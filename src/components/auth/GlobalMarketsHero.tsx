import React from 'react';
import { ShieldCheck, Zap, Globe, TrendingUp } from 'lucide-react';
import { TradeXLogo } from './TradeXLogo';

export function GlobalMarketsHero() {
  const marketTickers = [
    {
      symbol: 'NIFTY 50',
      change: '+1.24%',
      isPositive: true,
      country: 'india',
      flag: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shrink-0 shadow-sm overflow-hidden">
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="3" fill="#000080" />
        </svg>
      ),
    },
    {
      symbol: 'S&P 500',
      change: '+0.82%',
      isPositive: true,
      country: 'us',
      flag: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shrink-0 shadow-sm overflow-hidden">
          <rect width="24" height="24" fill="#B22234" />
          <path d="M0 4h24v3H0zM0 11h24v3H0zM0 18h24v3H0z" fill="#FFFFFF" />
          <rect width="11" height="12" fill="#3C3B6E" />
        </svg>
      ),
    },
    {
      symbol: 'NASDAQ',
      change: '+1.36%',
      isPositive: true,
      country: 'us',
      flag: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shrink-0 shadow-sm overflow-hidden">
          <rect width="24" height="24" fill="#B22234" />
          <path d="M0 4h24v3H0zM0 11h24v3H0zM0 18h24v3H0z" fill="#FFFFFF" />
          <rect width="11" height="12" fill="#3C3B6E" />
        </svg>
      ),
    },
    {
      symbol: 'DAX',
      change: '+0.71%',
      isPositive: true,
      country: 'germany',
      flag: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shrink-0 shadow-sm overflow-hidden">
          <rect width="24" height="8" fill="#000000" />
          <rect y="8" width="24" height="8" fill="#DD0000" />
          <rect y="16" width="24" height="8" fill="#FFCE00" />
        </svg>
      ),
    },
    {
      symbol: 'FTSE 100',
      change: '+0.58%',
      isPositive: true,
      country: 'uk',
      flag: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shrink-0 shadow-sm overflow-hidden">
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0l24 24m0-24L0 24" stroke="#FFF" strokeWidth="4" />
          <path d="M0 0l24 24m0-24L0 24" stroke="#C8102E" strokeWidth="2" />
          <path d="M12 0v24M0 12h24" stroke="#FFF" strokeWidth="6" />
          <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full p-6 sm:p-10 lg:p-12 text-zinc-100 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10">
        <TradeXLogo size="lg" showTagline={true} />
      </div>

      {/* Hero Headline & Live Market Tags */}
      <div className="relative z-10 mt-8 sm:mt-12 space-y-4">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            Trade Global.
            <br />
            <span className="text-lime-400 drop-shadow-[0_0_25px_rgba(163,230,53,0.45)]">
              Grow Bigger.
            </span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mt-3.5 leading-relaxed font-normal">
            Access <strong className="text-zinc-200 font-semibold">Indian</strong>,{' '}
            <strong className="text-zinc-200 font-semibold">European</strong>,{' '}
            <strong className="text-zinc-200 font-semibold">US</strong> markets and more — all in one place.
          </p>
        </div>

        {/* Live Market Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-2">
          {/* India */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md text-xs font-medium text-zinc-200 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden shrink-0">
              <rect width="24" height="8" fill="#FF9933" />
              <rect y="8" width="24" height="8" fill="#FFFFFF" />
              <rect y="16" width="24" height="8" fill="#138808" />
              <circle cx="12" cy="12" r="2.5" fill="#000080" />
            </svg>
            <span>Indian Market</span>
            <span className="flex items-center gap-1 text-[11px] text-lime-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
              Live
            </span>
          </div>

          {/* EU */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md text-xs font-medium text-zinc-200 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden shrink-0">
              <rect width="24" height="24" fill="#003399" />
              <circle cx="12" cy="5" r="1" fill="#FFCC00" />
              <circle cx="17" cy="7" r="1" fill="#FFCC00" />
              <circle cx="19" cy="12" r="1" fill="#FFCC00" />
              <circle cx="17" cy="17" r="1" fill="#FFCC00" />
              <circle cx="12" cy="19" r="1" fill="#FFCC00" />
              <circle cx="7" cy="17" r="1" fill="#FFCC00" />
              <circle cx="5" cy="12" r="1" fill="#FFCC00" />
              <circle cx="7" cy="7" r="1" fill="#FFCC00" />
            </svg>
            <span>European Market</span>
            <span className="flex items-center gap-1 text-[11px] text-lime-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
              Live
            </span>
          </div>

          {/* US */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md text-xs font-medium text-zinc-200 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 rounded-full overflow-hidden shrink-0">
              <rect width="24" height="24" fill="#B22234" />
              <path d="M0 4h24v3H0zM0 11h24v3H0zM0 18h24v3H0z" fill="#FFFFFF" />
              <rect width="11" height="12" fill="#3C3B6E" />
            </svg>
            <span>US Market</span>
            <span className="flex items-center gap-1 text-[11px] text-lime-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* 3D Angled Smartphone Mockup with Illuminated World Globe */}
      <div className="relative z-10 my-8 sm:my-10 flex items-center justify-center lg:justify-start">
        {/* Neon World Globe in Background */}
        <div className="absolute right-0 sm:-right-8 top-1/2 -translate-y-1/2 w-72 sm:w-84 h-72 sm:h-84 opacity-60 pointer-events-none">
          <svg viewBox="0 0 300 300" className="w-full h-full text-lime-400">
            {/* Grid latitude and longitude lines */}
            <circle cx="150" cy="150" r="130" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <ellipse cx="150" cy="150" rx="130" ry="60" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
            <ellipse cx="150" cy="150" rx="130" ry="100" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
            <ellipse cx="150" cy="150" rx="60" ry="130" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
            <ellipse cx="150" cy="150" rx="100" ry="130" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="150" x2="280" y2="150" stroke="#22c55e" strokeWidth="1" opacity="0.4" />
            <line x1="150" y1="20" x2="150" y2="280" stroke="#22c55e" strokeWidth="1" opacity="0.4" />

            {/* Pulsing Inter-Market Connection Arcs */}
            <path
              d="M70 120 Q 150 60 220 130"
              fill="none"
              stroke="#a3e635"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            <path
              d="M100 170 Q 170 110 240 160"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
            />
            <circle cx="70" cy="120" r="4" fill="#a3e635" className="animate-ping" />
            <circle cx="70" cy="120" r="3" fill="#a3e635" />
            <circle cx="220" cy="130" r="4" fill="#a3e635" />
            <circle cx="160" cy="85" r="3" fill="#bef264" />
          </svg>
        </div>

        {/* Angled Smartphone Container */}
        <div className="relative w-64 sm:w-72 rounded-[32px] p-2.5 bg-gradient-to-tr from-zinc-900 via-zinc-950 to-zinc-900 border border-lime-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(163,230,53,0.18)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          {/* Inner Phone Screen */}
          <div className="w-full bg-[#090d0b] rounded-[24px] p-3.5 border border-zinc-800/80 overflow-hidden relative">
            {/* Screen Top Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pb-2 border-b border-zinc-800/50">
              <span>9:41</span>
              <div className="flex items-center gap-1 text-lime-400">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                <span className="text-[9px] text-zinc-400">5G</span>
              </div>
            </div>

            {/* Mini Live Candlestick Graph Header */}
            <div className="py-2.5 px-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white flex items-center gap-1">
                  Global Indices <TrendingUp className="w-3 h-3 text-lime-400" />
                </span>
                <span className="text-[10px] text-lime-400 font-mono font-bold">+1.14%</span>
              </div>

              {/* Mini SVG Neon Area Wave */}
              <div className="w-full h-10 overflow-hidden">
                <svg viewBox="0 0 200 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="phoneWaveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 32 Q 30 18, 60 25 T 120 12 T 160 18 T 200 6 L 200 40 L 0 40 Z"
                    fill="url(#phoneWaveGrad)"
                  />
                  <path
                    d="M 0 32 Q 30 18, 60 25 T 120 12 T 160 18 T 200 6"
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Live Market Tickers List */}
            <div className="space-y-1.5 pt-1">
              {marketTickers.map((ticker) => (
                <div
                  key={ticker.symbol}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 hover:border-lime-400/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {ticker.flag}
                    <span className="text-xs font-bold text-zinc-200 font-mono tracking-tight">
                      {ticker.symbol}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-lime-400 font-mono">
                    {ticker.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 3 Trust & Feature Badges */}
      <div className="relative z-10 pt-4 border-t border-zinc-900/80">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Badge 1: Secure & Reliable */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Secure</div>
              <div className="text-[10px] text-zinc-500 leading-tight">& Reliable</div>
            </div>
          </div>

          {/* Badge 2: Fast Execution */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Fast</div>
              <div className="text-[10px] text-zinc-500 leading-tight">Execution</div>
            </div>
          </div>

          {/* Badge 3: Global Access */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Global</div>
              <div className="text-[10px] text-zinc-500 leading-tight">Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
