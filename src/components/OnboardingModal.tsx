import React, { useState } from 'react';
import { Sparkles, Brain, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  user: UserProfile;
  onComplete: (updatedProfile: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);
  const [learningLevel, setLearningLevel] = useState<UserProfile['learningLevel']>(user.learningLevel);
  const [language, setLanguage] = useState<UserProfile['language']>(user.language);

  const screens = [
    {
      title: 'Welcome to StudyMate AI',
      subtitle: 'Your personal AI tutor for Mathematics and Physics.',
      icon: Sparkles,
      color: 'from-indigo-500 to-blue-600',
      badge: 'Learn. Solve. Understand.'
    },
    {
      title: 'Learn Difficult Concepts',
      subtitle: 'Understand complex topics through simple explanations, worked examples, key formulas, and visual step-by-step guidance.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Maths & Physics Masterclass'
    },
    {
      title: 'Solve Problems with AI',
      subtitle: 'Type a question or take a photo of your Maths or Physics homework to receive clear, step-by-step solutions or Socratic hints.',
      icon: Camera,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Photo & Voice Solver'
    },
    {
      title: 'Practice & Improve',
      subtitle: 'Take AI-generated quizzes, bookmark key formulas, track weekly progress, and focus on your recommended weak areas.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Smart Progress Analytics'
    }
  ];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        learningLevel,
        language
      });
    }
  };

  const handleSkip = () => {
    onComplete({
      learningLevel,
      language
    });
  };

  const current = screens[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 pb-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {step + 1} of {screens.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
          >
            Skip
          </button>
        </div>

        {/* Dynamic Graphic Card */}
        <div className="p-6 text-center flex flex-col items-center">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${current.color} flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6 transform transition-transform duration-300 hover:scale-105`}>
            <Icon className="w-10 h-10 stroke-[1.8]" />
          </div>

          <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 mb-2">
            {current.badge}
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            {current.title}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-2 mb-4">
            {current.subtitle}
          </p>

          {/* Setup options on final screen */}
          {step === 3 && (
            <div className="w-full text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-3 mb-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Learning Level
                </label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="School (Class 9-10)">School (Class 9-10)</option>
                  <option value="High School (Class 11-12)">High School (Class 11-12)</option>
                  <option value="College / Engineering">College / Engineering</option>
                  <option value="Competitive Exams (JEE/NEET)">Competitive Exams (JEE/NEET)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Explanation Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      language === 'en'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ta')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      language === 'ta'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Indicators & Actions */}
        <div className="p-6 pt-0 mt-auto flex items-center justify-between">
          <div className="flex space-x-1.5">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-indigo-600 dark:bg-indigo-400' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>{step === screens.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
