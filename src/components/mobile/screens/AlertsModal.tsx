import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { GLOBAL_MARKETS } from '../../../data/globalMarkets';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
}

export function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const { formatPrice, currency, getAssetDisplayPrice } = useCurrency();
  const { selectedAsset, livePrices } = useTrading();

  const [activeTab, setActiveTab] = useState<'price' | 'news' | 'technical'>('price');
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt_1',
      symbol: 'RELIANCE',
      targetPrice: 3050.0,
      condition: 'above',
      createdAt: 'Today, 10:15 AM',
    },
    {
      id: 'alt_2',
      symbol: 'NIFTY50',
      targetPrice: 25000.0,
      condition: 'above',
      createdAt: 'Yesterday, 14:30 PM',
    },
  ]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(selectedAsset.symbol);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddAlert = () => {
    const priceNum = parseFloat(targetPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newAlert: PriceAlert = {
      id: 'alt_' + Date.now(),
      symbol: selectedSymbol,
      targetPrice: priceNum,
      condition,
      createdAt: 'Just now',
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setCreateModalOpen(false);
    setTargetPriceInput('');
    setToast(`Alert created for ${selectedSymbol} ${condition} ${formatPrice(priceNum)}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060907] flex flex-col max-w-md mx-auto animate-in slide-in-from-right duration-200">
      {/* Header Bar (Screen 12) */}
      <header className="flex items-center justify-between px-4 pt-3 pb-3 bg-[#090D0B] border-b border-[#1A251D]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-white tracking-tight">Alerts</h1>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="p-2 rounded-lg bg-[#111913] border border-[#213224] text-lime-400 hover:bg-[#162219] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </header>

      {/* Tabs: Price Alerts | News Alerts | Technical (Screen 12) */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 p-1 bg-[#0E1511] border border-[#1A261D] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('price')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'price' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Price Alerts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'news' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            News Alerts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'technical' ? 'bg-lime-400 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Technical
          </button>
        </div>
      </div>

      {toast && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-lime-950/90 border border-lime-400/50 text-lime-300 text-xs font-mono flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'price' && (
          <>
            {alerts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#111913] border border-[#213224] flex items-center justify-center text-zinc-500 mx-auto">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white font-mono">No alerts yet</h3>
                <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto">
                  Set price, news or technical alerts to get notified instantly.
                </p>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black font-bold text-xs font-mono cursor-pointer shadow-lg"
                >
                  + Create Alert
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden">
                {alerts.map((alt) => (
                  <div key={alt.id} className="p-3.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{alt.symbol}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          alt.condition === 'above' ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'
                        }`}>
                          {alt.condition === 'above' ? '▲ Above' : '▼ Below'}
                        </span>
                      </div>
                      <div className="text-zinc-500 text-[10px] mt-0.5">{alt.createdAt}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">
                        {formatPrice(alt.targetPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alt.id)}
                        className="p-1 rounded text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'news' && (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            Market news alerts active for NIFTY 50 and S&P 500.
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs">
            RSI & SMA breakout alerts configured.
          </div>
        )}
      </div>

      {/* Modal: Create Alert */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A261D]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-lime-400" />
                <span>New Price Alert</span>
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1">Asset</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-[#142017] border border-[#233527] rounded-xl px-3 py-2 text-white outline-none"
                >
                  {GLOBAL_MARKETS.map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#0E1511]">
                      {a.symbol} ({a.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Trigger Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCondition('above')}
                    className={`py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      condition === 'above' ? 'bg-lime-400 text-black border-lime-400' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    Price Crosses Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('below')}
                    className={`py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      condition === 'below' ? 'bg-red-500 text-white border-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    Price Drops Below
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Target Price ({currency === 'INR' ? '₹' : '$'})</label>
                <input
                  type="number"
                  step="0.05"
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(e.target.value)}
                  placeholder="e.g. 3000.00"
                  className="w-full bg-[#142017] border border-[#233527] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAlert}
                className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-xs font-mono font-bold text-black cursor-pointer shadow-lg"
              >
                Save Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
