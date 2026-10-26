import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'neon' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

    const variantStyles = {
      default:
        'bg-lime-400 text-zinc-950 hover:bg-lime-300 font-extrabold shadow-[0_0_25px_rgba(163,230,53,0.35)] active:scale-[0.99]',
      neon:
        'bg-lime-400 text-zinc-950 hover:bg-lime-300 font-black shadow-[0_0_30px_rgba(163,230,53,0.45)] active:scale-[0.98]',
      destructive:
        'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[0.99]',
      outline:
        'border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white',
      secondary:
        'bg-[#121A14] text-zinc-200 hover:bg-[#18251C] border border-[#233527]',
      ghost:
        'hover:bg-zinc-800/60 text-zinc-400 hover:text-white',
      link:
        'text-lime-400 underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizeStyles = {
      default: 'h-12 px-5 py-3',
      sm: 'h-9 px-3.5 text-xs',
      lg: 'h-14 px-8 text-base font-extrabold',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
