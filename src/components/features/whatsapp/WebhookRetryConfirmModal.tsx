'use client';

import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';

interface WebhookRetryConfirmModalProps {
  eventId: string | null;
  isOpen: boolean;
  isRetrying: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function WebhookRetryConfirmModal({
  eventId,
  isOpen,
  isRetrying,
  onConfirm,
  onClose,
}: WebhookRetryConfirmModalProps) {
  if (!isOpen || !eventId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-3xl border border-[#E4E8F0] bg-white p-6 shadow-xl space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="retry-modal-title"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="retry-modal-title" className="text-base font-bold text-[#1E2238] leading-tight">
              Retry Webhook Event?
            </h3>
            <p className="text-xs text-[#6C7383]">
              Re-queue this event for backend background processing
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0] p-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#6C7383]">Target Event ID:</span>
            <span className="font-mono font-bold text-[#1E2238] select-all truncate max-w-[220px]" title={eventId}>
              {eventId}
            </span>
          </div>
          <p className="text-[#6C7383] text-[11px] leading-relaxed pt-1 border-t border-[#E4E8F0]/70">
            This will enqueue a <code className="text-[#4B49AC] font-bold">PROCESS_WEBHOOK</code> job in BullMQ and reset the event status to <code className="text-amber-700 font-bold">QUEUED</code>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E4E8F0]">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isRetrying}
            className="rounded-xl font-bold text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isRetrying}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl font-bold text-xs bg-[#4B49AC] hover:bg-[#3F3D91] shadow-2xs"
          >
            Confirm Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
