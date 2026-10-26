import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCurrency, SupportedCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';

interface CurrencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencySettingsModal({ isOpen, onClose }: CurrencySettingsModalProps) {
  const { currency, setCurrency, formatPrice, exchangeRateInfo } = useCurrency();
  const { resetDemoAccount } = useTrading();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectCurrency = (nextCurr: SupportedCurrency) => {
    if (nextCurr !== currency) {
      setCurrency(nextCurr);
      setSuccessToast(`Base currency updated to ${nextCurr === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleConfirmReset = () => {
    resetDemoAccount();
    setResetConfirmOpen(false);
    setSuccessToast(`Demo account reset to starting balance (${currency === 'INR' ? '₹ 1,00,000.00' : '$ 1,000.00'}).`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060907] flex flex-col max-w-md mx-auto animate-in slide-in-from-right duration-200">
      {/* Header Bar (Screen 14) */}
      <header className="flex items-center gap-3 px-4 pt-3 pb-3 bg-[#090D0B] border-b border-[#1A251D]">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-white tracking-tight">Currency Settings</h1>
      </header>

      {/* Toast Feedback */}
      {successToast && (
        <div className="m-4 p-3 rounded-xl bg-lime-950/90 border border-lime-400/50 text-lime-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Trading Currency Section (Screen 14) */}
        <div className="space-y-3">
          <label className="text-xs font-sans text-zinc-400 font-medium">Trading Currency</label>

          <div className="grid grid-cols-2 gap-3">
            {/* INR (₹) */}
            <button
              type="button"
              onClick={() => handleSelectCurrency('INR')}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-lime-400/15 border-lime-400 text-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.15)] font-bold'
                  : 'bg-[#0E1511] border-[#1A261D] text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#16241A] flex items-center justify-center font-bold text-lime-400">
                  ₹
                </span>
                <span>INR (₹)</span>
              </div>
              {currency === 'INR' && <Check className="w-4 h-4 text-lime-400" />}
            </button>

            {/* USD ($) */}
            <button
              type="button"
              onClick={() => handleSelectCurrency('USD')}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-lime-400/15 border-lime-400 text-lime-300 shadow-[0_0_12px_rgba(163,230,53,0.15)] font-bold'
                  : 'bg-[#0E1511] border-[#1A261D] text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#16241A] flex items-center justify-center font-bold text-lime-400">
                  $
                </span>
                <span>USD ($)</span>
              </div>
              {currency === 'USD' && <Check className="w-4 h-4 text-lime-400" />}
            </button>
          </div>
        </div>

        {/* Exchange Rate Card (Screen 14) */}
        <div className="p-4 rounded-2xl bg-[#0B100D] border border-[#1A261D] space-y-1.5">
          <div className="text-[11px] font-sans text-zinc-400 uppercase tracking-wider">
            Exchange Rate
          </div>
          <div className="text-base font-bold text-white font-mono">
            {exchangeRateInfo.text}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            Last updated: {exchangeRateInfo.lastUpdated}
          </div>
        </div>

        {/* Demo Trading Section (Screen 14) */}
        <div className="p-4 rounded-2xl bg-[#0B100D] border border-[#1A261D] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-zinc-400">Demo Trading</span>
            <span className="text-[11px] text-zinc-500 font-mono">Virtual practice</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#121A14] border border-[#233527]">
            <span className="text-xs text-zinc-400">Starting Balance</span>
            <span className="text-base font-black text-white font-mono">
              {currency === 'INR' ? '₹ 1,00,000' : '$ 1,000'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <span>Reset Demo Account</span>
          </button>
        </div>

        {/* Virtual Money Only Compliance Pill (Screen 14) */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/25 text-[10px] font-mono font-bold text-lime-400">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
            <span>DEMO MODE — VIRTUAL MONEY ONLY</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-400" />
              <span>Reset Demo Balance?</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              This will restore your starting demo balance to{' '}
              <strong className="text-lime-400">
                {currency === 'INR' ? '₹ 1,00,000.00' : '$ 1,000.00'}
              </strong>{' '}
              and clear any open positions and pending orders.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-xs font-mono font-bold text-red-300 cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
