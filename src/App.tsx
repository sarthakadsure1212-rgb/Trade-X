import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GlobalMarketsHero } from './components/auth/GlobalMarketsHero';
import { AuthCard, AuthUser } from './components/auth/AuthCard';
import { AuthenticatedView } from './components/auth/AuthenticatedView';
import { TradeXLogo } from './components/auth/TradeXLogo';
import { TradeXPlatform } from './components/trading/TradeXPlatform';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { TrendingUp, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';

interface MainAuthLayoutProps {
  initialMode?: 'login' | 'signup' | 'forgot-password';
}

function MainAuthView({ initialMode = 'login' }: MainAuthLayoutProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isVerifyingSession, setIsVerifyingSession] = useState<boolean>(true);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: supaSession } = await supabase.auth.getSession();
          if (supaSession?.session?.user) {
            const sbUser = supaSession.session.user;
            setCurrentUser({
              id: sbUser.id,
              name: sbUser.user_metadata?.name || (sbUser.email ? sbUser.email.split('@')[0] : 'Trader'),
              email: sbUser.email || 'trader@tradex.platform',
              provider: 'local',
              createdAt: sbUser.created_at,
            });
            setSessionToken(supaSession.session.access_token);
            setIsVerifyingSession(false);
            return;
          }
        }

        const storedToken = localStorage.getItem('tradex_auth_token');
        if (!storedToken) {
          setIsVerifyingSession(false);
          return;
        }

        const res = await fetch('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            setSessionToken(storedToken);
          } else {
            localStorage.removeItem('tradex_auth_token');
          }
        } else {
          localStorage.removeItem('tradex_auth_token');
        }
      } catch (err) {
        console.warn('Session verification check failed:', err);
      } finally {
        setIsVerifyingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (user: AuthUser, token: string) => {
    setCurrentUser(user);
    setSessionToken(token);
    localStorage.setItem('tradex_auth_token', token);
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (err) {
      console.warn('Logout network notice:', err);
    } finally {
      setCurrentUser(null);
      setSessionToken(null);
      localStorage.removeItem('tradex_auth_token');
    }
  };

  // If user is already authenticated, show the full-screen TradeX Platform
  if (currentUser) {
    return (
      <AuthenticatedView
        user={currentUser}
        token={sessionToken || undefined}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060907] text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-x-hidden relative">
      {/* Background Ambient Radial Highlights */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-lime-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/60 pointer-events-none" />



      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {isVerifyingSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
            <TradeXLogo size="lg" />
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>Verifying TradeX secure session...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-8">
            {/* Left Column: Visual Showcase & Brand Messaging (Visible on Desktop) */}
            <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-center">
              <GlobalMarketsHero />
            </div>

            {/* Right Column / Mobile Center: Authentication Card (Login / Sign Up / Forgot Password) */}
            <div className="w-full lg:col-span-5 xl:col-span-5 flex items-center justify-center">
              <AuthCard onAuthSuccess={handleAuthSuccess} initialMode={initialMode} />
            </div>
          </div>
        )}
      </main>

      {/* Subtle Platform Footer */}
      <footer className="relative z-10 py-4 px-6 border-t border-zinc-900/60 bg-[#060907]/90 text-[11px] text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">TradeX Global Markets</span>
            <span>·</span>
            <span>Multi-Exchange Financial Architecture & Demo Terminal</span>
          </div>
          <div className="text-zinc-600">
            Encrypted SHA-512 & AES-256 Authentication Security
          </div>
        </div>
      </footer>
    </div>
  );
}

// Protected Chart Route Component
function ProtectedTradeRoute({ defaultTab = 'chart' }: { defaultTab?: 'chart' | 'simulator' }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'simulator' || defaultTab === 'simulator' ? 'simulator' : 'chart';

  useEffect(() => {
    const verify = async () => {
      try {
        const storedToken = localStorage.getItem('tradex_auth_token');
        if (!storedToken) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            setSessionToken(storedToken);
          } else {
            localStorage.removeItem('tradex_auth_token');
          }
        } else {
          localStorage.removeItem('tradex_auth_token');
        }
      } catch (e) {
        console.warn('Session check failed:', e);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const handleLogout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionToken}` },
        });
      }
    } finally {
      localStorage.removeItem('tradex_auth_token');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#060907] flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>Loading TradeX Engine...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to login page to enforce protection
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TradeXPlatform
      user={currentUser}
      token={sessionToken || undefined}
      onLogout={handleLogout}
      initialTab={initialTab}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainAuthView initialMode="login" />} />
        <Route path="/login" element={<MainAuthView initialMode="login" />} />
        <Route path="/signup" element={<MainAuthView initialMode="signup" />} />
        <Route path="/trade" element={<ProtectedTradeRoute defaultTab="chart" />} />
        <Route path="/simulator" element={<ProtectedTradeRoute defaultTab="simulator" />} />
        <Route path="/demo" element={<ProtectedTradeRoute defaultTab="simulator" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

