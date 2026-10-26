import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading } from '../../../context/TradingContext';
import { MarketAsset } from '../../../data/globalMarkets';
import { TradeXLightweightChart } from '../../chart/TradeXLightweightChart';

interface TradeScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: 'home' | 'markets' | 'trade' | 'orders' | 'profile') => void;
}

export function TradeScreen({ onBack, onNavigateTab }: TradeScreenProps) {
  const { currency, formatPrice, getAssetDisplayPrice } = useCurrency();
  const {
    selectedAsset,
    balance,
    placeOrder,
    livePrices,
    toggleWatchlist,
    isWatchlisted,
    marketDataStatus,
  } = useTrading();

  // Order Parameters
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<string>(() => {
    const p = livePrices[selectedAsset.symbol] || getAssetDisplayPrice(selectedAsset);
    return p.toFixed(2);
  });

  // Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingSide, setPendingSide] = useState<'BUY' | 'SELL'>('BUY');

  // Feedback notifications
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    orderId?: string;
  } | null>(null);

  const currentPrice =
    livePrices[selectedAsset.symbol] || getAssetDisplayPrice(selectedAsset);
  const executionPrice =
    orderType === 'MARKET' ? currentPrice : parseFloat(limitPrice) || currentPrice;
  const totalOrderValue = executionPrice * quantity;
  const isStarred = isWatchlisted(selectedAsset.symbol);

  // Quick percentage allocation helper
  const handlePercentClick = (percent: number) => {
    if (executionPrice <= 0) return;
    const maxQty = Math.floor((balance * (percent / 100)) / executionPrice);
    setQuantity(Math.max(1, maxQty));
  };

  // Triggered when user taps BUY or SELL directly below the chart
  const handleInitiateOrder = (side: 'BUY' | 'SELL') => {
    // 1. Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      setNotification({
        message: 'Invalid Quantity: Please enter at least 1 unit to trade.',
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // 2. Validate price for limit orders
    if (orderType !== 'MARKET') {
      const parsedPrice = parseFloat(limitPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setNotification({
          message: 'Invalid Price: Please specify a valid limit trigger price.',
          type: 'error',
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }
    }

    // 3. Validate available funds for BUY
    if (side === 'BUY' && balance < totalOrderValue) {
      setNotification({
        message: `Insufficient Funds: Order requires ${formatPrice(totalOrderValue)}, but available balance is ${formatPrice(balance)}.`,
        type: 'error',
      });
      setTimeout(() => setNotification(null), 3500);
      return;
    }

    // Open Confirmation Dialog
    setPendingSide(side);
    setConfirmModalOpen(true);
  };

  // Confirmed Order Submission
  const handleConfirmOrder = () => {
    setConfirmModalOpen(false);

    const res = placeOrder({
      symbol: selectedAsset.symbol,
      assetName: selectedAsset.name,
      exchange: selectedAsset.exchange,
      side: pendingSide,
      type: orderType,
      qty: quantity,
      orderPrice: orderType !== 'MARKET' ? parseFloat(limitPrice) : undefined,
    });

    if (res.success) {
      setNotification({
        message: res.message,
        type: 'success',
        orderId: res.orderId,
      });
    } else {
      setNotification({ message: res.message, type: 'error' });
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3 pb-8">
      {/* 1. Header Bar: Asset Info & Live Price */}
      <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-[#090D0B] border-b border-[#1A251D]">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Back to Markets"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center font-bold text-xs text-lime-400 font-mono shrink-0">
            {selectedAsset.symbol.slice(0, 3)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white font-mono truncate">
                {selectedAsset.symbol}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono px-1 rounded bg-[#131C16] border border-[#1A251D]">
                {selectedAsset.exchange.split(' ')[0]}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-sans truncate">
              {selectedAsset.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right font-mono">
            <div className="text-sm font-bold text-white">
              {formatPrice(currentPrice)}
            </div>
            <div
              className={`text-[10px] font-semibold ${
                selectedAsset.change24h >= 0 ? 'text-lime-400' : 'text-red-400'
              }`}
            >
              {selectedAsset.change24h >= 0 ? '+' : ''}
              {selectedAsset.change24h.toFixed(2)}%
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleWatchlist(selectedAsset.symbol)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-lime-400 transition-colors cursor-pointer"
            title="Toggle Watchlist"
          >
            <Star
              className={`w-4 h-4 ${
                isStarred ? 'fill-lime-400 text-lime-400' : 'text-zinc-600'
              }`}
            />
          </button>
        </div>
      </header>

      {/* 2. Unified Live Demo Status Bar (No separate demo/live modes) */}
      <div className="px-4 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span>LIVE DEMO</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1410] border border-[#1A261D] text-zinc-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
          <span>REAL-TIME MARKET FEED</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">12ms</span>
        </div>
      </div>

      {/* 3. Notification Toast */}
      {notification && (
        <div className="mx-4 p-3 rounded-xl border backdrop-blur-xl shadow-2xl flex flex-col gap-2 text-xs font-mono animate-fade-in">
          {notification.type === 'success' ? (
            <div className="w-full flex items-start gap-2.5 text-lime-300 bg-lime-950/90 p-3 rounded-lg border border-lime-400/50">
              <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold">{notification.message}</div>
                {notification.orderId && (
                  <div className="text-[10px] text-lime-400/80 pt-0.5">
                    Order ID: {notification.orderId}
                  </div>
                )}
              </div>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('orders')}
                  className="px-2 py-1 rounded bg-lime-400 text-black font-bold text-[10px] shrink-0 hover:bg-lime-300 transition-colors cursor-pointer"
                >
                  View Orders
                </button>
              )}
            </div>
          ) : (
            <div className="w-full flex items-start gap-2 text-red-300 bg-red-950/90 p-3 rounded-lg border border-red-500/50">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{notification.message}</div>
            </div>
          )}
        </div>
      )}

      {/* 4. Custom Interactive Candlestick Chart (TradingView branding completely removed) */}
      <div className="px-4">
        <TradeXLightweightChart
          symbol={selectedAsset.symbol}
          assetName={selectedAsset.name}
          basePrice={currentPrice}
          height={280}
        />
      </div>

      {/* 5. Working Buy and Sell Trading Panel (Visible directly below the chart) */}
      <div className="px-4 space-y-3">
        <div className="p-3.5 rounded-2xl bg-[#0B100D] border border-[#1A261D] space-y-3 shadow-lg">
          {/* Order Type Tabs: Market | Limit | Stop */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#121A14] rounded-xl border border-[#1F2E22]">
            {(['MARKET', 'LIMIT', 'STOP'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  orderType === type
                    ? 'bg-lime-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {type === 'MARKET' ? 'Market' : type === 'LIMIT' ? 'Limit' : 'Stop'}
              </button>
            ))}
          </div>

          {/* Conditional Limit / Stop Trigger Price Input */}
          {orderType !== 'MARKET' && (
            <div className="flex items-center justify-between gap-3 bg-[#131D16] border border-[#233527] rounded-xl px-3 py-2 text-xs font-mono animate-fade-in">
              <span className="text-zinc-400">
                {orderType === 'LIMIT' ? 'Limit Price' : 'Stop Trigger'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-lime-400 font-bold">{currency === 'INR' ? '₹' : '$'}</span>
                <input
                  type="number"
                  step="0.05"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-24 text-right bg-transparent border-none text-white font-mono font-bold outline-none"
                />
              </div>
            </div>
          )}

          {/* Quantity Stepper with Plus / Minus controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Quantity</span>
              <span className="text-zinc-500">Lot: 1</span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#121A14] border border-[#233527] rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg bg-[#18251C] hover:bg-[#203225] text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease Quantity"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center bg-transparent border-none text-base font-bold text-white font-mono outline-none"
              />

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-lg bg-[#18251C] hover:bg-[#203225] text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Increase Quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Percentage Allocation: 25% | 50% | 75% | 100% */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentClick(pct)}
                  className="py-1 rounded-lg bg-[#142017] hover:bg-[#1C2C1F] border border-[#233527] text-zinc-300 text-[11px] font-mono font-medium transition-colors cursor-pointer text-center"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Value and Available Balance info */}
          <div className="pt-1 flex items-center justify-between text-xs font-mono text-zinc-300 border-t border-[#18251C]">
            <div>
              <span className="text-zinc-500 text-[11px] block">Order Value</span>
              <span className="font-bold text-white">{formatPrice(totalOrderValue)}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[11px] block">Available Funds</span>
              <span className="font-bold text-lime-400">{formatPrice(balance)}</span>
            </div>
          </div>

          {/* Prominent Green BUY and Red SELL Buttons (Directly below chart) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleInitiateOrder('BUY')}
              className="py-3.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 active:scale-[0.98] text-black font-extrabold font-mono text-sm tracking-wide shadow-[0_0_20px_rgba(163,230,53,0.35)] transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <span>BUY</span>
              <span className="text-[10px] font-medium opacity-80">
                {formatPrice(executionPrice)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleInitiateOrder('SELL')}
              className="py-3.5 px-4 rounded-xl bg-red-500 hover:bg-red-400 active:scale-[0.98] text-white font-extrabold font-mono text-sm tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all cursor-pointer flex flex-col items-center justify-center"
            >
              <span>SELL</span>
              <span className="text-[10px] font-medium opacity-80">
                {formatPrice(executionPrice)}
              </span>
            </button>
          </div>

          {/* Reassurance Indicator */}
          <div className="text-center pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-[10px] font-mono font-bold text-lime-400">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>LIVE DEMO ACCOUNT — REAL-TIME EXECUTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ORDER CONFIRMATION MODAL                                       */}
      {/* ============================================================== */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#0B100D] border border-[#233527] rounded-3xl p-5 shadow-2xl space-y-4 text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1A251D]">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    pendingSide === 'BUY' ? 'bg-lime-400' : 'bg-red-500'
                  }`}
                />
                <h3 className="text-base font-bold text-white font-mono">
                  Confirm {pendingSide} Order
                </h3>
              </div>
              <span
                className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                  pendingSide === 'BUY'
                    ? 'bg-lime-400/20 text-lime-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {pendingSide}
              </span>
            </div>

            {/* Asset and Execution Parameters */}
            <div className="p-3.5 rounded-2xl bg-[#121A14] border border-[#1F2E22] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Instrument</span>
                <span className="font-bold text-white">
                  {selectedAsset.symbol} ({selectedAsset.exchange})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Account</span>
                <span className="font-bold text-lime-400">Live Demo Account</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Order Type</span>
                <span className="font-bold text-white">{orderType} ORDER</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Quantity</span>
                <span className="font-bold text-white">{quantity} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Est. Price</span>
                <span className="font-bold text-white">{formatPrice(executionPrice)}</span>
              </div>
              <div className="h-[1px] bg-[#1F2E22] my-1" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 font-bold">Total Order Value</span>
                <span
                  className={`font-black ${
                    pendingSide === 'BUY' ? 'text-lime-400' : 'text-red-400'
                  }`}
                >
                  {formatPrice(totalOrderValue)}
                </span>
              </div>
            </div>

            {/* Balance after execution preview */}
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-zinc-500">Available After Trade</span>
              <span className="font-bold text-zinc-300">
                {formatPrice(Math.max(0, balance - (pendingSide === 'BUY' ? totalOrderValue : 0)))}
              </span>
            </div>

            {/* Live Demo Disclaimer */}
            <div className="p-2.5 rounded-xl bg-lime-400/10 border border-lime-400/20 text-[10px] font-mono text-lime-300 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
              <span>
                Live Demo Order: Instant real-time execution with virtual capital. Safe paper trading on real-time prices.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="py-3 rounded-xl bg-[#142017] hover:bg-[#1B2B1F] border border-[#233527] text-zinc-300 font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className={`py-3 rounded-xl font-black font-mono text-xs transition-all cursor-pointer shadow-lg ${
                  pendingSide === 'BUY'
                    ? 'bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_15px_rgba(163,230,53,0.35)]'
                    : 'bg-red-500 hover:bg-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                }`}
              >
                Confirm {pendingSide}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
