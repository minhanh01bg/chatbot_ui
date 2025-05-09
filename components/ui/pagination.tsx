'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: PaginationProps) {
  const pagesAroundCurrent = React.useMemo(() => {
    return Array.from(
      { length: Math.min(3, totalPages) },
      (_, i) => i + Math.max(currentPage - 1, 1)
    ).filter(page => page <= totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)} {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {currentPage > 3 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0"
          >
            <span>1</span>
          </Button>
          <span className="px-2">...</span>
        </>
      )}
      
      {pagesAroundCurrent.map(page => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="h-8 w-8 p-0"
        >
          <span>{page}</span>
        </Button>
      ))}
      
      {currentPage < totalPages - 2 && (
        <>
          <span className="px-2">...</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0"
          >
            <span>{totalPages}</span>
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 