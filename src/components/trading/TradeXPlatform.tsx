import React from 'react';
import { AuthUser } from '../auth/AuthCard';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { TradingProvider } from '../../context/TradingContext';
import { MobileShell } from '../mobile/MobileShell';

export type MainNavTab = 'home' | 'markets' | 'trade' | 'orders' | 'profile' | 'chart' | 'simulator';

interface TradeXPlatformProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  token?: string;
  isStandalone?: boolean;
  initialTab?: MainNavTab;
}

export function TradeXPlatform({
  user,
  onLogout,
  token,
}: TradeXPlatformProps) {
  return (
    <CurrencyProvider userId={user?.id}>
      <TradingProvider userId={user?.id}>
        <MobileShell user={user} token={token} onLogout={onLogout} />
      </TradingProvider>
    </CurrencyProvider>
  );
}
