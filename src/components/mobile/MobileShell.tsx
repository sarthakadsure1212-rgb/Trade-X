import React, { useState } from 'react';
import {
  Home,
  Globe,
  TrendingUp,
  Layers,
  User,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useTrading } from '../../context/TradingContext';
import { useCurrency } from '../../context/CurrencyContext';
import { MarketAsset } from '../../data/globalMarkets';
import { AuthUser } from '../auth/AuthCard';

import { HomeScreen } from './screens/HomeScreen';
import { MarketsScreen } from './screens/MarketsScreen';
import { TradeScreen } from './screens/TradeScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { ProfileScreen } from './screens/ProfileScreen';

import { CurrencySettingsModal } from './screens/CurrencySettingsModal';
import { WatchlistModal } from './screens/WatchlistModal';
import { AlertsModal } from './screens/AlertsModal';

export type MobileTab = 'home' | 'markets' | 'trade' | 'orders' | 'profile';

interface MobileShellProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  token?: string;
}

export function MobileShell({ user, onLogout, token }: MobileShellProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const { positions, setSelectedAsset } = useTrading();
  const { currency } = useCurrency();

  // Modals state
  const [currencySettingsOpen, setCurrencySettingsOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  // Desktop view toggle: centered mobile device frame vs full-bleed
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);

  const handleSelectAssetToTrade = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    setActiveTab('trade');
  };

  return (
    <div className="min-h-screen w-full bg-[#030504] text-zinc-100 flex items-center justify-center font-sans antialiased selection:bg-lime-400 selection:text-black">
      {/* Background ambient highlights for desktop */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-lime-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container: Mobile phone viewport on desktop or full-width on mobile */}
      <div
        className={`w-full min-h-screen bg-[#060907] flex flex-col relative transition-all duration-300 ${
          isDesktopExpanded
            ? 'max-w-4xl min-h-screen border-x border-[#1A251D] shadow-2xl'
            : 'max-w-md min-h-screen sm:min-h-[844px] sm:my-6 sm:rounded-[36px] sm:border-[4px] sm:border-[#1E2B21] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden'
        }`}
      >
        {/* Desktop Viewport Width Toggle Pill (Top-Right discreet helper) */}
        <div className="hidden sm:flex absolute top-3 right-3 z-40">
          <button
            type="button"
            onClick={() => setIsDesktopExpanded((prev) => !prev)}
            className="p-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            title={isDesktopExpanded ? 'Switch to Mobile Phone Frame' : 'Expand to Tablet Width'}
          >
            {isDesktopExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Scrollable Screen Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              onNavigateTab={setActiveTab}
              onOpenCurrencySettings={() => setCurrencySettingsOpen(true)}
              onOpenAlerts={() => setAlertsOpen(true)}
              onSelectAssetToTrade={handleSelectAssetToTrade}
            />
          )}

          {activeTab === 'markets' && (
            <MarketsScreen
              onSelectAssetToTrade={handleSelectAssetToTrade}
              onOpenCurrencySettings={() => setCurrencySettingsOpen(true)}
            />
          )}

          {activeTab === 'trade' && (
            <TradeScreen
              onBack={() => setActiveTab('markets')}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersScreen onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              onLogout={onLogout}
              onOpenCurrencySettings={() => setCurrencySettingsOpen(true)}
              onOpenWatchlist={() => setWatchlistOpen(true)}
              onOpenAlerts={() => setAlertsOpen(true)}
            />
          )}
        </main>

        {/* ============================================================== */}
        {/* MOBILE BOTTOM NAVIGATION BAR (Screens 5, 6, 7, 8, 9, 13)       */}
        {/* Home | Markets | Trade | Orders | Profile                     */}
        {/* ============================================================== */}
        <nav className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-[#090D0B]/98 backdrop-blur-md border-t border-[#1A251D] px-2 py-2 safe-area-bottom">
          <div className="max-w-md mx-auto grid grid-cols-5 items-center">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-sans mt-1">Home</span>
            </button>

            {/* 2. Markets */}
            <button
              type="button"
              onClick={() => setActiveTab('markets')}
              className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                activeTab === 'markets'
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-[10px] font-sans mt-1">Markets</span>
            </button>

            {/* 3. Trade */}
            <button
              type="button"
              onClick={() => setActiveTab('trade')}
              className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                activeTab === 'trade'
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-sans mt-1">Trade</span>
            </button>

            {/* 4. Orders */}
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center justify-center py-1 transition-all relative cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Layers className="w-5 h-5" />
                {positions.length > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-lime-400 text-black font-bold font-mono text-[9px] flex items-center justify-center">
                    {positions.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans mt-1">Orders</span>
            </button>

            {/* 5. Profile */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-lime-400 font-bold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-sans mt-1">Profile</span>
            </button>
          </div>
        </nav>

        {/* Currency Settings Modal (Screen 14) */}
        <CurrencySettingsModal
          isOpen={currencySettingsOpen}
          onClose={() => setCurrencySettingsOpen(false)}
        />

        {/* Watchlist Modal (Screen 10) */}
        <WatchlistModal
          isOpen={watchlistOpen}
          onClose={() => setWatchlistOpen(false)}
          onSelectAssetToTrade={handleSelectAssetToTrade}
        />

        {/* Alerts Modal (Screen 12) */}
        <AlertsModal
          isOpen={alertsOpen}
          onClose={() => setAlertsOpen(false)}
        />
      </div>
    </div>
  );
}
