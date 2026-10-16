import React, { useState, useEffect } from 'react';
import {
  Globe,
  Moon,
  Sun,
  Flame,
  Award,
  Shield,
  Trash2,
  Check,
  LogOut,
  Mail,
  Clock,
  Maximize,
  Minimize
} from 'lucide-react';
import { UserProfile } from '../types';
import { AuthService } from '../services/authService';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClearData: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateProfile,
  onClearData,
  onLogout
}) => {
  const [name, setName] = useState(user.name);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || document.body.classList.contains('simulated-fullscreen'));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !document.body.classList.contains('simulated-fullscreen')) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else {
          document.body.classList.add('simulated-fullscreen');
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen && document.fullscreenElement) {
          await (document as any).webkitExitFullscreen();
        }
        document.body.classList.remove('simulated-fullscreen');
        setIsFullscreen(false);
      }
    } catch (e) {
      const isSimulated = document.body.classList.toggle('simulated-fullscreen');
      setIsFullscreen(isSimulated);
    }
  };

  const authUser = AuthService.getCurrentUser();

  const handleSaveName = () => {
    onUpdateProfile({ name });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      if (onLogout) {
        onLogout();
      }
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Profile Header Card */}
      <div className="p-6 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#D8C3A5] dark:ring-[#C99A7B]/40"
          />
          <div className="absolute -bottom-1 -right-1 bg-[#B9785F] text-[#FCFAF5] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-xs">
            <Flame className="w-3 h-3 mr-0.5 fill-current" />
            {user.streakDays}d
          </div>
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
                {user.name}
              </h2>
              <p className="text-xs font-semibold text-[#75685C] dark:text-[#BFB2A4]">
                {user.learningLevel}
              </p>
            </div>

            {onLogout && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-3.5 py-1.5 rounded-xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-xs font-bold transition-all flex items-center justify-center space-x-1.5 self-center sm:self-auto disabled:opacity-50 hover:bg-[#29231F]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#211C18] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#B9785F] fill-current" />
              <span>{user.streakDays} Day Streak</span>
            </span>

            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#211C18] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] flex items-center gap-1">
              <Award className="w-3 h-3 text-[#B9785F]" />
              <span>{user.questionsSolved} Questions Solved</span>
            </span>

            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#211C18] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#B9785F]" />
              <span>{Math.round((user.totalStudyMinutes / 60) * 10) / 10} Hours Studied</span>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Account Details & Session */}
        <div className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B] flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Account & Authentication</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#75685C] block">
                  Logged In Account
                </span>
                <p className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#B9785F]" />
                  <span>{authUser?.email || 'radhakrishnan132005@gmail.com'}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#302822] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] capitalize">
                  {authUser?.authProvider || 'Firebase Email'} Auth
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1">
                Display Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 text-xs font-medium p-2.5 rounded-xl border border-[#D8C3A5] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD]"
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-xs font-bold rounded-xl shadow-xs hover:bg-[#29231F] flex items-center gap-1"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : 'Save'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1">
                Academic Level
              </label>
              <select
                value={user.learningLevel}
                onChange={(e) => onUpdateProfile({ learningLevel: e.target.value as any })}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-[#D8C3A5] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD]"
              >
                <option value="School (Class 9-10)">School (Class 9-10)</option>
                <option value="High School (Class 11-12)">High School (Class 11-12)</option>
                <option value="College / Engineering">College / Engineering</option>
                <option value="Competitive Exams (JEE/NEET)">Competitive Exams (JEE/NEET)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Multilingual & Display Settings */}
        <div className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B] flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            <span>Language & Theme Preferences</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1.5">
                AI Tutor Explanation Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ language: 'en' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                    user.language === 'en'
                      ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] border-[#3B3028]'
                      : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ language: 'ta' })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                    user.language === 'ta'
                      ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] border-[#3B3028]'
                      : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC8] dark:border-[#423730]">
              <div>
                <span className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD] block">
                  Dark Mode Theme
                </span>
                <span className="text-[11px] font-medium text-[#75685C] dark:text-[#BFB2A4]">
                  Eye-safe dark canvas for night study sessions
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateProfile({ darkMode: !user.darkMode })}
                className={`p-2.5 rounded-xl border transition-all ${
                  user.darkMode
                    ? 'bg-[#B9785F] text-[#FCFAF5] border-[#B9785F]'
                    : 'bg-[#E8DCC8] text-[#3B3028] border-[#D8C3A5]'
                }`}
              >
                {user.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC8] dark:border-[#423730]">
              <div>
                <span className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD] block">
                  Full Screen Display Mode
                </span>
                <span className="text-[11px] font-medium text-[#75685C] dark:text-[#BFB2A4]">
                  Expand StudyMate AI to fill your screen
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className={`p-2.5 rounded-xl border transition-all ${
                  isFullscreen
                    ? 'bg-[#B9785F] text-[#FCFAF5] border-[#B9785F]'
                    : 'bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#D8C3A5] dark:border-[#423730]'
                }`}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Clear Data & Sign Out Zone */}
        <div className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#B9785F] flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" />
            <span>Account Management</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
              Clear saved app data or log out of your session securely
            </p>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all saved app data?')) {
                    onClearData();
                  }
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] hover:bg-[#D8C3A5] text-xs font-bold rounded-xl transition-colors text-center"
              >
                Reset App Data
              </button>

              {onLogout && (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#B9785F]/15 text-[#B9785F] hover:bg-[#B9785F] hover:text-[#FCFAF5] text-xs font-bold rounded-xl border border-[#B9785F]/30 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
