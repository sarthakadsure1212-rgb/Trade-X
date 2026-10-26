import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useCurrency, SupportedCurrency } from './CurrencyContext';
import { GLOBAL_MARKETS, MarketAsset } from '../data/globalMarkets';

export interface Position {
  id: string;
  symbol: string;
  assetName: string;
  exchange: string;
  side: 'BUY' | 'SELL';
  qty: number;
  avgEntryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  pnlPercent: number;
  timestamp: number;
  formattedTime: string;
}

export interface Order {
  id: string;
  symbol: string;
  assetName: string;
  exchange: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP';
  qty: number;
  orderPrice: number;
  filledPrice?: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
  timestamp: number;
  formattedDate: string;
  formattedTime: string;
}

export interface TradingContextType {
  balance: number;
  positions: Position[];
  orders: Order[];
  totalUnrealizedPnl: number;
  totalUnrealizedPnlPercent: number;
  totalRealizedPnl: number;
  portfolioValue: number;
  livePrices: Record<string, number>;
  livePriceChanges: Record<string, number>;
  placeOrder: (params: {
    symbol: string;
    assetName: string;
    exchange: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP';
    qty: number;
    orderPrice?: number;
  }) => { success: boolean; message: string; orderId?: string };
  closePosition: (positionId: string) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  resetDemoAccount: () => void;
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => { success: boolean; message: string };
  isSimulatedData: boolean;
  tradingMode: 'DEMO' | 'LIVE';
  switchTradingMode: (mode: 'DEMO' | 'LIVE') => { success: boolean; message: string; requiresBrokerSetup?: boolean };
  brokerStatus: {
    isConfigured: boolean;
    provider: string | null;
    status: string;
    accountId: string | null;
    message: string;
  };
  marketDataStatus: {
    status: string;
    feedType: string;
    provider: string;
    isSimulated: boolean;
    latencyMs: number;
    message: string;
  };
  selectedAsset: MarketAsset;
  setSelectedAsset: (asset: MarketAsset) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

interface TradingProviderProps {
  children: React.ReactNode;
  userId?: string | null;
}

export function TradingProvider({ children, userId }: TradingProviderProps) {
  const { currency, convert, getAssetDisplayPrice, usdToInrRate } = useCurrency();
  const storageKey = `tradex_demo_trading_${userId || 'guest'}`;

  // Default initial balances: INR 100,000 or USD 1,000
  const getDefaultBalance = (curr: SupportedCurrency) => (curr === 'INR' ? 100000 : 1000);

  // Keep track of the currency of currently stored state to convert seamlessly on currency switch
  const prevCurrencyRef = useRef<SupportedCurrency>(currency);

  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_balance`);
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0) return val;
      }
    } catch {
      // ignore
    }
    return getDefaultBalance(currency);
  });

  // Trading Mode: 'DEMO' (virtual money only) or 'LIVE' (authorized broker)
  const [tradingMode, setTradingMode] = useState<'DEMO' | 'LIVE'>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_mode`);
      if (saved === 'LIVE' || saved === 'DEMO') return saved;
    } catch {
      // ignore
    }
    return 'DEMO';
  });

  // Live Broker Status
  const [brokerStatus, setBrokerStatus] = useState<{
    isConfigured: boolean;
    provider: string | null;
    status: string;
    accountId: string | null;
    message: string;
  }>({
    isConfigured: false,
    provider: null,
    status: 'UNCONFIGURED',
    accountId: null,
    message: 'Live Brokerage Integration is unconfigured. Demo virtual money mode active.',
  });

  // Market Data Feed Status
  const [marketDataStatus, setMarketDataStatus] = useState<{
    status: string;
    feedType: string;
    provider: string;
    isSimulated: boolean;
    latencyMs: number;
    message: string;
  }>({
    status: 'SIMULATED',
    feedType: 'High-Fidelity Simulated Feed',
    provider: 'TradeX Market Simulator',
    isSimulated: true,
    latencyMs: 12,
    message: 'Simulated market feed active. To stream live exchange data, add MARKET_DATA_API_KEY.',
  });

  // Fetch backend status on mount
  useEffect(() => {
    fetch('/api/brokerage/status')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.isConfigured === 'boolean') {
          setBrokerStatus(data);
        }
      })
      .catch(() => {});

    fetch('/api/market-data/status')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.status) {
          setMarketDataStatus(data);
        }
      })
      .catch(() => {});
  }, []);

  const [positions, setPositions] = useState<Position[]>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_positions`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Clean initial state for users — no hardcoded personal positions
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_orders`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Clean initial state for users — no hardcoded personal orders
    return [];
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_watchlist`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['NIFTY50', 'SENSEX', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'AAPL', 'TSLA', 'BTC/USD'];
  });

  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(() => {
    const savedSymbol = localStorage.getItem('tradex_selected_symbol');
    if (savedSymbol) {
      const found = GLOBAL_MARKETS.find((a) => a.symbol === savedSymbol);
      if (found) return found;
    }
    return GLOBAL_MARKETS[3]; // RELIANCE by default to match screenshot
  });

  // Live prices dictionary for real-time tick engine
  const [livePrices, setLivePrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    GLOBAL_MARKETS.forEach((asset) => {
      initial[asset.symbol] = getAssetDisplayPrice(asset);
    });
    return initial;
  });

  const [livePriceChanges, setLivePriceChanges] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    GLOBAL_MARKETS.forEach((asset) => {
      initial[asset.symbol] = asset.change24h;
    });
    return initial;
  });

  // Handle currency switch: Convert balance, positions, and orders accurately
  useEffect(() => {
    if (prevCurrencyRef.current !== currency) {
      const fromCurr = prevCurrencyRef.current;
      const toCurr = currency;
      prevCurrencyRef.current = currency;

      // Convert available demo balance
      setBalance((prev) => convert(prev, fromCurr, toCurr));

      // Convert positions entry price and current price
      setPositions((prev) =>
        prev.map((pos) => {
          const newAvgPrice = convert(pos.avgEntryPrice, fromCurr, toCurr);
          const newCurrentPrice = convert(pos.currentPrice, fromCurr, toCurr);
          const newPnl = (newCurrentPrice - newAvgPrice) * pos.qty * (pos.side === 'BUY' ? 1 : -1);
          return {
            ...pos,
            avgEntryPrice: newAvgPrice,
            currentPrice: newCurrentPrice,
            unrealizedPnl: newPnl,
          };
        })
      );

      // Convert order prices
      setOrders((prev) =>
        prev.map((ord) => ({
          ...ord,
          orderPrice: convert(ord.orderPrice, fromCurr, toCurr),
          filledPrice: ord.filledPrice ? convert(ord.filledPrice, fromCurr, toCurr) : undefined,
        }))
      );

      // Refresh live prices in new currency
      const updated: Record<string, number> = {};
      GLOBAL_MARKETS.forEach((asset) => {
        updated[asset.symbol] = getAssetDisplayPrice(asset);
      });
      setLivePrices(updated);
    }
  }, [currency, convert, getAssetDisplayPrice]);

  // Persist demo state whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_balance`, balance.toString());
      localStorage.setItem(`${storageKey}_positions`, JSON.stringify(positions));
      localStorage.setItem(`${storageKey}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${storageKey}_watchlist`, JSON.stringify(watchlist));
      localStorage.setItem('tradex_selected_symbol', selectedAsset.symbol);
    } catch {
      // ignore
    }
  }, [balance, positions, orders, watchlist, selectedAsset, storageKey]);

  // Real-time market tick generator (simulates live ticks and checks pending limit orders)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random asset to update
      const randomIndex = Math.floor(Math.random() * GLOBAL_MARKETS.length);
      const targetAsset = GLOBAL_MARKETS[randomIndex];
      const symbol = targetAsset.symbol;

      const current = livePrices[symbol] || getAssetDisplayPrice(targetAsset);
      const deltaPercent = (Math.random() * 0.4 - 0.2) / 100; // ±0.2%
      const newPrice = Number((current * (1 + deltaPercent)).toFixed(2));

      setLivePrices((prev) => ({
        ...prev,
        [symbol]: newPrice,
      }));

      // Update positions for this symbol
      setPositions((prev) =>
        prev.map((pos) => {
          if (pos.symbol === symbol) {
            const diff = newPrice - pos.avgEntryPrice;
            const pnl = pos.side === 'BUY' ? diff * pos.qty : -diff * pos.qty;
            const pnlPct = (pnl / (pos.avgEntryPrice * pos.qty)) * 100;
            return {
              ...pos,
              currentPrice: newPrice,
              unrealizedPnl: Number(pnl.toFixed(2)),
              pnlPercent: Number(pnlPct.toFixed(2)),
            };
          }
          return pos;
        })
      );

      // Check pending limit orders for this symbol
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.status === 'PENDING' && ord.symbol === symbol) {
            // BUY Limit: triggers when market price <= limit price
            if (ord.side === 'BUY' && newPrice <= ord.orderPrice) {
              // Fill order!
              createOrAddToPosition({
                symbol: ord.symbol,
                assetName: ord.assetName,
                exchange: ord.exchange,
                side: 'BUY',
                qty: ord.qty,
                entryPrice: newPrice,
              });
              return {
                ...ord,
                status: 'FILLED',
                filledPrice: newPrice,
              };
            }
            // SELL Limit: triggers when market price >= limit price
            if (ord.side === 'SELL' && newPrice >= ord.orderPrice) {
              createOrAddToPosition({
                symbol: ord.symbol,
                assetName: ord.assetName,
                exchange: ord.exchange,
                side: 'SELL',
                qty: ord.qty,
                entryPrice: newPrice,
              });
              return {
                ...ord,
                status: 'FILLED',
                filledPrice: newPrice,
              };
            }
          }
          return ord;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [livePrices, getAssetDisplayPrice]);

  // Helper to add position or merge
  const createOrAddToPosition = (params: {
    symbol: string;
    assetName: string;
    exchange: string;
    side: 'BUY' | 'SELL';
    qty: number;
    entryPrice: number;
  }) => {
    setPositions((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.symbol === params.symbol && p.side === params.side
      );
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const totalQty = existing.qty + params.qty;
        const totalCost = existing.qty * existing.avgEntryPrice + params.qty * params.entryPrice;
        const newAvg = totalCost / totalQty;
        const diff = params.entryPrice - newAvg;
        const pnl = params.side === 'BUY' ? diff * totalQty : -diff * totalQty;
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          qty: totalQty,
          avgEntryPrice: Number(newAvg.toFixed(2)),
          currentPrice: params.entryPrice,
          unrealizedPnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(((pnl / (newAvg * totalQty)) * 100).toFixed(2)),
        };
        return updated;
      } else {
        const newPos: Position = {
          id: 'pos_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          symbol: params.symbol,
          assetName: params.assetName,
          exchange: params.exchange,
          side: params.side,
          qty: params.qty,
          avgEntryPrice: params.entryPrice,
          currentPrice: params.entryPrice,
          unrealizedPnl: 0,
          pnlPercent: 0,
          timestamp: Date.now(),
          formattedTime: 'Just now',
        };
        return [newPos, ...prev];
      }
    });
  };

  // Place Order Method
  const placeOrder = ({
    symbol,
    assetName,
    exchange,
    side,
    type,
    qty,
    orderPrice,
  }: {
    symbol: string;
    assetName: string;
    exchange: string;
    side: 'BUY' | 'SELL';
    type: 'MARKET' | 'LIMIT' | 'STOP';
    qty: number;
    orderPrice?: number;
  }) => {
    if (qty <= 0) {
      return { success: false, message: 'Quantity must be at least 1 unit.' };
    }

    const currentLivePrice =
      livePrices[symbol] ||
      getAssetDisplayPrice(
        GLOBAL_MARKETS.find((a) => a.symbol === symbol) || GLOBAL_MARKETS[0]
      );

    const executionPrice =
      type === 'MARKET' ? currentLivePrice : orderPrice || currentLivePrice;
    const requiredFunds = executionPrice * qty;

    if (side === 'BUY' && balance < requiredFunds) {
      return {
        success: false,
        message: `Insufficient virtual funds. Required: ${requiredFunds.toFixed(2)}, Available: ${balance.toFixed(2)}`,
      };
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    if (type === 'MARKET') {
      // Immediate execution
      setBalance((prev) => Math.max(0, prev - requiredFunds));
      createOrAddToPosition({
        symbol,
        assetName,
        exchange,
        side,
        qty,
        entryPrice: executionPrice,
      });

      const newOrder: Order = {
        id: orderId,
        symbol,
        assetName,
        exchange,
        side,
        type: 'MARKET',
        qty,
        orderPrice: executionPrice,
        filledPrice: executionPrice,
        status: 'FILLED',
        timestamp: Date.now(),
        formattedDate,
        formattedTime,
      };

      setOrders((prev) => [newOrder, ...prev]);
      return {
        success: true,
        message: `Filled: ${side} ${qty} ${symbol} at ${executionPrice.toFixed(2)}`,
        orderId,
      };
    } else {
      // Pending Limit/Stop Order
      // Reserve funds for BUY limit orders
      if (side === 'BUY') {
        setBalance((prev) => Math.max(0, prev - requiredFunds));
      }

      const newOrder: Order = {
        id: orderId,
        symbol,
        assetName,
        exchange,
        side,
        type,
        qty,
        orderPrice: executionPrice,
        status: 'PENDING',
        timestamp: Date.now(),
        formattedDate,
        formattedTime,
      };

      setOrders((prev) => [newOrder, ...prev]);
      return {
        success: true,
        message: `Placed: ${type} ${side} ${qty} ${symbol} at ${executionPrice.toFixed(2)}`,
        orderId,
      };
    }
  };

  // Close Open Position
  const closePosition = (positionId: string) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) {
      return { success: false, message: 'Position not found or already closed.' };
    }

    const currentPrice = livePrices[pos.symbol] || pos.currentPrice;
    const diff = currentPrice - pos.avgEntryPrice;
    const pnl = pos.side === 'BUY' ? diff * pos.qty : -diff * pos.qty;
    const returnedValue = pos.avgEntryPrice * pos.qty + pnl;

    // Credit returned capital and PnL to balance
    setBalance((prev) => Math.max(0, prev + returnedValue));

    // Remove position
    setPositions((prev) => prev.filter((p) => p.id !== positionId));

    // Add closing record to order history
    const now = new Date();
    const closeOrder: Order = {
      id: 'ord_close_' + Date.now(),
      symbol: pos.symbol,
      assetName: pos.assetName,
      exchange: pos.exchange,
      side: pos.side === 'BUY' ? 'SELL' : 'BUY',
      type: 'MARKET',
      qty: pos.qty,
      orderPrice: currentPrice,
      filledPrice: currentPrice,
      status: 'FILLED',
      timestamp: Date.now(),
      formattedDate: now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders((prev) => [closeOrder, ...prev]);

    return {
      success: true,
      message: `Closed ${pos.symbol} position. Realized P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}`,
    };
  };

  // Cancel Pending Order
  const cancelOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) {
      return { success: false, message: 'Order not found.' };
    }
    if (ord.status !== 'PENDING') {
      return { success: false, message: 'Only pending orders can be cancelled.' };
    }

    // Refund reserved funds if BUY
    if (ord.side === 'BUY') {
      const refund = ord.orderPrice * ord.qty;
      setBalance((prev) => prev + refund);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );

    return {
      success: true,
      message: `Cancelled ${ord.side} order for ${ord.qty} ${ord.symbol}.`,
    };
  };

  // Reset Demo Account
  const resetDemoAccount = () => {
    const defaultBal = getDefaultBalance(currency);
    setBalance(defaultBal);
    setPositions([]);
    setOrders([]);
    try {
      localStorage.removeItem(`${storageKey}_balance`);
      localStorage.removeItem(`${storageKey}_positions`);
      localStorage.removeItem(`${storageKey}_orders`);
    } catch {
      // ignore
    }
  };

  // Deposit Virtual Funds
  const depositFunds = (amount: number) => {
    if (amount > 0) {
      setBalance((prev) => prev + amount);
    }
  };

  // Withdraw Virtual Funds
  const withdrawFunds = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Enter a valid amount.' };
    if (amount > balance) return { success: false, message: 'Insufficient demo balance.' };
    setBalance((prev) => prev - amount);
    return { success: true, message: `Withdrawn virtual demo funds.` };
  };

  // Switch Trading Mode between DEMO and LIVE
  const switchTradingMode = (targetMode: 'DEMO' | 'LIVE') => {
    if (targetMode === 'LIVE') {
      if (!brokerStatus.isConfigured) {
        return {
          success: false,
          requiresBrokerSetup: true,
          message: 'Live Brokerage API not configured. Configure authorized Zerodha or Alpaca credentials in server environment. Virtual Demo Mode is active.',
        };
      }
      setTradingMode('LIVE');
      try { localStorage.setItem(`${storageKey}_mode`, 'LIVE'); } catch {}
      return { success: true, message: `Switched to LIVE TRADING (${brokerStatus.provider || 'Broker'}). Real capital is active.` };
    } else {
      setTradingMode('DEMO');
      try { localStorage.setItem(`${storageKey}_mode`, 'DEMO'); } catch {}
      return { success: true, message: 'Switched to DEMO TRADING. Virtual money only.' };
    }
  };

  // Watchlist toggle
  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol);

  // Computations
  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalInvested = positions.reduce((acc, p) => acc + p.avgEntryPrice * p.qty, 0);
  const totalUnrealizedPnlPercent =
    totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0;
  const portfolioValue = balance + totalInvested + totalUnrealizedPnl;
  const totalRealizedPnl = 0; // Cumulative tracker

  return (
    <TradingContext.Provider
      value={{
        balance,
        positions,
        orders,
        totalUnrealizedPnl,
        totalUnrealizedPnlPercent,
        totalRealizedPnl,
        portfolioValue,
        livePrices,
        livePriceChanges,
        placeOrder,
        closePosition,
        cancelOrder,
        resetDemoAccount,
        depositFunds,
        withdrawFunds,
        isSimulatedData: marketDataStatus.isSimulated,
        tradingMode,
        switchTradingMode,
        brokerStatus,
        marketDataStatus,
        selectedAsset,
        setSelectedAsset,
        watchlist,
        toggleWatchlist,
        isWatchlisted,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading(): TradingContextType {
  const ctx = useContext(TradingContext);
  if (!ctx) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return ctx;
}
