import React from 'react';
import { Home, Stethoscope, History, Building2, User, Accessibility, Box } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  language: SupportedLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onNavigate,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const items = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'checker', label: 'Check', icon: Stethoscope },
    { id: 'bodymap', label: 'Body Map', icon: Accessibility },
    { id: 'doctors', label: 'Doctors', icon: Building2 },
    { id: 'history', label: t.history, icon: History }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all relative min-h-[48px] ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-teal-600 rounded-full" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-teal-600 scale-110 transition-transform' : 'text-slate-500'}`} />
              <span className="text-[11px] leading-none tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
