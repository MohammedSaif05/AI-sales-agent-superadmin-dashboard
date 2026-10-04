'use client';

import React from 'react';
import { RotateCcw, MessageSquare } from 'lucide-react';
import { useWhatsAppConnections } from '../../../../hooks/useWhatsAppConnections';
import { WhatsAppConnectionTable } from '../../../../components/features/whatsapp/WhatsAppConnectionTable';
import { ErrorState } from '../../../../components/ui/ErrorState';
import { Button } from '../../../../components/ui/Button';

export default function WhatsAppConnectionsPage() {
  const {
    data,
    isLoading,
    error,
    refresh,
    search,
    setSearch,
    status,
    setStatus,
  } = useWhatsAppConnections();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white shadow-md shadow-[#4B49AC]/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]">
                WhatsApp Connections
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#6C7383]">
                Monitor WhatsApp Business Cloud accounts across all platform tenants
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
          title="Failed to load WhatsApp connections"
          message="Could not retrieve platform WhatsApp connections. Please verify your connection and try again."
          onRetry={refresh}
        />
      ) : (
        <WhatsAppConnectionTable
          connections={data}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
