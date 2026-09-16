'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAnalysisDetail } from '../../../../../../../hooks/useAnalysisDetail';
import { MetricFactCard } from '../../../../../../../components/features/analyst/MetricFactCard';
import { InsightCard } from '../../../../../../../components/features/analyst/InsightCard';
import { RecommendationCard } from '../../../../../../../components/features/analyst/RecommendationCard';
import { LimitationBanner } from '../../../../../../../components/features/analyst/LimitationBanner';
import { SafeTechnicalCard } from '../../../../../../../components/features/analyst/SafeTechnicalCard';
import { Badge } from '../../../../../../../components/ui/Badge';
import { Skeleton, CardsSkeleton } from '../../../../../../../components/ui/Skeleton';
import { ErrorState } from '../../../../../../../components/ui/ErrorState';
import { Button } from '../../../../../../../components/ui/Button';

export default function AnalysisDetailPage() {
  const params = useParams();
  const businessId = typeof params?.id === 'string' ? params.id : '';
  const analysisId = typeof params?.analysisId === 'string' ? params.analysisId : '';

  const { data, isLoading, error, refresh } = useAnalysisDetail(businessId, analysisId);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link href={`/admin/businesses/${businessId}/analyst`}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
              >
                Back to Analyst Hub
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4B49AC] to-[#7DA0FA] text-white shadow-sm shadow-[#4B49AC]/25">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]">
              Analysis Report Audit
            </h1>
            {data && <Badge status={data.status} />}
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#6C7383]">
            Deep inspection of analysis{' '}
            <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-1 rounded-lg border border-[#4B49AC]/20">
              {analysisId}
            </code>{' '}
            for Business ID:{' '}
            <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-1 rounded-lg border border-[#4B49AC]/20">
              {businessId}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* State Rendering */}
      {isLoading && !data ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <CardsSkeleton count={4} />
        </div>
      ) : error ? (
        <ErrorState
          error={error}
          title="Failed to load analysis report"
          onRetry={refresh}
        />
      ) : data ? (
        <div className="space-y-6">
          {/* Failure Alert if FAILED */}
          {data.status === 'FAILED' && (
            <div className="rounded-2xl border border-[#F3797E]/40 bg-[#FEF0F0] p-5 shadow-2xs flex items-start gap-3.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3797E] text-white shrink-0 shadow-2xs">
                <AlertCircle className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[#C53030]">Analysis Failed to Complete</h3>
                <p className="text-xs text-[#C53030]/90 leading-relaxed">
                  {data.errorMessage ||
                    'An error occurred during analysis processing. Technical details are logged below.'}
                </p>
              </div>
            </div>
          )}

          {/* Synthesis / Summary Card (if summary or result is present) */}
          {(data.summary || data.result) && (
            <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E8F0] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#4B49AC] border border-[#4B49AC]/20">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E2238] leading-tight">
                      {data.analysisType ? data.analysisType.replace(/_/g, ' ') : 'Analysis'} Synthesis
                    </h2>
                    <p className="text-xs text-[#6C7383]">
                      Deterministic analysis calculated from business transactional records
                    </p>
                  </div>
                </div>

                {data.result?.period && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] px-3.5 py-1.5 text-xs text-[#6C7383]">
                    <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
                    <span>Period:</span>
                    <span className="font-mono font-bold text-[#1E2238]">
                      {data.result.period.from.substring(0, 10)} → {data.result.period.to.substring(0, 10)}
                    </span>
                  </div>
                )}
              </div>

              {/* Safe plain text AI summary */}
              {data.summary && (
                <div className="rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0] p-5">
                  <p className="text-sm text-[#212529] leading-relaxed whitespace-pre-wrap font-normal">
                    {data.summary}
                  </p>
                </div>
              )}

              {/* Sparse Data Limitations Banner */}
              <LimitationBanner limitations={data.result?.dataLimitations} />
            </div>
          )}

          {/* Metric Facts Section */}
          {data.result?.metrics && data.result.metrics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4B49AC]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                  Verified Metric Facts ({data.result.metrics.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.result.metrics.map((metric) => (
                  <MetricFactCard key={metric.key} metric={metric} />
                ))}
              </div>
            </div>
          )}

          {/* Strategic Insights Section */}
          {data.result?.insights && data.result.insights.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4B49AC]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                  Validated Strategic Insights ({data.result.insights.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.result.insights.map((insight, idx) => (
                  <InsightCard key={idx} insight={insight} />
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations Section */}
          {data.result?.recommendations && data.result.recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7978E9]" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                  Actionable Recommendations ({data.result.recommendations.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.result.recommendations.map((rec, idx) => (
                  <RecommendationCard key={idx} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          {/* Safe Technical Metadata Audit (Replacing raw JSON drawer) */}
          <SafeTechnicalCard analysis={data} />
        </div>
      ) : null}
    </div>
  );
}
