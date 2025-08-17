'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/lib/theme';

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme when component mounts
    initializeTheme();
  }, []);

  return null; // This component doesn't render anything
}
