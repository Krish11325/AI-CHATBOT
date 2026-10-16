import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Flame,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Zap,
  Check,
  X
} from 'lucide-react';
import { UserProfile, QuizResult, DailyActivity } from '../types';
import { StorageRepository } from '../data/storage';

interface ProgressScreenProps {
  user: UserProfile;
  quizResults: QuizResult[];
  onAskAIAboutTopic: (topicTitle: string) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  user,
  quizResults,
  onAskAIAboutTopic
}) => {
  // Calendar and Activity State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [dailyActivity, setDailyActivity] = useState<Record<string, DailyActivity>>(() =>
    StorageRepository.getDailyActivity()
  );
  const [selectedDayDateStr, setSelectedDayDateStr] = useState<string | null>(null);
  const [liveStreak, setLiveStreak] = useState<number>(user.streakDays);

  const totalQuestions = user.questionsSolved || 48;
  const avgAccuracy =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((acc, r) => acc + r.accuracy, 0) / quizResults.length
        )
      : 82;

  const weeklyData = [
    { day: 'Mon', minutes: 35 },
    { day: 'Tue', minutes: 50 },
    { day: 'Wed', minutes: 45 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 30 },
    { day: 'Sat', minutes: 75 },
    { day: 'Sun', minutes: 40 }
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

  const strongTopics = ['Calculus & Derivatives', 'Newton\'s Laws of Motion', 'Trigonometry'];
  const weakTopics = ['Electrostatics', 'Probability Distributions', 'Optics'];

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get total days in currently displayed month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Day of week for the 1st day of the month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0 index
  const startPadding = (firstDayIndex + 6) % 7;

  // Format YYYY-MM-DD
  const formatIsoDate = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle goal met status for selected day
  const handleToggleGoalForDay = (dateStr: string) => {
    const updatedAll = StorageRepository.toggleDailyGoalMet(dateStr);
    setDailyActivity({ ...updatedAll });

    // Refresh streak count
    const updatedUser = StorageRepository.getUserProfile();
    setLiveStreak(updatedUser.streakDays);
  };

  // Calculate monthly stats
  let monthlyGoalMetCount = 0;
  let monthlyTotalMinutes = 0;

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateStr = formatIsoDate(year, month, d);
    const act = dailyActivity[dateStr];
    if (act) {
      if (act.goalMet) monthlyGoalMetCount++;
      monthlyTotalMinutes += act.minutesStudied || 0;
    }
  }

  const selectedActivity = selectedDayDateStr ? dailyActivity[selectedDayDateStr] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Analytics Overview Title */}
      <div>
        <h2 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
          Learning Analytics & Progress
        </h2>
        <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] font-medium">
          Track your study calendar, streak goals & performance trends
        </p>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[#3B3028] dark:text-[#C99A7B]">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#75685C]">
              Total Time
            </span>
          </div>
          <p className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
            {Math.floor(user.totalStudyMinutes / 60)}h {user.totalStudyMinutes % 60}m
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[#B9785F]">
            <Flame className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#75685C]">
              Active Streak
            </span>
          </div>
          <p className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
            {liveStreak} Days
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[#3B3028] dark:text-[#C99A7B]">
            <Brain className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#75685C]">
              Solved Qs
            </span>
          </div>
          <p className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
            {totalQuestions}
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-[#87917A]">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#75685C]">
              Avg Accuracy
            </span>
          </div>
          <p className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
            {avgAccuracy}%
          </p>
        </div>
      </div>

      {/* VISUAL STREAK CALENDAR CARD */}
      <div className="p-5 sm:p-6 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-5">
        {/* Header & Streak Highlights */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCC8] dark:border-[#423730]">
          <div>
            <h3 className="text-base font-black text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#B9785F]" />
              <span>Learning Streak Calendar</span>
            </h3>
            <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] mt-0.5 font-medium">
              Days with 🔥 indicate met study goals. Tap any date to view or toggle goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#B9785F] fill-current" />
              <span>{liveStreak}-Day Streak Active</span>
            </span>

            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#B9785F]" />
              <span>{monthlyGoalMetCount}/{totalDaysInMonth} Days Met</span>
            </span>
          </div>
        </div>

        {/* Month Navigation Control */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-black text-[#3B3028] dark:text-[#F5EBDD]">
              {monthNames[month]} {year}
            </h4>
            <button
              onClick={handleGoToday}
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-[#E8DCC8] dark:bg-[#211C18] hover:bg-[#D8C3A5] text-[#3B3028] dark:text-[#F5EBDD] transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-[#D8C3A5] dark:border-[#423730] text-[#3B3028] dark:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-[#D8C3A5] dark:border-[#423730] text-[#3B3028] dark:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-black uppercase text-[#75685C] tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Padding tiles prior to 1st of month */}
            {Array.from({ length: startPadding }).map((_, idx) => (
              <div key={`pad-${idx}`} className="h-12 sm:h-14 rounded-xl bg-transparent" />
            ))}

            {/* Days 1 to totalDaysInMonth */}
            {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatIsoDate(year, month, dayNum);
              const activity = dailyActivity[dateStr];

              const isToday = dateStr === todayStr;
              const isGoalMet = activity?.goalMet;
              const hasPartialStudy = !isGoalMet && activity && activity.minutesStudied > 0;
              const minutes = activity?.minutesStudied || 0;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDayDateStr(dateStr)}
                  className={`relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all cursor-pointer group active:scale-95 ${
                    isGoalMet
                      ? 'bg-[#3B3028] text-[#FCFAF5] dark:bg-[#C99A7B] dark:text-[#211C18] shadow-xs'
                      : hasPartialStudy
                      ? 'bg-[#B9785F]/20 text-[#3B3028] dark:text-[#F5EBDD] border border-[#B9785F]/40'
                      : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border border-[#E8DCC8] dark:border-[#423730] hover:border-[#D8C3A5]'
                  } ${
                    isToday
                      ? 'ring-2 ring-[#B9785F] dark:ring-[#C99A7B] ring-offset-2 ring-offset-[#FCFAF5] dark:ring-offset-[#302822] font-black'
                      : ''
                  }`}
                >
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-xs font-bold leading-none">
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9785F] animate-pulse" />
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-center">
                    {isGoalMet ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#FCFAF5]/20 text-[#FCFAF5] dark:text-[#211C18]">
                        <Flame className="w-3 h-3 text-[#B9785F] fill-current" />
                        <span className="hidden sm:inline">{minutes}m</span>
                      </span>
                    ) : hasPartialStudy ? (
                      <span className="text-[9px] font-bold text-[#B9785F] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{minutes}m</span>
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#75685C]">
                        •
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend Footer */}
        <div className="pt-3 border-t border-[#E8DCC8] dark:border-[#423730] flex flex-wrap items-center justify-between text-xs text-[#75685C] gap-2">
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-[#3B3028] dark:bg-[#C99A7B] flex items-center justify-center">
                <Flame className="w-2.5 h-2.5 text-[#B9785F] fill-current" />
              </span>
              <span>Goal Met (Streak Day)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-[#B9785F]/20 border border-[#B9785F]/40" />
              <span>Partial Study</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]" />
              <span>Rest Day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Goal Modal / Dialog */}
      {selectedDayDateStr && (
        <div className="fixed inset-0 z-50 bg-[#29231F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] rounded-[24px] p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-[#3B3028] dark:text-[#F5EBDD]">
                Study Log: {selectedDayDateStr}
              </h4>
              <button
                onClick={() => setSelectedDayDateStr(null)}
                className="p-1 rounded-xl text-[#75685C] hover:text-[#3B3028]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
              <p>Minutes Logged: <strong className="text-[#3B3028] dark:text-[#F5EBDD] font-extrabold">{selectedActivity?.minutesStudied || 0} mins</strong></p>
              <p>Status: {selectedActivity?.goalMet ? <span className="font-extrabold text-[#87917A]">Goal Achieved (🔥 Streak Active)</span> : <span className="font-bold text-[#B9785F]">Goal Pending</span>}</p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  handleToggleGoalForDay(selectedDayDateStr);
                  setSelectedDayDateStr(null);
                }}
                className="w-full py-2.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#29231F]"
              >
                {selectedActivity?.goalMet ? 'Mark Goal Unachieved' : 'Mark Goal Achieved (🔥)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Study Time Bar Chart */}
      <div className="p-5 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#B9785F]" />
            <span>Weekly Study Activity (Minutes)</span>
          </h3>
          <span className="text-xs font-extrabold text-[#B9785F] dark:text-[#C99A7B]">
            This Week: 335 min
          </span>
        </div>

        <div className="flex items-end justify-between h-40 pt-4 px-2 border-b border-[#E8DCC8] dark:border-[#423730]">
          {weeklyData.map((d, i) => {
            const heightPercent = Math.round((d.minutes / maxMinutes) * 100);

            return (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <span className="text-[10px] font-extrabold text-[#75685C] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.minutes}m
                </span>
                <div
                  className="w-7 rounded-t-lg bg-[#3B3028] dark:bg-[#C99A7B] group-hover:bg-[#B9785F] transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-extrabold text-[#75685C] dark:text-[#BFB2A4] mt-2">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong vs Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#87917A] flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Strong Topics</span>
          </h4>
          <div className="space-y-2">
            {strongTopics.map((t, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730] text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] flex justify-between items-center">
                <span>{t}</span>
                <span className="text-[10px] text-[#87917A] font-extrabold">92% Mastery</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#B9785F] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Focus Areas (Needs Practice)</span>
          </h4>
          <div className="space-y-2">
            {weakTopics.map((t, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#B9785F]/10 border border-[#B9785F]/30 text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] flex justify-between items-center">
                <span>{t}</span>
                <button
                  onClick={() => onAskAIAboutTopic(t)}
                  className="text-[10px] font-extrabold text-[#B9785F] underline"
                >
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
