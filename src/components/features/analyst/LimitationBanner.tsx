import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface LimitationBannerProps {
  limitations?: string[] | null;
}

export function LimitationBanner({ limitations }: LimitationBannerProps) {
  if (!limitations || limitations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#FFFBEB] p-4.5 text-xs text-[#92400E] shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706] shrink-0 border border-[#F59E0B]/20">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="font-bold text-sm text-[#78350F] tracking-tight">
            Data Limitations & Sparse Data Advisory
          </h4>
          <p className="text-[#92400E]/90 text-xs leading-relaxed">
            The AI Business Analyst identified the following data boundaries while computing this analysis:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-xs text-[#92400E] font-medium leading-relaxed">
            {limitations.map((item, index) => (
              <li key={index} className="leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
