/**
 * Live Real-Time Moving Candlestick Chart & Order Book
 * 
 * Features:
 * - Real-time animated forming candle: Price ticks dynamically every 800ms
 * - Dynamic high, low, close expansion and real-time wick stretching
 * - Live price indicator ray with pulsating price tag on vertical axis
 * - Volume bars corresponding to candle volatility
 * - Live order book (Bids & Asks depth) with animated fills
 * - Live trade execution tape streaming simulated market transactions
 * - Timeframe resolution controls (1s, 5s, 1m, 5m) and tick speed control
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Layers,
  ArrowUp,
  ArrowDown,
  Clock,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeTick {
  id: string;
  price: number;
  qty: number;
  time: string;
  side: 'buy' | 'sell';
}

interface LiveCandlestickChartProps {
  assetSymbol?: string;
  basePrice?: number;
  className?: string;
}

export function LiveCandlestickChart({
  assetSymbol = 'NVDA',
  basePrice = 142.80,
  className = '',
}: LiveCandlestickChartProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(800); // ms per tick
  const [timeframeSeconds, setTimeframeSeconds] = useState<number>(10); // new candle every 10s for fast live demonstration
  const [timerCountdown, setTimerCountdown] = useState<number>(10);

  // Seed initial completed candles
  const [candles, setCandles] = useState<Candle[]>(() => {
    const list: Candle[] = [];
    let cur = basePrice * 0.96;
    const now = Date.now();
    for (let i = 24; i >= 1; i--) {
      const open = cur;
      const delta = (Math.random() - 0.48) * (basePrice * 0.012);
      const close = Math.max(open + delta, basePrice * 0.8);
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.006);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.006);
      const volume = Math.floor(1000 + Math.random() * 8000);
      const d = new Date(now - i * 10000);
      list.push({
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
      cur = close;
    }
    return list;
  });

  // Active forming candle
  const [activeCandle, setActiveCandle] = useState<Candle>(() => {
    const last = basePrice;
    return {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      open: last,
      high: last + 0.3,
      low: last - 0.2,
      close: last + 0.1,
      volume: 120,
    };
  });

  // Live Trades Feed
  const [recentTrades, setRecentTrades] = useState<TradeTick[]>(() => [
    { id: '1', price: basePrice + 0.15, qty: 12, time: 'Just now', side: 'buy' },
    { id: '2', price: basePrice + 0.10, qty: 45, time: '1s ago', side: 'buy' },
    { id: '3', price: basePrice - 0.05, qty: 80, time: '2s ago', side: 'sell' },
    { id: '4', price: basePrice + 0.05, qty: 25, time: '3s ago', side: 'buy' },
  ]);

  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down'>('up');

  // Real-time tick engine
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveCandle((prev) => {
        // Micro-fluctuation
        const volatility = basePrice * 0.003;
        const tickDelta = (Math.random() - 0.49) * volatility;
        const newClose = Number(Math.max(basePrice * 0.7, prev.close + tickDelta).toFixed(2));
        const newHigh = Number(Math.max(prev.high, newClose).toFixed(2));
        const newLow = Number(Math.min(prev.low, newClose).toFixed(2));
        const newVolume = prev.volume + Math.floor(Math.random() * 45 + 5);

        const direction = newClose >= prev.close ? 'up' : 'down';
        setLastTickDirection(direction);

        // Add to live trade tape
        const newTrade: TradeTick = {
          id: Math.random().toString(36).substring(2, 7),
          price: newClose,
          qty: Math.floor(Math.random() * 50 + 5),
          time: new Date().toLocaleTimeString([], { second: '2-digit', fractionalSecondDigits: 1 } as any),
          side: direction === 'up' ? 'buy' : 'sell',
        };
        setRecentTrades((t) => [newTrade, ...t.slice(0, 7)]);

        return {
          ...prev,
          high: newHigh,
          low: newLow,
          close: newClose,
          volume: newVolume,
        };
      });

      // Handle candle completion timer
      setTimerCountdown((prevCount) => {
        if (prevCount <= 1) {
          // Finalize active candle and start a new one!
          setCandles((prevList) => {
            const finalized = { ...activeCandle };
            return [...prevList.slice(1), finalized];
          });

          setActiveCandle((curr) => ({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            open: curr.close,
            high: curr.close,
            low: curr.close,
            close: curr.close,
            volume: 10,
          }));

          return timeframeSeconds;
        }
        return prevCount - 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, timeframeSeconds, activeCandle, basePrice]);

  // All display candles (historical + active)
  const displayCandles = [...candles, activeCandle];

  // Min and max for auto-scaling
  const allPrices = displayCandles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...allPrices) * 0.998;
  const maxPrice = Math.max(...allPrices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...displayCandles.map((c) => c.volume)) * 1.2 || 1;

  // Chart dimensions
  const svgWidth = 840;
  const svgHeight = 320;
  const chartHeight = 240;
  const volumeHeight = 60;
  const paddingRight = 75; // for price axis

  const candleSlotWidth = (svgWidth - paddingRight) / displayCandles.length;
  const candleBodyWidth = Math.max(3, candleSlotWidth * 0.65);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  };

  const getVolY = (vol: number) => {
    return svgHeight - (vol / maxVolume) * volumeHeight;
  };

  const activeY = getY(activeCandle.close);
  const isCandleGreen = activeCandle.close >= activeCandle.open;

  return (
    <div className={`p-6 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md space-y-4 ${className}`}>
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <span>{assetSymbol} Live Candlestick Tape</span>
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-lime-400">
                REAL-TIME MOVING
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Active candle forming in real-time · New candle in <span className="font-mono text-lime-400 font-bold">{timerCountdown}s</span>
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Candle Interval Selector */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono">
            {[
              { label: '5s Fast', val: 5 },
              { label: '10s Normal', val: 10 },
              { label: '30s Trend', val: 30 },
            ].map((tf) => (
              <button
                key={tf.val}
                onClick={() => {
                  setTimeframeSeconds(tf.val);
                  setTimerCountdown(tf.val);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  timeframeSeconds === tf.val
                    ? 'bg-zinc-800 text-lime-400 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed((s) => (s === 800 ? 400 : s === 400 ? 1200 : 800))}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Tick frequency"
          >
            {speed === 400 ? '⚡ Ultra (400ms)' : speed === 800 ? '⚡ Fast (800ms)' : '⏱ Normal (1.2s)'}
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isPlaying
                ? 'bg-lime-400/10 border-lime-400/40 text-lime-400 hover:bg-lime-400 hover:text-zinc-950'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
            title={isPlaying ? 'Pause live ticks' : 'Resume live ticks'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Live Chart Area & Orderbook Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Candlestick SVG Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-zinc-950/80 rounded-xl border border-zinc-800/90 p-3 relative overflow-hidden flex flex-col justify-between">
          {/* Current Live Price Banner */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400">Current Price:</span>
              <span
                className={`text-xl font-black tabular-nums transition-colors ${
                  lastTickDirection === 'up' ? 'text-lime-400' : 'text-red-400'
                }`}
              >
                ${activeCandle.close.toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                  isCandleGreen ? 'bg-lime-400/20 text-lime-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {isCandleGreen ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {(((activeCandle.close - activeCandle.open) / activeCandle.open) * 100).toFixed(2)}%
              </span>
            </div>

            <div className="flex items-center gap-3 text-zinc-500 text-[11px] hidden sm:flex">
              <span>O: ${activeCandle.open.toFixed(2)}</span>
              <span>H: ${activeCandle.high.toFixed(2)}</span>
              <span>L: ${activeCandle.low.toFixed(2)}</span>
              <span>Vol: {activeCandle.volume}</span>
            </div>
          </div>

          {/* SVG Real-Time Candlestick Chart */}
          <div className="w-full h-72 relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Horizontal Grid lines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
                const y = chartHeight * ratio;
                const p = maxPrice - ratio * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1={0}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#27272a"
                      strokeDasharray="4 4"
                      strokeWidth="0.8"
                    />
                    <text
                      x={svgWidth - paddingRight + 6}
                      y={y + 3}
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      ${p.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Divider Line */}
              <line
                x1={0}
                y1={chartHeight}
                x2={svgWidth - paddingRight}
                y2={chartHeight}
                stroke="#3f3f46"
                strokeWidth="1"
              />

              {/* Candles */}
              {displayCandles.map((c, i) => {
                const isLatest = i === displayCandles.length - 1;
                const isGreen = c.close >= c.open;
                const color = isGreen ? '#a3e635' : '#ef4444';

                const x = i * candleSlotWidth + candleSlotWidth / 2;
                const openY = getY(c.open);
                const closeY = getY(c.close);
                const highY = getY(c.high);
                const lowY = getY(c.low);

                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(1.5, Math.abs(openY - closeY));

                const volY = getVolY(c.volume);
                const volHeight = svgHeight - volY;

                return (
                  <g key={i} className={isLatest ? 'animate-pulse' : ''}>
                    {/* Wick Line */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={color}
                      strokeWidth={isLatest ? '2' : '1.2'}
                    />

                    {/* Candle Body */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={color}
                      stroke={isLatest ? '#ffffff' : color}
                      strokeWidth={isLatest ? '1' : '0.5'}
                      rx="1"
                    />

                    {/* Volume Bar */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={volY}
                      width={candleBodyWidth}
                      height={volHeight}
                      fill={color}
                      opacity={isLatest ? '0.7' : '0.35'}
                      rx="1"
                    />
                  </g>
                );
              })}

              {/* Live Price Horizontal Ray & Axis Tag */}
              <line
                x1={0}
                y1={activeY}
                x2={svgWidth - paddingRight}
                y2={activeY}
                stroke={isCandleGreen ? '#a3e635' : '#ef4444'}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Glowing Active Price Badge on Right Axis */}
              <rect
                x={svgWidth - paddingRight + 2}
                y={activeY - 9}
                width={70}
                height={18}
                rx="4"
                fill={isCandleGreen ? '#a3e635' : '#ef4444'}
              />
              <text
                x={svgWidth - paddingRight + 36}
                y={activeY + 3.5}
                fill="#09090b"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ${activeCandle.close.toFixed(2)}
              </text>
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2 border-t border-zinc-900 font-mono">
            <span>Historical 25 Candles</span>
            <span className="text-lime-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
              Live Streaming Active
            </span>
          </div>
        </div>

        {/* Live Orderbook & Recent Trades Feed (4 Cols) */}
        <div className="lg:col-span-4 bg-zinc-950/80 rounded-xl border border-zinc-800/90 p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-lime-400" /> Live Order Book Depth
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Spread: $0.02</span>
            </div>

            {/* Asks (Sells) */}
            <div className="space-y-1 my-2 text-xs font-mono">
              {[
                { price: activeCandle.close + 0.08, qty: 140, pct: 60 },
                { price: activeCandle.close + 0.05, qty: 220, pct: 85 },
                { price: activeCandle.close + 0.02, qty: 95, pct: 40 },
              ].map((ask, i) => (
                <div key={i} className="relative flex justify-between px-2 py-0.5 rounded overflow-hidden">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-red-500/15 pointer-events-none"
                    style={{ width: `${ask.pct}%` }}
                  />
                  <span className="text-red-400 z-10">${ask.price.toFixed(2)}</span>
                  <span className="text-zinc-400 z-10">{ask.qty}</span>
                </div>
              ))}
            </div>

            {/* Mid Price Separator */}
            <div className="py-1 px-2 my-1 bg-zinc-900 rounded font-mono text-center text-xs font-bold flex justify-between items-center border border-zinc-800">
              <span className="text-zinc-500 text-[10px]">CURRENT</span>
              <span className={lastTickDirection === 'up' ? 'text-lime-400' : 'text-red-400'}>
                ${activeCandle.close.toFixed(2)}
              </span>
              <span className="text-zinc-500 text-[10px]">LIVE</span>
            </div>

            {/* Bids (Buys) */}
            <div className="space-y-1 my-2 text-xs font-mono">
              {[
                { price: activeCandle.close - 0.02, qty: 110, pct: 50 },
                { price: activeCandle.close - 0.04, qty: 310, pct: 90 },
                { price: activeCandle.close - 0.07, qty: 175, pct: 70 },
              ].map((bid, i) => (
                <div key={i} className="relative flex justify-between px-2 py-0.5 rounded overflow-hidden">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-lime-400/15 pointer-events-none"
                    style={{ width: `${bid.pct}%` }}
                  />
                  <span className="text-lime-400 z-10">${bid.price.toFixed(2)}</span>
                  <span className="text-zinc-400 z-10">{bid.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Live Trades Tape */}
          <div className="pt-2 border-t border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-300 block mb-1">
              Live Tape Execution:
            </span>
            <div className="space-y-1 max-h-24 overflow-hidden text-[11px] font-mono">
              {recentTrades.slice(0, 4).map((trade) => (
                <div key={trade.id} className="flex justify-between items-center text-zinc-400">
                  <span className={trade.side === 'buy' ? 'text-lime-400 font-bold' : 'text-red-400 font-bold'}>
                    ${trade.price.toFixed(2)}
                  </span>
                  <span>{trade.qty} shares</span>
                  <span className="text-[10px] text-zinc-500">{trade.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveCandlestickChart;
