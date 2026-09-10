import React from 'react';
import { Store, Users, FileSpreadsheet, Files, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardStats } from '../../../api/types/admin.types';
import { formatNumber } from '../../../lib/utils';


export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* 1. Total Businesses (Skydash Cornflower Blue #7DA0FA) */}
      <div className="rounded-2xl p-5 sm:p-6 text-white shadow-sm bg-[#7DA0FA] flex flex-col justify-between min-h-[160px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 block">
              Platform Tenants
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Total Businesses
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/30 shadow-xs">
            <Store className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-4xl sm:text-[42px] font-black tracking-tight text-white leading-none">
            {formatNumber(stats.totalBusinesses)}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/20 text-xs">
          <span className="font-semibold text-white/95">
            {formatNumber(stats.totalUsers)} platform user accounts
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full text-white">
            Active
          </span>
        </div>
      </div>

      {/* 2. Total Customers (Skydash Deep Indigo #4B49AC) */}
      <div className="rounded-2xl p-5 sm:p-6 text-white shadow-sm bg-[#4B49AC] flex flex-col justify-between min-h-[160px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 block">
              Customer Directory
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Total Customers
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/30 shadow-xs">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-4xl sm:text-[42px] font-black tracking-tight text-white leading-none">
            {formatNumber(stats.totalCustomers)}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/20 text-xs">
          <span className="font-semibold text-white/95">
            Active across all stores
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full text-white">
            Synced
          </span>
        </div>
      </div>

      {/* 3. Total Imports (Skydash Iris Purple #7978E9) */}
      <div className="rounded-2xl p-5 sm:p-6 text-white shadow-sm bg-[#7978E9] flex flex-col justify-between min-h-[160px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 block">
              Batch Ingestion
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Total Imports
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/30 shadow-xs">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-4xl sm:text-[42px] font-black tracking-tight text-white leading-none">
            {formatNumber(stats.totalImports)}
          </h3>
        </div>

        <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-white/20 text-xs font-bold">
          <span className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-white shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            {stats.completedImports} completed
          </span>
          <span className="inline-flex items-center gap-1 bg-white/25 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-white shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-white" />
            {stats.failedImports} failed
          </span>
        </div>
      </div>

      {/* 4. Total Files Stored (Skydash Coral Red #F3797E) */}
      <div className="rounded-2xl p-5 sm:p-6 text-white shadow-sm bg-[#F3797E] flex flex-col justify-between min-h-[160px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 block">
              Asset Storage
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Total Files Stored
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/30 shadow-xs">
            <Files className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-4xl sm:text-[42px] font-black tracking-tight text-white leading-none">
            {formatNumber(stats.totalFiles)}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/20 text-xs">
          <span className="font-semibold text-white/95">
            Logos & staged CSV files
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full text-white">
            Secure
          </span>
        </div>
      </div>
    </div>
  );
}


