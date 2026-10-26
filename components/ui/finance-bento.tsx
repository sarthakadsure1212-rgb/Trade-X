/**
 * TradeX Finance Bento Component
 * 
 * High-performance, responsive fintech bento grid featuring:
 * - Interactive Portfolio Area Chart with timeframe switching & scrubber tooltip
 * - Asset Allocation Interactive Donut & dynamic category highlights
 * - Cash Flow Income vs Expense breakdown with monthly trend bars
 * - Stocks & Crypto live-feeling simulated watchlist with sparklines
 * - Upcoming recurring obligations & payment tracker
 * - Financial goals with interactive simulated deposit workflow
 * - Integrated paper trading execution modal for realistic student trading practice
 */

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Target,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  Wallet,
  Coins,
  ShieldAlert,
  SlidersHorizontal,
  X,
  CreditCard,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FinanceBentoProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onTrade?: (symbol: string) => void;
  liveDemoBalance?: number;
  liveActivePrice?: number;
  activeAssetSymbol?: string;
  floatingPnl?: number;
  openPositionsCount?: number;
}

type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';
type AssetTab = 'all' | 'stocks' | 'crypto';

interface AssetItem {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change24h: number;
  sparkline: number[];
  volume: string;
  marketCap: string;
}

interface GoalItem {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
  targetDate: string;
  color: string;
}

interface PaymentItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  category: string;
  autopay: boolean;
  status: 'pending' | 'completed';
}

const INITIAL_ASSETS: AssetItem[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stock',
    price: 142.80,
    change24h: 3.84,
    sparkline: [136, 137, 139, 138, 140, 141.5, 142.8],
    volume: '$48.2B',
    marketCap: '$3.51T',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 67420.50,
    change24h: 2.65,
    sparkline: [65800, 66100, 65900, 66700, 66950, 67200, 67420],
    volume: '$31.8B',
    marketCap: '$1.32T',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 231.45,
    change24h: 1.15,
    sparkline: [228, 229, 229.5, 230, 230.8, 231, 231.45],
    volume: '$19.4B',
    marketCap: '$3.49T',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 2645.20,
    change24h: 3.25,
    sparkline: [2550, 2580, 2565, 2610, 2630, 2620, 2645.2],
    volume: '$16.2B',
    marketCap: '$318B',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    price: 428.60,
    change24h: 0.88,
    sparkline: [424, 425, 426, 427, 426.5, 427.8, 428.6],
    volume: '$14.1B',
    marketCap: '$3.18T',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    price: 174.90,
    change24h: 6.42,
    sparkline: [162, 165, 164, 168, 171, 173, 174.9],
    volume: '$5.8B',
    marketCap: '$82.4B',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stock',
    price: 218.40,
    change24h: -1.35,
    sparkline: [224, 222, 221, 220, 219, 219.5, 218.4],
    volume: '$18.7B',
    marketCap: '$698B',
  },
];

const TIMEFRAME_DATA: Record<Timeframe, { points: number[]; dates: string[]; change: string; changePercent: string; isPositive: boolean }> = {
  '1D': {
    points: [46200, 46450, 46300, 46800, 47100, 47450, 47900, 48650],
    dates: ['09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:00 PM'],
    change: '+$2,450.40',
    changePercent: '+5.31%',
    isPositive: true,
  },
  '1W': {
    points: [45100, 45800, 45600, 46700, 47200, 47950, 48650],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    change: '+$3,550.00',
    changePercent: '+7.87%',
    isPositive: true,
  },
  '1M': {
    points: [42100, 43400, 42900, 44800, 45600, 47100, 48650],
    dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    change: '+$6,550.40',
    changePercent: '+15.56%',
    isPositive: true,
  },
  '1Y': {
    points: [28500, 31200, 34000, 33500, 37800, 41200, 44500, 48650],
    dates: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Today'],
    change: '+$20,150.40',
    changePercent: '+70.70%',
    isPositive: true,
  },
  'ALL': {
    points: [15000, 21000, 28000, 36000, 42000, 48650],
    dates: ['Inception', 'Year 1', 'Year 2', 'Year 3', 'Current'],
    change: '+$33,650.40',
    changePercent: '+224.33%',
    isPositive: true,
  },
};

const ALLOCATION_CATEGORIES = [
  { name: 'Equities & Tech', percent: 45, value: '$21,892.68', color: '#a3e635' }, // vibrant lime
  { name: 'Cryptocurrencies', percent: 25, value: '$12,162.60', color: '#22c55e' }, // emerald
  { name: 'Cash & Stable Yield', percent: 20, value: '$9,730.08', color: '#38bdf8' }, // sky
  { name: 'Commodities & Metals', percent: 10, value: '$4,865.04', color: '#eab308' }, // amber
];

