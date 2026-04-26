'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { BarChart3, Package, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalSuppliers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        // Check for demo admin login first
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');

        if (userRole === 'admin' && userEmail === 'admin@baweed.com') {
          setUser({ 
            id: 'admin-demo',
            email: userEmail,
            full_name: 'Admin User',
            role: 'admin',
            created_at: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        // Otherwise check Supabase auth
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

        if (!profile || profile.role !== 'admin') {
          router.push('/');
          return;
        }

        setUser(profile);

        // Fetch dashboard stats
        const [
          { count: ordersCount, data: ordersData },
          { count: productsCount },
          { count: suppliersCount },
        ] = await Promise.all([
          supabase
            .from('orders')
            .select('total_amount', { count: 'exact' })
            .eq('status', 'delivered'),
          supabase
            .from('products')
            .select('id', { count: 'exact' })
            .eq('is_active', true),
          supabase
            .from('suppliers')
            .select('id', { count: 'exact' })
            .eq('is_active', true),
        ]);

        const totalRevenue =
          ordersData?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0;

        setStats({
          totalOrders: ordersCount || 0,
          totalRevenue,
          totalProducts: productsCount || 0,
          totalSuppliers: suppliersCount || 0,
        });
      } catch (error) {
        console.error('Error checking admin access:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user.full_name || 'Admin'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Delivered orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AED {stats.totalRevenue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">From completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">Active suppliers</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/suppliers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Suppliers
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Link href="/admin/inventory">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory Management
                </Button>
              </Link>
              <Link href="/admin/invoices">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Invoices
                </Button>
              </Link>
              <Link href="/admin/emails">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Email Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
