import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#212529] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-[#E4E8F0] bg-white px-3.5 py-2.5 text-sm text-[#212529] placeholder:text-[#9CA3AF] transition-all duration-150 focus:border-[#4B49AC] focus:outline-none focus:ring-2 focus:ring-[#4B49AC]/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB] shadow-2xs',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#F3797E] focus:border-[#F3797E] focus:ring-[#F3797E]/20',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#9CA3AF]">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-xs text-[#F3797E] font-medium">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
