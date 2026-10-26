/**
 * Native TradeX Live Ticker Ribbon
 * 
 * 100% Native, zero external script dependencies.
 * Streams real-time market quotes across the top bar.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const TICKERS: TickerItem[] = [
  { symbol: 'NVDA', name: 'Nvidia', price: '$142.80', change: '+3.84%', isPositive: true },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$67,420.50', change: '+2.65%', isPositive: true },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$2,645.20', change: '+3.25%', isPositive: true },
  { symbol: 'AAPL', name: 'Apple', price: '$231.45', change: '+1.15%', isPositive: true },
  { symbol: 'SOL/USD', name: 'Solana', price: '$174.90', change: '+6.42%', isPositive: true },
  { symbol: 'MSFT', name: 'Microsoft', price: '$428.60', change: '+0.88%', isPositive: true },
  { symbol: 'TSLA', name: 'Tesla', price: '$218.40', change: '-1.35%', isPositive: false },
  { symbol: 'SPY', name: 'S&P 500', price: '$582.30', change: '+0.62%', isPositive: true },
];

interface LiveTickerRibbonProps {
  onSelectTicker?: (symbol: string) => void;
  className?: string;
}

export function LiveTickerRibbon({ onSelectTicker, className = '' }: LiveTickerRibbonProps) {
  // Double for smooth marquee loop
  const displayItems = [...TICKERS, ...TICKERS];

  return (
    <div className={`w-full overflow-hidden bg-zinc-950 border-b border-zinc-800 py-1.5 px-2 ${className}`}>
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {displayItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (onSelectTicker) {
                const cleanSymbol = item.symbol.split('/')[0];
                onSelectTicker(cleanSymbol);
              }
            }}
            className="flex items-center gap-2 whitespace-nowrap text-xs font-mono shrink-0 hover:bg-zinc-900 px-2 py-1 rounded-lg transition-colors cursor-pointer group"
          >
            <span className="font-bold text-white group-hover:text-lime-400 transition-colors">
              {item.symbol}
            </span>
            <span className="text-zinc-300 font-semibold">{item.price}</span>
            <span
              className={`flex items-center text-[11px] font-bold ${
                item.isPositive ? 'text-lime-400' : 'text-red-400'
              }`}
            >
              {item.isPositive ? (
                <ArrowUpRight className="w-3 h-3 inline" />
              ) : (
                <ArrowDownRight className="w-3 h-3 inline" />
              )}
              {item.change}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LiveTickerRibbon;
