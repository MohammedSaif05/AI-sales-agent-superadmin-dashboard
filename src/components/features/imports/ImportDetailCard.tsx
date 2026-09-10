import React from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  HardDrive,
  Store,
  Phone,
  MapPin,
} from 'lucide-react';
import { ImportDetailData } from '../../../api/types/admin.types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { formatDate, formatNumber, formatFileSize } from '../../../lib/utils';

export function ImportDetailCard({ item }: { item: ImportDetailData }) {
  const isFailed = item.status === 'FAILED';

  return (
    <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E4E8F0]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7978E9] to-[#98BDFF] text-white shrink-0 shadow-md shadow-[#7978E9]/20">
            <FileSpreadsheet className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E2238] tracking-tight">
                Import Job Details
              </h2>
              <Badge status={item.status} />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase bg-[#F5F7FF] text-[#4B49AC] border border-[#4B49AC]/20 shadow-2xs">
                {item.importType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#6C7383]">
              <span>Job ID:</span>
              <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-1 rounded-lg border border-[#4B49AC]/20 select-all">
                {item.id}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Row Statistics Breakdown */}
      <div>
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] mb-3">
          Row Statistics Breakdown
        </h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 shadow-2xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C7383]">
              Total Rows
            </span>
            <p className="text-3xl sm:text-4xl font-black font-mono text-[#1E2238] mt-2">
              {formatNumber(item.totalRows)}
            </p>
            <span className="text-[11px] text-[#9CA3AF] font-medium mt-1 block">
              Batch payload sum
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-emerald-50/20 p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Valid Rows</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 mt-2">
              {formatNumber(item.validRows)}
            </p>
            <span className="text-[11px] text-emerald-600/80 font-medium mt-1 block">
              Successfully staged
            </span>
          </div>

          <div className="rounded-2xl border border-[#F3797E]/40 bg-gradient-to-b from-[#FEF0F0] to-[#FEF0F0]/30 p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F3797E]">
              <XCircle className="w-4 h-4 text-[#F3797E]" />
              <span>Invalid Rows</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black font-mono text-[#F3797E] mt-2">
              {formatNumber(item.invalidRows)}
            </p>
            <span className="text-[11px] text-[#F3797E]/80 font-medium mt-1 block">
              Validation errors
            </span>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/80 to-amber-50/20 p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700">
              <Copy className="w-4 h-4 text-amber-600" />
              <span>Duplicate Rows</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black font-mono text-amber-700 mt-2">
              {formatNumber(item.duplicateRows)}
            </p>
            <span className="text-[11px] text-amber-600/80 font-medium mt-1 block">
              Existing duplicates
            </span>
          </div>
        </div>
      </div>

      {/* Business & Creator Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-6 border-t border-[#E4E8F0]">
        {/* Business Info */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
            Target Business
          </h4>
          <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shadow-2xs shrink-0">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-black text-[#1E2238] text-base block hover:text-[#4B49AC] transition-colors">
                    {item.business?.name || '—'}
                  </span>
                  <span className="text-xs font-mono text-[#6C7383]">
                    ID: {item.businessId.slice(0, 12)}...
                  </span>
                </div>
              </div>
              <Link href={`/admin/businesses/${item.businessId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#E4E8F0] font-bold text-xs text-[#4B49AC] hover:bg-[#4B49AC] hover:text-white hover:border-[#4B49AC] shadow-2xs transition-all"
                >
                  View Store
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-[#E4E8F0]/70 text-xs">
              <div className="flex items-center gap-2 text-[#6C7383]">
                <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span className="font-mono font-bold text-[#1E2238]">
                  {item.business?.phone || '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6C7383]">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span className="font-medium text-[#1E2238] truncate">
                  {item.business?.city
                    ? `${item.business.city}, ${item.business.state || ''}`
                    : 'Location unassigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded File Info */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
            Uploaded Source File
          </h4>
          <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#7978E9] border border-[#E4E8F0] shadow-2xs shrink-0">
                <HardDrive className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-[#1E2238] text-sm block truncate" title={item.file?.fileName}>
                  {item.file?.fileName || 'Direct Submission / Vision Payload'}
                </span>
                {item.file && (
                  <span className="text-xs font-mono text-[#6C7383] block mt-0.5">
                    Size: {formatFileSize(item.file.fileSize)} • Type: {item.file.fileType}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4E8F0]/70 flex items-center justify-between text-xs">
              <span className="text-[#6C7383] font-medium">Uploaded By:</span>
              <span className="font-bold text-[#1E2238] bg-white px-2.5 py-1 rounded-lg border border-[#E4E8F0] shadow-2xs">
                {item.createdBy ? item.createdBy.name || item.createdBy.phone : 'System / Direct'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="pt-6 border-t border-[#E4E8F0]">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] mb-3">
          Timeline & Processing
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0] shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#4B49AC] border border-[#E4E8F0] shadow-2xs shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6C7383] block">
                Created At
              </span>
              <span className="font-mono font-semibold text-[#1E2238]">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0] shadow-2xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#4B49AC] border border-[#E4E8F0] shadow-2xs shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6C7383] block">
                Completed At
              </span>
              <span className="font-mono font-semibold text-[#1E2238]">
                {item.completedAt ? formatDate(item.completedAt) : 'Pending completion'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Diagnostics / Troubleshooting Box */}
      {(item.errorSummary || isFailed) && (
        <div className="rounded-2xl border border-[#F3797E]/40 bg-[#FEF0F0] p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#F3797E] shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h5 className="text-sm font-black text-[#991B1B]">
                Troubleshooting Diagnostic
              </h5>
              <p className="text-xs text-[#B91C1C] leading-relaxed font-mono bg-white/70 p-3 rounded-xl border border-[#F3797E]/20">
                {item.errorSummary ||
                  'The import job encountered an unrecoverable failure during processing.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
