'use client';

import { useState, useEffect, useCallback } from 'react';
import { analystApi } from '../api/services/analystApi';
import {
  AnalysisQuery,
  AnalysisRecordItem,
  AnalysisStatus,
  AnalysisType,
} from '../api/types/analyst.types';
import { PaginationMeta } from '../api/types/common.types';
import { ApiError } from '../api/client/apiError';

export function useBusinessAnalyses(businessId: string, initialPage = 1, initialLimit = 20) {
  const [data, setData] = useState<AnalysisRecordItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState<AnalysisStatus | undefined>(undefined);
  const [analysisType, setAnalysisType] = useState<AnalysisType | undefined>(undefined);
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
    setAnalysisType(undefined);
    setError(null);
    setIsLoading(!!businessId);
  }

  useEffect(() => {
    if (!businessId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const query: AnalysisQuery = {
          page,
          limit,
          status,
          analysisType,
        };
        const response = await analystApi.getBusinessAnalyses(businessId, query);
        if (!cancelled) {
          // Backend wraps nested { data: [], meta: {} } inside response.data
          const items = Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
            ? (response.data as unknown as AnalysisRecordItem[])
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
          setError(ApiError.fromUnknown(err, `/admin/businesses/${businessId}/analyses`));
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
  }, [businessId, page, limit, status, analysisType, refreshKey]);

  const handleSetPage = useCallback((newPage: number) => {
    setIsLoading(true);
    setPage(newPage);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setIsLoading(true);
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSetStatus = useCallback((newStatus?: AnalysisStatus) => {
    setIsLoading(true);
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handleSetAnalysisType = useCallback((newType?: AnalysisType) => {
    setIsLoading(true);
    setAnalysisType(newType);
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
    analysisType,
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    setStatus: handleSetStatus,
    setAnalysisType: handleSetAnalysisType,
    isLoading,
    error,
    refresh,
  };
}
