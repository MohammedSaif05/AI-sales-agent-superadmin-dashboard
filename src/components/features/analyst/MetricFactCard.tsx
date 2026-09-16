import React from 'react';
import { MetricFactItem } from '../../../api/types/analyst.types';
import { formatNumber } from '../../../lib/utils';

interface MetricFactCardProps {
  metric: MetricFactItem;
}

export function MetricFactCard({ metric }: MetricFactCardProps) {
  const formatValue = (val: number | null, unit: string) => {
    if (val === null || val === undefined) return '—';

    const normalizedUnit = (unit || '').toLowerCase().trim();
    if (normalizedUnit === 'percentage' || normalizedUnit === '%') {
      return `${val}%`;
    }
    if (normalizedUnit === 'currency') {
      return `₹${formatNumber(val)}`;
    }
    if (normalizedUnit === 'rate') {
      return `${val}x`;
    }
    return formatNumber(val);
  };

  return (
    <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 shadow-2xs hover:border-[#4B49AC]/30 transition-all flex flex-col justify-between min-h-[130px]">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] truncate block" title={metric.name}>
            {metric.name}
          </span>
          {metric.unit && (
            <span className="rounded-md bg-white border border-[#E4E8F0] px-2 py-0.5 text-[10px] font-mono font-bold text-[#4B49AC] shadow-2xs shrink-0">
              {metric.unit}
            </span>
          )}
        </div>

        <p className="text-3xl font-black font-mono text-[#1E2238] tracking-tight mt-2">
          {formatValue(metric.value, metric.unit)}
        </p>
      </div>

      {metric.description && (
        <p className="text-xs text-[#6C7383] mt-2 line-clamp-2 leading-relaxed" title={metric.description}>
          {metric.description}
        </p>
      )}
    </div>
  );
}
