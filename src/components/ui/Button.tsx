import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

    const variants = {
      primary:
        'bg-[#4B49AC] hover:bg-[#3E3C93] text-white shadow-sm shadow-[#4B49AC]/25 focus:ring-[#4B49AC]/40 border border-[#4B49AC]',
      secondary:
        'bg-[#F5F7FF] text-[#4B49AC] hover:bg-[#EAEFFF] border border-[#4B49AC]/20 focus:ring-[#4B49AC]/30 shadow-2xs',
      outline:
        'border border-[#E4E8F0] bg-white text-[#212529] hover:bg-[#F8F9FA] hover:text-[#4B49AC] hover:border-[#D1D5DB] focus:ring-[#4B49AC]/20 shadow-2xs',
      danger:
        'bg-[#F3797E] text-white hover:bg-[#E2666B] focus:ring-[#F3797E]/40 border border-[#F3797E] shadow-sm',
      ghost:
        'bg-transparent text-[#6C7383] hover:bg-[#F5F7FF] hover:text-[#4B49AC] focus:ring-[#4B49AC]/15',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
