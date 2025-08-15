import type { Metadata } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Backdrop from '@/components/admin/Backdrop';

export const metadata: Metadata = {
  title: 'My Subscription - AI Chatbot',
  description: 'Manage your subscription and billing information.',
};

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-white to-blue-50 w-full">
          {/* Sidebar and Backdrop */}
          <Sidebar />
          <Backdrop />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <div className='h-full'>
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
