import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  RotateCcw,
  Star,
  CheckCircle2,
  DollarSign,
  Lock,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { AuthUser } from '../../auth/AuthCard';
import { PWAInstallButton } from '../../pwa/PWAInstallButton';

interface ProfileScreenProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  onOpenCurrencySettings: () => void;
  onOpenWatchlist: () => void;
  onOpenAlerts: () => void;
}

export function ProfileScreen({
  user,
  onLogout,
  onOpenCurrencySettings,
  onOpenWatchlist,
  onOpenAlerts,
}: ProfileScreenProps) {
  const { currency, exchangeRateInfo } = useCurrency();
  const { balance } = useTrading();

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'TradeX Trader');
  const displayEmail = user?.email || 'trader@tradex.platform';

  return (
    <div className="w-full flex flex-col space-y-4 pb-6">
      {/* Header Bar (Screen 13) */}
      <header className="px-4 pt-3 pb-2 bg-[#090D0B] border-b border-[#1A251D]">
        <h1 className="text-base font-bold text-white tracking-tight">Profile</h1>
      </header>

      {/* User Information Card (Screen 13) */}
      <div className="mx-4 p-4 rounded-2xl bg-[#0B100D] border border-[#1A261D] flex items-center gap-3.5 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-lime-400/10 border-2 border-lime-400/40 flex items-center justify-center text-lime-400 shrink-0">
          <User className="w-7 h-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white truncate font-sans">
              {displayName}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/30 text-[9px] font-mono font-bold text-lime-400">
              LIVE DEMO VIP
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">
            {displayEmail}
          </p>
        </div>
      </div>

      {/* Menu List (Screen 13) */}
      <div className="mx-4 rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg text-xs font-mono">
        {/* Currency & Demo Settings (Direct link to Screen 14) */}
        <button
          type="button"
          onClick={onOpenCurrencySettings}
          className="w-full p-4 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center text-lime-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-lime-400 transition-colors">
                Currency & Live Demo Settings
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Active: {currency === 'INR' ? '₹ INR (Indian Rupee)' : '$ USD (US Dollar)'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* Watchlist Manager */}
        <button
          type="button"
          onClick={onOpenWatchlist}
          className="w-full p-4 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center text-zinc-300">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-lime-400 transition-colors">
                Watchlist
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Manage pinned markets & indices
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* Notifications & Price Alerts */}
        <button
          type="button"
          onClick={onOpenAlerts}
          className="w-full p-4 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center text-zinc-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-lime-400 transition-colors">
                Price Alerts
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Manage custom price triggers
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* Security & Authentication */}
        <button
          type="button"
          onClick={() => setSecurityModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center text-zinc-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-lime-400 transition-colors">
                Security & Session
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Supabase / JWT Encrypted Session
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* About TradeX */}
        <button
          type="button"
          onClick={() => setAboutModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#121A14] transition-colors cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center text-zinc-300">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-lime-400 transition-colors">
                About TradeX
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                v2.4.0 • Paper Trading Engine
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Log Out Button (Screen 13) */}
      <div className="px-4 pt-2">
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Confirmation Modal: Log Out */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-400" />
              <span>Log Out of TradeX?</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Your demo balances and open simulated positions will be saved safely for when you log back in.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  if (onLogout) onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-xs font-mono font-bold text-red-300 cursor-pointer"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-lime-400" />
              <span>Security & Session</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-[#121A14] border border-[#233527] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Authentication:</span>
                <span className="text-lime-400 font-bold">Supabase / JWT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Session ID:</span>
                <span className="text-zinc-300 font-mono">{user?.id?.slice(0, 12) || 'usr_session'}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Encryption:</span>
                <span className="text-zinc-300">SHA-512 & AES-256</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-lime-400" />
              <span>About TradeX</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              TradeX is a professional mobile-first paper trading simulator designed for learning market mechanics with virtual money only. No real funds are at risk.
            </p>
            <div className="text-[11px] text-zinc-500 font-mono border-t border-[#1F3123] pt-2 space-y-1">
              <div>Version: 2.4.0 (Build 2026.10)</div>
              <div>Data Mode: High-frequency simulated market feeds</div>
            </div>
            <button
              type="button"
              onClick={() => setAboutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs cursor-pointer shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
