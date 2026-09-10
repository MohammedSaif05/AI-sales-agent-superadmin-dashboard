import React from 'react';
import { Phone, ShieldAlert, MessageSquare, Volume2, Mail } from 'lucide-react';
import { CustomerItem } from '../../../api/types/admin.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { formatDate } from '../../../lib/utils';

export function CustomerTable({ customers }: { customers: CustomerItem[] }) {
  return (
    <div className="rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Customer</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Phone (Canonical)</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">City</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Source</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Marketing Preferences</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Status</TableHead>
            <TableHead className="py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]">Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const prefs = customer.preferences;
            const isSoftDeleted = !!customer.deletedAt;

            return (
              <TableRow
                key={customer.id}
                className={`hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70 ${
                  isSoftDeleted ? 'opacity-50 bg-[#F9FAFB]' : ''
                }`}
              >
                <TableCell className="font-medium text-[#1E2238] py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F7FF] border border-[#E4E8F0] text-[#4B49AC] shrink-0 font-bold text-xs shadow-2xs">
                      {customer.name ? customer.name[0]?.toUpperCase() : 'C'}
                    </div>
                    <div>
                      <span className="font-bold block text-[#212529]">{customer.name || 'Unnamed Customer'}</span>
                      {customer.email && (
                        <span className="text-xs text-[#6C7383] font-normal">{customer.email}</span>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#212529]">
                    <Phone className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                    <span>{customer.normalizedPhone || customer.rawPhone}</span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-[#6C7383]">
                  {customer.city || '—'}
                </TableCell>

                <TableCell>
                  <Badge variant="neutral" className="text-[10px] font-mono">
                    {customer.source}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {prefs?.doNotContact ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#FEF0F0] border border-[#F3797E]/30 px-2 py-0.5 text-[10px] font-bold text-[#F3797E]">
                        <ShieldAlert className="w-3 h-3" />
                        DNC
                      </span>
                    ) : (
                      <>
                        <span
                          title="WhatsApp Consent"
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                            prefs?.whatsappMarketing
                              ? 'bg-[#E8F8F0] border-[#10B981]/30 text-[#10B981]'
                              : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] line-through'
                          }`}
                        >
                          <MessageSquare className="w-3 h-3" />
                          WA
                        </span>

                        <span
                          title="Voice Consent"
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                            prefs?.voiceMarketing
                              ? 'bg-[#F0F5FF] border-[#7DA0FA]/30 text-[#7DA0FA]'
                              : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] line-through'
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                          Voice
                        </span>

                        <span
                          title="Email Consent"
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                            prefs?.emailMarketing
                              ? 'bg-[#F5F7FF] border-[#4B49AC]/20 text-[#4B49AC]'
                              : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF] line-through'
                          }`}
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {isSoftDeleted ? (
                    <Badge variant="danger" className="text-[10px]">Deleted</Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  )}
                </TableCell>

                <TableCell className="text-xs text-[#6C7383] whitespace-nowrap font-mono">
                  {formatDate(customer.createdAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
