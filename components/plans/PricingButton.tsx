'use client';

import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

interface PricingButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function PricingButton({ 
  variant = 'outline', 
  size = 'default',
  className = '' 
}: PricingButtonProps) {
  return (
    <Link href="/plans">
      <Button variant={variant} size={size} className={className}>
        <CreditCard className="w-4 h-4 mr-2" />
        Pricing
      </Button>
    </Link>
  );
}
