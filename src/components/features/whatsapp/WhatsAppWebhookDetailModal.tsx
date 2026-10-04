'use client';

import React, { useState } from 'react';
import {
  X,
  Webhook,
  Phone,
  Clock,
  Calendar,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import { WebhookEventStatus, WhatsAppWebhookEventItem } from '../../../api/types/whatsapp.types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { formatDate } from '../../../lib/utils';

interface WhatsAppWebhookDetailModalProps {
  event: WhatsAppWebhookEventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: (id: string) => void;
  isRetrying?: boolean;
}

export function WhatsAppWebhookDetailModal({
  event,
  isOpen,
  onClose,
  onRetry,
  isRetrying = false,
}: WhatsAppWebhookDetailModalProps) {
  const [isPayloadExpanded, setIsPayloadExpanded] = useState<boolean>(false);

  if (!isOpen || !event) return null;

  const isEligibleForRetry =
    event.status === WebhookEventStatus.FAILED || event.status === WebhookEventStatus.RECEIVED;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-3xl border border-[#E4E8F0] bg-white p-6 sm:p-7 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="webhook-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E4E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white shadow-md shadow-[#4B49AC]/25">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h2 id="webhook-modal-title" className="text-lg font-bold text-[#1E2238] leading-tight">
                Webhook Event Inspection
              </h2>
              <p className="text-xs text-[#6C7383]">
                Operational ingest and queue processing metadata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-xl p-2 text-[#6C7383] hover:bg-[#F8F9FA] hover:text-[#1E2238] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383]">
              Current Ingestion State
            </span>
            <div className="flex items-center gap-2">
              <Badge status={event.status} />
              <span className="text-xs text-[#6C7383] font-mono">
                Attempts: <strong>{event.attempts}</strong>
              </span>
            </div>
          </div>

          {isEligibleForRetry && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(event.id)}
              disabled={isRetrying}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#4B49AC]" />}
              className="rounded-xl border-[#4B49AC] text-[#4B49AC] hover:bg-[#4B49AC] hover:text-white font-bold text-xs shadow-2xs"
            >
              Retry Event
            </Button>
          )}
        </div>

        {/* Error Alert if failed */}
        {event.errorMessage && (
          <div className="p-4 rounded-2xl bg-[#FEF0F0] border border-[#F3797E]/30 text-xs text-[#C53030] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#F3797E] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-sm">Processing Error</span>
              <p className="leading-relaxed font-mono text-[11px] bg-white/70 p-2.5 rounded-lg border border-[#F3797E]/20">
                {event.errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-[#4B49AC]" />
              Event ID
            </span>
            <p className="font-mono text-xs font-semibold text-[#1E2238] select-all break-all">
              {event.id}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#4B49AC]" />
              Provider Phone Number ID
            </span>
            <p className="font-mono text-xs font-semibold text-[#1E2238] select-all">
              {event.providerPhoneNumberId || <span className="text-[#9CA3AF] italic">None</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1 sm:col-span-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383]">
              Idempotency Key
            </span>
            <p className="font-mono text-xs text-[#1E2238] select-all break-all bg-white p-2 rounded-lg border border-[#E4E8F0]">
              {event.idempotencyKey}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
              Received At
            </span>
            <p className="font-semibold text-xs text-[#1E2238]">
              {formatDate(event.receivedAt)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
              Processed At
            </span>
            <p className="font-semibold text-xs text-[#1E2238]">
              {formatDate(event.processedAt)}
            </p>
          </div>

          {event.eventOriginTimestamp && (
            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1 sm:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
                Provider Event Origin Timestamp
              </span>
              <p className="font-semibold text-xs text-[#1E2238]">
                {formatDate(event.eventOriginTimestamp)}
              </p>
            </div>
          )}
        </div>

        {/* Collapsed, Read-Only Raw Payload Inspection View */}
        <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] overflow-hidden">
          <button
            type="button"
            onClick={() => setIsPayloadExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-[#1E2238] hover:bg-[#F0F2F6] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4B49AC]" />
              <span>Raw Webhook Payload (Read-Only)</span>
              <span className="text-[10px] font-normal text-[#6C7383]">
                {isPayloadExpanded ? '(Click to collapse)' : '(Collapsed by default)'}
              </span>
            </div>
            {isPayloadExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#6C7383]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#6C7383]" />
            )}
          </button>

          {isPayloadExpanded && (
            <div className="p-4 pt-0 border-t border-[#E4E8F0]">
              <pre className="text-[11px] font-mono leading-relaxed text-[#1E2238] bg-white p-3.5 rounded-xl border border-[#E4E8F0] max-h-64 overflow-auto whitespace-pre-wrap select-all">
                {event.rawPayload
                  ? JSON.stringify(event.rawPayload, null, 2)
                  : '// No raw payload returned'}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#E4E8F0]">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 bg-[#F8F9FB] border border-[#E4E8F0] text-xs font-bold text-[#1E2238] hover:bg-[#E4E8F0] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
