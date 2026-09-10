'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search, RotateCcw, Users } from 'lucide-react';
import { useBusinessCustomers } from '../../../../../hooks/useBusinessCustomers';
import { CustomerTable } from '../../../../../components/features/customers/CustomerTable';
import { TableSkeleton } from '../../../../../components/ui/Skeleton';
import { EmptyState } from '../../../../../components/ui/EmptyState';
import { ErrorState } from '../../../../../components/ui/ErrorState';
import { Input } from '../../../../../components/ui/Input';
import { Button } from '../../../../../components/ui/Button';
import { Pagination } from '../../../../../components/ui/Pagination';

export default function BusinessCustomersPage() {
  const params = useParams();
  const businessId = typeof params?.id === 'string' ? params.id : '';

  const {
    data,
    meta,
    search,
    setPage,
    setLimit,
    setSearch,
    isLoading,
    error,
    refresh,
  } = useBusinessCustomers(businessId, 1, 20);

  const [searchInput, setSearchInput] = useState(search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link href={`/admin/businesses/${businessId}`}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
              >
                Back to Store Profile
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238] pt-1">
            Customer Directory Inspection
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#6C7383]">
            Auditing customer records registered under Business ID:{' '}
            <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-1 rounded-lg border border-[#4B49AC]/20">
              {businessId}
            </code>
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
            Refresh Customers
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-md">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
          <Input
            placeholder="Search by customer name, phone, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#6C7383]" />}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
          {search && (
            <Button type="button" variant="ghost" size="md" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* States */}
      {isLoading && data.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E8F0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <TableSkeleton rows={6} cols={7} />
        </div>

      ) : error ? (
        <ErrorState
          error={error}
          title="Failed to inspect customer records"
          onRetry={refresh}
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title={search ? 'No customers matching your search query' : 'No customers recorded yet'}
          description={
            search
              ? 'Try modifying the keywords or clearing the search filter.'
              : 'This business has not registered or imported any customer records yet.'
          }
          action={
            search ? (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Clear Filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div>
          <CustomerTable customers={data} />
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
