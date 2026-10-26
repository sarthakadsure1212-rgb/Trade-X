import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
  UTCTimestamp,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import {
  Maximize2,
  Minimize2,
  Activity,
  Sliders,
  TrendingUp,
  Crosshair,
  Minus,
  Sparkles,
  BarChart2,
  Layers,
  ChevronDown,
  Info,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D';

interface TradeXLightweightChartProps {
  symbol: string;
  assetName: string;
  basePrice: number;
  height?: number;
  className?: string;
  onPriceChange?: (price: number) => void;
}

interface CandleData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function TradeXLightweightChart({
  symbol,
  assetName,
  basePrice,
  height = 360,
  className = '',
  onPriceChange,
}: TradeXLightweightChartProps) {
  const { formatPrice, currency } = useCurrency();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const rsiChartInstanceRef = useRef<IChartApi | null>(null);

  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showMACD, setShowMACD] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [activeTool, setActiveTool] = useState<'crosshair' | 'trendline' | 'horizontal' | 'none'>('crosshair');
  const [indicatorsMenuOpen, setIndicatorsMenuOpen] = useState(false);

  // Crosshair live legend state
  const [legendData, setLegendData] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
  } | null>(null);

  // Generate realistic historical candle data
  const initialData = useMemo<CandleData[]>(() => {
    const candles: CandleData[] = [];
    const count = 120;
    const now = Math.floor(Date.now() / 1000);

    let intervalSec = 86400; // 1D
    if (timeframe === '1m') intervalSec = 60;
    else if (timeframe === '5m') intervalSec = 300;
    else if (timeframe === '15m') intervalSec = 900;
    else if (timeframe === '30m') intervalSec = 1800;
    else if (timeframe === '1h') intervalSec = 3600;
    else if (timeframe === '4h') intervalSec = 14400;

    let price = basePrice * 0.92;
    const startTime = now - count * intervalSec;

    for (let i = 0; i < count; i++) {
      const time = (startTime + i * intervalSec) as UTCTimestamp;
      const volatility = 0.012;
      const delta = (Math.random() - 0.49) * volatility * price;
      const open = price;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * volatility * 0.6 * price;
      const low = Math.min(open, close) - Math.random() * volatility * 0.6 * price;
      const volume = Math.floor(10000 + Math.random() * 85000);

      candles.push({
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });

      price = close;
    }

    // Ensure the last candle close matches basePrice closely
    if (candles.length > 0) {
      candles[candles.length - 1].close = basePrice;
      candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
      candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, basePrice);
    }

    return candles;
  }, [basePrice, timeframe]);

  // Indicator Calculations
  const smaData = useMemo(() => {
    const period = 20;
    const result: { time: UTCTimestamp; value: number }[] = [];
    for (let i = period - 1; i < initialData.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += initialData[i - j].close;
      }
      result.push({
        time: initialData[i].time,
        value: Number((sum / period).toFixed(2)),
      });
    }
    return result;
  }, [initialData]);

  const emaData = useMemo(() => {
    const period = 50;
    const result: { time: UTCTimestamp; value: number }[] = [];
    if (initialData.length < period) return result;
    const multiplier = 2 / (period + 1);

    // Initial SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += initialData[i].close;
    }
    let ema = sum / period;
    result.push({ time: initialData[period - 1].time, value: Number(ema.toFixed(2)) });

    for (let i = period; i < initialData.length; i++) {
      ema = (initialData[i].close - ema) * multiplier + ema;
      result.push({ time: initialData[i].time, value: Number(ema.toFixed(2)) });
    }
    return result;
  }, [initialData]);

  const rsiData = useMemo(() => {
    const period = 14;
    const result: { time: UTCTimestamp; value: number }[] = [];
    if (initialData.length <= period) return result;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = initialData[i].close - initialData[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let rsi = 100 - 100 / (1 + rs);
    result.push({ time: initialData[period].time, value: Number(rsi.toFixed(2)) });

    for (let i = period + 1; i < initialData.length; i++) {
      const diff = initialData[i].close - initialData[i - 1].close;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = 100 - 100 / (1 + rs);
      result.push({ time: initialData[i].time, value: Number(rsi.toFixed(2)) });
    }
    return result;
  }, [initialData]);

  // Main Chart Initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Destroy existing chart if any
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth || 360,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#060907' },
        textColor: '#71717A',
        fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(26, 37, 29, 0.5)' },
        horzLines: { color: 'rgba(26, 37, 29, 0.5)' },
      },
      crosshair: {
        mode: 1, // Magnet mode
        vertLine: {
          color: '#22c55e',
          width: 1,
          style: 2, // Dashed
          labelBackgroundColor: '#142017',
        },
        horzLine: {
          color: '#22c55e',
          width: 1,
          style: 2,
          labelBackgroundColor: '#142017',
        },
      },
      timeScale: {
        borderColor: '#1A251D',
        timeVisible: true,
        secondsVisible: timeframe === '1m',
        barSpacing: 7,
      },
      rightPriceScale: {
        borderColor: '#1A251D',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.25 : 0.1,
        },
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
    });

    chartInstanceRef.current = chart;

    // Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candleSeries.setData(initialData);
    candleSeriesRef.current = candleSeries;

    // Volume Series
    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#22c55e',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // Overlay on the same scale or bottom margin
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      const volumeData = initialData.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)',
      }));
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // SMA Series
    if (showSMA && smaData.length > 0) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#facc15', // Gold
        lineWidth: 2,
        title: 'SMA 20',
      });
      smaSeries.setData(smaData);
      smaSeriesRef.current = smaSeries;
    }

    // EMA Series
    if (showEMA && emaData.length > 0) {
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#a855f7', // Purple
        lineWidth: 2,
        title: 'EMA 50',
      });
      emaSeries.setData(emaData);
      emaSeriesRef.current = emaSeries;
    }

    // Default crosshair legend
    if (initialData.length > 0) {
      const last = initialData[initialData.length - 1];
      const prev = initialData[initialData.length - 2] || last;
      const change = ((last.close - prev.close) / prev.close) * 100;
      setLegendData({
        time: new Date((last.time as number) * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        open: last.open,
        high: last.high,
        low: last.low,
        close: last.close,
        volume: last.volume,
        change,
      });
    }

    // Crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        if (initialData.length > 0) {
          const last = initialData[initialData.length - 1];
          const prev = initialData[initialData.length - 2] || last;
          setLegendData({
            time: new Date((last.time as number) * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            open: last.open,
            high: last.high,
            low: last.low,
            close: last.close,
            volume: last.volume,
            change: ((last.close - prev.close) / prev.close) * 100,
          });
        }
        return;
      }

      const candle = param.seriesData.get(candleSeries) as CandleData | undefined;
      if (candle) {
        setLegendData({
          time: new Date((param.time as number) * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume || 0,
          change: ((candle.close - candle.open) / candle.open) * 100,
        });
      }
    });

    // Resize observer
    const handleResize = () => {
      if (container && chart) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [initialData, showVolume, showSMA, showEMA, height, timeframe]);

  // RSI Sub-chart initialization (Screen 7 RSI panel)
  useEffect(() => {
    if (!showRSI || !rsiContainerRef.current) {
      if (rsiChartInstanceRef.current) {
        rsiChartInstanceRef.current.remove();
        rsiChartInstanceRef.current = null;
      }
      return;
    }

    const container = rsiContainerRef.current;
    if (rsiChartInstanceRef.current) {
      rsiChartInstanceRef.current.remove();
      rsiChartInstanceRef.current = null;
    }

    const rsiChart = createChart(container, {
      width: container.clientWidth || 360,
      height: 90,
      layout: {
        background: { type: ColorType.Solid, color: '#070C09' },
        textColor: '#71717A',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(26, 37, 29, 0.4)' },
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        borderColor: '#1A251D',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScale: false,
      handleScroll: false,
    });

    rsiChartInstanceRef.current = rsiChart;

    const rsiSeries = rsiChart.addSeries(LineSeries, {
      color: '#06b6d4', // Cyan
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 1,
        minMove: 0.1,
      },
    });

    rsiSeries.setData(rsiData);
    rsiSeriesRef.current = rsiSeries;

    // 70 and 30 threshold lines
    const line70 = rsiChart.addSeries(LineSeries, {
      color: 'rgba(239, 68, 68, 0.5)',
      lineWidth: 1,
      lineStyle: 2,
    });
    line70.setData(rsiData.map((d) => ({ time: d.time, value: 70 })));

    const line30 = rsiChart.addSeries(LineSeries, {
      color: 'rgba(34, 197, 94, 0.5)',
      lineWidth: 1,
      lineStyle: 2,
    });
    line30.setData(rsiData.map((d) => ({ time: d.time, value: 30 })));

    const handleResize = () => {
      if (container && rsiChart) {
        rsiChart.applyOptions({ width: container.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rsiChartInstanceRef.current) {
        rsiChartInstanceRef.current.remove();
        rsiChartInstanceRef.current = null;
      }
    };
  }, [rsiData, showRSI]);

  // Real-time tick simulation on chart
  useEffect(() => {
    const tickTimer = setInterval(() => {
      if (!candleSeriesRef.current || initialData.length === 0) return;

      const lastCandle = initialData[initialData.length - 1];
      const delta = (Math.random() - 0.49) * 0.003 * lastCandle.close;
      const updatedClose = Number((lastCandle.close + delta).toFixed(2));
      const updatedHigh = Math.max(lastCandle.high, updatedClose);
      const updatedLow = Math.min(lastCandle.low, updatedClose);

      const updatedCandle: CandleData = {
        ...lastCandle,
        high: updatedHigh,
        low: updatedLow,
        close: updatedClose,
        volume: lastCandle.volume + Math.floor(Math.random() * 20),
      };

      try {
        candleSeriesRef.current.update(updatedCandle);
        if (onPriceChange) {
          onPriceChange(updatedClose);
        }
      } catch {
        // ignore
      }
    }, 1200);

    return () => clearInterval(tickTimer);
  }, [initialData, onPriceChange]);

  const latestRsi = rsiData.length > 0 ? rsiData[rsiData.length - 1].value : 68.24;

  return (
    <div className={`w-full flex flex-col bg-[#060907] border border-[#1A251D] rounded-2xl overflow-hidden ${className}`}>
      {/* Top Header: Timeframe pills and Tool buttons (Screen 7) */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1A251D] bg-[#090D0B] gap-2 overflow-x-auto no-scrollbar">
        {/* Timeframe selector pills */}
        <div className="flex items-center gap-1 shrink-0">
          {(['1m', '5m', '15m', '30m', '1h', '4h', '1D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-lime-400 text-black shadow-[0_0_8px_rgba(163,230,53,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicators and Tools Menu */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          <button
            type="button"
            onClick={() => setIndicatorsMenuOpen((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              showSMA || showEMA || showRSI
                ? 'bg-lime-400/10 border-lime-400/40 text-lime-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden xs:inline text-[11px] font-semibold">Indicators</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Indicators Dropdown */}
          {indicatorsMenuOpen && (
            <div className="absolute right-0 top-9 z-50 w-52 bg-[#0E1511] border border-[#233527] rounded-xl shadow-2xl p-2 space-y-1 text-xs font-mono animate-fade-in">
              <div className="text-[10px] text-zinc-500 uppercase px-2 py-1 border-b border-[#1A261D]">
                Technical Indicators
              </div>
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#142017] cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-[#facc15]" />
                  SMA (20)
                </span>
                <input
                  type="checkbox"
                  checked={showSMA}
                  onChange={(e) => setShowSMA(e.target.checked)}
                  className="accent-lime-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#142017] cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  EMA (50)
                </span>
                <input
                  type="checkbox"
                  checked={showEMA}
                  onChange={(e) => setShowEMA(e.target.checked)}
                  className="accent-lime-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#142017] cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                  RSI (14) Oscillator
                </span>
                <input
                  type="checkbox"
                  checked={showRSI}
                  onChange={(e) => setShowRSI(e.target.checked)}
                  className="accent-lime-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#142017] cursor-pointer">
                <span className="flex items-center gap-2 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Volume Bars
                </span>
                <input
                  type="checkbox"
                  checked={showVolume}
                  onChange={(e) => setShowVolume(e.target.checked)}
                  className="accent-lime-400"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Live OHLCV Legend Bar */}
      {legendData && (
        <div className="px-3 py-1.5 bg-[#080C09] border-b border-[#152018] flex items-center justify-between text-[10px] font-mono text-zinc-400 flex-wrap gap-x-3 gap-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{symbol}</span>
            <span className="text-zinc-500">[{timeframe}]</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span>O: <strong className="text-zinc-200">{formatPrice(legendData.open)}</strong></span>
            <span>H: <strong className="text-lime-400">{formatPrice(legendData.high)}</strong></span>
            <span>L: <strong className="text-red-400">{formatPrice(legendData.low)}</strong></span>
            <span>C: <strong className={legendData.change >= 0 ? 'text-lime-400' : 'text-red-400'}>{formatPrice(legendData.close)}</strong></span>
            <span className={legendData.change >= 0 ? 'text-lime-400' : 'text-red-400'}>
              {legendData.change >= 0 ? '+' : ''}{legendData.change.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Main Candlestick Chart Viewport */}
      <div className="relative w-full flex-1 min-h-[280px]">
        {/* Native Lightweight Chart Canvas */}
        <div ref={chartContainerRef} className="w-full h-full" />

        {/* Data Origin Label (Non-misleading regulatory compliance) */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800/80 text-[9px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          <span>Simulated Real-Time Feed (1s)</span>
        </div>
      </div>

      {/* RSI Sub-Panel (as shown in Mockup Screen 7) */}
      {showRSI && (
        <div className="border-t border-[#1A251D] bg-[#070C09] px-3 py-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span>RSI (14)</span>
              <span>{latestRsi.toFixed(2)}</span>
            </span>
            <div className="flex items-center gap-2 text-[9px] text-zinc-500">
              <span className="text-red-400">OB: 70</span>
              <span className="text-lime-400">OS: 30</span>
            </div>
          </div>
          <div ref={rsiContainerRef} className="w-full h-[80px]" />
        </div>
      )}

      {/* Chart Footer Toolbar (Drawing / Indicators / Clear) */}
      <div className="px-3 py-2 bg-[#080C09] border-t border-[#1A251D] flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'crosshair' ? 'none' : 'crosshair')}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
              activeTool === 'crosshair'
                ? 'bg-lime-400/15 border-lime-400/40 text-lime-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title="Toggle Crosshair Scrubber"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Crosshair</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'trendline' ? 'none' : 'trendline')}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
              activeTool === 'trendline'
                ? 'bg-lime-400/15 border-lime-400/40 text-lime-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title="Trendline Tool"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Drawing</span>
          </button>
        </div>

        <div className="text-[10px] text-zinc-500 font-mono">
          <span>Pinch / Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
}
