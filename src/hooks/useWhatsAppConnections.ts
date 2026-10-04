'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { whatsappApi } from '../api/services/whatsappApi';
import { WhatsAppConnectionItem, WhatsAppConnectionStatus } from '../api/types/whatsapp.types';
import { ApiError } from '../api/client/apiError';

export function useWhatsAppConnections() {
  const [rawData, setRawData] = useState<WhatsAppConnectionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<WhatsAppConnectionStatus | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const response = await whatsappApi.getConnections();
        if (!cancelled) {
          setRawData(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, '/admin/whatsapp/connections'));
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
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  // Client-side search and status filtering over platform connections
  const data = useMemo(() => {
    return rawData.filter((item) => {
      if (status && item.status !== status) {
        return false;
      }
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesBusinessName = item.business?.name?.toLowerCase().includes(query);
        const matchesBusinessPhone = item.business?.phone?.toLowerCase().includes(query);
        const matchesDisplayPhone = item.displayPhoneNumber?.toLowerCase().includes(query);
        const matchesWabaId = item.wabaId?.toLowerCase().includes(query);
        const matchesPhoneId = item.phoneNumberId?.toLowerCase().includes(query);
        const matchesVerifiedName = item.verifiedName?.toLowerCase().includes(query);

        return (
          matchesBusinessName ||
          matchesBusinessPhone ||
          matchesDisplayPhone ||
          matchesWabaId ||
          matchesPhoneId ||
          matchesVerifiedName
        );
      }
      return true;
    });
  }, [rawData, search, status]);

  return {
    data,
    rawData,
    isLoading,
    error,
    refresh,
    search,
    setSearch,
    status,
    setStatus,
  };
}
