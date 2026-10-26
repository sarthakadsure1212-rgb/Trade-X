import { CandleData } from '../data/globalMarkets';

export interface IndicatorPoint {
  time: number;
  value: number;
}

export interface BollingerPoint {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface MacdPoint {
  time: number;
  macd: number;
  signal: number;
  histogram: number;
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data: CandleData[], period: number): IndicatorPoint[] {
  const result: IndicatorPoint[] = [];
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) {
      sum -= data[i - period].close;
    }
    if (i >= period - 1) {
      result.push({
        time: data[i].time,
        value: parseFloat((sum / period).toFixed(2)),
      });
    }
  }
  return result;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data: CandleData[], period: number): IndicatorPoint[] {
  const result: IndicatorPoint[] = [];
  if (data.length < period) return result;

  const multiplier = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let prevEMA = sum / period;

  result.push({
    time: data[period - 1].time,
    value: parseFloat(prevEMA.toFixed(2)),
  });

  for (let i = period; i < data.length; i++) {
    const currentEMA = (data[i].close - prevEMA) * multiplier + prevEMA;
    result.push({
      time: data[i].time,
      value: parseFloat(currentEMA.toFixed(2)),
    });
    prevEMA = currentEMA;
  }
  return result;
}

/**
 * Bollinger Bands (Period: default 20, StdDev: default 2)
 */
export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerPoint[] {
  const result: BollingerPoint[] = [];
  if (data.length < period) return result;

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((acc, curr) => acc + curr.close, 0) / period;
    const variance =
      slice.reduce((acc, curr) => acc + Math.pow(curr.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    result.push({
      time: data[i].time,
      upper: parseFloat((mean + stdDevMultiplier * stdDev).toFixed(2)),
      middle: parseFloat(mean.toFixed(2)),
      lower: parseFloat((mean - stdDevMultiplier * stdDev).toFixed(2)),
    });
  }
  return result;
}

/**
 * Relative Strength Index (RSI) - Default 14 period
 */
export function calculateRSI(data: CandleData[], period: number = 14): IndicatorPoint[] {
  const result: IndicatorPoint[] = [];
  if (data.length <= period) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);

  result.push({
    time: data[period].time,
    value: parseFloat(rsi.toFixed(2)),
  });

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);

    result.push({
      time: data[i].time,
      value: parseFloat(rsi.toFixed(2)),
    });
  }

  return result;
}

/**
 * Moving Average Convergence Divergence (MACD)
 * Standard: Fast 12, Slow 26, Signal 9
 */
export function calculateMACD(
  data: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MacdPoint[] {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Match fast and slow by timestamp
  const fastMap = new Map(fastEMA.map((item) => [item.time, item.value]));
  const macdLinePoints: IndicatorPoint[] = [];

  for (const slow of slowEMA) {
    const fastVal = fastMap.get(slow.time);
    if (fastVal !== undefined) {
      macdLinePoints.push({
        time: slow.time,
        value: parseFloat((fastVal - slow.value).toFixed(2)),
      });
    }
  }

  if (macdLinePoints.length < signalPeriod) return [];

  // Calculate Signal line (EMA of MACD line)
  const multiplier = 2 / (signalPeriod + 1);
  let sum = 0;
  for (let i = 0; i < signalPeriod; i++) {
    sum += macdLinePoints[i].value;
  }
  let prevSignal = sum / signalPeriod;

  const result: MacdPoint[] = [
    {
      time: macdLinePoints[signalPeriod - 1].time,
      macd: macdLinePoints[signalPeriod - 1].value,
      signal: parseFloat(prevSignal.toFixed(2)),
      histogram: parseFloat((macdLinePoints[signalPeriod - 1].value - prevSignal).toFixed(2)),
    },
  ];

  for (let i = signalPeriod; i < macdLinePoints.length; i++) {
    const currMacd = macdLinePoints[i].value;
    const currentSignal = (currMacd - prevSignal) * multiplier + prevSignal;
    result.push({
      time: macdLinePoints[i].time,
      macd: currMacd,
      signal: parseFloat(currentSignal.toFixed(2)),
      histogram: parseFloat((currMacd - currentSignal).toFixed(2)),
    });
    prevSignal = currentSignal;
  }

  return result;
}
