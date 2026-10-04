'use client';

import React from 'react';
import { X, MessageSquare, Store, Phone, ShieldCheck, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { WhatsAppConnectionItem, WhatsAppConnectionStatus } from '../../../api/types/whatsapp.types';
import { Badge } from '../../ui/Badge';
import { formatDate } from '../../../lib/utils';

interface WhatsAppConnectionDetailModalProps {
  connection: WhatsAppConnectionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppConnectionDetailModal({
  connection,
  isOpen,
  onClose,
}: WhatsAppConnectionDetailModalProps) {
  if (!isOpen || !connection) return null;

  const getQualityBadge = (quality: string | null) => {
    switch (quality?.toUpperCase()) {
      case 'GREEN':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">High (Green)</span>;
      case 'YELLOW':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Medium (Yellow)</span>;
      case 'RED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Low (Red)</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Unknown</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-3xl border border-[#E4E8F0] bg-white p-6 sm:p-7 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="connection-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E4E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white shadow-md shadow-[#4B49AC]/25">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 id="connection-modal-title" className="text-lg font-bold text-[#1E2238] leading-tight">
                WhatsApp Connection Details
              </h2>
              <p className="text-xs text-[#6C7383]">
                Operational connection metadata for {connection.business?.name || 'Store'}
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

        {/* Status & Store Identity */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0]">
          <div className="flex items-center gap-2.5">
            <Store className="w-4 h-4 text-[#4B49AC]" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] block">
                Business Store
              </span>
              <span className="font-bold text-sm text-[#1E2238]">{connection.business?.name || '—'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge status={connection.status} />
            {getQualityBadge(connection.qualityRating)}
          </div>
        </div>

        {/* Disconnect Warning Banner (if applicable) */}
        {connection.status === WhatsAppConnectionStatus.DISCONNECTING && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/30 text-xs text-[#92400E]">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Disconnect in Progress</span>
              <p>
                A disconnect request has been initiated for this WhatsApp account. Active operations are winding down gracefully.
              </p>
              {connection.disconnectReason && (
                <p className="font-mono text-[11px] pt-1 text-[#78350F]">
                  Reason: {connection.disconnectReason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#4B49AC]" />
              Display Phone Number
            </span>
            <p className="font-mono font-bold text-sm text-[#1E2238]">
              {connection.displayPhoneNumber || '—'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4B49AC]" />
              Meta Verified Name
            </span>
            <p className="font-bold text-sm text-[#1E2238]">
              {connection.verifiedName || <span className="text-[#9CA3AF] font-normal italic">Unverified</span>}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383]">
              WhatsApp Business Account ID (WABA)
            </span>
            <p className="font-mono text-xs font-semibold text-[#1E2238] select-all break-all">
              {connection.wabaId}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383]">
              Phone Number ID
            </span>
            <p className="font-mono text-xs font-semibold text-[#1E2238] select-all break-all">
              {connection.phoneNumberId}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
              Connection Version
            </span>
            <p className="font-mono font-bold text-sm text-[#1E2238]">
              v{connection.connectionVersion}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
              Last Synchronized
            </span>
            <p className="font-semibold text-xs text-[#1E2238]">
              {formatDate(connection.lastSyncAt)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
              Connected On
            </span>
            <p className="font-semibold text-xs text-[#1E2238]">
              {formatDate(connection.createdAt)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
              Last Updated
            </span>
            <p className="font-semibold text-xs text-[#1E2238]">
              {formatDate(connection.updatedAt)}
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FA] p-3 text-[11px] text-[#6C7383] flex items-center justify-between">
          <span>Security status:</span>
          <span className="font-semibold text-[#10B981] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tokens sanitized by backend (zero credentials exposed)
          </span>
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
