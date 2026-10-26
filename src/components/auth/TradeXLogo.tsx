import React from 'react';

interface TradeXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function TradeXLogo({ size = 'md', showTagline = false, className = '' }: TradeXLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', badge: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-3xl', badge: 'text-xs' },
    xl: { icon: 'w-12 h-12', text: 'text-4xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Custom stylized TradeX Neon "X" Icon */}
        <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_12px_rgba(163,230,53,0.65)]"
          >
            {/* Primary diagonal neon green chevron bar */}
            <path
              d="M8 6L18 20L8 34H14L22 22L16 6H8Z"
              fill="url(#limeGradient1)"
            />
            {/* Secondary diagonal crossing bar with sharp tech cut */}
            <path
              d="M32 6L20 23L24 29L34 6H32Z"
              fill="url(#limeGradient2)"
            />
            <path
              d="M26 31.5L24.5 34H32L26 25L23.5 28.5L26 31.5Z"
              fill="#a3e635"
            />
            <defs>
              <linearGradient id="limeGradient1" x1="8" y1="6" x2="22" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a3e635" />
                <stop offset="1" stopColor="#4ade80" />
              </linearGradient>
              <linearGradient id="limeGradient2" x1="20" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#bef264" />
                <stop offset="1" stopColor="#84cc16" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Text */}
        <span className={`font-extrabold tracking-tight text-white ${currentSize.text} select-none`}>
          Trade<span className="text-lime-400">X</span>
        </span>
      </div>

      {showTagline && (
        <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-zinc-400 font-semibold uppercase mt-1 pl-0.5 select-none">
          GLOBAL MARKETS <span className="text-lime-400/80">•</span> REAL OPPORTUNITIES
        </span>
      )}
    </div>
  );
}
