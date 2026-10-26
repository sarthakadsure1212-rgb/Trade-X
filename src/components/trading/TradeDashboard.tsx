import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { TradeXProChart, Position } from '../../../components/ui/tradex-pro-chart';
import { TradeXLogo } from '../auth/TradeXLogo';
import { AuthUser } from '../auth/AuthCard';

export interface ClosedTrade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  stakeAmount: number;
  entryPrice: number;
  exitPrice: number;
  durationSeconds: number;
  pnl: number;
  result: 'PROFIT' | 'LOSS' | 'TIE';
  timestamp: number;
  formattedTime: string;
}

interface TradeDashboardProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  token?: string;
  isStandalone?: boolean;
  selectedAssetSymbol?: string;
}

export function TradeDashboard({
  user: _user,
  onLogout,
  token: _token,
  isStandalone: _isStandalone = false,
  selectedAssetSymbol,
}: TradeDashboardProps) {

  // Preset Available Market Assets (Global indices, stocks, crypto, commodities)
  const MARKET_ASSETS = [
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', price: 67420.50, change: '+2.65%', icon: '₿' },
    { symbol: 'NIFTY50', name: 'NIFTY 50 Index', price: 24862.45, change: '+0.84%', icon: '🇮🇳' },
    { symbol: 'SPX', name: 'S&P 500 Index', price: 5864.60, change: '+0.42%', icon: '📈' },
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0850, change: '+0.34%', icon: '€' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 142.80, change: '+3.84%', icon: '⚡' },
    { symbol: 'AAPL', name: 'Apple Inc', price: 231.45, change: '+1.15%', icon: '🍏' },
    { symbol: 'ETH/USD', name: 'Ethereum / USD', price: 2640.20, change: '+1.80%', icon: 'Ξ' },
    { symbol: 'GOLD', name: 'Gold Spot / USD', price: 2735.60, change: '+0.52%', icon: '🏆' },
    { symbol: 'FTSE100', name: 'FTSE 100 Index', price: 8245.20, change: '+0.25%', icon: '🇬🇧' },
  ];

  // Selected Active Asset
  const [selectedSymbol, setSelectedSymbol] = useState<string>(() => {
    if (selectedAssetSymbol) {
      const match = MARKET_ASSETS.find((a) => a.symbol === selectedAssetSymbol || a.symbol.includes(selectedAssetSymbol));
      if (match) return match.symbol;
    }
    return 'BTC/USD';
  });

  const [assetName, setAssetName] = useState<string>(() => {
    const match = MARKET_ASSETS.find((a) => a.symbol === selectedSymbol);
    return match ? match.name : 'Bitcoin / US Dollar';
  });

  const [basePrice, setBasePrice] = useState<number>(() => {
    const match = MARKET_ASSETS.find((a) => a.symbol === selectedSymbol);
    return match ? match.price : 67420.50;
  });

  // Sync when selectedAssetSymbol prop updates
  useEffect(() => {
    if (selectedAssetSymbol) {
      const match = MARKET_ASSETS.find(
        (a) => a.symbol === selectedAssetSymbol || selectedAssetSymbol.includes(a.symbol) || a.symbol.includes(selectedAssetSymbol)
      );
      if (match) {
        setSelectedSymbol(match.symbol);
        setAssetName(match.name);
        setBasePrice(match.price);
      }
    }
  }, [selectedAssetSymbol]);

  // Demo Account Balance (Stored in localStorage for persistence)
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const saved = localStorage.getItem('tradex_demo_balance');
    return saved ? parseFloat(saved) : 10000.00;
  });

  // Open Active Positions
  const [openPositions, setOpenPositions] = useState<Position[]>([]);

  // Persistent Closed Trade History (Stored in localStorage)
  const [tradeHistory, setTradeHistory] = useState<ClosedTrade[]>(() => {
    try {
      const saved = localStorage.getItem('tradex_trade_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved trade history:', e);
    }
    return [];
  });

  // Notification Toast for Trade Settlement
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
  } | null>(null);

  // Sync Demo Balance to localStorage
  useEffect(() => {
    localStorage.setItem('tradex_demo_balance', demoBalance.toFixed(2));
  }, [demoBalance]);

  // Sync Trade History to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tradex_trade_history', JSON.stringify(tradeHistory));
    } catch (e) {
      console.warn('Failed to save trade history:', e);
    }
  }, [tradeHistory]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === notification?.id ? null : curr));
    }, 4500);
  };

  // Reset Demo Balance
  const handleResetBalance = () => {
    setDemoBalance(10000.00);
    showNotification('Demo Account balance reset to $10,000.00.', 'info');
  };

  /**
   * BUG 1 & 2 RESOLUTION:
   * 1. Booking Trade:
   *    Stake amount is deducted from demoBalance immediately on booking.
   *    Position enters active openPositions with selected duration (e.g. 1 min / 60s).
   */
  const handleExecuteTrade = (newPos: Position, stakeAmount: number) => {
    // Deduct stake from available balance
    setDemoBalance((prev) => Math.max(0, prev - stakeAmount));
    setOpenPositions((prev) => [newPos, ...prev]);

    const durLabel = newPos.durationSeconds
      ? newPos.durationSeconds >= 60
        ? `${newPos.durationSeconds / 60}m`
        : `${newPos.durationSeconds}s`
      : 'Manual';

    showNotification(
      `Booked ${durLabel} ${newPos.type} on ${newPos.symbol}: $${stakeAmount.toFixed(2)} held. Closes automatically upon expiry.`,
      'info'
    );
  };

  /**
   * BUG 1 & 2 RESOLUTION:
   * 2. Auto-Closing / Settling Trade:
   *    When duration (e.g. 1 min) reaches zero:
   *    - If BUY and close price > entry price => PROFIT (+85% payout credited to balance! Balance increases!).
   *    - If BUY and close price < entry price => LOSS (Stake remains cut! Balance stays cut!).
   *    - If SELL and close price < entry price => PROFIT (+85% payout credited to balance! Balance increases!).
   *    - If SELL and close price > entry price => LOSS (Stake remains cut!).
   *    - If tie => Stake returned to balance.
   */
  const handleClosePosition = (
    id: string,
    finalPnl: number,
    exitPrice: number,
    reason: 'MANUAL' | 'EXPIRED' = 'EXPIRED'
  ) => {
    const closedPos = openPositions.find((p) => p.id === id);
    if (!closedPos) return;

    // Remove from open positions
    setOpenPositions((prev) => prev.filter((p) => p.id !== id));

    const stake = closedPos.stakeAmount;
    let result: 'PROFIT' | 'LOSS' | 'TIE' = 'TIE';

    if (finalPnl > 0) {
      result = 'PROFIT';
      // Credited stake + profit back into balance => balance increases
      const returnAmount = stake + finalPnl;
      setDemoBalance((prev) => prev + returnAmount);
      showNotification(
        `🎉 PROFIT! ${closedPos.type} on ${closedPos.symbol} won! Payout: +$${finalPnl.toFixed(2)} credited to your demo account.`,
        'success'
      );
    } else if (finalPnl < 0) {
      result = 'LOSS';
      // Stake was already deducted upon trade entry, so 0 is returned => balance stays cut
      showNotification(
        `📉 LOSS: ${closedPos.type} on ${closedPos.symbol} expired in loss. $${stake.toFixed(2)} stake was cut from your demo account.`,
        'error'
      );
    } else {
      result = 'TIE';
      // Returned stake
      setDemoBalance((prev) => prev + stake);
      showNotification(
        `⚖️ TIE: ${closedPos.symbol} closed at exact entry price. $${stake.toFixed(2)} stake refunded.`,
        'info'
      );
    }

    // Record in persistent Trade History
    const historyItem: ClosedTrade = {
      id: closedPos.id,
      symbol: closedPos.symbol,
      type: closedPos.type,
      stakeAmount: stake,
      entryPrice: closedPos.entryPrice,
      exitPrice: exitPrice,
      durationSeconds: closedPos.durationSeconds || 60,
      pnl: finalPnl,
      result,
      timestamp: Date.now(),
      formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setTradeHistory((prev) => [historyItem, ...prev]);
  };

  return (
    <div className="w-full min-h-screen bg-[#060907] text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in max-w-md">
          <div
            className={`p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 text-xs ${
              notification.type === 'success'
                ? 'bg-lime-950/90 border-lime-400/40 text-lime-300'
                : notification.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-300'
                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {notification.type === 'info' && <Sparkles className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />}
            <div className="leading-relaxed font-mono">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Minimal Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090d0b]/95 border-b border-[#1A251D] backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="w-full flex items-center justify-between gap-3">
          {/* Brand Logo & Engine Indicator */}
          <div className="flex items-center gap-2.5">
            <TradeXLogo size="sm" />
            <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/25 text-[10px] font-mono font-bold text-lime-400">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Demo Account Balance & Sign Out */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider hidden sm:block">Demo Balance</div>
              <div className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider sm:hidden">Demo</div>
              <div className="text-xs sm:text-base font-extrabold text-lime-400 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]">
                ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <button
                type="button"
                onClick={handleResetBalance}
                title="Reset Demo Balance to $10,000"
                className="p-1 rounded-md text-zinc-500 hover:text-lime-400 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 sm:p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Trading Canvas */}
      <main className="w-full flex-1 p-2 sm:p-4">
        <TradeXProChart
          symbol={selectedSymbol}
          assetName={assetName}
          basePrice={basePrice}
          accountBalance={demoBalance}
          openPositions={openPositions}
          onExecuteTrade={handleExecuteTrade}
          onClosePosition={handleClosePosition}
        />
      </main>
    </div>
  );
}
