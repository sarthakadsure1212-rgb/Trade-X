import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  X,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { GLOBAL_MARKETS, MarketAsset } from '../../../data/globalMarkets';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAssetToTrade: (asset: MarketAsset) => void;
}

export function WatchlistModal({ isOpen, onClose, onSelectAssetToTrade }: WatchlistModalProps) {
  const { formatPrice, getAssetDisplayPrice } = useCurrency();
  const { watchlist, toggleWatchlist, livePrices } = useTrading();

  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'finance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const watchlistAssets = GLOBAL_MARKETS.filter((a) => watchlist.includes(a.symbol));

  const filtered = watchlistAssets.filter((a) => {
    if (activeTab === 'tech' && !['TCS', 'INFY', 'AAPL', 'NVDA', 'MSFT', 'TSLA'].includes(a.symbol)) {
      return false;
    }
    if (activeTab === 'finance' && !['HDFCBANK', 'ICICIBANK', 'BANKNIFTY', 'SPX'].includes(a.symbol)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#060907] flex flex-col max-w-md mx-auto animate-in slide-in-from-right duration-200">
      {/* Header Bar (Screen 10) */}
      <header className="flex items-center justify-between px-4 pt-3 pb-3 bg-[#090D0B] border-b border-[#1A251D]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white tracking-tight">Watchlist</h1>
        </div>
      </header>

      {/* Filter Tabs (Screen 10) */}
      <div className="px-4 pt-3 space-y-3">
        <div className="grid grid-cols-3 p-1 bg-[#0E1511] border border-[#1A261D] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            My Watchlist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tech')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'tech' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tech
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('finance')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'finance' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Finance
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0E1511] border border-[#1A261D]">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search watchlist..."
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 font-mono outline-none"
          />
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-mono text-xs">
            No items in this watchlist view.
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden">
            {filtered.map((asset) => {
              const price = livePrices[asset.symbol] || getAssetDisplayPrice(asset);
              const isUp = asset.change24h >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAssetToTrade(asset);
                    onClose();
                  }}
                  className="p-3.5 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(asset.symbol);
                      }}
                      className="text-lime-400 p-0.5 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-lime-400" />
                    </button>

                    <div>
                      <div className="font-bold text-sm text-white font-mono group-hover:text-lime-400 transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-white">
                      {formatPrice(price)}
                    </div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-lime-400' : 'text-red-400'
                      }`}
                    >
                      {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
