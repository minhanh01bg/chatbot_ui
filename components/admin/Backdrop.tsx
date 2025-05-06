'use client';

import { useSidebar } from '@/components/ui/sidebar';

export default function Backdrop() {
  const { openMobile, setOpenMobile } = useSidebar();

  if (!openMobile) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
      onClick={() => setOpenMobile(false)}
      aria-hidden="true"
    />
  );
} 