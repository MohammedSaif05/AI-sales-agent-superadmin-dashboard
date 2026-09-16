'use client';

import { useState, useEffect, useCallback } from 'react';
import { analystApi } from '../api/services/analystApi';
import { AnalysisRecordItem } from '../api/types/analyst.types';
import { ApiError } from '../api/client/apiError';

export function useAnalysisDetail(businessId: string, analysisId: string) {
  const [data, setData] = useState<AnalysisRecordItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!(businessId && analysisId));
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Clear data immediately during render when switching businesses or analyses to prevent stale data display
  const [prevKey, setPrevKey] = useState(`${businessId}:${analysisId}`);
  const currentKey = `${businessId}:${analysisId}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setData(null);
    setError(null);
    setIsLoading(!!(businessId && analysisId));
  }

  useEffect(() => {
    if (!businessId || !analysisId) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const response = await analystApi.getBusinessAnalysisDetail(businessId, analysisId);
        if (!cancelled) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            ApiError.fromUnknown(
              err,
              `/admin/businesses/${businessId}/analyses/${analysisId}`,
            ),
          );
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
  }, [businessId, analysisId, refreshKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  return { data, isLoading, error, refresh };
}
