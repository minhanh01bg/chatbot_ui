import type { Metadata } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'My Subscription - AI Chatbot',
  description: 'Manage your subscription and billing information.',
};

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
