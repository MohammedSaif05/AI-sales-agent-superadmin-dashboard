'use client';

import { useState, useEffect, useCallback } from 'react';
import { whatsappApi } from '../api/services/whatsappApi';
import {
  WebhookEventsQuery,
  WebhookEventStatus,
  WhatsAppWebhookEventItem,
} from '../api/types/whatsapp.types';
import { ApiError } from '../api/client/apiError';

export function useWhatsAppWebhookEvents(initialLimit = 50) {
  const [data, setData] = useState<WhatsAppWebhookEventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [status, setStatus] = useState<WebhookEventStatus | undefined>(undefined);
  const [limit, setLimit] = useState<number>(initialLimit);

  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryError, setRetryError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const query: WebhookEventsQuery = {
          status,
          limit,
        };
        const response = await whatsappApi.getWebhookEvents(query);
        if (!cancelled) {
          setData(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(ApiError.fromUnknown(err, '/admin/whatsapp/webhook-events'));
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
  }, [status, limit, refreshKey]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleSetStatus = useCallback((newStatus?: WebhookEventStatus) => {
    setStatus(newStatus);
  }, []);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
  }, []);

  const retryEvent = useCallback(
    async (id: string): Promise<WhatsAppWebhookEventItem | null> => {
      setIsRetrying(true);
      setRetryError(null);
      try {
        const response = await whatsappApi.retryWebhookEvent(id);
        const updated = response.data;
        // Optimistically update event in local state
        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: WebhookEventStatus.QUEUED, errorMessage: null } : item)),
        );
        // Also trigger background refresh to sync with server
        setRefreshKey((k) => k + 1);
        return updated;
      } catch (err) {
        const parsed = ApiError.fromUnknown(
          err,
          `/admin/whatsapp/webhook-events/${id}/retry`,
        );
        setRetryError(parsed);
        throw parsed;
      } finally {
        setIsRetrying(false);
      }
    },
    [],
  );

  return {
    data,
    isLoading,
    error,
    refresh,
    status,
    setStatus: handleSetStatus,
    limit,
    setLimit: handleSetLimit,
    retryEvent,
    isRetrying,
    retryError,
  };
}
