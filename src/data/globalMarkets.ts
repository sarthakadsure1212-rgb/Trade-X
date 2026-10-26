export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'India' | 'USA' | 'Europe' | 'Crypto';
  exchange: string;
  currency: string;
  currencySymbol: string;
  basePrice: number;
  change24h: number; // percentage
  volume: string;
  marketCap: string;
  high52w: number;
  low52w: number;
  timezone: string;
  openTimeUtc: string; // e.g. "03:45"
  closeTimeUtc: string; // e.g. "10:00"
  dataSource: string;
  description: string;
}

export const GLOBAL_MARKETS: MarketAsset[] = [
  // INDIA: NSE / BSE
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50 Index',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 24862.45,
    change24h: 0.84,
    volume: '284.5M',
    marketCap: '₹182.4T',
    high52w: 26277.35,
    low52w: 18837.85,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'National Stock Exchange of India (Delayed 15s Feed)',
    description: 'Benchmark Indian stock market index representing the weighted average of 50 of the largest Indian companies.',
  },
  {
    symbol: 'SENSEX',
    name: 'BSE SENSEX 30',
    category: 'India',
    exchange: 'BSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 81381.36,
    change24h: 0.72,
    volume: '19.8M',
    marketCap: '₹144.2T',
    high52w: 85978.25,
    low52w: 63583.07,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'Bombay Stock Exchange (Official Market Feed)',
    description: 'Free-float market-weighted stock market index of 30 well-established and financially sound companies on the BSE.',
  },
  {
    symbol: 'BANKNIFTY',
    name: 'NIFTY Bank Index',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 51280.90,
    change24h: 1.15,
    volume: '142.1M',
    marketCap: '₹58.6T',
    high52w: 54467.35,
    low52w: 42105.40,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Bank Sector Consolidated Feed',
    description: 'Index of 12 most liquid and large capitalised banking stocks traded on the National Stock Exchange of India.',
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 2984.75,
    change24h: 1.42,
    volume: '11.4M',
    marketCap: '₹20.1T',
    high52w: 3217.90,
    low52w: 2221.05,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: 'Indian multinational conglomerate headquartered in Mumbai spanning energy, petrochemicals, retail, and telecommunications.',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 4125.30,
    change24h: -0.38,
    volume: '3.2M',
    marketCap: '₹14.9T',
    high52w: 4585.90,
    low52w: 3313.00,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: 'Global IT services, consulting and business solutions leader operating across 55 countries.',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 1684.20,
    change24h: 0.95,
    volume: '18.7M',
    marketCap: '₹12.8T',
    high52w: 1794.00,
    low52w: 1363.45,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: "India's largest private sector bank by assets and market capitalization.",
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 1912.80,
    change24h: 1.08,
    volume: '8.4M',
    marketCap: '₹7.9T',
    high52w: 1991.45,
    low52w: 1358.35,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: 'Next-generation digital services and enterprise consulting powerhouse.',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 1245.30,
    change24h: 0.62,
    volume: '14.2M',
    marketCap: '₹8.7T',
    high52w: 1332.00,
    low52w: 915.20,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: 'Leading private sector bank offering diverse financial services and digital banking across India.',
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    category: 'India',
    exchange: 'NSE India',
    currency: 'INR',
    currencySymbol: '₹',
    basePrice: 874.50,
    change24h: 1.85,
    volume: '16.8M',
    marketCap: '₹3.2T',
    high52w: 1179.00,
    low52w: 621.00,
    timezone: 'Asia/Kolkata',
    openTimeUtc: '03:45',
    closeTimeUtc: '10:00',
    dataSource: 'NSE Equities Feed',
    description: 'Pioneering automotive manufacturer producing commercial, passenger, and electric vehicles globally.',
  },

  // USA: S&P 500, NASDAQ, DOW & MEGA CAPS
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    category: 'USA',
    exchange: 'Cboe / NYSE',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 5864.67,
    change24h: 0.45,
    volume: '3.8B',
    marketCap: '$46.8T',
    high52w: 5920.40,
    low52w: 4103.78,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'Standard & Poor’s / Cboe Consolidated Real-Time Feed',
    description: 'Market-capitalization-weighted index of 500 leading publicly traded companies in the United States.',
  },
  {
    symbol: 'NDX',
    name: 'NASDAQ 100 Index',
    category: 'USA',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 20385.12,
    change24h: 0.88,
    volume: '4.9B',
    marketCap: '$23.4T',
    high52w: 20690.97,
    low52w: 14058.31,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'NASDAQ Global Index Feed (GIDS)',
    description: '100 of the largest non-financial domestic and international companies listed on The Nasdaq Stock Market.',
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    category: 'USA',
    exchange: 'NYSE',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 42863.86,
    change24h: 0.28,
    volume: '360.5M',
    marketCap: '$13.2T',
    high52w: 43325.09,
    low52w: 32417.59,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'Dow Jones Market Data Feed',
    description: 'Price-weighted measure of 30 significant US stocks traded on the New York Stock Exchange and Nasdaq.',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'USA',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 141.54,
    change24h: 2.34,
    volume: '56.3M',
    marketCap: '$3.47T',
    high52w: 144.42,
    low52w: 39.23,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'NASDAQ Real-Time Quotes',
    description: 'World leader in accelerated computing and artificial intelligence GPU architectures.',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'USA',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 232.15,
    change24h: -0.22,
    volume: '48.1M',
    marketCap: '$3.52T',
    high52w: 237.23,
    low52w: 164.08,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'NASDAQ Real-Time Quotes',
    description: 'Global tech titan delivering iPhones, Macs, iPads, wearables, and enterprise subscription services.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'USA',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 428.60,
    change24h: 0.61,
    volume: '21.5M',
    marketCap: '$3.18T',
    high52w: 468.35,
    low52w: 327.00,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'NASDAQ Real-Time Quotes',
    description: 'Global cloud software infrastructure, Azure, Windows, and enterprise AI pioneer.',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'USA',
    exchange: 'NASDAQ',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 218.85,
    change24h: -1.35,
    volume: '78.9M',
    marketCap: '$698.4B',
    high52w: 271.00,
    low52w: 138.80,
    timezone: 'America/New_York',
    openTimeUtc: '13:30',
    closeTimeUtc: '20:00',
    dataSource: 'NASDAQ Real-Time Quotes',
    description: 'Electric vehicles, solar generation, energy storage systems, and autonomous robotics.',
  },

  // EUROPE: FTSE 100, DAX 40, CAC 40, STOXX 600
  {
    symbol: 'FTSE',
    name: 'FTSE 100 Index',
    category: 'Europe',
    exchange: 'London Stock Exchange',
    currency: 'GBP',
    currencySymbol: '£',
    basePrice: 8247.16,
    change24h: 0.38,
    volume: '640.2M',
    marketCap: '£2.1T',
    high52w: 8474.41,
    low52w: 7302.21,
    timezone: 'Europe/London',
    openTimeUtc: '08:00',
    closeTimeUtc: '16:30',
    dataSource: 'London Stock Exchange InfoFeed',
    description: 'Share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization.',
  },
  {
    symbol: 'DAX',
    name: 'DAX 40 Index',
    category: 'Europe',
    exchange: 'Deutsche Börse (Xetra)',
    currency: 'EUR',
    currencySymbol: '€',
    basePrice: 19485.40,
    change24h: 0.52,
    volume: '78.4M',
    marketCap: '€1.8T',
    high52w: 19674.68,
    low52w: 14630.21,
    timezone: 'Europe/Berlin',
    openTimeUtc: '07:00',
    closeTimeUtc: '15:30',
    dataSource: 'Deutsche Börse Xetra Feed',
    description: 'Blue chip stock market index consisting of 40 major German companies trading on the Frankfurt Stock Exchange.',
  },
  {
    symbol: 'CAC40',
    name: 'CAC 40 Index',
    category: 'Europe',
    exchange: 'Euronext Paris',
    currency: 'EUR',
    currencySymbol: '€',
    basePrice: 7522.65,
    change24h: 0.18,
    volume: '65.1M',
    marketCap: '€2.3T',
    high52w: 8259.19,
    low52w: 6773.84,
    timezone: 'Europe/Paris',
    openTimeUtc: '07:00',
    closeTimeUtc: '15:30',
    dataSource: 'Euronext Market Data Feed',
    description: 'Benchmark French stock market index representing the 40 most significant values among the 100 largest market caps on Euronext Paris.',
  },
  {
    symbol: 'STOXX600',
    name: 'STOXX Europe 600',
    category: 'Europe',
    exchange: 'Euronext / Deutsche Börse',
    currency: 'EUR',
    currencySymbol: '€',
    basePrice: 521.80,
    change24h: 0.41,
    volume: '210.8M',
    marketCap: '€14.1T',
    high52w: 528.64,
    low52w: 428.18,
    timezone: 'Europe/Berlin',
    openTimeUtc: '07:00',
    closeTimeUtc: '15:30',
    dataSource: 'STOXX Consolidated Index Data',
    description: 'Broad benchmark comprising 600 large, mid and small capitalization companies across 17 European countries.',
  },
  {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    category: 'Europe',
    exchange: 'Euronext Amsterdam',
    currency: 'EUR',
    currencySymbol: '€',
    basePrice: 664.20,
    change24h: -1.85,
    volume: '2.1M',
    marketCap: '€262.4B',
    high52w: 1021.80,
    low52w: 535.10,
    timezone: 'Europe/Amsterdam',
    openTimeUtc: '07:00',
    closeTimeUtc: '15:30',
    dataSource: 'Euronext Amsterdam Market Feed',
    description: 'Sole global producer of Extreme Ultraviolet (EUV) photolithography machines critical for advanced semiconductor manufacturing.',
  },

  // CRYPTO & GLOBAL FX
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    category: 'Crypto',
    exchange: 'TradeX Global Liquidity',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 68450.00,
    change24h: 2.15,
    volume: '$38.2B',
    marketCap: '$1.35T',
    high52w: 73750.00,
    low52w: 34120.00,
    timezone: 'UTC',
    openTimeUtc: '00:00',
    closeTimeUtc: '24:00',
    dataSource: 'Aggregated Global Spot Liquidity (24/7/365)',
    description: 'Decentralized digital currency pioneer providing algorithmic peer-to-peer store of value.',
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    category: 'Crypto',
    exchange: 'TradeX Global Liquidity',
    currency: 'USD',
    currencySymbol: '$',
    basePrice: 2685.50,
    change24h: 1.82,
    volume: '$16.4B',
    marketCap: '$323.5B',
    high52w: 4092.20,
    low52w: 1520.40,
    timezone: 'UTC',
    openTimeUtc: '00:00',
    closeTimeUtc: '24:00',
    dataSource: 'Aggregated Global Spot Liquidity (24/7/365)',
    description: 'Decentralized open-source blockchain featuring smart contract functionality and proof-of-stake consensus.',
  },
];

