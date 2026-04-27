'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { LogOut, Shield } from 'lucide-react';

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        // Check for demo admin login
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');

        if (userRole === 'admin' && userEmail === 'admin@baweed.com') {
          setAdmin({
            id: 'admin-demo',
            email: userEmail,
            full_name: 'Admin User',
            role: 'admin',
            created_at: new Date().toISOString(),
          });
          setLoading(false);
          return;
        }

        // If not admin, redirect to login
        router.push('/login');
      } catch (error) {
        console.error('Error loading admin profile:', error);
        router.push('/login');
      }
    }

    checkAdmin();
  }, [router]);

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFullName');

    toast.success('Logged out successfully!');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 max-w-2xl py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Account Status</h3>
                <p className="text-green-700">Active Administrator</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">{admin.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{admin.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <p className="text-lg text-gray-900 capitalize">{admin.role}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(admin.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Admin Permissions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Product Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Order Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Supplier Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Inventory Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Invoice Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Email Management
                  </li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
