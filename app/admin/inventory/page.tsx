'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { ChevronLeft } from 'lucide-react';

export default function AdminInventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAndFetch() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          router.push('/');
          return;
        }

        const { data } = await supabase
          .from('inventory')
          .select('*, product:products(*)');

        if (data) {
          setInventory(data);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndFetch();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No inventory data found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">On Hand</th>
                      <th className="text-left py-3 px-4 font-semibold">Reserved</th>
                      <th className="text-left py-3 px-4 font-semibold">Available</th>
                      <th className="text-left py-3 px-4 font-semibold">Reorder Level</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const available = item.quantity_on_hand - item.quantity_reserved;
                      const needsReorder = available <= item.reorder_level;

                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.product?.name}</td>
                          <td className="py-3 px-4">{item.quantity_on_hand.toFixed(1)}</td>
                          <td className="py-3 px-4">{item.quantity_reserved.toFixed(1)}</td>
                          <td className="py-3 px-4 font-medium">{available.toFixed(1)}</td>
                          <td className="py-3 px-4">{item.reorder_level.toFixed(1)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                needsReorder
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {needsReorder ? 'Low Stock' : 'OK'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
