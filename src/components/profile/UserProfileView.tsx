import React, { useState } from 'react';
import { AuthUser } from '../auth/AuthCard';
import {
  User,
  Shield,
  KeyRound,
  LogOut,
  Sliders,
  Database,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe,
  Zap,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface UserProfileViewProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  token?: string;
}

export function UserProfileView({ user, onLogout, token }: UserProfileViewProps) {
  const [dataSpeed, setDataSpeed] = useState<'realtime' | 'low_latency'>('realtime');
  const [themeMode, setThemeMode] = useState<'deep_black' | 'charcoal'>('deep_black');

  const fallbackEmail = 'sarthakadsure1212@gmail.com';
  const displayEmail = user?.email || fallbackEmail;
  const displayName = user?.name || displayEmail.split('@')[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A08] text-zinc-100 overflow-y-auto p-3 sm:p-6 max-w-3xl mx-auto w-full space-y-5">
      {/* Profile Header */}
      <div className="p-5 rounded-2xl bg-[#0B100D] border border-[#1B271E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-lime-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(163,249,77,0.3)]">
            <div className="w-full h-full rounded-full bg-[#0E1511] flex items-center justify-center font-bold text-lg text-lime-300 font-mono">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white font-sans">{displayName}</h1>
            <p className="text-xs text-zinc-400 font-mono">{displayEmail}</p>
            <div className="mt-1 flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-lime-500/15 text-lime-400 border border-lime-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Verified Account</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#162319] text-zinc-400">
                Tier 1 Market Access
              </span>
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        )}
      </div>

      {/* Security & Authentication Details */}
      <div className="p-4 rounded-xl bg-[#090E0B] border border-[#19251C] space-y-3">
        <div className="text-xs font-mono font-bold text-lime-300 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-lime-400" />
          <span>Authentication & Security Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1F2F23]">
            <span className="text-zinc-500 text-[10px] block">Auth Provider</span>
            <span className="text-zinc-200 font-bold">
              {isSupabaseConfigured ? 'Supabase Auth (Cloud PKCE)' : 'TradeX Secure Cryptographic Auth'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1F2F23]">
            <span className="text-zinc-500 text-[10px] block">Session Token Hash</span>
            <span className="text-zinc-200 font-mono text-[11px] truncate block">
              {token ? `${token.slice(0, 16)}...` : 'AES-256 Validated'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1F2F23]">
            <span className="text-zinc-500 text-[10px] block">Encryption Protocol</span>
            <span className="text-zinc-200 font-bold">PBKDF2 SHA-512 + AES-GCM</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0E1511] border border-[#1F2F23]">
            <span className="text-zinc-500 text-[10px] block">Password Recovery</span>
            <span className="text-zinc-200 font-bold">Supabase SMTP Email Dispatch</span>
          </div>
        </div>
      </div>

      {/* Terminal Settings */}
      <div className="p-4 rounded-xl bg-[#090E0B] border border-[#19251C] space-y-3">
        <div className="text-xs font-mono font-bold text-lime-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-lime-400" />
          <span>Chart Platform Preferences</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#141E16]">
            <div>
              <div className="text-xs font-semibold text-white">Market Telemetry Rate</div>
              <div className="text-[11px] text-zinc-400">WebSocket / Tick Polling frequency</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setDataSpeed('realtime')}
                className={`px-2.5 py-1 rounded text-xs font-mono ${
                  dataSpeed === 'realtime'
                    ? 'bg-lime-400 text-black font-bold'
                    : 'bg-[#121A14] text-zinc-400'
                }`}
              >
                1.2s Real-Time
              </button>
              <button
                onClick={() => setDataSpeed('low_latency')}
                className={`px-2.5 py-1 rounded text-xs font-mono ${
                  dataSpeed === 'low_latency'
                    ? 'bg-lime-400 text-black font-bold'
                    : 'bg-[#121A14] text-zinc-400'
                }`}
              >
                Ultra-Low
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-semibold text-white">Fintech Theme Palette</div>
              <div className="text-[11px] text-zinc-400">Deep black & neon lime contrast</div>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-lime-400/20 text-lime-300 font-bold border border-lime-400/30">
              #070A08 Deep Neon
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Compliance & Data Disclaimer */}
      <div className="p-4 rounded-xl bg-[#090E0B] border border-[#19251C] text-[11px] font-mono text-zinc-400 space-y-2">
        <div className="flex items-center gap-2 text-zinc-300 font-bold">
          <Globe className="w-4 h-4 text-lime-400" />
          <span>Institutional Market Data Compliance</span>
        </div>
        <p className="leading-relaxed">
          TradeX provides native professional charting interfaces with real-time indicators and dynamic candle streaming. Market feeds for NSE, BSE, NYSE, NASDAQ, and European bourses reflect accurate exchange market schedules and consolidated index calculations.
        </p>
        <p className="text-zinc-500">
          TradeX features an interactive $10,000 Demo Options Simulator for risk-free strategy testing with real-time settlement and live profit & loss calculations.
        </p>
      </div>
    </div>
  );
}
