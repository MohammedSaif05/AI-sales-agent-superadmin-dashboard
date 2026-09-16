import React from 'react';
import Link from 'next/link';
import { Eye, FileText, Filter } from 'lucide-react';
import { AnalysisRecordItem, AnalysisStatus, AnalysisType } from '../../../api/types/analyst.types';
import { PaginationMeta } from '../../../api/types/common.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Pagination } from '../../ui/Pagination';
import { formatDate } from '../../../lib/utils';

interface AnalysisTableProps {
  analyses: AnalysisRecordItem[];
  businessId: string;
  meta?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  status?: AnalysisStatus;
  onStatusChange?: (status?: AnalysisStatus) => void;
  analysisType?: AnalysisType;
  onTypeChange?: (type?: AnalysisType) => void;
  isLoading?: boolean;
}

export function AnalysisTable({
  analyses,
  businessId,
  meta,
  onPageChange,
  onLimitChange,
  status,
  onStatusChange,
  analysisType,
  onTypeChange,
  isLoading,
}: AnalysisTableProps) {
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E8F0] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2238]">
          <Filter className="w-4 h-4 text-[#4B49AC]" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Analysis Type Filter */}
          {onTypeChange && (
            <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
              <span>Type:</span>
              <select
                value={analysisType || ''}
                onChange={(e) =>
                  onTypeChange(e.target.value ? (e.target.value as AnalysisType) : undefined)
                }
                aria-label="Filter by analysis type"
                className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
              >
                <option value="">All Analysis Types</option>
                <option value={AnalysisType.BUSINESS_SUMMARY}>Business Summary</option>
                <option value={AnalysisType.CUSTOMER_ANALYSIS}>Customer Analysis</option>
                <option value={AnalysisType.SALES_ANALYSIS}>Sales Analysis</option>
                <option value={AnalysisType.PRODUCT_ANALYSIS}>Product Analysis</option>
                <option value={AnalysisType.CAMPAIGN_ANALYSIS}>Campaign Analysis</option>
                <option value={AnalysisType.TREND_ANALYSIS}>Trend Analysis</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          {onStatusChange && (
            <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
              <span>Status:</span>
              <select
                value={status || ''}
                onChange={(e) =>
                  onStatusChange(e.target.value ? (e.target.value as AnalysisStatus) : undefined)
                }
                aria-label="Filter by status"
                className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value={AnalysisStatus.COMPLETED}>Completed</option>
                <option value={AnalysisStatus.PROCESSING}>Processing</option>
                <option value={AnalysisStatus.QUEUED}>Queued</option>
                <option value={AnalysisStatus.FAILED}>Failed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Analysis ID
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Type
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Status
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Period
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Summary
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                Created
              </TableHead>
              <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#6C7383]">
                  {isLoading ? 'Loading analyses...' : 'No analysis reports found matching the criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              analyses.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70"
                >
                  {/* ID */}
                  <TableCell className="font-mono text-xs font-medium py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F7FF] border border-[#E4E8F0] text-[#4B49AC] shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold font-mono block text-[#1E2238] text-xs">
                          {item.id.slice(0, 8)}...
                        </span>
                        <span className="text-[10px] text-[#6C7383] font-mono">
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase bg-[#F5F7FF] text-[#4B49AC] border border-[#4B49AC]/20 shadow-2xs">
                      {item.analysisType ? item.analysisType.replace(/_/g, ' ') : '—'}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <Badge status={item.status} />
                  </TableCell>

                  {/* Period */}
                  <TableCell className="py-3.5 text-xs text-[#5F677A] font-mono">
                    {item.result?.period ? (
                      <span className="font-medium text-[#1E2238]">
                        {item.result.period.from.substring(0, 10)} → {item.result.period.to.substring(0, 10)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  {/* Summary */}
                  <TableCell className="py-3.5 max-w-[280px]">
                    <p className="text-xs text-[#5F677A] line-clamp-2 leading-relaxed" title={item.summary || item.errorMessage || ''}>
                      {item.summary || (item.errorMessage ? `Error: ${item.errorMessage}` : '—')}
                    </p>
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-xs text-[#6C7383] font-medium whitespace-nowrap font-mono py-3.5">
                    {formatDate(item.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right whitespace-nowrap py-3.5">
                    <Link href={`/admin/businesses/${businessId}/analyst/analyses/${item.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5 text-[#4B49AC]" />}
                        className="rounded-xl border-[#E4E8F0] font-bold text-xs text-[#1E2238] hover:bg-[#4B49AC] hover:text-white hover:border-[#4B49AC] transition-all shadow-2xs"
                      >
                        Inspect
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {meta && onPageChange && (
          <Pagination
            meta={meta}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
