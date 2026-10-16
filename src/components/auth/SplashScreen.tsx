import React, { useEffect } from 'react';
import { Brain, Atom, Sparkles } from 'lucide-react';
import { MathPhysicsBgElements } from './MathPhysicsBgElements';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      <MathPhysicsBgElements />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 animate-fadeIn">
        {/* Animated Glowing Logo Frame */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl blur-xl opacity-70 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center shadow-2xl">
            <Brain className="w-12 h-12 text-indigo-400" />
            <Atom className="w-7 h-7 text-cyan-400 absolute bottom-2 right-2 animate-spin-slow" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight text-white">
            StudyMate AI
          </h1>
          <p className="text-xs font-semibold text-indigo-300">
            Your AI-powered Maths & Physics tutor
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Learn. Solve. Understand.
            </span>
          </div>
        </div>

        {/* Pulse Loading Indicator */}
        <div className="pt-10 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-medium text-slate-400">Initializing AI Tutor Engine...</span>
        </div>
      </div>
    </div>
  );
};
