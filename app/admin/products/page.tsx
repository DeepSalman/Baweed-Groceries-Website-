'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { type Product } from '@/lib/types';
import { ChevronLeft, Plus } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<(Product & { supplier?: any })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAndFetch() {
      try {
        // Check for demo admin login first
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');

        if (userRole === 'admin' && userEmail === 'admin@baweed.com') {
          // Demo admin - proceed to fetch data
        } else {
          // Check Supabase auth
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
        }

        const { data } = await supabase
          .from('products')
          .select('*, supplier:suppliers(*)')
          .order('created_at', { ascending: false });

        if (data) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
          <p className="text-gray-600">Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No products found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">Supplier</th>
                      <th className="text-left py-3 px-4 font-semibold">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold">Price</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-sm">{product.supplier?.company_name}</td>
                        <td className="py-3 px-4 text-sm">{product.sku}</td>
                        <td className="py-3 px-4">AED {product.unit_price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="link" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
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
