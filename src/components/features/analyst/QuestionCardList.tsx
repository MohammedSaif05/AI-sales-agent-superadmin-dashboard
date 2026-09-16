import React from 'react';
import { HelpCircle, MessageSquare, Filter, Clock } from 'lucide-react';
import { QuestionRecordItem, QuestionStatus } from '../../../api/types/analyst.types';
import { PaginationMeta } from '../../../api/types/common.types';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { formatDate } from '../../../lib/utils';

interface QuestionCardListProps {
  questions: QuestionRecordItem[];
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  status?: QuestionStatus;
  onStatusChange?: (status?: QuestionStatus) => void;
  isLoading?: boolean;
}

export function QuestionCardList({
  questions,
  meta,
  onPageChange,
  onLimitChange,
  status,
  onStatusChange,
  isLoading,
}: QuestionCardListProps) {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E8F0] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2238]">
          <Filter className="w-4 h-4 text-[#4B49AC]" />
          <span>Filter Questions</span>
        </div>

        {onStatusChange && (
          <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
            <span>Status:</span>
            <select
              value={status || ''}
              onChange={(e) =>
                onStatusChange(e.target.value ? (e.target.value as QuestionStatus) : undefined)
              }
              aria-label="Filter questions by status"
              className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value={QuestionStatus.COMPLETED}>Completed</option>
              <option value={QuestionStatus.PROCESSING}>Processing</option>
              <option value={QuestionStatus.FAILED}>Failed</option>
            </select>
          </div>
        )}
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="rounded-3xl border border-[#E4E8F0] bg-white p-12 text-center text-[#6C7383] shadow-2xs">
          <HelpCircle className="w-10 h-10 mx-auto text-[#7978E9]/40 mb-3" />
          <h4 className="font-bold text-[#1E2238] text-sm">No Questions Found</h4>
          <p className="text-xs text-[#6C7383] mt-1">
            {isLoading
              ? 'Loading question history...'
              : 'No business analyst questions match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {questions.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E4E8F0] bg-white p-5 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#4B49AC] border border-[#4B49AC]/20 shrink-0 shadow-2xs mt-0.5">
                    <HelpCircle className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                      Question Asked
                    </span>
                    <h3 className="font-bold text-[#1E2238] text-sm leading-snug">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge status={item.status} />
                </div>
              </div>

              {/* AI Answer / Processing Status */}
              <div className="rounded-xl bg-[#F8F9FB] border border-[#E4E8F0] p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#4B49AC]">
                  <MessageSquare className="w-4 h-4 text-[#4B49AC]" />
                  <span>AI Business Analyst Response</span>
                </div>
                {item.answer ? (
                  <p className="text-xs text-[#212529] leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                  </p>
                ) : (
                  <p className="text-xs text-[#6C7383] italic">
                    {item.status === QuestionStatus.FAILED
                      ? 'No response generated due to an error processing this query.'
                      : 'Response is currently being generated...'}
                  </p>
                )}
              </div>

              {/* Footer with ID and Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E4E8F0]/70 text-[11px] text-[#6C7383]">
                <span className="font-mono text-[#98A2B3]">
                  ID: <span className="text-[#1E2238] font-semibold">{item.id}</span>
                </span>
                <div className="flex items-center gap-1 font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#4B49AC]" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && onPageChange && (
        <div className="bg-white rounded-2xl border border-[#E4E8F0] shadow-2xs overflow-hidden">
          <Pagination
            meta={meta}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}
