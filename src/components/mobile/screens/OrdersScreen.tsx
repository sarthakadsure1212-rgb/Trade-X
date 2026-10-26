import React, { useState } from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useTrading, Position, Order } from '../../../context/TradingContext';

interface OrdersScreenProps {
  onNavigateTab?: (tab: 'home' | 'markets' | 'trade' | 'orders' | 'profile') => void;
}

export function OrdersScreen({ onNavigateTab }: OrdersScreenProps) {
  const { currency, formatPrice } = useCurrency();
  const {
    positions,
    orders,
    balance,
    totalUnrealizedPnl,
    totalUnrealizedPnlPercent,
    closePosition,
    cancelOrder,
  } = useTrading();

  // Active top tab: 'positions' or 'orders'
  const [activeTab, setActiveTab] = useState<'positions' | 'orders'>('positions');

  // Order history status filter
  const [orderFilter, setOrderFilter] = useState<'All' | 'Filled' | 'Pending' | 'Cancelled'>('All');

  // Confirmation dialogs
  const [closingPosition, setClosingPosition] = useState<Position | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'All') return true;
    if (orderFilter === 'Filled') return o.status === 'FILLED';
    if (orderFilter === 'Pending') return o.status === 'PENDING';
    if (orderFilter === 'Cancelled') return o.status === 'CANCELLED';
    return true;
  });

  const handleConfirmClose = () => {
    if (!closingPosition) return;
    const res = closePosition(closingPosition.id);
    setClosingPosition(null);
    if (res.success) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    const res = cancelOrder(cancellingOrder.id);
    setCancellingOrder(null);
    if (res.success) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-6">
      {/* Top Segmented Tab Switch (Screen 9) */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-2 p-1 bg-[#0E1511] border border-[#1A261D] rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('positions')}
            className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'positions'
                ? 'bg-lime-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Positions</span>
            {positions.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'positions' ? 'bg-black text-lime-400' : 'bg-[#18251C] text-lime-400'
              }`}>
                {positions.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-lime-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mx-4 p-3 rounded-xl bg-lime-950/90 border border-lime-400/50 text-lime-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: POSITIONS (Screen 9)                                    */}
      {/* ============================================================== */}
      {activeTab === 'positions' && (
        <div className="px-4 space-y-4">
          {/* Total P&L Banner (Screen 9) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C150E] to-[#0A100C] border border-lime-400/30 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-zinc-400 font-medium">Total P&L</span>
              <span className="text-[11px] text-zinc-400 font-mono">
                Available: <strong className="text-white font-bold">{formatPrice(balance)}</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  totalUnrealizedPnl >= 0 ? 'text-lime-400' : 'text-red-400'
                }`}
              >
                {totalUnrealizedPnl >= 0 ? '+' : ''}
                {formatPrice(totalUnrealizedPnl)}
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  totalUnrealizedPnlPercent >= 0 ? 'text-lime-400' : 'text-red-400'
                }`}
              >
                ({totalUnrealizedPnlPercent >= 0 ? '+' : ''}
                {totalUnrealizedPnlPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Open Positions List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-bold uppercase tracking-wider">
                Open Positions ({positions.length})
              </span>
            </div>

            {positions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0B100D] border border-[#1A261D] text-center space-y-2">
                <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-sm font-semibold text-zinc-300 font-mono">No Open Positions</div>
                <p className="text-xs text-zinc-500 font-sans">
                  Go to Markets or Trade to book a simulated stock or index contract.
                </p>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('markets')}
                    className="mt-2 px-4 py-2 rounded-xl bg-lime-400 text-black font-bold text-xs font-mono cursor-pointer"
                  >
                    Explore Markets
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
                {positions.map((pos) => {
                  const isUp = pos.unrealizedPnl >= 0;
                  return (
                    <div
                      key={pos.id}
                      className="p-3.5 flex items-center justify-between hover:bg-[#121A14] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#142017] border border-[#233527] flex items-center justify-center font-bold text-xs text-lime-400 font-mono">
                          {pos.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white font-mono">
                              {pos.symbol}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                pos.side === 'BUY'
                                  ? 'bg-lime-400/10 text-lime-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {pos.side}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            {pos.qty} Qty • Avg. {formatPrice(pos.avgEntryPrice)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <div
                            className={`text-sm font-bold ${
                              isUp ? 'text-lime-400' : 'text-red-400'
                            }`}
                          >
                            {isUp ? '+' : ''}{formatPrice(pos.unrealizedPnl)}
                          </div>
                          <div
                            className={`text-[11px] font-semibold ${
                              isUp ? 'text-lime-400' : 'text-red-400'
                            }`}
                          >
                            {isUp ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setClosingPosition(pos)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Orders Snippet (Screen 9) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="font-bold uppercase tracking-wider">Recent Orders</span>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-lime-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white">{ord.symbol}</span>
                    <span className="text-zinc-500">
                      {ord.side} • {ord.qty} Qty • {ord.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === 'FILLED'
                          ? 'bg-lime-400/10 text-lime-400'
                          : ord.status === 'PENDING'
                          ? 'bg-yellow-400/10 text-yellow-400'
                          : 'bg-red-400/10 text-red-400'
                      }`}
                    >
                      {ord.status === 'FILLED' ? '✓ Filled' : ord.status}
                    </span>
                    <span className="font-bold text-white">
                      {formatPrice(ord.filledPrice || ord.orderPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ORDER HISTORY (Screen 15)                               */}
      {/* ============================================================== */}
      {activeTab === 'orders' && (
        <div className="px-4 space-y-4">
          {/* Filter Pills: All | Filled | Pending | Cancelled */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Filled', 'Pending', 'Cancelled'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setOrderFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  orderFilter === filter
                    ? 'bg-lime-400 text-black shadow-sm'
                    : 'bg-[#111913] text-zinc-400 hover:text-white border border-[#1A261D]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0B100D] border border-[#1A261D] text-zinc-500 font-mono text-xs">
              No orders found matching "{orderFilter}".
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0B100D] border border-[#1A261D] divide-y divide-[#152018] overflow-hidden shadow-lg">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 flex items-center justify-between hover:bg-[#121A14] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-mono">
                        {ord.symbol}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          ord.side === 'BUY'
                            ? 'bg-lime-400/10 text-lime-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {ord.side}
                      </span>
                      <span className="text-zinc-500 text-xs font-mono">
                        • {ord.qty} Qty • {ord.type}
                      </span>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      {ord.formattedDate} {ord.formattedTime}
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0 flex items-center gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">
                        {formatPrice(ord.filledPrice || ord.orderPrice)}
                      </div>
                      <div className="mt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'FILLED'
                              ? 'bg-lime-400/10 text-lime-400'
                              : ord.status === 'PENDING'
                              ? 'bg-yellow-400/10 text-yellow-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {ord.status === 'FILLED' ? '✓ Filled' : ord.status}
                        </span>
                      </div>
                    </div>

                    {ord.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => setCancellingOrder(ord)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Cancel pending order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal: Close Position */}
      {closingPosition && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white">Close Position</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Are you sure you want to market close your {closingPosition.qty} {closingPosition.symbol} position?
            </p>
            <div className="p-3 rounded-xl bg-[#142017] border border-[#233527] space-y-1 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Entry Price:</span>
                <span className="text-white">{formatPrice(closingPosition.avgEntryPrice)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Current Price:</span>
                <span className="text-white">{formatPrice(closingPosition.currentPrice)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-[#1F3123]">
                <span>Unrealized P&L:</span>
                <span className={closingPosition.unrealizedPnl >= 0 ? 'text-lime-400' : 'text-red-400'}>
                  {closingPosition.unrealizedPnl >= 0 ? '+' : ''}{formatPrice(closingPosition.unrealizedPnl)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setClosingPosition(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="flex-1 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-xs font-mono font-bold text-black cursor-pointer shadow-lg"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Cancel Pending Order */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1511] border border-[#233527] rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white">Cancel Pending Order?</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Cancel your pending {cancellingOrder.side} {cancellingOrder.qty} {cancellingOrder.symbol} at {formatPrice(cancellingOrder.orderPrice)}.
              Any reserved funds will be credited back to your available balance.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-xs font-mono font-bold text-red-300 cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
