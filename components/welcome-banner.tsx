import React from 'react';

interface WelcomeBannerProps {
  title?: string;
  description?: string;
}

export function WelcomeBanner({ 
  title = "Welcome to Admin Dashboard", 
  description = "Manage your sites, subscriptions, and more from here." 
}: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-blue-100">{description}</p>
    </div>
  );
} 