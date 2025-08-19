import { AdminThemeProvider } from '@/contexts/AdminThemeContext';

export default function ThemeTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider defaultTheme="adminLight">
      {children}
    </AdminThemeProvider>
  );
} 