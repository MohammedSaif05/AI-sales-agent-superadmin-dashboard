import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { ApiError } from '../../api/client/apiError';

export interface ErrorStateProps {
  error?: ApiError | Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  let resolvedTitle = title;
  let resolvedMessage = message;

  if (error instanceof ApiError) {
    resolvedTitle = title || `Error (${error.errorCode || error.statusCode})`;
    resolvedMessage = message || error.message;
  } else if (error) {
    resolvedTitle = title || 'Failed to load data';
    resolvedMessage = message || error.message;
  } else {
    resolvedTitle = title || 'An unexpected error occurred';
    resolvedMessage = message || 'Please try refreshing or contacting support if the problem persists.';
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-[#F3797E]/30 bg-[#FEF0F0]/50 shadow-2xs',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF0F0] text-[#F3797E] border border-[#F3797E]/30 mb-3 shadow-xs">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-[#991B1B] tracking-tight">{resolvedTitle}</h3>
      <p className="mt-1.5 text-xs text-[#B91C1C] max-w-md leading-relaxed">{resolvedMessage}</p>
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="border-[#F3797E]/40 text-[#B91C1C] hover:bg-[#FEF0F0]"
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
