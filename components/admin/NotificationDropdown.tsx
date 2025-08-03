'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useState } from 'react';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'message' | 'alert' | 'update';
};

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'New message received',
    description: 'You have a new message from Admin',
    time: '2 minutes ago',
    read: false,
    type: 'message',
  },
  {
    id: '2',
    title: 'New user registered',
    description: 'John Doe has registered',
    time: '1 hour ago',
    read: false,
    type: 'alert',
  },
  {
    id: '3',
    title: 'System update completed',
    description: 'The system has been updated to version 1.2.0',
    time: '3 hours ago',
    read: true,
    type: 'update',
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 relative transition-colors"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-red-500">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-white border border-gray-200 shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <DropdownMenuLabel className="px-0 py-0 text-gray-900 font-semibold">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 hover:bg-gray-50 cursor-pointer border-l-2 transition-colors ${
                  notification.read 
                    ? 'border-transparent' 
                    : notification.type === 'message' 
                      ? 'border-blue-500' 
                      : notification.type === 'alert' 
                        ? 'border-red-500' 
                        : 'border-green-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-900">{notification.title}</div>
                  <div className="text-xs text-gray-500">{notification.time}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{notification.description}</div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No notifications
            </div>
          )}
        </div>
        <DropdownMenuSeparator className="bg-gray-100" />
        <Link href="/admin/notifications" className="block w-full">
          <DropdownMenuItem className="cursor-pointer justify-center font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50">
            View all notifications
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 