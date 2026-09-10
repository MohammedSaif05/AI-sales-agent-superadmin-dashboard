'use client';

import React from 'react';
import { Menu, LogOut, ShieldCheck, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onOpenMobileMenu?: () => void;
  title?: string;
}

export function Topbar({ onOpenMobileMenu, title = 'Dashboard Overview' }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-18 w-full items-center justify-between border-b border-[#E4E8F0] bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Left Section: Mobile Menu, Page Title & Breadcrumb */}
      <div className="flex items-center gap-4">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden rounded-xl p-2 text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC] transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#4B49AC] uppercase">
            <span>Portal</span>
            <span className="text-[#C4C9D6]">/</span>
            <span className="text-[#6C7383] capitalize">Audit Plane</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E2238] leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center Section: Skydash-style Quick Search Bar */}
      <div className="hidden md:flex items-center gap-2.5 rounded-full border border-[#E4E8F0] bg-[#F8F9FB] px-4 py-2 text-xs text-[#6C7383] w-64 lg:w-80 focus-within:border-[#4B49AC] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#4B49AC]/15 transition-all">
        <Search className="h-4 w-4 text-[#98A2B3] shrink-0" />
        <input
          type="text"
          placeholder="Search stores, audits, batches..."
          className="w-full bg-transparent text-xs font-medium text-[#212529] placeholder:text-[#98A2B3] focus:outline-none"
        />
        <kbd className="hidden lg:inline-flex items-center rounded border border-[#E4E8F0] bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#98A2B3] shadow-2xs">
          ⌘K
        </kbd>
      </div>

      {/* Right Section: System Status, Notifications, Super Admin Profile, Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold tracking-wide">API Online</span>
        </div>

        {/* Skydash-style Notification Bell */}
        <button
          aria-label="View notifications"
          className="relative rounded-xl p-2 text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC] transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4B49AC] ring-2 ring-white" />
          </span>
        </button>

        <div className="h-6 w-px bg-[#E4E8F0] hidden sm:block" />

        {/* User Profile Info Card */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#4B49AC] to-[#7DA0FA] text-white font-bold text-xs shadow-sm ring-2 ring-[#4B49AC]/20">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1E2238] tracking-tight">
                  Super Admin
                </span>
                <span className="rounded-full bg-[#4B49AC]/10 text-[#4B49AC] border border-[#4B49AC]/20 px-1.5 py-0.2 text-[9px] font-extrabold tracking-wider uppercase">
                  ROOT
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#6C7383]">
                {user.phone}
              </span>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={() => logout()}
          className="group flex items-center gap-1.5 rounded-xl border border-[#E4E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#6C7383] hover:border-[#F3797E]/40 hover:bg-[#FEF0F0] hover:text-[#D9383A] transition-all shadow-2xs cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

