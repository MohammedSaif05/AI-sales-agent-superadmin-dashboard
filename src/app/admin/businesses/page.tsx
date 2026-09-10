'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Store } from 'lucide-react';
import { useBusinesses } from '../../../hooks/useBusinesses';
import { BusinessTable } from '../../../components/features/businesses/BusinessTable';
import { TableSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';

export default function BusinessesPage() {
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
  } = useBusinesses(1, 20);

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238] leading-tight">
            Registered Businesses
          </h1>
          <p className="text-xs sm:text-sm text-[#5F677A]">
            Directory of onboarded stores, owners, and customer counts across all tenants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] text-[#1E2238] font-bold hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh Directory
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 max-w-xl">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <Input
              placeholder="Search by store name, phone, city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#4B49AC]" />}
              className="rounded-xl border-[#E4E8F0] bg-white shadow-2xs text-xs font-medium"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="rounded-xl font-bold px-5 shadow-sm">
            Search
          </Button>
          {search && (
            <Button type="button" variant="outline" size="md" onClick={handleClearSearch} className="rounded-xl font-semibold border-[#E4E8F0]">
              Clear
            </Button>
          )}
        </form>
      </div>


      {/* State Renderers */}
      {isLoading && data.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E8F0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <TableSkeleton rows={6} cols={7} />
        </div>

      ) : error ? (
        <ErrorState
          error={error}
          title="Failed to load businesses"
          onRetry={refresh}
        />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Store className="w-6 h-6" />}
          title={search ? 'No businesses matching your search' : 'No businesses registered yet'}
          description={
            search
              ? 'Try modifying your search keywords or clear the filter to see all stores.'
              : 'Registered businesses will appear here once onboarded.'
          }
          action={
            search ? (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Clear Search Filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div>
          <BusinessTable businesses={data} />
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
