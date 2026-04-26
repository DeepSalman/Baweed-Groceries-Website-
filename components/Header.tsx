'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(data);
        }
      } catch (error) {
        // Silently fail if Supabase is not configured
      } finally {
        setLoading(false);
      }
    }

    getUser();

    try {
      const result = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(data);
        } else {
          setUser(null);
        }
      });

      const subscription = (result as any)?.data?.subscription;
      return () => subscription?.unsubscribe();
    } catch (error) {
      // Silently fail if Supabase is not configured
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="hidden sm:inline">Baweed</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Admin
            </Link>
          )}
          {user?.role === 'supplier' && (
            <Link href="/supplier" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Supplier
            </Link>
          )}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </Link>

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{user.full_name || 'Profile'}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="default">Login</Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