export type TimeframeKey = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M';

export interface TimeframeConfig {
  key: TimeframeKey;
  label: string;
  seconds: number;
  candlesCount: number;
}

export const TIMEFRAMES: TimeframeConfig[] = [
  { key: '1m', label: '1m', seconds: 60, candlesCount: 150 },
  { key: '5m', label: '5m', seconds: 300, candlesCount: 150 },
  { key: '15m', label: '15m', seconds: 900, candlesCount: 150 },
  { key: '30m', label: '30m', seconds: 1800, candlesCount: 150 },
  { key: '1h', label: '1h', seconds: 3600, candlesCount: 180 },
  { key: '4h', label: '4h', seconds: 14400, candlesCount: 180 },
  { key: '1D', label: '1D', seconds: 86400, candlesCount: 220 },
  { key: '1W', label: '1W', seconds: 604800, candlesCount: 160 },
  { key: '1M', label: '1M', seconds: 2592000, candlesCount: 120 },
];

export interface CandleData {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Deterministic pseudo-random historical OHLC generator with realistic volatility,
 * trends, wicks, and volume surges.
 */
export function generateCandleHistory(
  basePrice: number,
  timeframe: TimeframeKey,
  seedKey: string
): CandleData[] {
  const tf = TIMEFRAMES.find((t) => t.key === timeframe) || TIMEFRAMES[6];
  const count = tf.candlesCount;
  const intervalSeconds = tf.seconds;

  // Derive pseudo-random seed from string
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) & 0xffffffff;
  }
  const random = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  const candles: CandleData[] = [];
  const now = Math.floor(Date.now() / 1000);
  const startTime = now - count * intervalSeconds;

  let currentPrice = basePrice * (0.88 + random() * 0.12);
  const volatility = 0.0035 * Math.sqrt(intervalSeconds / 60);

  for (let i = 0; i < count; i++) {
    const candleTime = startTime + i * intervalSeconds;

    // Trending component + cyclical wave
    const trendDrift = (basePrice - currentPrice) * 0.015;
    const cyclical = Math.sin(i / 14) * currentPrice * 0.002;
    const delta = (random() - 0.485) * currentPrice * volatility + trendDrift + cyclical;

    const open = currentPrice;
    const close = Math.max(open + delta, 0.01);
    const wickHighDelta = random() * currentPrice * volatility * 1.4;
    const wickLowDelta = random() * currentPrice * volatility * 1.4;
    const high = Math.max(open, close) + wickHighDelta;
    const low = Math.max(Math.min(open, close) - wickLowDelta, 0.001);

    const baseVol = 1000 + random() * 4000;
    const volatilityMultiplier = 1 + Math.abs(close - open) / (open * 0.002);
    const volume = Math.round(baseVol * volatilityMultiplier);

    candles.push({
      time: candleTime,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  // Adjust last candle to closely match basePrice
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

/**
 * Checks whether the exchange for the given asset is currently open based on UTC time.
 */
export function isMarketOpen(asset: MarketAsset): {
  isOpen: boolean;
  statusText: string;
  nextEvent: string;
} {
  if (asset.category === 'Crypto') {
    return {
      isOpen: true,
      statusText: '24/7 OPEN',
      nextEvent: 'Continuous Trading',
    };
  }

  const now = new Date();
  const day = now.getUTCDay(); // 0 is Sunday, 6 is Saturday

  // Weekend check
  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      statusText: 'WEEKEND CLOSED',
      nextEvent: 'Opens Monday',
    };
  }

  const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const [openH, openM] = asset.openTimeUtc.split(':').map(Number);
  const [closeH, closeM] = asset.closeTimeUtc.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const remainingMins = closeMinutes - currentMinutes;
    const h = Math.floor(remainingMins / 60);
    const m = remainingMins % 60;
    return {
      isOpen: true,
      statusText: 'MARKET OPEN',
      nextEvent: `Closes in ${h}h ${m}m`,
    };
  } else {
    return {
      isOpen: false,
      statusText: 'MARKET CLOSED',
      nextEvent: 'Pre-Market / Off-Hours',
    };
  }
}
