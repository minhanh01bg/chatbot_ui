'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Documents from '@/components/admin/documents/Documents';

export default function DocumentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sites page since documents should be accessed through sites
    router.push('/admin/sites');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to Sites...</p>
      </div>
    </div>
  );
} 