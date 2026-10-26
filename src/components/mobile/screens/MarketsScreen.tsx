import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Star,
  TrendingUp,
  TrendingDown,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { GLOBAL_MARKETS, MarketAsset } from '../../../data/globalMarkets';
import { TradeXLogo } from '../../auth/TradeXLogo';

interface MarketsScreenProps {
  onSelectAssetToTrade: (asset: MarketAsset) => void;
  onOpenCurrencySettings: () => void;
}

type MarketFilter = 'All' | 'India' | 'US' | 'Forex' | 'Crypto';

export function MarketsScreen({
  onSelectAssetToTrade,
  onOpenCurrencySettings,
}: MarketsScreenProps) {
  const { currency, setCurrency, formatPrice, getAssetDisplayPrice } = useCurrency();
  const { livePrices, watchlist, toggleWatchlist, isWatchlisted } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MarketFilter>('All');

  const filteredAssets = useMemo(() => {
    return GLOBAL_MARKETS.filter((asset) => {
      // Category filter
      if (selectedFilter === 'India' && asset.category !== 'India') return false;
      if (selectedFilter === 'US' && asset.category !== 'USA') return false;
      if (selectedFilter === 'Crypto' && asset.category !== 'Crypto') return false;
      if (selectedFilter === 'Forex' && asset.category !== 'Europe') return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSymbol = asset.symbol.toLowerCase().includes(q);
        const matchName = asset.name.toLowerCase().includes(q);
        const matchExchange = asset.exchange.toLowerCase().includes(q);
        return matchSymbol || matchName || matchExchange;
      }
      return true;
    });
  }, [selectedFilter, searchQuery]);

  // Grouped sections for Indian Markets vs Popular Stocks if filter is 'All' or 'India'
  const indianIndices = useMemo(
    () => filteredAssets.filter((a) => a.category === 'India' && ['NIFTY50', 'SENSEX', 'BANKNIFTY'].includes(a.symbol)),
    [filteredAssets]
  );

  const indianStocks = useMemo(
    () => filteredAssets.filter((a) => a.category === 'India' && !['NIFTY50', 'SENSEX', 'BANKNIFTY'].includes(a.symbol)),
    [filteredAssets]
  );

  const otherAssets = useMemo(
    () => filteredAssets.filter((a) => a.category !== 'India'),
    [filteredAssets]
  );

  const renderAssetRow = (asset: MarketAsset) => {
    const price = livePrices[asset.symbol] || getAssetDisplayPrice(asset);
    const isUp = asset.change24h >= 0;
    const starred = isWatchlisted(asset.symbol);

    return (
      <div
        key={asset.symbol}
        onClick={() => onSelectAssetToTrade(asset)}
        className="p-3.5 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Star watchlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(asset.symbol);
            }}
            className="p-1 rounded text-zinc-600 hover:text-lime-400 transition-colors cursor-pointer"
            title={starred ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Star
              className={`w-4 h-4 ${
                starred ? 'fill-lime-400 text-lime-400' : 'text-zinc-600 hover:text-zinc-300'
              }`}
            />
          </button>

          {/* Symbol avatar */}
          <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center font-bold text-xs text-lime-400 font-mono shrink-0">
            {asset.symbol.slice(0, 3)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white font-mono group-hover:text-lime-400 transition-colors truncate">
                {asset.symbol}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono px-1 rounded bg-[#131C16]">
                {asset.exchange.split(' ')[0]}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 truncate font-sans">
              {asset.name}
            </div>
          </div>
        </div>

        <div className="text-right font-mono shrink-0 pl-2">
          <div className="text-sm font-bold text-white">
            {formatPrice(price)}
          </div>
          <div
            className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
              isUp ? 'text-lime-400' : 'text-red-400'
            }`}
          >
            {isUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-3 pb-6">
      {/* Header with Currency Switcher (Screen 6) */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#090D0B] border-b border-[#1A251D]">
        <TradeXLogo size="sm" />

        {/* Currency Segmented Switch */}
        <div className="flex items-center bg-[#111913] border border-[#213224] p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              currency === 'INR'
                ? 'bg-lime-400 text-black shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ₹ INR
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-lime-400 text-black shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            USD $
          </button>
        </div>
      </header>

      {/* Search Input Bar (Screen 6) */}
      <div className="px-4">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0E1511] border border-[#1A261D] focus-within:border-lime-400/60 transition-colors">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks, indices, currencies..."
            className="w-full bg-transparent border-none text-xs text-white placeholder-zinc-500 font-mono outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-zinc-500 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills (All | India | US | Forex | Crypto) */}
      <div className="px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(['All', 'India', 'US', 'Forex', 'Crypto'] as MarketFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === tab
                ? 'bg-lime-400 text-black shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                : 'bg-[#111913] text-zinc-400 hover:text-white border border-[#1A261D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs">
          No instruments found matching "{searchQuery}".
        </div>
      )}

      {/* Grouped View (When viewing India or All without query) */}
      {!searchQuery && (selectedFilter === 'All' || selectedFilter === 'India') && (
        <div className="px-4 space-y-4">
          {/* Section 1: Indian Markets (Indices) */}
          {indianIndices.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Indian Markets
              </div>
              <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
                {indianIndices.map(renderAssetRow)}
              </div>
            </div>
          )}

          {/* Section 2: Popular Stocks */}
          {indianStocks.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Popular Stocks
              </div>
              <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
                {indianStocks.map(renderAssetRow)}
              </div>
            </div>
          )}

          {/* Section 3: US & Global if 'All' */}
          {selectedFilter === 'All' && otherAssets.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                US & Global Assets
              </div>
              <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
                {otherAssets.map(renderAssetRow)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flat List (When searching or filtered by specific tab) */}
      {(searchQuery || (selectedFilter !== 'All' && selectedFilter !== 'India')) && (
        <div className="px-4">
          <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
            {filteredAssets.map(renderAssetRow)}
          </div>
        </div>
      )}
    </div>
  );
}
