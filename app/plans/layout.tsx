import type { Metadata } from 'next';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'Plans & Pricing - AI Chatbot',
  description: 'Choose the perfect plan for your AI chatbot needs. Flexible pricing with powerful features.',
};

export default function PlansLayout({
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
