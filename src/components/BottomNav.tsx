import React from 'react';
import { Home, BookOpen, Bot, Award, User } from 'lucide-react';

export type TabType = 'home' | 'learn' | 'aitutor' | 'practice' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'aitutor' as TabType, label: 'AI Tutor', icon: Bot, isEmphasized: true },
    { id: 'practice' as TabType, label: 'Practice', icon: Award },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F2E8]/95 dark:bg-[#211C18]/95 backdrop-blur-md border-t border-[#E8DCC8] dark:border-[#423730] px-3 py-2 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
      <div className="flex items-center justify-around relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isEmphasized) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-4 flex flex-col items-center justify-center focus:outline-none group"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
                    isActive
                      ? 'bg-[#3B3028] text-[#FCFAF5] border-[#B9785F] dark:bg-[#C99A7B] dark:text-[#211C18] dark:border-[#FCFAF5]'
                      : 'bg-[#3B3028] text-[#E8DCC8] border-[#D8C3A5]/50 dark:bg-[#302822] dark:text-[#C99A7B] dark:border-[#423730]'
                  }`}
                >
                  <Bot className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-1 transition-colors ${
                    isActive ? 'text-[#3B3028] dark:text-[#F5EBDD]' : 'text-[#75685C] dark:text-[#BFB2A4]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#3B3028] dark:text-[#F5EBDD]'
                  : 'text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#E8DCC8] dark:bg-[#302822]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-[#3B3028] dark:text-[#F5EBDD]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
