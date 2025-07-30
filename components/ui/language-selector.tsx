'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '@/lib/languages';

interface LanguageSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onValueChange,
  placeholder = 'Select language...',
  className,
  disabled = false,
}: LanguageSelectorProps) {
  const selectedLanguage = value ? getLanguageByCode(value) : null;

  return (
    <div className={cn('relative', className)}>
      <select
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'appearance-none pr-8'
        )}
      >
        <option value="">{placeholder}</option>
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name} ({language.nativeName})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />

      {/* Display selected language info */}
      {selectedLanguage && (
        <div className="mt-1 text-xs text-muted-foreground">
          Selected: {selectedLanguage.flag} {selectedLanguage.name} ({selectedLanguage.nativeName})
        </div>
      )}
    </div>
  );
}
