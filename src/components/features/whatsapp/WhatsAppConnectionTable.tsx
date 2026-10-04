'use client';

import React, { useState } from 'react';
import { Eye, Store, Phone, Search, Filter, MessageSquare, ShieldCheck } from 'lucide-react';
import { WhatsAppConnectionItem, WhatsAppConnectionStatus } from '../../../api/types/whatsapp.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { TableSkeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';
import { formatDate } from '../../../lib/utils';
import { WhatsAppConnectionDetailModal } from './WhatsAppConnectionDetailModal';

interface WhatsAppConnectionTableProps {
  connections: WhatsAppConnectionItem[];
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  status?: WhatsAppConnectionStatus;
  onStatusChange: (status?: WhatsAppConnectionStatus) => void;
  onRefresh: () => void;
}

export function WhatsAppConnectionTable({
  connections,
  isLoading,
  search,
  onSearchChange,
  status,
  onStatusChange,
}: WhatsAppConnectionTableProps) {
  const [selectedConnection, setSelectedConnection] = useState<WhatsAppConnectionItem | null>(null);

  const getQualityBadge = (quality: string | null) => {
    switch (quality?.toUpperCase()) {
      case 'GREEN':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">High</span>;
      case 'YELLOW':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Med</span>;
      case 'RED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Low</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Unknown</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E8F0] shadow-2xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search store, phone, WABA ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#6C7383]" />}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[#6C7383]">
            <Filter className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span className="font-semibold">Status:</span>
            <select
              value={status || ''}
              onChange={(e) =>
                onStatusChange(e.target.value ? (e.target.value as WhatsAppConnectionStatus) : undefined)
              }
              aria-label="Filter connections by status"
              className="rounded-xl border border-[#E4E8F0] bg-[#F8F9FB] px-3 py-1.5 text-xs font-semibold text-[#1E2238] focus:outline-none focus:ring-1 focus:ring-[#4B49AC] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value={WhatsAppConnectionStatus.CONNECTED}>Connected</option>
              <option value={WhatsAppConnectionStatus.DISCONNECTING}>Disconnecting</option>
              <option value={WhatsAppConnectionStatus.DISCONNECTED}>Disconnected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
        {isLoading && connections.length === 0 ? (
          <TableSkeleton rows={5} cols={7} />
        ) : connections.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8 text-[#4B49AC]" />}
            title={search || status ? 'No matching WhatsApp connections' : 'No WhatsApp connections found'}
            description={
              search || status
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Businesses with WhatsApp Business accounts connected will appear here.'
            }
            action={
              search || status ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSearchChange('');
                    onStatusChange(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Store & Business
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Display Phone
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Verified Name
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  WABA ID
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Phone Number ID
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Status
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-center">
                  Quality
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">
                  Last Sync
                </TableHead>
                <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((conn) => (
                <TableRow key={conn.id} className="hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70">
                  {/* Store & Business */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0 shadow-2xs">
                        <Store className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2238] text-sm block">
                          {conn.business?.name || '—'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#6C7383]">
                          <Phone className="w-3 h-3 text-[#9CA3AF]" />
                          <span>{conn.business?.phone || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Display Phone */}
                  <TableCell className="py-3.5 font-mono font-bold text-xs text-[#1E2238]">
                    {conn.displayPhoneNumber || '—'}
                  </TableCell>

                  {/* Verified Name */}
                  <TableCell className="py-3.5 text-xs text-[#1E2238]">
                    {conn.verifiedName ? (
                      <span className="font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        {conn.verifiedName}
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF] italic">Unverified</span>
                    )}
                  </TableCell>

                  {/* WABA ID */}
                  <TableCell className="py-3.5 font-mono text-xs text-[#6C7383]">
                    <span className="bg-[#F8F9FA] px-2 py-0.5 rounded-md border border-[#E4E8F0]">
                      {conn.wabaId.slice(0, 10)}...
                    </span>
                  </TableCell>

                  {/* Phone Number ID */}
                  <TableCell className="py-3.5 font-mono text-xs text-[#6C7383]">
                    <span className="bg-[#F8F9FA] px-2 py-0.5 rounded-md border border-[#E4E8F0]">
                      {conn.phoneNumberId.slice(0, 10)}...
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <Badge status={conn.status} />
                  </TableCell>

                  {/* Quality Rating */}
                  <TableCell className="py-3.5 text-center">
                    {getQualityBadge(conn.qualityRating)}
                  </TableCell>

                  {/* Last Sync */}
                  <TableCell className="py-3.5 font-mono text-xs text-[#6C7383] whitespace-nowrap">
                    {formatDate(conn.lastSyncAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedConnection(conn)}
                      leftIcon={<Eye className="w-3.5 h-3.5 text-[#4B49AC]" />}
                      className="rounded-xl border-[#E4E8F0] font-bold text-xs text-[#1E2238] hover:bg-[#4B49AC] hover:text-white hover:border-[#4B49AC] transition-all shadow-2xs"
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail Modal */}
      <WhatsAppConnectionDetailModal
        connection={selectedConnection}
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
      />
    </div>
  );
}
