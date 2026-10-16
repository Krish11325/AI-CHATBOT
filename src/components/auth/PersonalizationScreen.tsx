import React, { useState } from 'react';
import {
  Brain,
  Check,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  ArrowRight,
  Zap,
  Calculator,
  Compass
} from 'lucide-react';
import { MathPhysicsBgElements } from './MathPhysicsBgElements';
import { AuthService, AuthUser } from '../../services/authService';

interface PersonalizationScreenProps {
  authUser: AuthUser;
  onPersonalizationComplete: (updatedUser: AuthUser) => void;
}

export const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({
  authUser,
  onPersonalizationComplete
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [learningLevel, setLearningLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleStartLearning = async () => {
    setIsSaving(true);
    try {
      const updated = await AuthService.savePersonalization(authUser.id, {
        subjects: selectedSubjects,
        learningLevel,
        dailyGoalMinutes
      });
      onPersonalizationComplete(updated);
    } catch {
      onPersonalizationComplete({
        ...authUser,
        subjects: selectedSubjects,
        learningLevel,
        dailyGoalMinutes,
        hasCompletedPersonalization: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <MathPhysicsBgElements />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Let's personalize your learning
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome, {authUser.name}! Configure your AI tutor preferences.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-indigo-950/10 space-y-6">
          {/* Question 1: Subjects */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Which subjects do you want to learn?</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Mathematics */}
              <button
                type="button"
                onClick={() => toggleSubject('Mathematics')}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all active:scale-95 ${
                  selectedSubjects.includes('Mathematics')
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="p-2 rounded-xl bg-white/20 w-max">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm pt-1">Mathematics</h3>
                  <p className="text-[11px] opacity-80">Calculus, Algebra, Geometry</p>
                </div>
                {selectedSubjects.includes('Mathematics') && (
                  <span className="p-1 rounded-full bg-white/20">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>

              {/* Physics */}
              <button
                type="button"
                onClick={() => toggleSubject('Physics')}
                className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all active:scale-95 ${
                  selectedSubjects.includes('Physics')
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-600 shadow-md shadow-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="p-2 rounded-xl bg-white/20 w-max">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm pt-1">Physics</h3>
                  <p className="text-[11px] opacity-80">Mechanics, Optics, Waves</p>
                </div>
                {selectedSubjects.includes('Physics') && (
                  <span className="p-1 rounded-full bg-white/20">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Question 2: Learning Level */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>What's your learning level?</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLearningLevel(lvl)}
                  className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all text-center ${
                    learningLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Daily Study Goal */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>What is your daily study goal?</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: '15 minutes', minutes: 15 },
                { label: '30 minutes', minutes: 30 },
                { label: '45 minutes', minutes: 45 },
                { label: '60+ minutes', minutes: 60 }
              ].map((item) => (
                <button
                  key={item.minutes}
                  type="button"
                  onClick={() => setDailyGoalMinutes(item.minutes)}
                  className={`py-3 px-2 rounded-2xl text-xs font-extrabold border transition-all text-center ${
                    dailyGoalMinutes === item.minutes
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={handleStartLearning}
            disabled={isSaving}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
