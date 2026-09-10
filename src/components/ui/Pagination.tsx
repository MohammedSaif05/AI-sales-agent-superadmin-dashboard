import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { PaginationMeta } from '../../api/types/common.types';

export interface PaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  disabled?: boolean;
}

export function Pagination({ meta, onPageChange, onLimitChange, disabled = false }: PaginationProps) {
  if (!meta || meta.total <= 0) return null;

  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = meta;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#E4E8F0] bg-white rounded-b-2xl text-xs text-[#6C7383]">
      <div className="flex items-center gap-2">
        <span>
          Showing <strong className="font-bold text-[#212529]">{startItem}</strong> to{' '}
          <strong className="font-bold text-[#212529]">{endItem}</strong> of{' '}
          <strong className="font-bold text-[#212529]">{total}</strong> results
        </span>

        {onLimitChange && (
          <div className="ml-4 flex items-center gap-1.5">
            <span className="text-[#6C7383]">Per page:</span>
            <select
              value={limit}
              disabled={disabled}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Items per page"
              className="rounded-lg border border-[#E4E8F0] bg-white py-1 px-2.5 text-xs font-medium text-[#212529] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="mr-2 text-zinc-500">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevPage || disabled}
          onClick={() => onPageChange(page - 1)}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage || disabled}
          onClick={() => onPageChange(page + 1)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
