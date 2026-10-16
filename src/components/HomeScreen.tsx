import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Mic,
  Send,
  Bookmark,
  Award,
  FileText,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, SubjectType } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  onNavigateToTab: (tab: 'home' | 'learn' | 'aitutor' | 'practice' | 'profile') => void;
  onOpenSubject: (subject: SubjectType) => void;
  onQuickAskAI: (initialQuestion?: string) => void;
  onOpenImageSolver: () => void;
  onOpenFormulas: () => void;
  onOpenNotes: () => void;
  onOpenQuizGenerator: () => void;
  onOpenPlanner: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onNavigateToTab,
  onOpenSubject,
  onQuickAskAI,
  onOpenImageSolver,
  onOpenFormulas,
  onOpenNotes,
  onOpenQuizGenerator,
  onOpenPlanner
}) => {
  const [questionInput, setQuestionInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      onQuickAskAI(questionInput.trim());
      setQuestionInput('');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const targetMinutes = user.dailyGoalMinutes || 45;
  const completedMinutes = 32;
  const remainingMinutes = Math.max(0, targetMinutes - completedMinutes);
  const goalPercentage = Math.round((completedMinutes / targetMinutes) * 100);

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-1">
      {/* Greeting Banner with Profile Avatar */}
      <div className="flex items-center justify-between p-4 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
            {getGreeting()}, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs font-semibold text-[#75685C] dark:text-[#BFB2A4]">
            Ready to learn something new?
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('profile')}
          className="relative group focus:outline-none shrink-0"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D8C3A5] dark:ring-[#C99A7B]/50"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#B9785F] text-[#FCFAF5] text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center shadow-xs">
            <Flame className="w-2.5 h-2.5 mr-0.5 fill-current" />
            {user.streakDays}
          </div>
        </button>
      </div>

      {/* Large AI Tutor Card - Sand Gradient */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#E8DCC8] via-[#F7F2E8] to-[#FCFAF5] dark:from-[#302822] dark:via-[#29231F] dark:to-[#211C18] p-6 border border-[#D8C3A5] dark:border-[#423730] shadow-md shadow-[#3B3028]/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] rounded-2xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#3B3028] dark:text-[#F5EBDD]">
                Ask StudyMate AI
              </h3>
              <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
                Ask me anything about Maths or Physics.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#B9785F]/15 text-[#B9785F] dark:text-[#C99A7B] border border-[#B9785F]/30">
            AI Active
          </span>
        </div>

        {/* Question Input */}
        <form onSubmit={handleAskSubmit} className="relative flex items-center">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-[#FCFAF5] dark:bg-[#211C18] border border-[#D8C3A5] dark:border-[#423730] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 text-xs font-medium rounded-2xl py-3.5 pl-4 pr-28 focus:outline-none focus:ring-2 focus:ring-[#3B3028] dark:focus:ring-[#C99A7B] transition-all"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            <button
              type="button"
              onClick={onOpenImageSolver}
              className="p-2 text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-xl transition-colors"
              title="Scan or upload photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onQuickAskAI()}
              className="p-2 text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-xl transition-colors"
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="p-2 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] disabled:opacity-40 font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </form>

        {/* Preset Prompt Chips */}
        <div className="flex flex-wrap gap-2 pt-0.5 text-xs">
          <button
            onClick={() => onQuickAskAI('A car travels 100 m in 5 seconds. Find its velocity.')}
            className="px-2.5 py-1 rounded-xl bg-[#FCFAF5] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730] text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] transition-colors text-[11px] font-semibold"
          >
            ⚡ Velocity numerical
          </button>
          <button
            onClick={() => onQuickAskAI('State Newton\'s Second Law of Motion with formula and units.')}
            className="px-2.5 py-1 rounded-xl bg-[#FCFAF5] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730] text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] transition-colors text-[11px] font-semibold"
          >
            ⚛ Newton's 2nd Law
          </button>
          <button
            onClick={() => onQuickAskAI('Solve 2x² - 7x + 3 = 0 using quadratic formula.')}
            className="px-2.5 py-1 rounded-xl bg-[#FCFAF5] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730] text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] transition-colors text-[11px] font-semibold"
          >
            📐 Quadratic formula
          </button>
        </div>
      </div>

      {/* Two Large Subject Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#75685C] dark:text-[#BFB2A4]">
          Subjects
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mathematics Card */}
          <button
            onClick={() => onOpenSubject('maths')}
            className="group relative overflow-hidden p-6 rounded-[24px] bg-[#E8DCC8] dark:bg-[#302822] border border-[#D8C3A5] dark:border-[#423730] shadow-sm text-left transition-all hover:shadow-md active:scale-98"
          >
            <div className="absolute top-2 right-3 text-[#3B3028]/10 dark:text-[#F5EBDD]/10 text-6xl font-black font-serif pointer-events-none select-none">
              π
            </div>
            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#3B3028] text-[#FCFAF5] dark:bg-[#C99A7B] dark:text-[#211C18] flex items-center justify-center text-xl font-serif italic font-black shadow-xs">
                π
              </div>
              <div>
                <h4 className="text-lg font-black text-[#3B3028] dark:text-[#F5EBDD]">
                  Mathematics
                </h4>
                <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4] mt-0.5">
                  Explore concepts, formulas & problems
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B] pt-2 group-hover:underline">
                Start Learning →
              </span>
            </div>
          </button>

          {/* Physics Card */}
          <button
            onClick={() => onOpenSubject('physics')}
            className="group relative overflow-hidden p-6 rounded-[24px] bg-[#F7F2E8] dark:bg-[#29231F] border border-[#B9785F]/30 dark:border-[#423730] shadow-sm text-left transition-all hover:shadow-md active:scale-98"
          >
            <div className="absolute top-2 right-3 text-[#B9785F]/15 dark:text-[#C99A7B]/15 text-6xl font-black font-serif pointer-events-none select-none">
              ⚛
            </div>
            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#B9785F] text-[#FCFAF5] dark:bg-[#C99A7B] dark:text-[#211C18] flex items-center justify-center text-xl font-bold shadow-xs">
                ⚛
              </div>
              <div>
                <h4 className="text-lg font-black text-[#3B3028] dark:text-[#F5EBDD]">
                  Physics
                </h4>
                <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4] mt-0.5">
                  Understand the laws of the universe
                </p>
              </div>
              <span className="inline-flex items-center text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B] pt-2 group-hover:underline">
                Start Learning →
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions (2-Column / 4-Grid Layout) */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#75685C] dark:text-[#BFB2A4]">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Scan Question */}
          <button
            onClick={onOpenImageSolver}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5] transition-all text-left flex items-center space-x-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                Scan Question
              </h4>
              <p className="text-[10px] text-[#75685C] dark:text-[#BFB2A4]">Photo solver</p>
            </div>
          </button>

          {/* Formula Library */}
          <button
            onClick={onOpenFormulas}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5] transition-all text-left flex items-center space-x-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                Formula Library
              </h4>
              <p className="text-[10px] text-[#75685C] dark:text-[#BFB2A4]">Quick reference</p>
            </div>
          </button>

          {/* AI Quiz */}
          <button
            onClick={onOpenQuizGenerator}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5] transition-all text-left flex items-center space-x-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                AI Quiz
              </h4>
              <p className="text-[10px] text-[#75685C] dark:text-[#BFB2A4]">Test knowledge</p>
            </div>
          </button>

          {/* Study Notes */}
          <button
            onClick={onOpenNotes}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5] transition-all text-left flex items-center space-x-3 group active:scale-98"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                Study Notes
              </h4>
              <p className="text-[10px] text-[#75685C] dark:text-[#BFB2A4]">Saved solutions</p>
            </div>
          </button>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#75685C] dark:text-[#BFB2A4] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#B9785F]" />
            <span>Continue Learning</span>
          </h3>
          <button
            onClick={() => onNavigateToTab('learn')}
            className="text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Calculus */}
          <div
            onClick={() => onOpenSubject('maths')}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:shadow-xs transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#211C18] dark:text-[#C99A7B]">
                  Mathematics
                </span>
                <h4 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD] mt-1.5">
                  Calculus
                </h4>
              </div>
              <span className="text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B]">
                65%
              </span>
            </div>

            <div className="w-full bg-[#E8DCC8]/50 dark:bg-[#211C18] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#3B3028] dark:bg-[#C99A7B] transition-all duration-500"
                style={{ width: '65%' }}
              />
            </div>
          </div>

          {/* Newton's Laws */}
          <div
            onClick={() => onOpenSubject('physics')}
            className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] hover:shadow-xs transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#B9785F]/15 text-[#B9785F] dark:bg-[#211C18] dark:text-[#C99A7B]">
                  Physics
                </span>
                <h4 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD] mt-1.5">
                  Newton's Laws
                </h4>
              </div>
              <span className="text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B]">
                48%
              </span>
            </div>

            <div className="w-full bg-[#E8DCC8]/50 dark:bg-[#211C18] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#B9785F] dark:bg-[#C99A7B] transition-all duration-500"
                style={{ width: '48%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Study Goal Card */}
      <div className="p-5 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs flex items-center justify-between">
        <div className="space-y-1.5 pr-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B]">
              Today's Study Goal
            </span>
          </div>
          <h4 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
            {completedMinutes} / {targetMinutes} min
          </h4>
          <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
            {remainingMinutes} minutes remaining
          </p>
          <button
            onClick={onOpenPlanner}
            className="mt-1 px-3 py-1.5 rounded-xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-xs font-bold hover:bg-[#29231F] transition-all inline-flex items-center space-x-1"
          >
            <span>Keep Going</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Circular Progress Indicator in Sand Palette */}
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              className="stroke-[#E8DCC8] dark:stroke-[#211C18]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              className="stroke-[#B9785F] dark:stroke-[#C99A7B] transition-all duration-1000 ease-out"
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 * (1 - goalPercentage / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs font-black text-[#3B3028] dark:text-[#F5EBDD]">
              {goalPercentage}%
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#87917A] mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
