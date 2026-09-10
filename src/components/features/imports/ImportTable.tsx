import React from 'react';
import Link from 'next/link';
import { Eye, FileSpreadsheet } from 'lucide-react';
import { GlobalImportItem } from '../../../api/types/admin.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { formatDate, formatNumber } from '../../../lib/utils';

export function ImportTable({ imports }: { imports: GlobalImportItem[] }) {
  return (
    <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Import Batch</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Business</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Type</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Status</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Total Rows</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Valid</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Invalid</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Duplicates</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Created</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {imports.map((item) => (
            <TableRow key={item.id} className="hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70">
              <TableCell className="font-mono text-xs font-medium py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7FF] border border-[#E4E8F0] text-[#7978E9] shrink-0 shadow-2xs">
                    <FileSpreadsheet className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-bold font-mono block text-[#1E2238] text-xs hover:text-[#4B49AC] transition-colors">
                      {item.id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-[#6C7383] font-medium font-sans truncate max-w-[140px] block" title={item.file?.fileName}>
                      {item.file?.fileName || 'Direct Payload'}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3.5">
                <div className="text-xs">
                  <span className="font-bold text-[#1E2238] text-sm block hover:text-[#4B49AC] transition-colors">
                    {item.business?.name || '—'}
                  </span>
                  <span className="text-[#6C7383] font-mono text-[11px] block">
                    {item.business?.phone || item.businessId}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-3.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase bg-[#F5F7FF] text-[#4B49AC] border border-[#4B49AC]/20 shadow-2xs">
                  {item.importType}
                </span>
              </TableCell>

              <TableCell className="py-3.5">
                <Badge status={item.status} />
              </TableCell>

              <TableCell className="text-right font-black text-[#1E2238] text-xs font-mono py-3.5">
                {formatNumber(item.totalRows)}
              </TableCell>

              <TableCell className="text-right py-3.5">
                <span className="inline-flex items-center justify-end font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/50">
                  {formatNumber(item.validRows)}
                </span>
              </TableCell>

              <TableCell className="text-right py-3.5">
                {item.invalidRows > 0 ? (
                  <span className="inline-flex items-center justify-end font-mono font-bold text-xs text-[#F3797E] bg-[#FEF0F0] px-2.5 py-0.5 rounded-md border border-[#F3797E]/30">
                    {formatNumber(item.invalidRows)}
                  </span>
                ) : (
                  <span className="font-mono font-semibold text-xs text-[#9CA3AF]">0</span>
                )}
              </TableCell>

              <TableCell className="text-right py-3.5">
                {item.duplicateRows > 0 ? (
                  <span className="inline-flex items-center justify-end font-mono font-bold text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/50">
                    {formatNumber(item.duplicateRows)}
                  </span>
                ) : (
                  <span className="font-mono font-semibold text-xs text-[#9CA3AF]">0</span>
                )}
              </TableCell>

              <TableCell className="text-xs text-[#6C7383] font-medium whitespace-nowrap font-mono py-3.5">
                {formatDate(item.createdAt)}
              </TableCell>

              <TableCell className="text-right whitespace-nowrap py-3.5">
                <Link href={`/admin/imports/${item.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5 text-[#4B49AC]" />}
                    className="rounded-xl border-[#E4E8F0] font-bold text-xs text-[#1E2238] hover:bg-[#4B49AC] hover:text-white hover:border-[#4B49AC] transition-all shadow-2xs"
                  >
                    Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
