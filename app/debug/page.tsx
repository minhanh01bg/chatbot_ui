'use client';

import MobXDebugger from '@/components/debug/MobXDebugger';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Tools</h1>
        <MobXDebugger />
      </div>
    </div>
  );
} 