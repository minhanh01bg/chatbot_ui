'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <div className="h-16 border-b bg-background">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            title="Notifications"
          >
            <BellIcon className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">A</span>
            </div>
            <span className="ml-2 text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
} 