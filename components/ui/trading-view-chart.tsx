/**
 * TradingView Interactive Technical Analysis Widget & Real-time Live Market Ribbon
 * 
 * Embeds TradingView's official Advanced Real-Time Chart widget
 * with dark mode theme, live candlesticks, indicators, and responsive controls.
 */

import React, { useEffect, useRef, useState } from 'react';

export interface TradingViewChartProps {
  symbol: string; // e.g. "NASDAQ:NVDA", "COINBASE:BTCUSD"
  theme?: 'dark' | 'light';
  height?: number | string;
  interval?: string; // "1" (1-min live candle), "5", "15", "60", "D", "W"
  className?: string;
  showIntervalSwitcher?: boolean;
}

export function TradingViewChart({
  symbol,
  theme = 'dark',
  height = 520,
  interval: initialInterval = '1',
  className = '',
  showIntervalSwitcher = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedInterval, setSelectedInterval] = useState<string>(initialInterval);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: selectedInterval,
      timezone: 'Etc/UTC',
      theme: theme,
      style: '1', // Candlesticks
      locale: 'en',
      enable_publishing: false,
      backgroundColor: '#09090b',
      gridColor: 'rgba(39, 39, 42, 0.4)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      studies: [
        'STD;SMA',
        'STD;RSI',
        'STD;MACD',
      ],
      support_host: 'https://www.tradingview.com',
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme, selectedInterval]);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col ${className}`}>
      {showIntervalSwitcher && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-mono text-[11px]">Live Candle Period:</span>
            <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-lg border border-zinc-800">
              {[
                { label: '1m Live', value: '1' },
                { label: '5m', value: '5' },
                { label: '15m', value: '15' },
                { label: '1H', value: '60' },
                { label: '1D', value: 'D' },
              ].map((int) => (
                <button
                  key={int.value}
                  onClick={() => setSelectedInterval(int.value)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer ${
                    selectedInterval === int.value
                      ? 'bg-lime-400 text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-lime-400">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            <span>TradingView Real-Time Streaming</span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{ height: typeof height === 'number' ? `${height}px` : height, minHeight: '480px' }}
        className="w-full relative"
      />
    </div>
  );
}

export function TradingViewTickerTape() {
  const tapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tapeRef.current) return;
    tapeRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    tapeRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'NASDAQ:NVDA', title: 'NVDA' },
        { proName: 'COINBASE:BTCUSD', title: 'BTC/USD' },
        { proName: 'COINBASE:ETHUSD', title: 'ETH/USD' },
        { proName: 'NASDAQ:AAPL', title: 'AAPL' },
        { proName: 'BINANCE:SOLUSDT', title: 'SOL/USD' },
        { proName: 'NASDAQ:MSFT', title: 'MSFT' },
        { proName: 'NASDAQ:TSLA', title: 'TSLA' },
        { proName: 'AMEX:SPY', title: 'S&P 500' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    tapeRef.current.appendChild(script);

    return () => {
      if (tapeRef.current) {
        tapeRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-950 overflow-hidden min-h-[46px]">
      <div ref={tapeRef} className="w-full" />
    </div>
  );
}

export default TradingViewChart;
