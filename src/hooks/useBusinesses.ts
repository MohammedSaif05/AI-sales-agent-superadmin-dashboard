'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/services/adminApi';
import { BusinessListItem } from '../api/types/admin.types';
import { PaginationMeta } from '../api/types/common.types';
import { ApiError } from '../api/client/apiError';

export function useBusinesses(initialPage = 1, initialLimit = 20) {
  const [data, setData] = useState<BusinessListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await adminApi.getBusinesses({
          page,
          limit,
          search: search.trim() || undefined,
        });
        if (!cancelled) {
          setData(response.data || []);
          setMeta(response.meta || null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, '/admin/businesses'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [page, limit, search, refreshKey]);

  const handleSetPage = useCallback((newPage: number) => {
    setIsLoading(true);
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setIsLoading(true);
    setLimit(newLimit);
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setIsLoading(true);
    setSearch(newSearch);
  }, []);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    data,
    meta,
    page,
    limit,
    search,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setSearch: handleSetSearch,
    isLoading,
    error,
    refresh,
  };
}
