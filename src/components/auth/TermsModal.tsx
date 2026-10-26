import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-zinc-200 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">TradeX Terms & Privacy Policy</h3>
              <p className="text-[11px] text-zinc-500 font-mono">Effective October 2026 · Global Markets Compliance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs text-zinc-400 leading-relaxed max-h-72 overflow-y-auto pr-2">
          <section className="space-y-1.5">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> 1. Market Access & User Agreement
            </h4>
            <p>
              By accessing TradeX Global Markets, you acknowledge that you are using an authorized institutional-grade financial analysis and trading interface. All accounts are subject to real-time risk verification and security protocols.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> 2. Data Privacy & Encryption
            </h4>
            <p>
              Your personal information, login credentials, and session tokens are encrypted using industry-standard AES-256 and SHA-512 cryptographic salting. TradeX will never sell your personal trading information to third-party data brokers.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> 3. Responsible Trading & Risk Disclosure
            </h4>
            <p>
              Financial markets across Indian, European, and US exchanges involve risk. TradeX provides analytical tools, order execution gateways, and real-time telemetry. Users must safeguard account credentials and use two-factor verification.
            </p>
          </section>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-xs font-bold text-zinc-950 transition-all cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.3)] flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
