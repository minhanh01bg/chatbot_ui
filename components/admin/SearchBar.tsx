'use client';

import { useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 admin-text-muted" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
                  className="h-10 w-full rounded-lg border admin-border-primary pl-10 pr-12 py-2 text-sm admin-bg-glass backdrop-blur-md focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:border-purple-500 transition-all duration-200"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border admin-border-secondary admin-accent-secondary px-1.5 font-mono text-[10px] font-medium admin-text-muted">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
} 