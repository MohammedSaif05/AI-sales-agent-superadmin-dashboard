'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useImportDetails } from '../../../../hooks/useImportDetails';
import { ImportDetailCard } from '../../../../components/features/imports/ImportDetailCard';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Button } from '../../../../components/ui/Button';

export default function ImportDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data, isLoading, error, refresh } = useImportDetails(id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/imports">
          <Button
            variant="outline"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Back to Imports
          </Button>
        </Link>

        <Button
          variant="outline"
          size="md"
          onClick={refresh}
          isLoading={isLoading}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
        >
          Refresh Record
        </Button>
      </div>

      {/* State Rendering */}
      {isLoading && !data ? (
        <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-56 rounded-lg" />
              <Skeleton className="h-4 w-80 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>

      ) : error && !data ? (
        <ErrorState
          error={error}
          title={error.statusCode === 404 ? 'Import Record Not Found' : 'Failed to load import details'}
          message={
            error.statusCode === 404
              ? 'The requested import batch record could not be found.'
              : error.message
          }
          onRetry={refresh}
        />
      ) : data ? (
        <ImportDetailCard item={data} />
      ) : null}
    </div>
  );
}
