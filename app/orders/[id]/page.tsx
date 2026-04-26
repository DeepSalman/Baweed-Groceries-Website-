'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { type Order, type OrderItem } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(profile);

        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('id', parseInt(orderId))
          .single();

        if (!orderData) {
          router.push('/orders');
          return;
        }

        // Check access: user must be order owner or admin
        if (orderData.user_id !== session.user.id && profile?.role !== 'admin') {
          router.push('/');
          return;
        }

        setOrder(orderData);

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*, product:products(*)')
          .eq('order_id', parseInt(orderId));

        if (itemsData) {
          setItems(itemsData);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={user?.role === 'admin' ? '/admin/orders' : '/orders'}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order {order.order_number}</h1>
        </div>

        <div className="grid gap-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{order.status}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.ordered_at).toLocaleDateString()}</p>
                </div>
                {order.estimated_delivery && (
                  <div>
                    <p className="text-gray-600">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(order.estimated_delivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x AED {item.unit_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">AED {item.line_total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">
                <p>{order.delivery_address}</p>
                <p>
                  {order.delivery_city}, {order.delivery_state} {order.delivery_postal_code}
                </p>
                <p>{order.delivery_country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">AED {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">AED {order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">AED {order.delivery_fee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>AED {order.total_amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
