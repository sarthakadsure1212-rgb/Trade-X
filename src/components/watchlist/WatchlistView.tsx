import React, { useState, useEffect } from 'react';
import {
  GLOBAL_MARKETS,
  MarketAsset,
} from '../../data/globalMarkets';
import {
  Star,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface WatchlistViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  currentSymbol: string;
}

const DEFAULT_WATCHLIST = ['NIFTY50', 'SPX', 'NVDA', 'DAX', 'BTC/USD', 'RELIANCE'];

export function WatchlistView({ onSelectAsset, currentSymbol }: WatchlistViewProps) {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem('tradex_user_watchlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_WATCHLIST;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('tradex_user_watchlist', JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  const toggleSymbol = (symbol: string) => {
    if (watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prev) => prev.filter((s) => s !== symbol));
    } else {
      setWatchlistSymbols((prev) => [...prev, symbol]);
    }
  };

  const watchedAssets = GLOBAL_MARKETS.filter((a) =>
    watchlistSymbols.includes(a.symbol)
  );

  const searchResults = GLOBAL_MARKETS.filter(
    (a) =>
      !watchlistSymbols.includes(a.symbol) &&
      (a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A08] text-zinc-100 overflow-y-auto p-3 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-lime-400 fill-lime-400" />
            <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
              Custom Watchlist
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Pinned instruments with real-time price tracking and one-tap chart inspection.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs font-mono transition-all shadow-[0_0_10px_rgba(163,249,77,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Symbol</span>
        </button>
      </div>

      {/* Add Symbol Modal / Dropdown */}
      {isAdding && (
        <div className="mb-4 p-3 bg-[#0B100D] border border-lime-400/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search to add (e.g. SENSEX, AAPL, FTSE)..."
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-zinc-500 font-mono outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                setIsAdding(false);
                setSearchQuery('');
              }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
          </div>

          {searchQuery && (
            <div className="max-h-48 overflow-y-auto divide-y divide-[#17221A] pt-2">
              {searchResults.length === 0 ? (
                <div className="text-xs text-zinc-500 font-mono py-2">
                  No additional symbols found.
                </div>
              ) : (
                searchResults.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => {
                      toggleSymbol(asset.symbol);
                      setSearchQuery('');
                      setIsAdding(false);
                    }}
                    className="flex items-center justify-between py-2 px-1 hover:bg-[#121A14] rounded cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-white mr-2">{asset.symbol}</span>
                      <span className="text-[11px] text-zinc-400">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-300">
                        {asset.currencySymbol}
                        {asset.basePrice.toLocaleString()}
                      </span>
                      <Plus className="w-4 h-4 text-lime-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Watched Assets List */}
      <div className="bg-[#090E0B] border border-[#19251C] rounded-xl overflow-hidden divide-y divide-[#152018]">
        {watchedAssets.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <Star className="w-8 h-8 text-zinc-600 mx-auto" />
            <div className="text-xs text-zinc-400 font-mono">
              Your watchlist is empty. Add symbols to monitor your favorite global instruments.
            </div>
            <button
              onClick={() => setWatchlistSymbols(DEFAULT_WATCHLIST)}
              className="px-3 py-1.5 rounded-lg bg-[#141F17] hover:bg-[#1C2C20] border border-[#273B2C] text-lime-400 text-xs font-mono"
            >
              Load Default Global Watchlist
            </button>
          </div>
        ) : (
          watchedAssets.map((asset) => {
            const isSelected = asset.symbol === currentSymbol;
            return (
              <div
                key={asset.symbol}
                className={`p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#111813] transition-colors group ${
                  isSelected ? 'bg-lime-400/5 border-l-2 border-lime-400' : ''
                }`}
              >
                {/* Left: Star + Symbol info */}
                <div
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  onClick={() => onSelectAsset(asset)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSymbol(asset.symbol);
                    }}
                    title="Remove from watchlist"
                    className="text-lime-400 hover:text-red-400 transition-colors"
                  >
                    <Star className="w-4 h-4 fill-lime-400 hover:fill-transparent" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white font-mono">
                        {asset.symbol}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#162319] text-zinc-400">
                        {asset.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      {asset.name}
                    </div>
                  </div>
                </div>

                {/* Right: Price & 24h Change */}
                <div
                  className="text-right font-mono cursor-pointer shrink-0"
                  onClick={() => onSelectAsset(asset)}
                >
                  <div className="text-sm sm:text-base font-bold text-white">
                    {asset.currencySymbol}
                    {asset.basePrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      asset.change24h >= 0 ? 'text-lime-400' : 'text-red-400'
                    }`}
                  >
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {asset.change24h >= 0 ? '+' : ''}
                      {asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Open Chart Action */}
                <button
                  onClick={() => onSelectAsset(asset)}
                  title="View on full screen chart"
                  className="p-2 rounded-lg bg-[#141E17] hover:bg-lime-400 hover:text-black text-zinc-300 transition-all shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
