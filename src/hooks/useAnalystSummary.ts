'use client';

import { useState, useEffect, useCallback } from 'react';
import { analystApi } from '../api/services/analystApi';
import { AnalystSummaryData } from '../api/types/analyst.types';
import { ApiError } from '../api/client/apiError';

export function useAnalystSummary(businessId: string) {
  const [data, setData] = useState<AnalystSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!businessId);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Clear data immediately when switching businesses to prevent stale data display
  const [prevBusinessId, setPrevBusinessId] = useState(businessId);
  if (businessId !== prevBusinessId) {
    setPrevBusinessId(businessId);
    setData(null);
    setError(null);
    setIsLoading(!!businessId);
  }

  useEffect(() => {
    if (!businessId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const response = await analystApi.getBusinessAnalystSummary(businessId);
        if (!cancelled) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, `/admin/businesses/${businessId}/analyst-summary`));
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
  }, [businessId, refreshKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  return { data, isLoading, error, refresh };
}
