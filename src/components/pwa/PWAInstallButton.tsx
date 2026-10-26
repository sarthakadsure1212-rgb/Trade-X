import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  WifiOff,
  Laptop,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'pill' | 'compact';
  className?: string;
}

export function PWAInstallButton({ variant = 'pill', className = '' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode, don't show the prompt
  if (isStandalone || isInstalled) {
    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-[10px] font-mono text-lime-400 font-medium">
          <CheckCircle2 className="w-3 h-3 text-lime-400" />
          <span>App Installed</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // If native browser prompt isn't immediately available (e.g. iOS Safari, Firefox, or Chrome desktop before trigger), show instructions modal
      setShowModal(true);
    }
  };

  return (
    <>
      {/* 1. Pill variant (ideal for headers and navbars) */}
      {variant === 'pill' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-black text-xs font-bold font-sans transition-all shadow-[0_0_14px_rgba(163,230,53,0.35)] hover:shadow-[0_0_20px_rgba(163,230,53,0.55)] cursor-pointer active:scale-95 ${className}`}
          title="Install TradeX Mobile App"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5] animate-bounce" />
          <span className="tracking-tight">Install App</span>
        </button>
      )}

      {/* 2. Compact Icon/Button variant */}
      {variant === 'compact' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111913] hover:bg-[#1a251d] border border-lime-400/40 text-lime-400 text-xs font-mono font-medium transition-all cursor-pointer ${className}`}
          title="Install TradeX App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )}

      {/* 3. Full Button variant */}
      {variant === 'button' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-black font-extrabold text-sm transition-all shadow-[0_0_18px_rgba(163,230,53,0.4)] cursor-pointer active:scale-[0.98] ${className}`}
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Install TradeX Mobile App</span>
        </button>
      )}

      {/* 4. Banner variant (for login page or top of dashboard) */}
      {variant === 'banner' && (
        <div className={`p-3.5 rounded-2xl bg-gradient-to-r from-[#0B150E] via-[#0D1B11] to-[#080E0A] border border-lime-400/35 shadow-lg flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">TradeX Native App</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-lime-400/20 text-lime-400 border border-lime-400/30">PWA</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Install to home screen for lightning-fast trading & instant alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallClick}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-all shadow-[0_0_12px_rgba(163,230,53,0.35)] cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>
        </div>
      )}

      {/* Success notification */}
      {installSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl bg-zinc-900 border border-lime-400 text-white shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
          <div className="text-xs font-sans">
            <p className="font-bold text-white">TradeX App Installed!</p>
            <p className="text-zinc-400 text-[11px]">Open it anytime directly from your home screen.</p>
          </div>
        </div>
      )}

      {/* Instruction Modal for iOS Safari and other browsers without immediate beforeinstallprompt */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B130E] border border-lime-400/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative text-zinc-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-lime-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Install TradeX App</h3>
                <p className="text-xs text-lime-400/80 font-mono">Mobile Home Screen & Desktop</p>
              </div>
            </div>

            {isIOS ? (
              /* iOS Safari Step-by-Step Instructions */
              <div className="space-y-3.5 text-xs">
                <p className="text-zinc-300">
                  Follow these 2 quick steps in Safari to add TradeX to your iPhone or iPad:
                </p>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Tap the Share icon</p>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        Tap <Share className="w-3.5 h-3.5 text-lime-400 inline" /> in Safari's bottom toolbar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Select "Add to Home Screen"</p>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-lime-400 inline" /> <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Chrome / Desktop Instructions */
              <div className="space-y-3.5 text-xs">
                <p className="text-zinc-300">
                  Install TradeX directly to your device for an uninterrupted full-screen experience:
                </p>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Open Browser Menu (⋮)</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Tap the three dots icon in Chrome, Edge, or Brave.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Tap "Install TradeX" or "Add to Home screen"</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Confirm installation to add the app icon to your launcher.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PWAOfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] px-3 py-2 rounded-xl bg-amber-500/95 text-black font-medium text-xs shadow-2xl flex items-center justify-between gap-2 border border-amber-400 animate-bounce">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 text-black" />
        <span>Offline Mode — Cached market charts & paper balance active.</span>
      </div>
    </div>
  );
}
