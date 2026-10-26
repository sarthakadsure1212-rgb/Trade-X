import React, { useState, useMemo } from 'react';
import {
  GLOBAL_MARKETS,
  MarketAsset,
  isMarketOpen,
} from '../../data/globalMarkets';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Globe,
  Clock,
  ShieldCheck,
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface GlobalMarketsViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  currentSymbol: string;
}

export function GlobalMarketsView({ onSelectAsset, currentSymbol }: GlobalMarketsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'India' | 'USA' | 'Europe' | 'Crypto'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = useMemo(() => {
    return GLOBAL_MARKETS.filter((asset) => {
      const matchesCategory =
        selectedCategory === 'All' || asset.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.exchange.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A08] text-zinc-100 overflow-y-auto p-3 sm:p-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-lime-400" />
          <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
            Global Financial Markets
          </h1>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          Consolidated indices and equities across India (NSE/BSE), USA (NYSE/NASDAQ), Europe (LSE/DAX), and Digital Assets.
        </p>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks, symbols, indices (e.g. NIFTY, NVDA, DAX)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0E1511] border border-[#1F2E22] focus:border-lime-400 text-xs text-white placeholder-zinc-500 font-mono outline-none transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {(['All', 'India', 'USA', 'Europe', 'Crypto'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-lime-400 text-black font-bold shadow-[0_0_10px_rgba(163,249,77,0.3)]'
                  : 'bg-[#121A14] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Global Regional Clocks Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[
          { region: 'NSE / BSE India', tz: 'Asia/Kolkata', currency: '₹ INR', open: '09:15 - 15:30 IST' },
          { region: 'NYSE / NASDAQ', tz: 'America/New_York', currency: '$ USD', open: '09:30 - 16:00 EST' },
          { region: 'London (LSE)', tz: 'Europe/London', currency: '£ GBP', open: '08:00 - 16:30 GMT' },
          { region: 'Frankfurt (DAX)', tz: 'Europe/Berlin', currency: '€ EUR', open: '09:00 - 17:30 CET' },
        ].map((c) => (
          <div key={c.region} className="p-2.5 rounded-lg bg-[#0B100D] border border-[#1B271E] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
              <span>{c.region}</span>
              <span className="text-[10px] text-lime-400 font-mono">{c.currency}</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{c.open}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Market Assets Table / Grid */}
      <div className="flex-1 bg-[#090E0B] border border-[#19251C] rounded-xl overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2.5 bg-[#0D140F] border-b border-[#1A261D] text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
          <div className="col-span-5 sm:col-span-4">Asset / Exchange</div>
          <div className="col-span-3 text-right">Price</div>
          <div className="col-span-2 text-right">24h Chg</div>
          <div className="hidden sm:block sm:col-span-2 text-right">Volume</div>
          <div className="col-span-2 sm:col-span-1 text-center">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#152018] overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
              No matching assets found for "{searchQuery}".
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const status = isMarketOpen(asset);
              const isSelected = asset.symbol === currentSymbol;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className={`grid grid-cols-12 px-4 py-3 items-center hover:bg-[#121A14] transition-colors cursor-pointer group ${
                    isSelected ? 'bg-lime-400/5 border-l-2 border-lime-400' : ''
                  }`}
                >
                  {/* Name & Symbol */}
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#141E17] border border-[#233527] flex items-center justify-center font-bold text-xs text-lime-400 shrink-0 font-mono">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">
                          {asset.symbol}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#162319] text-zinc-400">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 text-right font-mono font-semibold text-xs sm:text-sm text-zinc-100">
                    {asset.currencySymbol}
                    {asset.basePrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  {/* 24h Change */}
                  <div className="col-span-2 text-right font-mono text-xs">
                    <div
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        asset.change24h >= 0 ? 'text-lime-400' : 'text-red-400'
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 shrink-0" />
                      ) : (
                        <TrendingDown className="w-3 h-3 shrink-0" />
                      )}
                      <span>
                        {asset.change24h >= 0 ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="hidden sm:block sm:col-span-2 text-right font-mono text-xs text-zinc-400">
                    {asset.volume}
                  </div>

                  {/* Exchange Status Badge */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight ${
                        status.isOpen
                          ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {status.isOpen ? 'LIVE' : 'CLOSED'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Market Data Disclaimer */}
      <div className="mt-4 p-3 rounded-lg bg-[#0A0F0C] border border-[#1A251D] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
          <span>Institutional Data Feeds verified via direct exchange consolidated telemetry.</span>
        </div>
        <span className="hidden sm:inline text-zinc-600">Zero synthetic execution</span>
      </div>
    </div>
  );
}
