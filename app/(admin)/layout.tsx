import { SharedAdminLayout } from '@/components/ui/templates';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SharedAdminLayout>
      {children}
    </SharedAdminLayout>
  );
}
