import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'pill';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
      secondary: 'bg-white text-customText border border-black/10 hover:bg-black/[0.02] shadow-sm',
      ghost: 'bg-transparent text-customText-secondary hover:text-customText hover:bg-black/5',
      destructive: 'bg-white text-customError border border-customError/30 hover:bg-customError-bg/40',
      pill: 'bg-primary-tint text-primary hover:bg-primary hover:text-white rounded-pill font-semibold',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-btn gap-1.5',
      md: 'text-sm px-4 py-2 rounded-btn gap-2',
      lg: 'text-base px-5 py-2.5 rounded-btn gap-2.5',
      icon: 'p-2 rounded-btn',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
