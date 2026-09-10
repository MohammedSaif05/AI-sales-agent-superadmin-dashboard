'use client';

import React from 'react';
import { RotateCcw, FileSpreadsheet } from 'lucide-react';
import { useImports } from '../../../hooks/useImports';
import { ImportTable } from '../../../components/features/imports/ImportTable';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';

export default function ImportsPage() {
  const { data, meta, setPage, setLimit, isLoading, error, refresh } =
    useImports(1, 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]">
            Global Import Activity
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#6C7383] mt-1">
            Audit log of customer batch imports across all tenants (CSV, Excel, and AI Vision).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh Imports
          </Button>
        </div>
      </div>

      {/* State Renderers */}
      {isLoading && data.length === 0 ? (
        <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 shadow-sm">
          <TableSkeleton rows={6} cols={9} />
        </div>

      ) : error ? (
        <ErrorState
          error={error}
          title="Failed to load import audit log"
          onRetry={refresh}
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="w-6 h-6" />}
          title="No customer imports recorded yet"
          description="Customer import batches from businesses will be displayed here for monitoring."
        />
      ) : (
        <div>
          <ImportTable imports={data} />
          <Pagination
            meta={meta}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}
