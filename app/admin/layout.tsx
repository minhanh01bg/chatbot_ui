import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Backdrop from '@/components/admin/Backdrop';
import { SidebarProvider } from '@/components/ui/sidebar';
import SessionProvider from '@/components/providers/SessionProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="min-h-screen flex bg-background w-full">
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
            <footer className="py-2 px-6 border-t border-border text-sm text-muted-foreground text-center">
              <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}