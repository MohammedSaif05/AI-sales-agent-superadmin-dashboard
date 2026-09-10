import React from 'react';
import Link from 'next/link';
import {
  Store,
  Phone,
  Mail,
  Globe,
  MapPin,
  Users,
  FileSpreadsheet,
  Files,
  ExternalLink,
} from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

import { BusinessDetailData } from '../../../api/types/admin.types';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { formatDate, formatNumber } from '../../../lib/utils';


export function BusinessProfile({ business }: { business: BusinessDetailData }) {
  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <Card className="rounded-3xl border border-[#E4E8F0] shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-4 border-b border-[#E4E8F0]/80">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7DA0FA] text-white shadow-md shadow-[#4B49AC]/25 ring-4 ring-white shrink-0">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl sm:text-3xl font-black text-[#1E2238] tracking-tight">
                {business.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6C7383]">
                <span className="font-semibold text-[#1E2238]">Store ID:</span>
                <code className="text-xs font-mono font-bold text-[#4B49AC] bg-[#F5F7FF] px-2.5 py-0.5 rounded-md border border-[#E4E8F0]">
                  {business.id}
                </code>
                <span className="text-[#C4C9D6]">•</span>
                <span className="font-medium">Registered {formatDate(business.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/admin/businesses/${business.id}/customers`}>
              <Button
                variant="primary"
                size="md"
                className="rounded-xl font-bold shadow-sm shadow-[#4B49AC]/25 px-5 py-2.5"
                leftIcon={<Users className="w-4 h-4" />}
              >
                Inspect Customers ({formatNumber(business._count?.customers || 0)})
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Quick Metrics Bar (3 Micro Skydash Stat Cards) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-[#98BDFF]/40 bg-gradient-to-br from-[#98BDFF]/15 via-[#F5F7FF] to-white p-5 shadow-2xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4B49AC] text-white shadow-sm shadow-[#4B49AC]/25 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#4B49AC]">Customers</p>
                <p className="text-2xl sm:text-3xl font-black text-[#1E2238] font-mono leading-tight mt-0.5">
                  {formatNumber(business._count?.customers || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#7978E9]/30 bg-gradient-to-br from-[#7978E9]/10 via-[#F5F7FF] to-white p-5 shadow-2xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7978E9] text-white shadow-sm shadow-[#7978E9]/25 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#7978E9]">Import Batches</p>
                <p className="text-2xl sm:text-3xl font-black text-[#1E2238] font-mono leading-tight mt-0.5">
                  {formatNumber(business._count?.imports || 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-[#F3797E]/30 bg-gradient-to-br from-[#F3797E]/10 via-[#F5F7FF] to-white p-5 shadow-2xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3797E] text-white shadow-sm shadow-[#F3797E]/25 shrink-0">
                <Files className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#F3797E]">Staged Files</p>
                <p className="text-2xl sm:text-3xl font-black text-[#1E2238] font-mono leading-tight mt-0.5">
                  {formatNumber(business._count?.fileUploads || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact and Location Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2">
            {/* Contact Details */}
            <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 space-y-3.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2238] pb-2 border-b border-[#E4E8F0]">
                Contact Information
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-[#1E2238]">
                  <Phone className="w-4 h-4 text-[#4B49AC] shrink-0" />
                  <span className="font-mono font-bold text-sm">{business.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-[#1E2238]">
                  <Mail className="w-4 h-4 text-[#4B49AC] shrink-0" />
                  <span className="font-medium">{business.email || '—'}</span>
                </div>
                {business.website && (
                  <div className="flex items-center gap-3 text-[#4B49AC]">
                    <Globe className="w-4 h-4 shrink-0" />
                    <a href={business.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 font-bold">
                      {business.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {business.instagram && (
                  <div className="flex items-center gap-3 text-[#1E2238]">
                    <InstagramIcon className="w-4 h-4 text-[#F3797E] shrink-0" />
                    <span className="font-semibold">{business.instagram}</span>
                  </div>
                )}
                {business.facebook && (
                  <div className="flex items-center gap-3 text-[#1E2238]">
                    <FacebookIcon className="w-4 h-4 text-[#4B49AC] shrink-0" />
                    <span className="font-semibold">{business.facebook}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 space-y-3.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2238] pb-2 border-b border-[#E4E8F0]">
                Location & Address
              </h4>
              <div className="flex items-start gap-3 text-xs text-[#1E2238]">
                <MapPin className="w-4 h-4 text-[#4B49AC] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[#1E2238]">{business.address || '—'}</p>
                  <p className="text-[#6C7383] font-medium mt-1">
                    {business.city}, {business.state} — {business.pincode}
                  </p>
                  <p className="text-[#98A2B3] text-[11px] font-semibold mt-0.5">{business.country || 'India'}</p>
                </div>
              </div>

              {business.description && (
                <div className="pt-2">
                  <h5 className="text-[11px] font-bold text-[#6C7383] mb-1">Store Description:</h5>
                  <p className="text-xs text-[#5F677A] leading-relaxed bg-white p-3 rounded-xl border border-[#E4E8F0]">
                    {business.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Members / Owners */}
          <div className="pt-4 border-t border-[#E4E8F0]">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2238] mb-3">
              Store Membership & Roles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {business.businessUsers?.map((bu) => (
                <div
                  key={bu.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#4B49AC] to-[#7DA0FA] text-white font-bold text-sm shadow-2xs">
                      {bu.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-[#1E2238] text-sm">
                        {bu.user?.name || 'Unnamed User'}
                      </p>
                      <p className="text-[#6C7383] font-mono text-xs font-medium">{bu.user?.phone}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#4B49AC] px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase text-white shadow-2xs">
                    {bu.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

