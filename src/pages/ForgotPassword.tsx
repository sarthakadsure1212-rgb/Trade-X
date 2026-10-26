import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShieldCheck, KeyRound } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!isSupabaseConfigured) {
        // Safe simulated flow if environment keys haven't been populated yet
        await new Promise((resolve) => setTimeout(resolve, 800));
        setMessage(
          "If an account exists for that email, a password reset link will be sent. Please check your inbox and spam folder. (Demo mode: Connect your Supabase keys in .env to deliver real emails)"
        );
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (resetError) throw resetError;

        setMessage(
          "If an account exists for that email, a password reset link will be sent. Please check your inbox and spam folder."
        );
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(
        err?.message || "We couldn't process your request right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B09] text-white flex items-center justify-center p-4 sm:p-6 relative selection:bg-lime-400 selection:text-black font-sans">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[480px] h-[480px] bg-lime-500/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[480px] h-[480px] bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      <section className="relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0D1410] p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(163,230,53,0.06)] backdrop-blur-xl">
        {/* Glow accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-28 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
            Trade<span className="text-lime-400">X</span>
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-[10px] font-mono text-lime-300">
            <ShieldCheck className="w-3 h-3 text-lime-400" />
            <span>PKCE Security</span>
          </div>
        </div>

        <div className="mt-7">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/25 flex items-center justify-center text-lime-400 mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
            Enter your registered email address and we'll send you a secure
            time-limited link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-xs font-medium text-gray-300 space-y-2">
            <span>Email Address</span>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-[#111A15] text-white placeholder-zinc-500 text-sm outline-none transition-all focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime-400 py-3.5 font-bold text-black transition-all hover:bg-lime-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        {message && (
          <div role="status" className="mt-5 rounded-xl bg-lime-400/10 border border-lime-400/25 p-3.5 text-xs text-lime-300 flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>{message}</div>
          </div>
        )}

        {error && (
          <div role="alert" className="mt-5 rounded-xl bg-red-500/10 border border-red-500/25 p-3.5 text-xs text-red-300 flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Log In</span>
          </Link>
          <span>
            Need help?{" "}
            <Link to="/login" className="font-semibold text-lime-400 hover:underline">
              Support
            </Link>
          </span>
        </div>
      </section>
    </main>
  );
}
