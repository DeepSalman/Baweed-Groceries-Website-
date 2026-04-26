'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { ChevronLeft } from 'lucide-react';

export default function AdminEmailLogsPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<any[]>([]);
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
          .from('email_logs')
          .select('*')
          .order('sent_at', { ascending: false });

        if (data) {
          setEmails(data);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
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
          <p className="text-gray-600">Loading email logs...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Email Logs</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email History</CardTitle>
          </CardHeader>
          <CardContent>
            {emails.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No emails sent yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Recipient</th>
                      <th className="text-left py-3 px-4 font-semibold">Subject</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Sent Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email) => (
                      <tr key={email.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{email.recipient_email}</td>
                        <td className="py-3 px-4 font-medium">{email.subject}</td>
                        <td className="py-3 px-4">{email.email_type}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              email.status === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : email.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {email.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(email.sent_at).toLocaleDateString()}
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
