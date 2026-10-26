import React, { useState } from 'react';
import {
  RotateCcw,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Settings,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { GLOBAL_MARKETS, MarketAsset } from '../../../data/globalMarkets';
import { TradeXLogo } from '../../auth/TradeXLogo';
import { AuthUser } from '../../auth/AuthCard';
import { PWAInstallButton } from '../../pwa/PWAInstallButton';

interface HomeScreenProps {
  user?: AuthUser | null;
  onNavigateTab: (tab: 'home' | 'markets' | 'trade' | 'orders' | 'profile') => void;
  onOpenCurrencySettings: () => void;
  onOpenAlerts: () => void;
  onSelectAssetToTrade: (asset: MarketAsset) => void;
}

export function HomeScreen({
  user,
  onNavigateTab,
  onOpenCurrencySettings,
  onOpenAlerts,
  onSelectAssetToTrade,
}: HomeScreenProps) {
  const { currency, setCurrency, formatPrice, getAssetDisplayPrice } = useCurrency();
  const {
    balance,
    portfolioValue,
    totalUnrealizedPnl,
    resetDemoAccount,
    depositFunds,
    withdrawFunds,
    livePrices,
  } = useTrading();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(currency === 'INR' ? 10000 : 500);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(currency === 'INR' ? 5000 : 250);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const [marketTab, setMarketTab] = useState<'India' | 'US' | 'Crypto'>('India');

  // Filtered market overview assets
  const overviewAssets = GLOBAL_MARKETS.filter((asset) => {
    if (marketTab === 'India') return asset.category === 'India';
    if (marketTab === 'US') return asset.category === 'USA';
    if (marketTab === 'Crypto') return asset.category === 'Crypto';
    return true;
  }).slice(0, 5);

  const displayName = user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'Trader');

  const handleDeposit = () => {
    depositFunds(depositAmount);
    setDepositModalOpen(false);
    setActionSuccessMsg(`Added ${formatPrice(depositAmount)} virtual funds.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleWithdraw = () => {
    const res = withdrawFunds(withdrawAmount);
    setWithdrawModalOpen(false);
    if (res.success) {
      setActionSuccessMsg(`Withdrew ${formatPrice(withdrawAmount)} virtual funds.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-6">
      {/* Top Header Bar (Screen 5) */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#090D0B] border-b border-[#1A251D]">
        <div className="flex items-center gap-2">
          <TradeXLogo size="sm" />
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Selector Pill */}
          <button
            type="button"
            onClick={onOpenCurrencySettings}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111913] border border-lime-400/30 hover:border-lime-400 text-xs font-mono text-lime-400 font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(163,230,53,0.15)]"
            title="Change currency (INR / USD)"
          >
            <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
            <span className="text-[10px] text-zinc-500">▾</span>
          </button>

          {/* Alerts Bell Icon */}
          <button
            type="button"
            onClick={onOpenAlerts}
            className="p-2 rounded-full bg-[#111913] border border-[#213224] text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Price Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Success Toast */}
      {actionSuccessMsg && (
        <div className="mx-4 p-3 rounded-xl bg-lime-950/90 border border-lime-400/50 text-lime-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Welcome Greeting Banner */}
      <div className="px-4">
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Hello, {displayName}
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">Good to see you!</p>
      </div>

      {/* Demo Balance Card (Screen 5) */}
      <div className="mx-4 p-4 rounded-2xl bg-gradient-to-br from-[#0B150E] via-[#090F0B] to-[#070A08] border border-lime-400/30 shadow-[0_4px_24px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Glow corner ambient highlight */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-zinc-400 font-medium">Live Demo Balance</span>
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-lime-400 text-[11px] font-mono transition-all cursor-pointer"
            title="Reset live demo virtual funds"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Balance Value */}
        <div className="text-3xl font-black text-white font-mono tracking-tight my-2">
          {formatPrice(balance)}
        </div>

        {/* Live Demo Compliance Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-[10px] font-mono font-bold text-lime-400">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span>LIVE DEMO — VIRTUAL FUNDS ONLY</span>
        </div>
      </div>

      {/* 4 Quick Action Buttons (Deposit, Withdraw, History, Settings) */}
      <div className="grid grid-cols-4 gap-2.5 px-4">
        <button
          type="button"
          onClick={() => setDepositModalOpen(true)}
          className="p-3 rounded-2xl bg-[#0E1511] hover:bg-[#131F18] border border-[#1A261D] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-[#142218] border border-[#233527] flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-zinc-300">Deposit</span>
        </button>

        <button
          type="button"
          onClick={() => setWithdrawModalOpen(true)}
          className="p-3 rounded-2xl bg-[#0E1511] hover:bg-[#131F18] border border-[#1A261D] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-[#142218] border border-[#233527] flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-zinc-300">Withdraw</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('orders')}
          className="p-3 rounded-2xl bg-[#0E1511] hover:bg-[#131F18] border border-[#1A261D] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-[#142218] border border-[#233527] flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
            <History className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-zinc-300">History</span>
        </button>

        <button
          type="button"
          onClick={onOpenCurrencySettings}
          className="p-3 rounded-2xl bg-[#0E1511] hover:bg-[#131F18] border border-[#1A261D] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-[#142218] border border-[#233527] flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-zinc-300">Settings</span>
        </button>
      </div>

      {/* Markets Overview Section (Screen 5) */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">Markets Overview</h2>
          <button
            type="button"
            onClick={() => onNavigateTab('markets')}
            className="text-xs text-lime-400 font-mono flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Markets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills: India | US | Crypto */}
        <div className="flex items-center gap-2">
          {(['India', 'US', 'Crypto'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setMarketTab(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                marketTab === cat
                  ? 'bg-lime-400 text-black shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                  : 'bg-[#111913] text-zinc-400 hover:text-white border border-[#1A261D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Overview List */}
        <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
          {overviewAssets.map((asset) => {
            const price = livePrices[asset.symbol] || getAssetDisplayPrice(asset);
            const isUp = asset.change24h >= 0;

            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectAssetToTrade(asset)}
                className="p-3.5 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center font-bold text-xs text-lime-400 font-mono">
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white font-mono group-hover:text-lime-400 transition-colors">
                      {asset.symbol}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-sans">
                      {asset.exchange}
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
      </div>

      {/* Confirmation Modal: Reset Demo Balance */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-red-400">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Reset Demo Account?</h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              This will restore your starting demo balance to{' '}
              <strong className="text-lime-400">
                {currency === 'INR' ? '₹ 1,00,000.00' : '$ 1,000.00'}
              </strong>{' '}
              and clear any open positions and pending orders.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoAccount();
                  setResetConfirmOpen(false);
                  setActionSuccessMsg('Demo account balance successfully reset.');
                  setTimeout(() => setActionSuccessMsg(null), 3000);
                }}
                className="flex-1 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-xs font-mono font-bold text-red-300 cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-lime-400" />
              <span>Simulated Demo Deposit</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Add virtual practice money to test larger trading strategies.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(currency === 'INR' ? [10000, 25000, 50000] : [250, 500, 1000]).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                    depositAmount === amt
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  +{formatPrice(amt, undefined, 0)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDepositModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeposit}
                className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-xs font-mono font-bold text-black cursor-pointer shadow-lg"
              >
                Add Virtual Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-zinc-300" />
              <span>Simulated Demo Withdrawal</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Test virtual profit deductions. Virtual funds only.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(currency === 'INR' ? [5000, 10000, 25000] : [100, 250, 500]).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setWithdrawAmount(amt)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                    withdrawAmount === amt
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  -{formatPrice(amt, undefined, 0)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white cursor-pointer"
              >
                Simulate Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
