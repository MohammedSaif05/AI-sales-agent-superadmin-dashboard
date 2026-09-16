import React from 'react';
import { ShieldCheck, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';
import { AnalysisRecordItem } from '../../../api/types/analyst.types';
import { Badge } from '../../ui/Badge';
import { formatDate } from '../../../lib/utils';

interface SafeTechnicalCardProps {
  analysis: AnalysisRecordItem;
}

export function SafeTechnicalCard({ analysis }: SafeTechnicalCardProps) {
  return (
    <div className="rounded-2xl border border-[#E4E8F0] bg-white p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#E4E8F0] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#4B49AC] border border-[#4B49AC]/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#1E2238] text-base leading-tight">
              Technical Audit Information
            </h3>
            <p className="text-xs text-[#6C7383]">
              Sanitized administrative metadata (zero PII / no raw JSON)
            </p>
          </div>
        </div>
        <Badge status={analysis.status} />
      </div>

      {analysis.errorMessage && (
        <div className="rounded-xl border border-[#F3797E]/30 bg-[#FEF0F0] p-4 text-xs text-[#C53030] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#F3797E]" />
          <div>
            <span className="font-bold block text-sm">Processing Error:</span>
            <p className="mt-1 leading-relaxed">{analysis.errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#6C7383] text-[11px] font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span>Analysis ID</span>
          </div>
          <p className="font-mono text-xs font-semibold text-[#1E2238] truncate" title={analysis.id}>
            {analysis.id}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#6C7383] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span>Analysis Type</span>
          </div>
          <p className="font-semibold text-xs text-[#1E2238]">
            {analysis.analysisType ? analysis.analysisType.replace(/_/g, ' ') : '—'}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#6C7383] text-[11px] font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span>Created At</span>
          </div>
          <p className="font-semibold text-xs text-[#1E2238]">
            {formatDate(analysis.createdAt)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[#6C7383] text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span>Completed At</span>
          </div>
          <p className="font-semibold text-xs text-[#1E2238]">
            {formatDate(analysis.completedAt)}
          </p>
        </div>
      </div>

      {analysis.result?.period && (
        <div className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FA] p-3.5 flex items-center justify-between text-xs">
          <span className="font-bold text-[#6C7383] uppercase tracking-wider text-[11px]">
            Analysis Data Period:
          </span>
          <span className="font-mono font-bold text-[#4B49AC] bg-white px-2.5 py-1 rounded-lg border border-[#E4E8F0] shadow-2xs">
            {analysis.result.period.from.substring(0, 10)} to {analysis.result.period.to.substring(0, 10)}
          </span>
        </div>
      )}
    </div>
  );
}
