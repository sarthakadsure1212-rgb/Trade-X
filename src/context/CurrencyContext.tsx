import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketAsset } from '../data/globalMarkets';

export type SupportedCurrency = 'INR' | 'USD';

export interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  symbol: string;
  usdToInrRate: number;
  formatPrice: (val: number, customCurrency?: SupportedCurrency, decimals?: number) => string;
  formatValue: (val: number, decimals?: number) => string;
  formatCompact: (val: number) => string;
  convert: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
  getAssetDisplayPrice: (asset: MarketAsset) => number;
  getAssetDisplayPriceFormatted: (asset: MarketAsset) => string;
  exchangeRateInfo: {
    rate: number;
    text: string;
    lastUpdated: string;
  };
}

const USD_TO_INR = 83.40;

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: React.ReactNode;
  userId?: string | null;
}

export function CurrencyProvider({ children, userId }: CurrencyProviderProps) {
  const storageKey = `tradex_currency_${userId || 'guest'}`;

  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'INR' || saved === 'USD') return saved;
    } catch {
      // ignore
    }
    return 'INR';
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, currency);
    } catch {
      // ignore
    }
  }, [currency, storageKey]);

  const setCurrency = (next: SupportedCurrency) => {
    setCurrencyState(next);
  };

  const symbol = currency === 'INR' ? '₹' : '$';

  // Convert amount from one currency to another
  const convert = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    if (from === to) return amount;
    if (from === 'USD' && to === 'INR') {
      return amount * USD_TO_INR;
    }
    if (from === 'INR' && to === 'USD') {
      return amount / USD_TO_INR;
    }
    return amount;
  };

  // Convert asset price according to current active currency
  const getAssetDisplayPrice = (asset: MarketAsset): number => {
    const assetCurrency = (asset.currency || 'USD') as SupportedCurrency;
    if (currency === 'INR') {
      if (assetCurrency === 'INR') return asset.basePrice;
      if (assetCurrency === 'USD') return asset.basePrice * USD_TO_INR;
      // EUR/GBP fallbacks
      return asset.basePrice * 90.0;
    } else {
      // Active currency is USD
      if (assetCurrency === 'USD') return asset.basePrice;
      if (assetCurrency === 'INR') return asset.basePrice / USD_TO_INR;
      return asset.basePrice * 1.08;
    }
  };

  const formatPrice = (val: number, customCurrency?: SupportedCurrency, decimals?: number): string => {
    const cur = customCurrency || currency;
    const curSymbol = cur === 'INR' ? '₹' : '$';
    const dec = decimals !== undefined ? decimals : (Math.abs(val) < 10 ? 2 : 2);

    if (cur === 'INR') {
      // Indian numbering system
      const formatted = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(val);
      return `${curSymbol} ${formatted}`;
    } else {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(val);
      return `${curSymbol} ${formatted}`;
    }
  };

  const formatValue = (val: number, decimals: number = 2): string => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(val);
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const formatCompact = (val: number): string => {
    if (currency === 'INR') {
      if (Math.abs(val) >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
      if (Math.abs(val) >= 100000) return `${(val / 100000).toFixed(2)} L`;
      if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(1)}k`;
      return val.toFixed(2);
    }
    if (Math.abs(val) >= 1000000000) return `${(val / 1000000000).toFixed(2)}B`;
    if (Math.abs(val) >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
    if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toFixed(2);
  };

  const getAssetDisplayPriceFormatted = (asset: MarketAsset): string => {
    const price = getAssetDisplayPrice(asset);
    return formatPrice(price);
  };

  const exchangeRateInfo = {
    rate: USD_TO_INR,
    text: '1 USD = ₹83.40 (approx.)',
    lastUpdated: '10 Apr 2025, 09:30',
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        usdToInrRate: USD_TO_INR,
        formatPrice,
        formatValue,
        formatCompact,
        convert,
        getAssetDisplayPrice,
        getAssetDisplayPriceFormatted,
        exchangeRateInfo,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}
