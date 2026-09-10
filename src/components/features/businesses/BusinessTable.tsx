import React from 'react';
import Link from 'next/link';
import { Eye, Store, Phone, Users, FileSpreadsheet } from 'lucide-react';
import { BusinessListItem } from '../../../api/types/admin.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Button } from '../../ui/Button';
import { formatDate, formatNumber } from '../../../lib/utils';

export function BusinessTable({ businesses }: { businesses: BusinessListItem[] }) {
  return (
    <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Business Name</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Location</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Owner</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-center">Customers</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-center">Imports</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Created</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <TableRow key={business.id} className="hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70">
              <TableCell className="font-medium py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0 shadow-2xs">
                    <Store className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1E2238] text-sm block hover:text-[#4B49AC] transition-colors">{business.name}</span>
                    <span className="text-xs font-mono text-[#6C7383] font-normal">{business.phone}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-xs">
                <span className="font-bold text-[#1E2238] block">
                  {business.city ? `${business.city}, ${business.state}` : '—'}
                </span>
                <span className="text-[11px] text-[#6C7383]">{business.country || 'India'}</span>
              </TableCell>

              <TableCell>
                {business.owner ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#1E2238]">
                      <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span className="font-mono font-bold">{business.owner.phone}</span>
                    </div>
                    {business.owner.name && (
                      <span className="text-[11px] font-medium text-[#4B49AC] bg-[#F5F7FF] px-2 py-0.5 rounded-md inline-block border border-[#4B49AC]/15">
                        {business.owner.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[#9CA3AF] text-xs italic">No Owner Assigned</span>
                )}
              </TableCell>

              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F7FF] border border-[#E4E8F0] px-3 py-1 text-xs font-bold text-[#4B49AC] shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-[#4B49AC]" />
                  {formatNumber(business.stats?.customerCount || 0)}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F9FB] border border-[#E4E8F0] px-3 py-1 text-xs font-bold text-[#1E2238] shadow-2xs">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#7978E9]" />
                  {formatNumber(business.stats?.importCount || 0)}
                </span>
              </TableCell>

              <TableCell className="text-xs text-[#6C7383] whitespace-nowrap font-mono font-medium">
                {formatDate(business.createdAt)}
              </TableCell>

              <TableCell className="text-right whitespace-nowrap">
                <Link href={`/admin/businesses/${business.id}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl font-bold text-xs hover:bg-[#4B49AC] hover:text-white transition-all shadow-2xs"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Store
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

