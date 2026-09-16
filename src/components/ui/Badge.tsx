import React from 'react';
import { cn } from '../../lib/utils';
import { ImportStatus } from '../../api/types/admin.types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  status?: ImportStatus | string;
}

export function Badge({
  className,
  children,
  variant = 'default',
  status,
  ...props
}: BadgeProps) {
  let resolvedVariant = variant;

  if (status) {
    switch (status) {
      case ImportStatus.COMPLETED:
      case 'COMPLETED':
        resolvedVariant = 'success';
        break;
      case ImportStatus.FAILED:
      case 'FAILED':
        resolvedVariant = 'danger';
        break;
      case ImportStatus.PROCESSING:
      case ImportStatus.PARSING:
      case 'PROCESSING':
        resolvedVariant = 'info';
        break;
      case ImportStatus.PREVIEW_READY:
      case ImportStatus.PENDING:
      case 'QUEUED':
        resolvedVariant = 'warning';
        break;
      default:
        resolvedVariant = 'neutral';
    }
  }

  const variants = {
    default:
      'bg-[#F8F9FA] text-[#6C7383] border-[#E4E8F0]',
    success:
      'bg-[#E8F8F0] text-[#10B981] border-[#10B981]/30',
    warning:
      'bg-[#FFF7E8] text-[#F59E0B] border-[#F59E0B]/30',
    danger:
      'bg-[#FEF0F0] text-[#F3797E] border-[#F3797E]/30',
    info:
      'bg-[#F0F5FF] text-[#4B49AC] border-[#4B49AC]/25',
    neutral:
      'bg-[#F5F7FF] text-[#4B49AC] border-[#4B49AC]/20',
  };

  const dots = {
    default: 'bg-[#9CA3AF]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#F3797E]',
    info: 'bg-[#4B49AC]',
    neutral: 'bg-[#4B49AC]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors select-none backdrop-blur-xs',
        variants[resolvedVariant],
        className,
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dots[resolvedVariant])} />
      <span>{children || status}</span>
    </span>
  );
}
