'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CartItem, type Product } from '@/lib/types';
import Header from '@/components/Header';
import { Trash2, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        setCart(cartItems);

        // Fetch product details
        if (cartItems.length > 0) {
          const productIds = cartItems.map((item: CartItem) => item.product_id);
          const { data } = await supabase
            .from('products')
            .select('*, inventory(*), supplier:suppliers(*)')
            .in('id', productIds);

          if (data) {
            const productMap = new Map(data.map((p) => [p.id, p]));
            setProducts(productMap);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cart.map((item) =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeFromCart = (productId: number) => {
    const updated = cart.filter((item) => item.product_id !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast.success('Item removed from cart');
  };

  const subtotal = cart.reduce((sum, item) => {
    const product = products.get(item.product_id);
    return sum + (product ? product.unit_price * item.quantity : 0);
  }, 0);

  const tax = subtotal * 0.05; // 5% tax
  const deliveryFee = cart.length > 0 ? 10 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      router.push('/login');
      return;
    }

    // Store cart data for checkout page
    localStorage.setItem('checkoutCart', JSON.stringify({ cart, subtotal, tax, deliveryFee, total }));
    router.push('/checkout');
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = products.get(item.product_id);
                if (!product) return null;

                const lineTotal = product.unit_price * item.quantity;

                return (
                  <Card key={item.product_id}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 text-xs">No image</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          AED {product.unit_price.toFixed(2)} per {product.unit}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                            }
                            className="w-12 text-center border rounded"
                          />
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-lg font-semibold text-gray-900">AED {lineTotal.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>AED {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>AED {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
