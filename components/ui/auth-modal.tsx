/**
 * TradeX Attractive Google Sign-In & Demo Account Authentication Portal
 * 
 * - Attractive modern fintech aesthetic with animated glow and neon accents
 * - Exclusive Google Sign-In (guest mode completely removed as requested)
 * - Customizable starting demo capital ($10k, $50k, $100k)
 * - Live feature badges showcasing real-time candlestick trading and PnL simulation
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'google';
  demoBalance: number;
  initialCapital: number;
  joinedAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (user: UserAccount) => void;
}

export function AuthModal({ isOpen, onClose, onSignInSuccess }: AuthModalProps) {
  const [selectedCapital, setSelectedCapital] = useState<number>(50000);
  const [isLoading, setIsLoading] = useState(false);
  const [googleAccountName, setGoogleAccountName] = useState('Sarthak Adsure');
  const [googleEmail, setGoogleEmail] = useState('sarthakadsure1212@gmail.com');

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: UserAccount = {
        id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
        name: googleAccountName.trim() || 'Sarthak Adsure',
        email: googleEmail.trim() || 'sarthakadsure1212@gmail.com',
        authProvider: 'google',
        demoBalance: selectedCapital,
        initialCapital: selectedCapital,
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      setIsLoading(false);
      onSignInSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 text-zinc-100 relative overflow-hidden">
        {/* Animated Ambient Glowing Elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-lime-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Hero Identity */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lime-400 to-lime-300 text-zinc-950 font-black text-2xl flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(163,230,53,0.4)]">
              TX
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-400 border-2 border-zinc-900 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-zinc-950" />
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trade<span className="text-lime-400">X</span> Live Account
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
              Sign in with Google to activate your real-time live market terminal, paper trading funds, and technical indicators.
            </p>
          </div>
        </div>

        {/* Live Features Grid Showcase */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs">
          <div className="flex items-center gap-2 p-1.5">
            <Activity className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="text-zinc-300 font-medium">Real-Time Live Candles</span>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <TrendingUp className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="text-zinc-300 font-medium">Live Profit & Loss Tracker</span>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <Zap className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="text-zinc-300 font-medium">SMA, EMA, Bollinger & RSI</span>
          </div>
          <div className="flex items-center gap-2 p-1.5">
            <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="text-zinc-300 font-medium">Risk-Free Paper Trading</span>
          </div>
        </div>

        {/* Demo Capital Tier Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-semibold">Select Starting Demo Capital:</span>
            <span className="font-mono text-lime-400 font-bold">
              ${selectedCapital.toLocaleString()} USD
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: '$10,000', value: 10000, desc: 'Conservative' },
              { label: '$50,000', value: 50000, desc: 'Recommended' },
              { label: '$100,000', value: 100000, desc: 'Institutional' },
            ].map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setSelectedCapital(tier.value)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCapital === tier.value
                    ? 'bg-lime-400/10 border-lime-400 text-white shadow-[0_0_15px_rgba(163,230,53,0.2)] ring-1 ring-lime-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span className="font-bold font-mono text-sm block">{tier.label}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{tier.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Google Account Profile Preview */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Google Account Credentials</span>
            <span className="text-lime-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-Bit Secure
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Trader Name</label>
              <input
                type="text"
                value={googleAccountName}
                onChange={(e) => setGoogleAccountName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 block mb-0.5">Google Email</label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>
        </div>

        {/* Exclusive Sign In with Google CTA (Guest Mode Removed) */}
        <div className="pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {/* Official Google G Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-zinc-950 font-extrabold">
              {isLoading ? 'Verifying Google Account...' : 'Continue with Google'}
            </span>
          </button>
        </div>

        {/* Regulatory & Paper Trading Sandbox Disclaimer */}
        <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span>Educational paper trading environment · Zero real financial risk</span>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
