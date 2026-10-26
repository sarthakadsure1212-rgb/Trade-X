import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useEffect(() => {
    let active = true;

    // In demo mode when keys are not yet configured, allow user to test the UI directly
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }

    // Check if an existing session or recovery hash exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session) {
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (
        event === "PASSWORD_RECOVERY" ||
        (event === "INITIAL_SESSION" && session) ||
        (event === "SIGNED_IN" && session)
      ) {
        setReady(true);
      }
    });

    // Fallback: If URL contains recovery access_token or token type in hash
    if (window.location.hash.includes("type=recovery") || window.location.search.includes("code=")) {
      setReady(true);
    }

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Demo mode simulation
        await new Promise((resolve) => setTimeout(resolve, 800));
        setPasswordUpdated(true);
        setMessage("Password updated successfully! (Demo simulated update)");
      } else {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        setPasswordUpdated(true);
        setMessage("Your password has been updated successfully. You can now log in.");
      }
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err?.message || "Failed to update password. Your recovery link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  // Password strength helper
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    if (score === 2) return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
    if (score === 3) return { label: "Good", color: "bg-yellow-400", text: "text-yellow-400" };
    return { label: "Strong", color: "bg-lime-400", text: "text-lime-400 font-bold" };
  };

  const strength = getStrength(password);

  return (
    <main className="min-h-screen bg-[#070B09] text-white flex items-center justify-center p-4 sm:p-6 relative selection:bg-lime-400 selection:text-black font-sans">
      <div className="fixed top-0 left-1/4 w-[480px] h-[480px] bg-lime-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[480px] h-[480px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      <section className="relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0D1410] p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(163,230,53,0.06)] backdrop-blur-xl">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-28 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
            Trade<span className="text-lime-400">X</span>
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-[10px] font-mono text-lime-300">
            <ShieldCheck className="w-3 h-3 text-lime-400" />
            <span>Secure Recovery</span>
          </div>
        </div>

        <div className="mt-7">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/25 flex items-center justify-center text-lime-400 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Set New Password</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
            Choose a strong, secure password to protect your TradeX account and market portfolio.
          </p>
        </div>

        {!ready ? (
          <div className="mt-8 p-6 rounded-2xl bg-zinc-900/60 border border-white/10 text-center space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-lime-400 mx-auto" />
            <p className="text-xs text-zinc-400">
              Verifying your secure password recovery session...
            </p>
            <p className="text-[11px] text-zinc-500">
              If this window remains indefinitely, your recovery link may have expired.{" "}
              <Link to="/forgot-password" className="text-lime-400 hover:underline">
                Request a new link
              </Link>
            </p>
          </div>
        ) : passwordUpdated ? (
          <div className="mt-7 space-y-5 animate-fade-in">
            <div className="p-4 rounded-xl bg-lime-400/10 border border-lime-400/30 text-lime-300 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-white mb-1">Password Updated!</div>
                <div className="leading-relaxed">{message}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-white/15 bg-[#111A15] text-white placeholder-zinc-500 text-sm outline-none transition-all focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Security rating:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`rounded-full transition-all ${
                          seg <= (password.length >= 8 ? (/[A-Z]/.test(password) ? 3 : 2) : 1)
                            ? strength.color
                            : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-white/15 bg-[#111A15] text-white placeholder-zinc-500 text-sm outline-none transition-all focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-lime-400 py-3.5 font-bold text-black transition-all hover:bg-lime-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 text-center text-xs text-gray-400">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-lime-400 hover:underline">
            Log In
          </Link>
        </div>
      </section>
    </main>
  );
}
