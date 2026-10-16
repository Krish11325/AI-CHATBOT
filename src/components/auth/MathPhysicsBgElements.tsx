import React from 'react';
import { Atom, Sparkles, Brain } from 'lucide-react';

export const MathPhysicsBgElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Soft warm sand ambient glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D8C3A5]/25 dark:bg-[#302822]/40 rounded-full blur-3xl" />
      <div className="absolute top-10 -right-16 w-64 h-64 bg-[#B9785F]/15 dark:bg-[#C99A7B]/15 rounded-full blur-3xl" />

      {/* Floating Equations and Mathematical Symbols in warm sand tones */}
      <div className="absolute top-6 left-6 text-[13px] font-serif italic text-[#75685C]/30 dark:text-[#BFB2A4]/25 tracking-wider">
        F = ma
      </div>

      <div className="absolute top-12 right-8 text-[14px] font-serif italic text-[#B9785F]/35 dark:text-[#C99A7B]/30 tracking-wider">
        E = mc²
      </div>

      <div className="absolute top-28 left-10 text-[12px] font-mono text-[#75685C]/30 dark:text-[#BFB2A4]/25">
        a² + b² = c²
      </div>

      <div className="absolute top-36 right-12 text-[13px] font-serif italic text-[#3B3028]/25 dark:text-[#F5EBDD]/20">
        ∫ f(x) dx
      </div>

      <div className="absolute top-48 left-16 text-[11px] font-mono text-[#B9785F]/30 dark:text-[#C99A7B]/25">
        Δx · Δp ≥ ℏ/2
      </div>

      <div className="absolute top-52 right-16 text-[12px] font-serif italic text-[#75685C]/30 dark:text-[#BFB2A4]/25">
        e^(iπ) + 1 = 0
      </div>

      {/* Floating Icons */}
      <div className="absolute top-8 left-1/3 text-[#B9785F]/20 dark:text-[#C99A7B]/25 animate-pulse">
        <Atom className="w-8 h-8" />
      </div>

      <div className="absolute top-20 right-1/4 text-[#75685C]/20 dark:text-[#BFB2A4]/25">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="absolute top-32 left-1/4 text-[#3B3028]/15 dark:text-[#F5EBDD]/20">
        <Brain className="w-7 h-7" />
      </div>
    </div>
  );
};
