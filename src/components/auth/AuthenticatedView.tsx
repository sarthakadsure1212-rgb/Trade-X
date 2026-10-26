import React from 'react';
import { AuthUser } from './AuthCard';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { TradingProvider } from '../../context/TradingContext';
import { MobileShell } from '../mobile/MobileShell';

interface AuthenticatedViewProps {
  user: AuthUser;
  token?: string;
  onLogout: () => void;
}

export function AuthenticatedView({ user, token, onLogout }: AuthenticatedViewProps) {
  return (
    <CurrencyProvider userId={user.id}>
      <TradingProvider userId={user.id}>
        <MobileShell user={user} token={token} onLogout={onLogout} />
      </TradingProvider>
    </CurrencyProvider>
  );
}
