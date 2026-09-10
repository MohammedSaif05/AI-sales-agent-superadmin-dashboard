'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useBusinessDetails } from '../../../../hooks/useBusinessDetails';
import { BusinessProfile } from '../../../../components/features/businesses/BusinessProfile';
import { OperatingHours } from '../../../../components/features/businesses/OperatingHours';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Button } from '../../../../components/ui/Button';

export default function BusinessDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data, isLoading, error, refresh } = useBusinessDetails(id);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/businesses">
          <Button
            variant="outline"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Back to Businesses
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
          Refresh Details
        </Button>
      </div>


      {/* State Rendering */}
      {isLoading && !data ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E4E8F0] bg-white p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>

      ) : error && !data ? (
        <ErrorState
          error={error}
          title={error.statusCode === 404 ? 'Business Not Found' : 'Failed to load business details'}
          message={
            error.statusCode === 404
              ? 'The requested business could not be found or may have been removed.'
              : error.message
          }
          onRetry={refresh}
        />
      ) : data ? (
        <div className="space-y-6">
          <BusinessProfile business={data} />
          <OperatingHours hours={data.hours} />
        </div>
      ) : null}
    </div>
  );
}
