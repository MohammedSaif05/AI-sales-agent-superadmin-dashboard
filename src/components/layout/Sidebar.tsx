'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Store, FileSpreadsheet, ShieldAlert, X, ChevronRight, Sparkles, MessageSquare, Webhook } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutGrid,
  },

  {
    label: 'Businesses',
    href: '/admin/businesses',
    icon: Store,
  },
  {
    label: 'Imports',
    href: '/admin/imports',
    icon: FileSpreadsheet,
  },
];

const WHATSAPP_NAV_ITEMS = [
  {
    label: 'WhatsApp Connections',
    href: '/admin/whatsapp/connections',
    icon: MessageSquare,
  },
  {
    label: 'Webhook Events',
    href: '/admin/whatsapp/webhook-events',
    icon: Webhook,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[#E4E8F0] bg-white shadow-xs">
      {/* Brand Header */}
      <div className="flex h-18 items-center justify-between px-6 border-b border-[#E4E8F0]/70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#4B49AC] to-[#7978E9] text-white font-bold text-sm shadow-md shadow-[#4B49AC]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold tracking-tight text-[#1E2238]">
              AI Sales Assistant
            </h1>
            <p className="text-[10px] font-extrabold tracking-wider text-[#4B49AC] uppercase">
              Super Admin Console
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden rounded-lg p-1 text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#98A2B3]">
          Platform Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#4B49AC] text-white shadow-md shadow-[#4B49AC]/25 font-bold'
                  : 'text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC]',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-white' : 'text-[#6C7383] group-hover:text-[#4B49AC]',
                  )}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  isActive
                    ? 'text-white/80 translate-x-0.5'
                    : 'text-[#C4C9D6] group-hover:text-[#4B49AC] group-hover:translate-x-0.5',
                )}
              />
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#98A2B3]">
          WhatsApp Channels
        </div>
        {WHATSAPP_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#4B49AC] text-white shadow-md shadow-[#4B49AC]/25 font-bold'
                  : 'text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC]',
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-white' : 'text-[#6C7383] group-hover:text-[#4B49AC]',
                  )}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform',
                  isActive
                    ? 'text-white/80 translate-x-0.5'
                    : 'text-[#C4C9D6] group-hover:text-[#4B49AC] group-hover:translate-x-0.5',
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* Footer Role Notice */}
      <div className="p-4 border-t border-[#E4E8F0]/70">
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#F5F7FF] p-3 text-xs text-[#6C7383] border border-[#E4E8F0]">
          <ShieldAlert className="w-4 h-4 text-[#4B49AC] shrink-0" />
          <div className="truncate">
            <p className="font-bold text-[#1E2238] text-xs">Feature 01: Audit Plane</p>
            <p className="text-[10px] font-semibold text-[#4B49AC]">Super Admin Protected</p>
          </div>
        </div>
      </div>
    </aside>

  );
}
