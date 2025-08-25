'use client';

import React from 'react';
import type { Suggestion as DBSuggestion } from '@/lib/db/schema';
import type { BlockKind } from '@/components/block';
import { Button } from '@/components/ui/button';

export function Suggestion({
  suggestion,
  onApply,
  blockKind,
}: {
  suggestion: DBSuggestion;
  onApply: () => void;
  blockKind: BlockKind;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs bg-background">
      <span className="font-medium">Suggestion</span>
      <span className="text-muted-foreground">{blockKind}</span>
      <Button size="sm" variant="outline" onClick={onApply}>
        Apply
      </Button>
    </div>
  );
}

