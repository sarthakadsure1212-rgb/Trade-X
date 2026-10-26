import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border border-red-500/80 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
            : 'border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400/40',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
