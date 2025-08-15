import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Backdrop from '@/components/admin/Backdrop';
import { SidebarProvider } from '@/components/ui/sidebar';
import SessionProvider from '@/components/providers/SessionProvider';
import { Footer } from '@/components/footer';

export default function AdminLayout({
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

            {/* Footer */}
            <Footer variant="admin" />
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}