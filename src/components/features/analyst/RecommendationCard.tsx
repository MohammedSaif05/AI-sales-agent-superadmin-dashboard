import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { ValidatedRecommendationItem } from '../../../api/types/analyst.types';

interface RecommendationCardProps {
  recommendation: ValidatedRecommendationItem;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center rounded-full bg-[#FEF0F0] border border-[#F3797E]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#F3797E]">
            HIGH PRIORITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center rounded-full bg-[#FFF7E8] border border-[#F59E0B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#F59E0B]">
            MEDIUM PRIORITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-[#F0F5FF] border border-[#4B49AC]/25 px-2.5 py-0.5 text-[10px] font-bold text-[#4B49AC]">
            LOW PRIORITY
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-[#E4E8F0] bg-white p-5 shadow-2xs space-y-3.5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#7978E9] border border-[#E4E8F0] shrink-0 shadow-2xs">
            <Target className="w-4.5 h-4.5" />
          </div>
          <h4 className="font-bold text-[#1E2238] text-sm truncate leading-snug">
            {recommendation.title}
          </h4>
        </div>
        <div className="shrink-0">
          {getPriorityBadge(recommendation.priority)}
        </div>
      </div>

      {/* Recommended Action */}
      <div className="rounded-xl bg-[#F8F9FB] border border-[#E4E8F0] p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#4B49AC] uppercase tracking-wider">
          <ArrowRight className="w-3.5 h-3.5 text-[#4B49AC]" />
          <span>Recommended Action</span>
        </div>
        <p className="text-xs font-semibold text-[#1E2238] leading-relaxed">
          {recommendation.action}
        </p>
      </div>

      {/* Business Rationale */}
      {recommendation.rationale && (
        <div className="text-xs text-[#5F677A] leading-relaxed">
          <span className="font-bold text-[#1E2238]">Rationale: </span>
          {recommendation.rationale}
        </div>
      )}

      {recommendation.referencedMetricKey && (
        <div className="pt-2 border-t border-[#E4E8F0]/70 flex items-center justify-between text-[11px]">
          <span className="text-[#98A2B3] font-medium">Referenced Metric:</span>
          <span className="font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2 py-0.5 rounded-md border border-[#4B49AC]/15">
            {recommendation.referencedMetricKey} {recommendation.referencedMetricValue !== null && recommendation.referencedMetricValue !== undefined ? `(${recommendation.referencedMetricValue})` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
