'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3,
  HelpCircle,
  FileSpreadsheet,
  Calendar,
} from 'lucide-react';
import { useAnalystSummary } from '../../../../../hooks/useAnalystSummary';
import { useBusinessAnalyses } from '../../../../../hooks/useBusinessAnalyses';
import { useBusinessQuestions } from '../../../../../hooks/useBusinessQuestions';
import { MetricFactCard } from '../../../../../components/features/analyst/MetricFactCard';
import { InsightCard } from '../../../../../components/features/analyst/InsightCard';
import { RecommendationCard } from '../../../../../components/features/analyst/RecommendationCard';
import { LimitationBanner } from '../../../../../components/features/analyst/LimitationBanner';
import { AnalysisTable } from '../../../../../components/features/analyst/AnalysisTable';
import { QuestionCardList } from '../../../../../components/features/analyst/QuestionCardList';
import { Skeleton, CardsSkeleton } from '../../../../../components/ui/Skeleton';
import { ErrorState } from '../../../../../components/ui/ErrorState';
import { Button } from '../../../../../components/ui/Button';

type ActiveTab = 'summary' | 'analyses' | 'questions';

export default function BusinessAnalystHubPage() {
  const params = useParams();
  const businessId = typeof params?.id === 'string' ? params.id : '';

  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

  // Summary hook
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
    refresh: refreshSummary,
  } = useAnalystSummary(businessId);

  // Analyses hook
  const {
    data: analysesData,
    meta: analysesMeta,
    status: analysisStatusFilter,
    analysisType: analysisTypeFilter,
    setPage: setAnalysesPage,
    setLimit: setAnalysesLimit,
    setStatus: setAnalysesStatus,
    setAnalysisType: setAnalysesType,
    isLoading: isAnalysesLoading,
    error: analysesError,
    refresh: refreshAnalyses,
  } = useBusinessAnalyses(businessId, 1, 20);

  // Questions hook
  const {
    data: questionsData,
    meta: questionsMeta,
    status: questionStatusFilter,
    setPage: setQuestionsPage,
    setLimit: setQuestionsLimit,
    setStatus: setQuestionsStatus,
    isLoading: isQuestionsLoading,
    error: questionsError,
    refresh: refreshQuestions,
  } = useBusinessQuestions(businessId, 1, 20);

  const handleRefreshAll = () => {
    if (activeTab === 'summary') refreshSummary();
    else if (activeTab === 'analyses') refreshAnalyses();
    else if (activeTab === 'questions') refreshQuestions();
  };

  const isCurrentLoading =
    activeTab === 'summary'
      ? isSummaryLoading
      : activeTab === 'analyses'
        ? isAnalysesLoading
        : isQuestionsLoading;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link href={`/admin/businesses/${businessId}`}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
              >
                Back to Store Profile
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4B49AC] to-[#7DA0FA] text-white shadow-sm shadow-[#4B49AC]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]">
              AI Business Analyst Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#6C7383]">
            Auditing analytics, validated insights, and question history for Business ID:{' '}
            <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-1 rounded-lg border border-[#4B49AC]/20">
              {businessId}
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleRefreshAll}
            isLoading={isCurrentLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E4E8F0] pb-px">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-b-2 ${activeTab === 'summary'
            ? 'border-[#4B49AC] text-[#4B49AC] bg-white shadow-2xs'
            : 'border-transparent text-[#6C7383] hover:text-[#1E2238] hover:bg-[#F8F9FA]'
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>30-Day Executive Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('analyses')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-b-2 ${activeTab === 'analyses'
            ? 'border-[#4B49AC] text-[#4B49AC] bg-white shadow-2xs'
            : 'border-transparent text-[#6C7383] hover:text-[#1E2238] hover:bg-[#F8F9FA]'
            }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Historical Analyses</span>
          {analysesMeta?.total !== undefined && (
            <span className="rounded-full bg-[#F0F5FF] text-[#4B49AC] px-2 py-0.5 text-[10px] font-mono font-bold">
              {analysesMeta.total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs sm:text-sm transition-all border-b-2 ${activeTab === 'questions'
            ? 'border-[#4B49AC] text-[#4B49AC] bg-white shadow-2xs'
            : 'border-transparent text-[#6C7383] hover:text-[#1E2238] hover:bg-[#F8F9FA]'
            }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Questions & Answers</span>
          {questionsMeta?.total !== undefined && (
            <span className="rounded-full bg-[#F0F5FF] text-[#4B49AC] px-2 py-0.5 text-[10px] font-mono font-bold">
              {questionsMeta.total}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: 30-Day Executive Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {isSummaryLoading && !summaryData ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 space-y-4 shadow-sm">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
              <CardsSkeleton count={4} />
            </div>
          ) : summaryError ? (
            <ErrorState
              error={summaryError}
              title="Failed to load AI Business Analyst summary"
              onRetry={refreshSummary}
            />
          ) : summaryData ? (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="rounded-3xl border border-[#E4E8F0] bg-white p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E8F0] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#4B49AC] border border-[#4B49AC]/20">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E2238] leading-tight">
                        Executive AI Synthesis
                      </h2>
                      <p className="text-xs text-[#6C7383]">
                        Deterministic calculation verified against business data
                      </p>
                    </div>
                  </div>

                  {summaryData.period && (
                    <div className="flex items-center gap-2 rounded-xl bg-[#F8F9FA] border border-[#E4E8F0] px-3.5 py-1.5 text-xs text-[#6C7383]">
                      <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
                      <span>Trailing Period:</span>
                      <span className="font-mono font-bold text-[#1E2238]">
                        {summaryData.period.from.substring(0, 10)} → {summaryData.period.to.substring(0, 10)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Safe plain text AI Summary */}
                <div className="rounded-2xl bg-[#F8F9FB] border border-[#E4E8F0] p-5">
                  <p className="text-sm text-[#212529] leading-relaxed whitespace-pre-wrap font-normal">
                    {summaryData.summary}
                  </p>
                </div>

                {/* Sparse Data Limitations */}
                <LimitationBanner limitations={summaryData.dataLimitations} />
              </div>

              {/* Metric Facts Section */}
              {summaryData.metrics && summaryData.metrics.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#4B49AC]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                      Key Metric Facts ({summaryData.metrics.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryData.metrics.map((metric) => (
                      <MetricFactCard key={metric.key} metric={metric} />
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Insights Section */}
              {summaryData.insights && summaryData.insights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#4B49AC]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                      Validated Strategic Insights ({summaryData.insights.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summaryData.insights.map((insight, idx) => (
                      <InsightCard key={idx} insight={insight} />
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendations Section */}
              {summaryData.recommendations && summaryData.recommendations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7978E9]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1E2238]">
                      Actionable Recommendations ({summaryData.recommendations.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summaryData.recommendations.map((rec, idx) => (
                      <RecommendationCard key={idx} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#E4E8F0] bg-white p-12 text-center text-[#6C7383] shadow-sm">
              <Sparkles className="w-10 h-10 mx-auto text-[#7978E9]/40 mb-3" />
              <h4 className="font-bold text-[#1E2238] text-base">No Summary Available</h4>
              <p className="text-xs text-[#6C7383] mt-1">
                No 30-day analyst summary could be retrieved for this business.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Historical Analyses */}
      {activeTab === 'analyses' && (
        <div className="space-y-4">
          {analysesError ? (
            <ErrorState
              error={analysesError}
              title="Failed to load historical analyses"
              onRetry={refreshAnalyses}
            />
          ) : (
            <AnalysisTable
              analyses={analysesData}
              businessId={businessId}
              meta={analysesMeta}
              onPageChange={setAnalysesPage}
              onLimitChange={setAnalysesLimit}
              status={analysisStatusFilter}
              onStatusChange={setAnalysesStatus}
              analysisType={analysisTypeFilter}
              onTypeChange={setAnalysesType}
              isLoading={isAnalysesLoading}
            />
          )}
        </div>
      )}

      {/* Tab 3: Question History */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questionsError ? (
            <ErrorState
              error={questionsError}
              title="Failed to load question history"
              onRetry={refreshQuestions}
            />
          ) : (
            <QuestionCardList
              questions={questionsData}
              meta={questionsMeta}
              onPageChange={setQuestionsPage}
              onLimitChange={setQuestionsLimit}
              status={questionStatusFilter}
              onStatusChange={setQuestionsStatus}
              isLoading={isQuestionsLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
