'use client';

import { useState, useEffect, useCallback } from 'react';
import { analystApi } from '../api/services/analystApi';
import {
  QuestionQuery,
  QuestionRecordItem,
  QuestionStatus,
} from '../api/types/analyst.types';
import { PaginationMeta } from '../api/types/common.types';
import { ApiError } from '../api/client/apiError';

export function useBusinessQuestions(businessId: string, initialPage = 1, initialLimit = 20) {
  const [data, setData] = useState<QuestionRecordItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState<QuestionStatus | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!businessId);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Clear data immediately during render when switching businesses to prevent stale data display
  const [prevBusinessId, setPrevBusinessId] = useState(businessId);
  if (businessId !== prevBusinessId) {
    setPrevBusinessId(businessId);
    setData([]);
    setMeta(null);
    setPage(1);
    setStatus(undefined);
    setError(null);
    setIsLoading(!!businessId);
  }

  useEffect(() => {
    if (!businessId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const query: QuestionQuery = {
          page,
          limit,
          status,
        };
        const response = await analystApi.getBusinessQuestions(businessId, query);
        if (!cancelled) {
          // Backend wraps nested { data: [], meta: {} } inside response.data
          const items = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
            ? (response.data as unknown as QuestionRecordItem[])
            : [];

          const rawMeta = response.data?.meta || response.meta;
          const paginationMeta: PaginationMeta | null = rawMeta
            ? {
                total: rawMeta.total,
                page: rawMeta.page,
                limit: rawMeta.limit,
                totalPages: rawMeta.totalPages,
                hasNextPage: rawMeta.hasNextPage,
                hasPrevPage: rawMeta.hasPrevPage ?? rawMeta.page > 1,
              }
            : null;

          setData(items);
          setMeta(paginationMeta);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, `/admin/businesses/${businessId}/questions`));
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
  }, [businessId, page, limit, status, refreshKey]);

  const handleSetPage = useCallback((newPage: number) => {
    setIsLoading(true);
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setIsLoading(true);
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSetStatus = useCallback((newStatus?: QuestionStatus) => {
    setIsLoading(true);
    setStatus(newStatus);
    setPage(1);
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
    status,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setStatus: handleSetStatus,
    isLoading,
    error,
    refresh,
  };
}
