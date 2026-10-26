import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Check,
  Loader2,
  Shield,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { TradeXLogo } from './TradeXLogo';
import { TermsModal } from './TermsModal';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'local' | 'google';
  createdAt: string;
  token?: string;
}

interface AuthCardProps {
  onAuthSuccess: (user: AuthUser, token: string) => void;
  initialMode?: 'login' | 'signup' | 'forgot-password';
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export function AuthCard({ onAuthSuccess, initialMode = 'login' }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Google Modal State
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleAccountName, setGoogleAccountName] = useState('');
  const [googleAccountEmail, setGoogleAccountEmail] = useState('');

  // Terms Modal State
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Status & Validation State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inline Validation Errors
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});
  };

  const switchMode = (newMode: AuthMode) => {
    clearMessages();
    setMode(newMode);
  };

  // Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: 'Weak', score: 1, color: 'bg-red-500' };
    if (score === 2) return { label: 'Fair', score: 2, color: 'bg-amber-500' };
    if (score === 3) return { label: 'Good', score: 3, color: 'bg-yellow-400' };
    return { label: 'Strong', score: 4, color: 'bg-lime-400' };
  };

  const passwordStrength = getPasswordStrength(signupPassword);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginEmail.trim()) {
      errors.loginEmail = 'Email is required';
    } else if (!emailRegex.test(loginEmail.trim())) {
      errors.loginEmail = 'Enter a valid email address';
    }

    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (supaErr) {
          throw new Error(supaErr.message || 'Supabase authentication failed.');
        }

        if (supaData.user) {
          const authUser: AuthUser = {
            id: supaData.user.id,
            name: supaData.user.user_metadata?.name || loginEmail.trim().split('@')[0],
            email: supaData.user.email || loginEmail.trim(),
            provider: 'local',
            createdAt: supaData.user.created_at,
          };
          setSuccessMessage('Supabase session verified! Entering TradeX...');
          setTimeout(() => {
            onAuthSuccess(authUser, supaData.session?.access_token || 'sb_token_' + Date.now());
          }, 500);
          return;
        }
      }

      // Local secure backend fallback
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      setSuccessMessage('Login verified successfully. Entering TradeX...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const errors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signupName.trim() || signupName.trim().length < 2) {
      errors.signupName = 'Full name is required (min 2 characters)';
    }

    if (!signupEmail.trim() || !emailRegex.test(signupEmail.trim())) {
      errors.signupEmail = 'Enter a valid email address';
    }

    if (!signupPassword || signupPassword.length < 8) {
      errors.signupPassword = 'Password must be at least 8 characters';
    }

    if (signupPassword !== signupConfirmPassword) {
      errors.signupConfirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      errors.terms = 'You must accept the Terms of Service & Privacy Policy';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data: supaData, error: supaErr } = await supabase.auth.signUp({
          email: signupEmail.trim(),
          password: signupPassword,
          options: {
            data: {
              name: signupName.trim(),
            },
          },
        });

        if (supaErr) {
          throw new Error(supaErr.message || 'Supabase registration failed.');
        }

        if (supaData.user) {
          const authUser: AuthUser = {
            id: supaData.user.id,
            name: signupName.trim(),
            email: supaData.user.email || signupEmail.trim(),
            provider: 'local',
            createdAt: supaData.user.created_at,
          };
          setSuccessMessage('Account registered in Supabase! Entering TradeX...');
          setTimeout(() => {
            onAuthSuccess(authUser, supaData.session?.access_token || 'sb_token_' + Date.now());
          }, 600);
          return;
        }
      }

      // Local secure backend fallback
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
          termsAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please check your information.');
      }

      setSuccessMessage('TradeX Account created successfully! Initializing session...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process registration at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth Submit
  const handleGoogleAuthExecute = async () => {
    setIsLoading(true);
    setGooglePromptOpen(false);
    clearMessages();

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleAccountName.trim() || 'Trader',
          email: googleAccountEmail.trim() || 'trader@tradex.platform',
          googleId: 'g_' + Math.random().toString(36).substring(2, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google authentication rejected.');
      }

      setSuccessMessage('Google Account authenticated with TradeX.');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail.trim() || !emailRegex.test(forgotEmail.trim())) {
      setFieldErrors({ forgotEmail: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error: supaErr } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (supaErr) {
          throw new Error(supaErr.message);
        }

        setForgotSubmitted(true);
        setSuccessMessage(`Password recovery link dispatched to ${forgotEmail.trim()} via Supabase.`);
        return;
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not verify recovery request.');
      }

      setForgotSubmitted(true);
      setSuccessMessage(data.message || 'Recovery email dispatched.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Account recovery error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[440px] mx-auto">
        {/* The Card Box matching screenshot */}
        <div className="relative rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 bg-[#0b0f0d]/90 border border-zinc-800/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(163,230,53,0.06)] overflow-hidden">
          {/* Subtle Top Ambient Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-36 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo & Currency Switcher matching Screenshot 2 */}
          <div className="flex items-center justify-between mb-6">
            <TradeXLogo size="md" />

            {/* Currency Pill */}
            <div className="flex items-center bg-[#111913] border border-[#213224] p-0.5 rounded-full text-[11px] font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-lime-400 text-black font-bold shadow-sm">
                ₹ INR
              </span>
              <span className="px-2 py-0.5 text-zinc-400">
                USD
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW 1: LOGIN                                                  */}
          {/* ============================================================== */}
          {mode === 'login' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header (Screen 2) */}
              <div className="text-left space-y-1">
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Log in to your global markets dashboard.
                </p>
              </div>

              {/* Alert Feedback Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (fieldErrors.loginEmail) setFieldErrors((prev) => ({ ...prev, loginEmail: '' }));
                      }}
                      placeholder="you@example.com"
                      error={Boolean(fieldErrors.loginEmail)}
                      className="pl-10 pr-4"
                    />
                  </div>
                  {fieldErrors.loginEmail && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.loginEmail}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (fieldErrors.loginPassword) setFieldErrors((prev) => ({ ...prev, loginPassword: '' }));
                      }}
                      placeholder="Enter your password"
                      error={Boolean(fieldErrors.loginPassword)}
                      className="pl-10 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.loginPassword && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.loginPassword}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end pt-0.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Primary Action Button: Log In */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="neon"
                  className="w-full mt-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-[#0b0f0d] px-3 text-zinc-500">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setGooglePromptOpen(true)}
                disabled={isLoading}
                className="w-full h-12 gap-2.5 font-medium text-xs sm:text-sm"
              >
                {/* Official Google 'G' Multi-Color Icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              {/* Bottom Switch: Don't have an account? Sign Up */}
              <div className="text-center text-xs text-zinc-400 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: SIGN UP                                                */}
          {/* ============================================================== */}
          {mode === 'signup' && (
            <div className="space-y-5 animate-fade-in">
              {/* Header (Screen 3) */}
              <div className="text-left space-y-1">
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">
                  Create Your TradeX Account
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Your global markets journey starts here.
                </p>
              </div>

              {/* Alert Feedback Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-lime-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <Label htmlFor="signup-name">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        if (fieldErrors.signupName) setFieldErrors((prev) => ({ ...prev, signupName: '' }));
                      }}
                      placeholder="Enter your legal full name"
                      error={Boolean(fieldErrors.signupName)}
                      className="pl-10 pr-4 h-11"
                    />
                  </div>
                  {fieldErrors.signupName && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.signupName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <Label htmlFor="signup-email">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (fieldErrors.signupEmail) setFieldErrors((prev) => ({ ...prev, signupEmail: '' }));
                      }}
                      placeholder="you@example.com"
                      error={Boolean(fieldErrors.signupEmail)}
                      className="pl-10 pr-4 h-11"
                    />
                  </div>
                  {fieldErrors.signupEmail && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.signupEmail}</p>
                  )}
                </div>

                {/* Password & Strength Indicator */}
                <div className="space-y-1">
                  <Label htmlFor="signup-password">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (fieldErrors.signupPassword) setFieldErrors((prev) => ({ ...prev, signupPassword: '' }));
                      }}
                      placeholder="Create a strong password"
                      error={Boolean(fieldErrors.signupPassword)}
                      className="pl-10 pr-11 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {signupPassword && (
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">Strength:</span>
                        <span className={passwordStrength.score >= 3 ? 'text-lime-400 font-bold' : 'text-amber-400'}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1">
                        {[1, 2, 3, 4].map((seg) => (
                          <div
                            key={seg}
                            className={`rounded-full transition-all ${
                              seg <= passwordStrength.score ? passwordStrength.color : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {fieldErrors.signupPassword && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.signupPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      id="signup-confirm-password"
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        if (fieldErrors.signupConfirmPassword) setFieldErrors((prev) => ({ ...prev, signupConfirmPassword: '' }));
                      }}
                      placeholder="Confirm your password"
                      error={Boolean(fieldErrors.signupConfirmPassword)}
                      className="pl-10 pr-11 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      title={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.signupConfirmPassword && (
                    <p className="text-[11px] text-red-400 pl-1">{fieldErrors.signupConfirmPassword}</p>
                  )}
                </div>

                {/* Terms of Service & Privacy Checkbox */}
                <div className="pt-1">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => {
                        setTermsAccepted(checked);
                        if (fieldErrors.terms) setFieldErrors((prev) => ({ ...prev, terms: '' }));
                      }}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-xs text-zinc-400 leading-snug cursor-pointer select-none">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setTermsModalOpen(true);
                        }}
                        className="text-lime-400 hover:text-lime-300 underline font-medium"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setTermsModalOpen(true);
                        }}
                        className="text-lime-400 hover:text-lime-300 underline font-medium"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  {fieldErrors.terms && (
                    <p className="text-[11px] text-red-400 pl-6 mt-1">{fieldErrors.terms}</p>
                  )}
                </div>

                {/* Primary Action Button: Create Account */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="neon"
                  className="w-full mt-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-[#0b0f0d] px-3 text-zinc-500">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Google Sign-Up Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setGooglePromptOpen(true)}
                disabled={isLoading}
                className="w-full h-12 gap-2.5 font-medium text-xs sm:text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign up with Google</span>
              </Button>

              {/* Bottom Switch: Already have an account? Log In */}
              <div className="text-center text-xs text-zinc-400 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 3: FORGOT PASSWORD                                        */}
          {/* ============================================================== */}
          {mode === 'forgot-password' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-left space-y-1">
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">
                  Forgot Password?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                  Enter your email and we'll send you a reset link if your account exists.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-lime-400" />
                  <div className="leading-relaxed">{successMessage}</div>
                </div>
              )}

              {!forgotSubmitted ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-zinc-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (fieldErrors.forgotEmail) setFieldErrors({});
                        }}
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border ${
                          fieldErrors.forgotEmail ? 'border-red-500' : 'border-zinc-800 focus:border-lime-400'
                        } text-white placeholder-zinc-500 text-sm focus:outline-none transition-all`}
                      />
                    </div>
                    {fieldErrors.forgotEmail && (
                      <p className="text-[11px] text-red-400 pl-1">{fieldErrors.forgotEmail}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 active:scale-[0.99] text-zinc-950 font-extrabold text-sm transition-all cursor-pointer shadow-[0_0_25px_rgba(163,230,53,0.35)] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="pt-2 text-center space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Check your email inbox or spam folder for the TradeX security reset link.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setForgotEmail('');
                    }}
                    className="text-xs text-lime-400 hover:underline"
                  >
                    Send to a different email
                  </button>
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Card Accent Line with Ambient Glow matching screenshot */}
          <div className="mt-8 pt-4 relative">
            {/* Glowing horizontal line */}
            <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-2 bg-lime-400/30 blur-sm rounded-full pointer-events-none" />

            {/* Bottom Caption matching screenshot */}
            <div className="text-center pt-3 text-[11px] text-zinc-500 font-medium tracking-wide">
              TradeX — Your Gateway to Global Markets
            </div>
          </div>
        </div>
      </div>

      {/* Google Sign In Account Selection Modal */}
      {googlePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl space-y-4 text-zinc-100">
            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-white">Sign in with Google</h4>
                <p className="text-[11px] text-zinc-400">Choose an account to continue to TradeX</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={googleAccountName}
                  onChange={(e) => setGoogleAccountName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Google Email</label>
                <input
                  type="email"
                  placeholder="e.g. alex.morgan@gmail.com"
                  value={googleAccountEmail}
                  onChange={(e) => setGoogleAccountEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setGooglePromptOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoogleAuthExecute}
                className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Authenticate Google ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={() => setTermsAccepted(true)}
      />
    </>
  );
}