const MONTHLY_CASH_FLOW = [
  { month: 'May', income: 4200, expense: 2400 },
  { month: 'Jun', income: 4600, expense: 2550 },
  { month: 'Jul', income: 4900, expense: 2800 },
  { month: 'Aug', income: 5100, expense: 2700 },
  { month: 'Sep', income: 5300, expense: 2950 },
  { month: 'Oct', income: 5450, expense: 2890 },
];

export function FinanceBento({
  title = 'TradeX Dashboard',
  subtitle = 'Your financial overview at a glance',
  className,
  onTrade,
  liveDemoBalance,
  liveActivePrice,
  activeAssetSymbol,
  floatingPnl = 0,
  openPositionsCount = 0,
}: FinanceBentoProps) {
  // Navigation and timeframe states
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [assetTab, setAssetTab] = useState<AssetTab>('all');
  const [assetSearch, setAssetSearch] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState<string | null>(null);

  // Dynamic state for Goals and Payments
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: 'g1',
      title: 'Emergency Reserve Fund',
      target: 6000,
      current: 5100,
      category: 'Safety Net',
      targetDate: 'Dec 2026',
      color: '#a3e635',
    },
    {
      id: 'g2',
      title: 'First $25K Investment Milestone',
      target: 25000,
      current: 18500,
      category: 'Long-term Growth',
      targetDate: 'May 2027',
      color: '#22c55e',
    },
    {
      id: 'g3',
      title: 'Tech Rig & Study Abroad',
      target: 4000,
      current: 3250,
      category: 'Education & Equipment',
      targetDate: 'Aug 2026',
      color: '#38bdf8',
    },
  ]);

  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: 'p1',
      title: 'Student Housing / Accommodation',
      amount: 850.00,
      dueDate: 'Nov 01, 2026',
      daysRemaining: 7,
      category: 'Living',
      autopay: true,
      status: 'pending',
    },
    {
      id: 'p2',
      title: 'AWS Cloud Student Sandbox',
      amount: 24.50,
      dueDate: 'Nov 04, 2026',
      daysRemaining: 10,
      category: 'Tech Stack',
      autopay: true,
      status: 'pending',
    },
    {
      id: 'p3',
      title: 'TradingView Market Analytics Pro',
      amount: 14.95,
      dueDate: 'Nov 12, 2026',
      daysRemaining: 18,
      category: 'Trading Tools',
      autopay: false,
      status: 'pending',
    },
    {
      id: 'p4',
      title: 'Spotify & Headspace Student Bundle',
      amount: 5.99,
      dueDate: 'Nov 15, 2026',
      daysRemaining: 21,
      category: 'Wellness & Audio',
      autopay: true,
      status: 'pending',
    },
  ]);

  // Goal Deposit Modal State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [activeDepositGoal, setActiveDepositGoal] = useState<GoalItem | null>(null);
  const [depositAmount, setDepositAmount] = useState('150');

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return INITIAL_ASSETS.filter((item) => {
      const matchesTab = assetTab === 'all' || item.type === assetTab.slice(0, -1);
      const matchesSearch =
        item.symbol.toLowerCase().includes(assetSearch.toLowerCase()) ||
        item.name.toLowerCase().includes(assetSearch.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [assetTab, assetSearch]);

  // Current timeframe dataset
  const currentChart = TIMEFRAME_DATA[timeframe];
  const chartPoints = currentChart.points;
  const minVal = Math.min(...chartPoints) * 0.98;
  const maxVal = Math.max(...chartPoints) * 1.02;

  // Generate SVG path for the area chart
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 24;

  const getCoordinates = (val: number, idx: number) => {
    const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  const pathD = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const coords = chartPoints.map((val, idx) => getCoordinates(val, idx));
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  }, [chartPoints, minVal, maxVal]);

  const areaD = useMemo(() => {
    if (!pathD) return '';
    const lastCoord = getCoordinates(chartPoints[chartPoints.length - 1], chartPoints.length - 1);
    const firstCoord = getCoordinates(chartPoints[0], 0);
    return `${pathD} L ${lastCoord.x} ${svgHeight} L ${firstCoord.x} ${svgHeight} Z`;
  }, [pathD, chartPoints]);

  const liveCalculatedNetWorth = (liveDemoBalance ?? 50000) + floatingPnl;
  const activeHoverValue = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : liveCalculatedNetWorth;
  const activeHoverDate = hoveredPointIndex !== null ? currentChart.dates[hoveredPointIndex] : currentChart.dates[currentChart.dates.length - 1];

  // Handle Trade trigger: load asset into real-time live trading terminal
  const handleOpenTrade = (asset: AssetItem) => {
    if (onTrade) {
      onTrade(asset.symbol);
    }
  };

  // Handle Deposit trigger
  const handleOpenDeposit = (goal: GoalItem) => {
    setActiveDepositGoal(goal);
    setDepositAmount('100');
    setDepositModalOpen(true);
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDepositGoal) return;
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === activeDepositGoal.id) {
          return { ...g, current: Math.min(g.target, g.current + amt) };
        }
        return g;
      })
    );
    setDepositModalOpen(false);
  };

  // Mark payment completed
  const handleTogglePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          return {
            ...p,
            status: p.status === 'completed' ? 'pending' : 'completed',
          };
        }
        return p;
      })
    );
  };

  return (
    <div
      className={cn(
        'w-full max-w-7xl mx-auto space-y-6 text-zinc-100 selection:bg-lime-400 selection:text-zinc-950',
        className
      )}
    >
      {/* Top Header Card: Title, Subtitle, Timeframe Controls & Simulated Trading CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {title}
                <span className="text-xs px-2 py-0.5 rounded-md bg-lime-400/20 text-lime-300 border border-lime-400/30 font-medium">
                  SIMULATED
                </span>
              </h1>
              <p className="text-sm text-zinc-400">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
            {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  timeframe === tf
                    ? 'bg-lime-400 text-zinc-950 shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Quick Simulate Order Button */}
          <button
            onClick={() => handleOpenTrade(INITIAL_ASSETS[0])}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] active:scale-95"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Simulate Trade</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================== */}
        {/* Bento Cell 1: Portfolio Balance & Interactive Chart (8 Cols)   */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

          {/* Metric Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1">
                <Wallet className="w-4 h-4 text-lime-400" />
                <span>Simulated Portfolio Net Worth</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400">{activeHoverDate}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                ${activeHoverValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-semibold tabular-nums">
                <ArrowUpRight className="w-4 h-4" />
                <span>{currentChart.change}</span>
                <span>({currentChart.changePercent})</span>
              </div>
              <span className="text-xs text-zinc-500 font-medium">in {timeframe} timeframe</span>
            </div>
          </div>

          {/* Interactive SVG Area Chart */}
          <div className="w-full h-56 relative my-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="tradeXChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a3e635" stopOpacity="0.32" />
                  <stop offset="65%" stopColor="#a3e635" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0.2, 0.5, 0.8].map((ratio, i) => (
                <line
                  key={i}
                  x1={paddingX}
                  y1={svgHeight * ratio}
                  x2={svgWidth - paddingX}
                  y2={svgHeight * ratio}
                  stroke="#27272a"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Gradient Area */}
              <path d={areaD} fill="url(#tradeXChartGradient)" />

              {/* Main Line Stroke */}
              <path
                d={pathD}
                fill="none"
                stroke="#a3e635"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Points and Scrubber */}
              {chartPoints.map((val, idx) => {
                const coord = getCoordinates(val, idx);
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Invisible expanded touch target */}
                    <circle cx={coord.x} cy={coord.y} r="18" fill="transparent" />

                    {/* Active highlight marker */}
                    {isHovered && (
                      <>
                        <line
                          x1={coord.x}
                          y1={paddingY}
                          x2={coord.x}
                          y2={svgHeight}
                          stroke="#a3e635"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r="7"
                          fill="#a3e635"
                          className="animate-ping opacity-50"
                        />
                      </>
                    )}

                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={isHovered ? 5.5 : 3.5}
                      fill={isHovered ? '#ffffff' : '#a3e635'}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Date Axis Markers */}
          <div className="flex justify-between items-center text-xs text-zinc-500 pt-2 border-t border-zinc-800/80 font-mono">
            {currentChart.dates.map((d, i) => (
              <span key={i} className="hidden sm:inline-block">
                {d}
              </span>
            ))}
            <span className="sm:hidden">{currentChart.dates[0]}</span>
            <span className="sm:hidden">{currentChart.dates[currentChart.dates.length - 1]}</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bento Cell 2: Portfolio Allocation Donut & Mix (4 Cols)        */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-lime-400" />
              <h2 className="text-base font-semibold text-white">Asset Allocation</h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">4 Asset Classes</span>
          </div>

          {/* Interactive SVG Donut */}
          <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {(() => {
                let accumulatedPercent = 0;
                return ALLOCATION_CATEGORIES.map((cat, i) => {
                  const strokeDasharray = `${cat.percent} ${100 - cat.percent}`;
                  const strokeDashoffset = -accumulatedPercent;
                  accumulatedPercent += cat.percent;
                  const isSelected = selectedAllocation === cat.name;

                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth={isSelected ? '14' : '10'}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      pathLength="100"
                      className="cursor-pointer transition-all duration-200 hover:opacity-90"
                      onMouseEnter={() => setSelectedAllocation(cat.name)}
                      onMouseLeave={() => setSelectedAllocation(null)}
                    />
                  );
                });
              })()}
            </svg>

            {/* Inner Content of Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs text-zinc-400 font-medium">
                {selectedAllocation || 'Dominant'}
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {selectedAllocation
                  ? ALLOCATION_CATEGORIES.find((c) => c.name === selectedAllocation)?.percent + '%'
                  : '45% Tech'}
              </span>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-2.5 mt-2">
            {ALLOCATION_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setSelectedAllocation(cat.name)}
                onMouseLeave={() => setSelectedAllocation(null)}
                className={cn(
                  'p-2 rounded-xl transition-all cursor-pointer border border-transparent',
                  selectedAllocation === cat.name
                    ? 'bg-zinc-800/80 border-zinc-700'
                    : 'hover:bg-zinc-800/40'
                )}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-zinc-200">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-zinc-400">{cat.value}</span>
                    <span className="font-semibold text-white">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bento Cell 3: Cash Flow (Inflow vs Outflow) (4 Cols)           */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-lime-400" />
                <h2 className="text-base font-semibold text-white">Monthly Cash Flow</h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono">
                +47.0% Saved
              </span>
            </div>

            {/* Inflow / Outflow KPI badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                <span className="text-xs text-zinc-400 block mb-1">Oct Inflow</span>
                <span className="text-lg font-bold text-lime-400 font-mono tabular-nums">
                  +$5,450.00
                </span>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                <span className="text-xs text-zinc-400 block mb-1">Oct Outflow</span>
                <span className="text-lg font-bold text-zinc-200 font-mono tabular-nums">
                  -$2,890.00
                </span>
              </div>
            </div>

            {/* Monthly Trend Bars */}
            <div className="space-y-3">
              <div className="text-xs font-medium text-zinc-400 flex justify-between">
                <span>Month</span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-lime-400" /> Income
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" /> Expenses
                  </span>
                </span>
              </div>

              <div className="space-y-2.5">
                {MONTHLY_CASH_FLOW.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-mono text-zinc-400">{m.month}</span>
                    <div className="flex-1 space-y-1">
                      {/* Income Bar */}
                      <div className="w-full bg-zinc-800/70 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-lime-400 h-full rounded-full"
                          style={{ width: `${(m.income / 6000) * 100}%` }}
                        />
                      </div>
                      {/* Expense Bar */}
                      <div className="w-full bg-zinc-800/70 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-zinc-500 h-full rounded-full"
                          style={{ width: `${(m.expense / 6000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-zinc-300 w-16 text-right tabular-nums">
                      +${m.income - m.expense}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
            <span>Net Monthly Surplus</span>
            <span className="text-lime-400 font-bold font-mono">+$2,560.00</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bento Cell 4: Watchlist (Stocks & Crypto) (4 Cols)             */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-lime-400" />
                <h2 className="text-base font-semibold text-white">Market Watch</h2>
              </div>

              {/* Tabs */}
              <div className="flex items-center p-0.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                {(['all', 'stocks', 'crypto'] as AssetTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAssetTab(tab)}
                    className={cn(
                      'px-2 py-1 rounded capitalize transition-all',
                      assetTab === tab
                        ? 'bg-zinc-800 text-lime-400 font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Search ticker (e.g. NVDA, BTC)..."
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            {/* Assets List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredAssets.map((asset) => {
                const isPos = asset.change24h >= 0;
                return (
                  <div
                    key={asset.symbol}
                    className="p-2.5 rounded-xl bg-zinc-950/40 hover:bg-zinc-800/50 border border-zinc-800/50 hover:border-zinc-700/80 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800/90 flex items-center justify-center font-bold text-xs font-mono text-white group-hover:text-lime-400 transition-colors">
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white font-mono">
                            {asset.symbol}
                          </span>
                          <span className="text-[10px] px-1 rounded bg-zinc-800 text-zinc-400 uppercase font-mono">
                            {asset.type}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 truncate max-w-[90px] block">
                          {asset.name}
                        </span>
                      </div>
                    </div>

                    {/* Mini Sparkline SVG */}
                    <div className="w-14 h-5 hidden sm:block">
                      <svg viewBox="0 0 60 20" className="w-full h-full">
                        {(() => {
                          const pts = asset.sparkline;
                          const min = Math.min(...pts);
                          const max = Math.max(...pts);
                          const coords = pts.map((p, i) => {
                            const x = (i / (pts.length - 1)) * 58 + 1;
                            const y = 19 - ((p - min) / (max - min || 1)) * 16;
                            return `${x},${y}`;
                          });
                          return (
                            <polyline
                              fill="none"
                              stroke={isPos ? '#a3e635' : '#f87171'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={coords.join(' ')}
                            />
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center gap-2">
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-white tabular-nums">
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div
                          className={cn(
                            'text-[10px] font-semibold tabular-nums',
                            isPos ? 'text-lime-400' : 'text-red-400'
                          )}
                        >
                          {isPos ? '+' : ''}
                          {asset.change24h}%
                        </div>
                      </div>

                      {/* Trade simulator button */}
                      <button
                        onClick={() => handleOpenTrade(asset)}
                        className="px-2 py-1 rounded bg-lime-400/10 hover:bg-lime-400 hover:text-zinc-950 text-lime-400 text-[10px] font-bold border border-lime-400/20 transition-all opacity-80 group-hover:opacity-100"
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between items-center">
            <span>Virtual Execution Sandbox</span>
            <span className="text-lime-400 font-mono">Zero Slippage</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bento Cell 5: Upcoming Payments & Financial Goals (4 Cols)     */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800/80 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            {/* Upcoming Obligations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <h2 className="text-base font-semibold text-white">Upcoming Payments</h2>
                </div>
                <span className="text-xs text-zinc-400 font-mono">{payments.filter(p => p.status === 'pending').length} due</span>
              </div>

              <div className="space-y-2">
                {payments.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleTogglePayment(p.id)}
                    className={cn(
                      'p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer',
                      p.status === 'completed'
                        ? 'bg-zinc-950/20 border-zinc-800/40 opacity-50'
                        : 'bg-zinc-950/50 border-zinc-800/70 hover:border-zinc-700'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center border text-xs',
                          p.status === 'completed'
                            ? 'bg-lime-400/20 border-lime-400 text-lime-400'
                            : 'border-zinc-700 text-zinc-500'
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className={cn('text-xs font-semibold text-zinc-200', p.status === 'completed' && 'line-through')}>
                          {p.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                          <span>{p.dueDate}</span>
                          {p.autopay && (
                            <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400">
                              Autopay
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white tabular-nums">
                        ${p.amount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {p.status === 'completed' ? 'Paid' : `In ${p.daysRemaining}d`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Goals for Students / Learners */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-lime-400" />
                  <h2 className="text-base font-semibold text-white">Financial Milestones</h2>
                </div>
                <span className="text-xs text-lime-400 font-medium">Empower 15+</span>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => {
                  const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  return (
                    <div
                      key={goal.id}
                      className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-800/60 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-zinc-200 block">{goal.title}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            Target {goal.targetDate}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOpenDeposit(goal)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-lime-400 hover:text-zinc-950 text-zinc-300 hover:font-bold text-[10px] transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Deposit</span>
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: goal.color,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-zinc-400">
                          <span>
                            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                          <span className="font-bold text-white">{percent}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between items-center">
            <span>Automated Budget Guard</span>
            <span className="text-zinc-400 font-mono">Safe Harbor</span>
          </div>
        </div>
      </div>

      {/* Regulatory & Sample Data Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start sm:items-center gap-3 text-xs text-zinc-400">
        <ShieldAlert className="w-4 h-4 text-lime-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 leading-relaxed">
          <strong className="text-zinc-200 font-medium">TradeX Educational Environment: </strong>
          All market prices, portfolio balances, and asset analytics displayed are realistic simulated sample data. They are designed for financial literacy training, students aged 15+, and risk-free trading exploration. TradeX does not claim this represents live broker accounts or guaranteed returns.
        </div>
      </div>



      {/* ============================================================== */}
      {/* Interactive Goal Deposit Simulation Modal                      */}
      {/* ============================================================== */}
      {depositModalOpen && activeDepositGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Simulate Goal Contribution</h3>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-zinc-400">Target Goal:</p>
              <p className="text-sm font-semibold text-white">{activeDepositGoal.title}</p>
              <p className="text-xs font-mono text-zinc-500 mt-1">
                Current: ${activeDepositGoal.current.toLocaleString()} / ${activeDepositGoal.target.toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleExecuteDeposit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Simulated Contribution ($ USD)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                {[50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset.toString())}
                    className="flex-1 py-1 text-[11px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono"
                  >
                    +${preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-lime-400/20 active:scale-95"
                >
                  Add Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceBento;
