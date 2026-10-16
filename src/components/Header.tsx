import React, { useState, useEffect } from 'react';
import { Flame, Search, Bell, Moon, Sun, Maximize, Minimize } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSearch,
  onOpenNotifications,
  onToggleDarkMode,
  onOpenProfile
}) => {
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F7F2E8]/90 dark:bg-[#211C18]/90 backdrop-blur-md border-b border-[#E8DCC8]/80 dark:border-[#423730] px-4 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* User Info & Greeting */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenProfile}
            className="relative group focus:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D8C3A5] dark:ring-[#C99A7B]/40"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#B9785F] text-[#FCFAF5] text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center shadow-sm">
              <Flame className="w-2.5 h-2.5 mr-0.5 fill-current" />
              {user.streakDays}
            </div>
          </button>
          <div>
            <h2 className="text-xs font-semibold text-[#75685C] dark:text-[#BFB2A4]">
              {getGreeting()}
            </h2>
            <h1 className="text-base font-extrabold text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-1.5">
              <span>{user.name.split(' ')[0]}</span>
              {user.language === 'ta' && (
                <span className="text-[10px] bg-[#E8DCC8] dark:bg-[#302822] text-[#B9785F] dark:text-[#C99A7B] px-1.5 py-0.5 rounded font-bold border border-[#D8C3A5]/40 dark:border-[#423730]">
                  தமிழ்
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#75685C] dark:text-[#BFB2A4] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-full transition-colors"
            title="Search topics, formulas & notes"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 text-[#75685C] dark:text-[#BFB2A4] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-full transition-colors"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-[#B9785F]" /> : <Maximize className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-[#75685C] dark:text-[#BFB2A4] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-full transition-colors"
            title="Toggle theme"
          >
            {user.darkMode ? <Sun className="w-5 h-5 text-[#C99A7B]" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-[#75685C] dark:text-[#BFB2A4] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#302822] rounded-full transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B9785F] rounded-full ring-2 ring-[#FCFAF5] dark:ring-[#211C18]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
