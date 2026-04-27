'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CartItem, type Profile, type PaymentCard } from '@/lib/types';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/currency';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Delivery address
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'new-card'>('card');
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // New card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    async function loadCheckoutData() {
      try {
        // Check for demo customer login first
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');

        if (userRole !== 'customer') {
          // Get user info from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            router.push('/login');
            return;
          }

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profileData);
        } else {
          // Demo customer
          setUser({
            id: 'customer-demo',
            email: userEmail,
            full_name: 'Demo Customer',
            role: 'customer',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'United Kingdom',
            created_at: new Date().toISOString(),
          } as any);
        }

        // Load cart and order data from localStorage
        const checkoutData = localStorage.getItem('checkoutCart');
        if (!checkoutData) {
          router.push('/cart');
          return;
        }

        const parsed = JSON.parse(checkoutData);
        setCart(parsed.cart);
        setOrderData(parsed);

        // Pre-fill delivery address
        if (profileData) {
          setDeliveryAddress(profileData.address || '');
          setCity(profileData.city || '');
          setState(profileData.state || '');
          setPostalCode(profileData.postal_code || '');
        }

        // Load saved cards
        const { data: cardsData } = await supabase
          .from('payment_cards')
          .select('*')
          .eq('user_id', session.user.id)
          .order('is_default', { ascending: false });

        if (cardsData) {
          setSavedCards(cardsData);
          if (cardsData.length > 0) {
            setSelectedCardId(cardsData[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading checkout data:', error);
        toast.error('Error loading checkout data');
      } finally {
        setLoading(false);
      }
    }

    loadCheckoutData();
  }, [router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (!user || !deliveryAddress || !city || !state || !postalCode) {
        toast.error('Please fill in all delivery details');
        setProcessing(false);
        return;
      }

      let paymentCardId: number | null = null;

      // Handle payment card
      if (paymentMethod === 'new-card') {
        if (!cardNumber || !cardHolder || !expiryMonth || !expiryYear || !cvv) {
          toast.error('Please fill in all card details');
          setProcessing(false);
          return;
        }

        // Save new card if requested
        if (saveCard) {
          const { data: newCard } = await supabase
            .from('payment_cards')
            .insert({
              user_id: user.id,
              card_number: `****${cardNumber.slice(-4)}`,
              card_holder_name: cardHolder,
              expiry_month: parseInt(expiryMonth),
              expiry_year: parseInt(expiryYear),
              cvv: cvv,
            })
            .select()
            .single();

          paymentCardId = newCard?.id || null;
        }
      } else {
        paymentCardId = selectedCardId;
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          delivery_address: deliveryAddress,
          delivery_city: city,
          delivery_state: state,
          delivery_postal_code: postalCode,
          delivery_country: country,
          subtotal: this.orderData?.subtotal || 0,
          tax_amount: this.orderData?.tax || 0,
          delivery_fee: this.orderData?.deliveryFee || 0,
          total_amount: this.orderData?.total || 0,
          payment_method: paymentMethod === 'new-card' ? 'credit_card' : 'saved_card',
          payment_card_id: paymentCardId,
        })
        .select()
        .single();

      if (orderError) {
        toast.error('Error creating order');
        setProcessing(false);
        return;
      }

      // Add order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product?.unit_price || 0,
        line_total: (item.product?.unit_price || 0) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error adding order items:', itemsError);
      }

      // Log email (mock)
      await supabase.from('email_logs').insert({
        recipient_email: user.email,
        recipient_name: user.full_name || 'Customer',
        subject: `Order Confirmation - ${orderNumber}`,
        email_type: 'order_confirmation',
        body: `Your order ${orderNumber} has been placed successfully.`,
        related_order_id: orderData.id,
      });

      // Clear cart
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutCart');

      toast.success('Order placed successfully!');
      router.push(`/orders/${orderData.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Error placing order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (!user || !orderData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    disabled={processing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Emirate</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={country}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedCards.length > 0 && (
                  <div className="space-y-2">
                    <Label>Use Saved Card</Label>
                    <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {savedCards.map((card) => (
                          <SelectItem key={card.id} value={`card-${card.id}`}>
                            {card.card_number} - {card.card_holder_name}
                          </SelectItem>
                        ))}
                        <SelectItem value="new-card">+ Add New Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {paymentMethod === 'new-card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                        maxLength="16"
                        required
                        disabled={processing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardHolder">Card Holder Name</Label>
                      <Input
                        id="cardHolder"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Input
                          id="expiryMonth"
                          placeholder="MM"
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          maxLength="2"
                          required
                          disabled={processing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Year</Label>
                        <Input
                          id="expiryYear"
                          placeholder="YY"
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          maxLength="2"
                          required
                          disabled={processing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength="3"
                          type="password"
                          required
                          disabled={processing}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        disabled={processing}
                      />
                      <Label htmlFor="saveCard" className="cursor-pointer">
                        Save this card for future purchases
                      </Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between">
                      <span>{item.product?.name} x {item.quantity}</span>
                      <span>{formatPrice((item.product?.unit_price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>{formatPrice(orderData.tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{formatPrice(orderData.deliveryFee)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(orderData.total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
