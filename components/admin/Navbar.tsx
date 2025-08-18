'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, X } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const { openMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      setOpenMobile(!openMobile);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white/95 backdrop-blur-md border-b border-gray-200 h-16 shadow-sm">
      <div className="flex flex-col items-center justify-between w-full lg:flex-row">
        <div className="flex items-center justify-between w-full gap-2 px-4 py-3 border-b border-gray-100 sm:gap-4 lg:justify-normal lg:border-b-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-600 border border-gray-200 rounded-lg z-40 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {openMobile ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="lg:hidden font-semibold text-xl text-gray-900">Admin Panel</div>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors lg:hidden"
            aria-label="Toggle Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* <div className="hidden lg:block">
            <SearchBar />
          </div> */}
        </div>
        
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-4 py-3 lg:flex lg:w-auto lg:justify-end lg:py-0 shadow-lg lg:shadow-none absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 lg:static lg:border-0`}
        >
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
} 