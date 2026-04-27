'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'customer' | 'admin'>('customer');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes, check if admin login is selected
      if (loginType === 'admin') {
        // Admin credentials for demo
        if (email === 'admin@baweed.com' && password === 'admin123') {
          // Store admin session in localStorage
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userId', 'admin-demo');
          toast.success('Admin login successful!');
          router.push('/admin');
        } else {
          toast.error('Invalid admin credentials. Use admin@baweed.com / admin123 for demo.');
        }
      } else {
        // Customer login - check for demo credentials first
        if (email === 'demo@customer.com' && password === 'password123') {
          localStorage.setItem('userRole', 'customer');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userId', 'customer-demo');
          toast.success('Demo customer login successful!');
          router.push('/');
        } else {
          // Try Supabase login
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            toast.error(error.message);
          } else if (data.user) {
            toast.success('Logged in successfully!');
            localStorage.setItem('userRole', 'customer');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', data.user.id);
            router.push('/');
          }
        }
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to your Baweed Groceries account</CardDescription>
          
          {/* Login Type Toggle */}
          <div className="flex gap-2 mt-4 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('customer')}
              className={`flex-1 py-2 px-3 rounded transition-colors text-sm font-medium ${
                loginType === 'customer'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-3 rounded transition-colors text-sm font-medium ${
                loginType === 'admin'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Demo Credentials Info */}
          {loginType === 'admin' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1">Demo Admin Credentials:</p>
              <p>Email: <code className="bg-white px-1 py-0.5 rounded">admin@baweed.com</code></p>
              <p>Password: <code className="bg-white px-1 py-0.5 rounded">admin123</code></p>
            </div>
          )}

          {loginType === 'customer' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              <p className="font-semibold mb-1">Demo Customer Credentials:</p>
              <p>Email: <code className="bg-white px-1 py-0.5 rounded">demo@customer.com</code></p>
              <p>Password: <code className="bg-white px-1 py-0.5 rounded">password123</code></p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder={loginType === 'admin' ? 'admin@baweed.com' : 'your@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : `Login as ${loginType === 'admin' ? 'Admin' : 'Customer'}`}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
