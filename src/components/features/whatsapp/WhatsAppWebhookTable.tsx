'use client';

import React, { useState } from 'react';
import { Eye, RotateCcw, Filter, Webhook, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { WebhookEventStatus, WhatsAppWebhookEventItem } from '../../../api/types/whatsapp.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { TableSkeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';
import { formatDate } from '../../../lib/utils';
import { WhatsAppWebhookDetailModal } from './WhatsAppWebhookDetailModal';
import { WebhookRetryConfirmModal } from './WebhookRetryConfirmModal';

interface WhatsAppWebhookTableProps {
  events: WhatsAppWebhookEventItem[];
  isLoading: boolean;
  status?: WebhookEventStatus;
  onStatusChange: (status?: WebhookEventStatus) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onRetry: (id: string) => Promise<unknown>;
  isRetrying: boolean;
}

export function WhatsAppWebhookTable({
  events,
  isLoading,
  status,
  onStatusChange,
  limit,
  onLimitChange,
  onRetry,
  isRetrying,
}: WhatsAppWebhookTableProps) {
  const [selectedEvent, setSelectedEvent] = useState<WhatsAppWebhookEventItem | null>(null);
  const [retryTargetId, setRetryTargetId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const handleOpenRetry = (id: string) => {
    setActionSuccessMessage(null);
    setActionErrorMessage(null);
    setRetryTargetId(id);
  };

  const handleConfirmRetry = async () => {
    if (!retryTargetId) return;
    try {
      await onRetry(retryTargetId);
      setActionSuccessMessage(`Webhook event ${retryTargetId.slice(0, 8)}... re-queued successfully.`);
      setRetryTargetId(null);
      if (selectedEvent?.id === retryTargetId) {
        setSelectedEvent((prev) =>
          prev ? { ...prev, status: WebhookEventStatus.QUEUED, errorMessage: null } : null,
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retry webhook event.';
      setActionErrorMessage(msg);
      setRetryTargetId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Feedback Alerts */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#10B981]/30 text-xs text-[#065F46] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs font-bold text-[#065F46]/70 hover:text-[#065F46]"
          >
            Dismiss
          </button>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-4 rounded-2xl bg-[#FEF0F0] border border-[#F3797E]/30 text-xs text-[#991B1B] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F3797E]" />
            <span className="font-semibold">{actionErrorMessage}</span>
          </div>
          <button
            onClick={() => setActionErrorMessage(null)}
            className="text-xs font-bold text-[#991B1B]/70 hover:text-[#991B1B]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E8F0] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2238]">
          <Filter className="w-4 h-4 text-[#4B49AC]" />
          <span>Webhook Ingestion Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
            <span>Status:</span>
            <select
              value={status || ''}
              onChange={(e) =>
                onStatusChange(e.target.value ? (e.target.value as WebhookEventStatus) : undefined)
              }
              aria-label="Filter events by status"
              className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value={WebhookEventStatus.QUEUED}>Queued</option>
              <option value={WebhookEventStatus.PROCESSED}>Processed</option>
              <option value={WebhookEventStatus.FAILED}>Failed</option>
              <option value={WebhookEventStatus.RECEIVED}>Received</option>
            </select>
          </div>

          {/* Limit Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Filter events by limit"
              className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
            >
              <option value={25}>Latest 25</option>
              <option value={50}>Latest 50</option>
              <option value={100}>Latest 100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
        {isLoading && events.length === 0 ? (
          <TableSkeleton rows={5} cols={7} />
        ) : events.length === 0 ? (
          <EmptyState
            icon={<Webhook className="w-8 h-8 text-[#4B49AC]" />}
            title={status ? 'No webhook events matching filter' : 'No webhook events recorded'}
            description={
              status
                ? 'Try modifying or clearing your status filter.'
                : 'Incoming WhatsApp webhooks will be staged and monitored here.'
            }
            action={
              status ? (
                <Button variant="outline" size="sm" onClick={() => onStatusChange(undefined)}>
                  Clear Filter
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Event ID
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Provider Phone ID
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Status
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-center">
                  Attempts
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Received At
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Processed At
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Error / Note
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((evt) => {
                const canRetry =
                  evt.status === WebhookEventStatus.FAILED || evt.status === WebhookEventStatus.RECEIVED;

                return (
                  <TableRow
                    key={evt.id}
                    className="hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70"
                  >
                    {/* Event ID */}
                    <TableCell className="py-3.5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0">
                          <Webhook className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-[#1E2238] block" title={evt.id}>
                          {evt.id.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>

                    {/* Provider Phone ID */}
                    <TableCell className="py-3.5 font-mono text-xs text-[#6C7383]">
                      {evt.providerPhoneNumberId ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#9CA3AF]" />
                          {evt.providerPhoneNumberId}
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF] italic">—</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5">
                      <Badge status={evt.status} />
                    </TableCell>

                    {/* Attempts */}
                    <TableCell className="py-3.5 text-center font-mono text-xs font-bold text-[#1E2238]">
                      {evt.attempts}
                    </TableCell>

                    {/* Received At */}
                    <TableCell className="py-3.5 font-mono text-xs text-[#6C7383] whitespace-nowrap">
                      {formatDate(evt.receivedAt)}
                    </TableCell>

                    {/* Processed At */}
                    <TableCell className="py-3.5 font-mono text-xs text-[#6C7383] whitespace-nowrap">
                      {formatDate(evt.processedAt)}
                    </TableCell>

                    {/* Error / Note */}
                    <TableCell className="py-3.5 max-w-[200px]">
                      {evt.errorMessage ? (
                        <span className="text-xs text-[#C53030] font-mono truncate block" title={evt.errorMessage}>
                          {evt.errorMessage}
                        </span>
                      ) : evt.status === WebhookEventStatus.PROCESSED ? (
                        <span className="text-xs text-[#10B981] font-medium">Processed</span>
                      ) : (
                        <span className="text-xs text-[#9CA3AF] italic">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(evt)}
                          leftIcon={<Eye className="w-3.5 h-3.5 text-[#4B49AC]" />}
                          className="rounded-xl border-[#E4E8F0] font-bold text-xs text-[#1E2238] hover:bg-[#4B49AC] hover:text-white hover:border-[#4B49AC] transition-all shadow-2xs"
                        >
                          Inspect
                        </Button>

                        {canRetry && (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isRetrying}
                            onClick={() => handleOpenRetry(evt.id)}
                            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
                            className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs shadow-2xs"
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail Modal */}
      <WhatsAppWebhookDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRetry={(id) => handleOpenRetry(id)}
        isRetrying={isRetrying}
      />

      {/* Retry Confirmation Dialog */}
      <WebhookRetryConfirmModal
        eventId={retryTargetId}
        isOpen={!!retryTargetId}
        isRetrying={isRetrying}
        onConfirm={handleConfirmRetry}
        onClose={() => setRetryTargetId(null)}
      />
    </div>
  );
}
