'use client';

import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Store,
  FileSpreadsheet,
  ArrowRight,
  Activity,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';
import { StatCards } from '../../../components/features/dashboard/StatCards';
import { CardsSkeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Button } from '../../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export default function DashboardPage() {
  const { data, isLoading, error, refresh } = useDashboard();

  return (
    <div className="space-y-7">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238] leading-tight">
            Welcome back, Super Admin
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5F677A]">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#4B49AC]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4B49AC] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4B49AC]" />
              </span>
              All systems operational
            </span>
            <span className="text-[#C4C9D6] hidden sm:inline">•</span>
            <span>Live multi-tenant sales & customer engine active.</span>
          </div>
        </div>


        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E4E8F0] shadow-2xs text-xs font-bold text-[#1E2238]">
            <Calendar className="w-3.5 h-3.5 text-[#4B49AC]" />
            <span>Today (Active Session)</span>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="rounded-xl border-[#E4E8F0] text-[#1E2238] font-bold hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"
          >
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* States: Loading, Error, Data */}
      {isLoading && !data ? (
        <CardsSkeleton count={4} />
      ) : error && !data ? (
        <ErrorState
          error={error}
          title="Unable to load dashboard statistics"
          onRetry={refresh}
        />
      ) : data ? (
        <>
          {/* Top Section: Hero Card + 2x2 Skydash Stat Grid */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            {/* Left: Skydash-style Platform Overview Card */}
            <div className="xl:col-span-5 rounded-3xl border border-[#98BDFF]/40 bg-gradient-to-br from-[#98BDFF]/20 via-[#F5F7FF] to-white p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(152,189,255,0.18)] min-h-[340px]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-extrabold tracking-wide text-[#4B49AC] shadow-2xs border border-[#E4E8F0]">
                    <Activity className="h-3.5 w-3.5 text-[#4B49AC] animate-pulse" />
                    SYSTEM ACTIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    100% API Uptime
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white shadow-lg shadow-[#4B49AC]/25 ring-4 ring-white/80 shrink-0">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4B49AC]">
                        Supervisor Node
                      </span>
                      <h2 className="text-2xl sm:text-[26px] font-black tracking-tight text-[#1E2238] leading-tight">
                        Platform Engine
                      </h2>
                    </div>
                  </div>
                  <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-[#5F677A] font-normal">
                    Continuous monitoring of tenant database isolation, customer ingestion pipelines, and Super Admin auditing across all active stores.
                  </p>
                </div>

                {/* Micro Metric Strip */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/80 p-2.5 border border-[#98BDFF]/30 backdrop-blur-xs shadow-2xs">
                  <div className="text-center p-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#98A2B3] block">Protocol</span>
                    <span className="text-xs font-bold font-mono text-[#1E2238]">REST / v1</span>
                  </div>
                  <div className="text-center p-1 border-x border-[#E4E8F0]">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#98A2B3] block">Isolation</span>
                    <span className="text-xs font-bold text-[#4B49AC]">Multi-Tenant</span>
                  </div>
                  <div className="text-center p-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#98A2B3] block">Audit Log</span>
                    <span className="text-xs font-bold text-emerald-600">Enabled</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#98BDFF]/30 flex flex-wrap items-center gap-2">
                <Badge variant="success" className="text-[10px] font-bold">API v1 Connected</Badge>
                <Badge variant="neutral" className="text-[10px] font-bold">RBAC Strict</Badge>
                <Badge variant="info" className="text-[10px] font-bold">JWT Protected</Badge>
              </div>
            </div>

            {/* Right: 2x2 Skydash Stat Cards */}
            <div className="xl:col-span-7">
              <StatCards stats={data} />
            </div>
          </div>

          {/* Operational Quick Links & Audit Context */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-7">
            {/* Card 1: Business Directory */}
            <Card className="rounded-3xl border border-[#E4E8F0] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0 shadow-2xs">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4B49AC]">
                        Tenant Management
                      </span>
                      <CardTitle className="text-lg font-bold text-[#1E2238] tracking-tight">
                        Business Directory
                      </CardTitle>
                      <CardDescription className="text-xs text-[#6C7383]">
                        Inspect registered stores and tenant operating profiles
                      </CardDescription>
                    </div>
                  </div>
                  <Link href="/admin/businesses">
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Browse
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 3-Column Micro Stat Grid */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#F8F9FB] p-3 border border-[#E4E8F0]/80">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Stores
                    </span>
                    <span className="text-xl font-black text-[#1E2238]">
                      {data.totalBusinesses}
                    </span>
                  </div>
                  <div className="text-center border-x border-[#E4E8F0]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Owners
                    </span>
                    <span className="text-xl font-black text-[#4B49AC]">
                      {data.totalUsers}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Customers
                    </span>
                    <span className="text-xl font-black text-emerald-600">
                      {data.totalCustomers}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#6C7383] leading-relaxed pt-1">
                  Search across {data.totalBusinesses} stores, view configured operating hours,
                  and inspect tenant customers for administrative support and compliance auditing.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Customer Imports Log */}
            <Card className="rounded-3xl border border-[#E4E8F0] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FF] text-[#7978E9] border border-[#E4E8F0] shrink-0 shadow-2xs">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7978E9]">
                        Data Ingestion
                      </span>
                      <CardTitle className="text-lg font-bold text-[#1E2238] tracking-tight">
                        Customer Imports Log
                      </CardTitle>
                      <CardDescription className="text-xs text-[#6C7383]">
                        Monitor platform-wide batch customer ingestion
                      </CardDescription>
                    </div>
                  </div>
                  <Link href="/admin/imports">
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Monitor
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 3-Column Micro Stat Grid */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#F8F9FB] p-3 border border-[#E4E8F0]/80">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Batches
                    </span>
                    <span className="text-xl font-black text-[#1E2238]">
                      {data.totalImports}
                    </span>
                  </div>
                  <div className="text-center border-x border-[#E4E8F0]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Completed
                    </span>
                    <span className="text-xl font-black text-emerald-600">
                      {data.completedImports}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C7383] block">
                      Failed
                    </span>
                    <span className="text-xl font-black text-[#F3797E]">
                      {data.failedImports}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#6C7383] leading-relaxed pt-1">
                  Audit {data.totalImports} total imports ({data.completedImports} completed,{' '}
                  {data.failedImports} failed). Inspect row-level validation errors and troubleshoot failed uploads.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

