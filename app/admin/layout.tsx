import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Backdrop from '@/components/admin/Backdrop';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background w-full">
        {/* Sidebar and Backdrop */}
        <Sidebar />
        <Backdrop />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          
          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div>
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="py-4 px-6 border-t border-border text-sm text-muted-foreground text-center">
            <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
} 