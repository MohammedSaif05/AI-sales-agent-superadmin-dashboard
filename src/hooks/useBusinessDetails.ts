'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/services/adminApi';
import { BusinessDetailData } from '../api/types/admin.types';
import { ApiError } from '../api/client/apiError';

export function useBusinessDetails(id: string) {
  const [data, setData] = useState<BusinessDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!id);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await adminApi.getBusinessDetail(id);
        if (!cancelled) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, `/admin/businesses/${id}`));
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
  }, [id, refreshKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  return { data, isLoading, error, refresh };
}
