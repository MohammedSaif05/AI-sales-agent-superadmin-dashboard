'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/services/adminApi';
import { GlobalImportItem } from '../api/types/admin.types';
import { PaginationMeta } from '../api/types/common.types';
import { ApiError } from '../api/client/apiError';

export function useImports(initialPage = 1, initialLimit = 20) {
  const [data, setData] = useState<GlobalImportItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await adminApi.getGlobalImports({
          page,
          limit,
        });
        if (!cancelled) {
          setData(response.data || []);
          setMeta(response.meta || null);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, '/admin/imports'));
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
  }, [page, limit, refreshKey]);

  const handleSetPage = useCallback((newPage: number) => {
    setIsLoading(true);
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setIsLoading(true);
    setLimit(newLimit);
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
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    isLoading,
    error,
    refresh,
  };
}
