import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#D1D5DB] bg-white shadow-2xs',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] mb-4 shadow-xs">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-bold text-[#212529] tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs text-[#6C7383] max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
