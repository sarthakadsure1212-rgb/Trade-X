import React, { useState, useEffect } from 'react';
import {
  GLOBAL_MARKETS,
  MarketAsset,
} from '../../data/globalMarkets';
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
}

interface PriceAlertsViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  activeAsset: MarketAsset;
}

export function PriceAlertsView({ onSelectAsset, activeAsset }: PriceAlertsViewProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('tradex_price_alerts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    // Seed an initial demo alert
    return [
      {
        id: 'al_1',
        symbol: 'NIFTY50',
        targetPrice: 25000.0,
        condition: 'above',
        createdAt: new Date().toISOString(),
        triggered: false,
      },
      {
        id: 'al_2',
        symbol: 'NVDA',
        targetPrice: 150.0,
        condition: 'above',
        createdAt: new Date().toISOString(),
        triggered: false,
      },
    ];
  });

  const [selectedSymbol, setSelectedSymbol] = useState(activeAsset.symbol);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState<string>(
    activeAsset.basePrice ? (activeAsset.basePrice * 1.02).toFixed(2) : '100'
  );
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    localStorage.setItem('tradex_price_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const targetAsset = GLOBAL_MARKETS.find((a) => a.symbol === selectedSymbol) || activeAsset;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (!priceNum || priceNum <= 0) return;

    const newAlert: PriceAlert = {
      id: 'al_' + Date.now(),
      symbol: selectedSymbol,
      targetPrice: priceNum,
      condition,
      createdAt: new Date().toISOString(),
      triggered: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setIsCreating(false);
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A08] text-zinc-100 overflow-y-auto p-3 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-lime-400" />
            <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
              Price Alerts
            </h1>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Get instant notifications when global assets cross critical support or resistance levels.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs font-mono transition-all shadow-[0_0_10px_rgba(163,249,77,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Create Alert Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateAlert}
          className="mb-4 p-4 bg-[#0B100D] border border-lime-400/30 rounded-xl space-y-3"
        >
          <div className="text-xs font-mono font-bold text-lime-300 uppercase tracking-wider">
            Configure Price Alert
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Asset Selector */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Asset Symbol
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => {
                  setSelectedSymbol(e.target.value);
                  const matched = GLOBAL_MARKETS.find((a) => a.symbol === e.target.value);
                  if (matched) {
                    setTargetPrice((matched.basePrice * 1.02).toFixed(2));
                  }
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#111913] border border-[#203023] text-xs text-white font-mono outline-none focus:border-lime-400"
              >
                {GLOBAL_MARKETS.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} — {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Trigger Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#111913] border border-[#203023] text-xs text-white font-mono outline-none focus:border-lime-400"
              >
                <option value="above">Crosses Above or Equal (≥)</option>
                <option value="below">Crosses Below or Equal (≤)</option>
              </select>
            </div>

            {/* Target Price */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Target Price ({targetAsset.currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Target Price"
                required
                className="w-full px-3 py-2 rounded-lg bg-[#111913] border border-[#203023] text-xs text-white font-mono outline-none focus:border-lime-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs font-mono transition-all"
            >
              Save Alert
            </button>
          </div>
        </form>
      )}

      {/* Alerts List */}
      <div className="bg-[#090E0B] border border-[#19251C] rounded-xl overflow-hidden divide-y divide-[#152018]">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs font-mono space-y-2">
            <BellRing className="w-8 h-8 text-zinc-600 mx-auto" />
            <div>No active price alerts. Create an alert to monitor market swings.</div>
          </div>
        ) : (
          alerts.map((alert) => {
            const asset = GLOBAL_MARKETS.find((a) => a.symbol === alert.symbol);
            const currentPrice = asset ? asset.basePrice : 0;
            const diff = alert.targetPrice - currentPrice;
            const diffPercent = currentPrice > 0 ? (diff / currentPrice) * 100 : 0;

            return (
              <div
                key={alert.id}
                className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#111813] transition-colors"
              >
                {/* Left: Icon & Symbol Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      alert.triggered
                        ? 'bg-zinc-800 text-zinc-400'
                        : alert.condition === 'above'
                        ? 'bg-lime-500/15 text-lime-400 border border-lime-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {alert.condition === 'above' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white font-mono">
                        {alert.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#162319] text-zinc-400">
                        {alert.condition === 'above' ? '≥ Crossing Above' : '≤ Crossing Below'}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      Target: {asset?.currencySymbol}
                      {alert.targetPrice.toLocaleString()} · Current: {asset?.currencySymbol}
                      {currentPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Right: Distance & Delete */}
                <div className="flex items-center gap-4">
                  <div className="text-right font-mono text-xs hidden sm:block">
                    <span className="text-zinc-500 text-[10px] block">Distance</span>
                    <span
                      className={`font-semibold ${
                        alert.condition === 'above' && diff > 0
                          ? 'text-zinc-300'
                          : 'text-lime-400'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {diff.toFixed(2)} ({diffPercent.toFixed(2)}%)
                    </span>
                  </div>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    title="Delete alert"
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
