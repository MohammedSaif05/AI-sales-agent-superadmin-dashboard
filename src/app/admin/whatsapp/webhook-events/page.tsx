'use client';

import React from 'react';
import { RotateCcw, Webhook } from 'lucide-react';
import { useWhatsAppWebhookEvents } from '../../../../hooks/useWhatsAppWebhookEvents';
import { WhatsAppWebhookTable } from '../../../../components/features/whatsapp/WhatsAppWebhookTable';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Button } from '../../../../components/ui/Button';

export default function WhatsAppWebhookEventsPage() {
  const {
    data,
    isLoading,
    error,
    refresh,
    status,
    setStatus,
    limit,
    setLimit,
    retryEvent,
    isRetrying,
  } = useWhatsAppWebhookEvents(50);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white shadow-md shadow-[#4B49AC]/20">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]">
                WhatsApp Webhook Events
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#6C7383]">
                Monitor staged Meta webhook ingestion, queue states, and manual recovery
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {error ? (
        <ErrorState
          error={error}
          title="Failed to load webhook events"
          message="Could not retrieve WhatsApp webhook events. Please verify the backend service status and try again."
          onRetry={refresh}
        />
      ) : (
        <WhatsAppWebhookTable
          events={data}
          isLoading={isLoading}
          status={status}
          onStatusChange={setStatus}
          limit={limit}
          onLimitChange={setLimit}
          onRetry={retryEvent}
          isRetrying={isRetrying}
        />
      )}
    </div>
  );
}
