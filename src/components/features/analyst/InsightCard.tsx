import React from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ValidatedInsightItem } from '../../../api/types/analyst.types';

interface InsightCardProps {
  insight: ValidatedInsightItem;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'POSITIVE':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8F0] border border-[#10B981]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#10B981]">
            <CheckCircle2 className="w-3 h-3" />
            POSITIVE
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF0F0] border border-[#F3797E]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#F3797E]">
            <AlertTriangle className="w-3 h-3" />
            ATTENTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F5FF] border border-[#4B49AC]/25 px-2.5 py-0.5 text-[10px] font-bold text-[#4B49AC]">
            <Info className="w-3 h-3" />
            NEUTRAL
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-[#E4E8F0] bg-white p-5 shadow-2xs space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0 shadow-2xs">
            <Lightbulb className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6C7383] block">
              {insight.category ? insight.category.replace(/_/g, ' ') : 'INSIGHT'}
            </span>
            <h4 className="font-bold text-[#1E2238] text-sm truncate leading-snug">
              {insight.title}
            </h4>
          </div>
        </div>
        <div className="shrink-0">
          {getSeverityBadge(insight.severity)}
        </div>
      </div>

      <p className="text-xs text-[#5F677A] leading-relaxed">
        {insight.description}
      </p>

      {insight.referencedMetricKey && (
        <div className="pt-2 border-t border-[#E4E8F0]/70 flex items-center justify-between text-[11px]">
          <span className="text-[#98A2B3] font-medium">Referenced Metric:</span>
          <span className="font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2 py-0.5 rounded-md border border-[#4B49AC]/15">
            {insight.referencedMetricKey} {insight.referencedMetricValue !== null && insight.referencedMetricValue !== undefined ? `(${insight.referencedMetricValue})` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
