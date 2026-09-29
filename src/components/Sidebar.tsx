import React from 'react';
import { Home, Stethoscope, MessageSquare, Building2, History, BarChart3, ShieldCheck, HeartPulse, User, Accessibility } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  language: SupportedLanguage;
  onOpenDisclaimer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  language,
  onOpenDisclaimer
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const menuItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'checker', label: 'Symptom Checker', icon: Stethoscope },
    { id: 'bodymap', label: 'Body Anatomy Map', icon: Accessibility },
    { id: 'doctors', label: t.findDoctors, icon: Building2 },
    { id: 'history', label: t.history, icon: History },
    { id: 'admin', label: 'ML Analytics & Admin', icon: BarChart3 },
    { id: 'profile', label: t.profile, icon: User }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-teal-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-wide block">
              AegisHealth AI
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Smart Care • Better Lives
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="p-3 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Disclaimer & Emergency Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60 space-y-3">
        <button
          onClick={onOpenDisclaimer}
          className="w-full text-left p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 hover:bg-amber-100/70 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Medical Disclaimer</span>
          </div>
          <p className="text-[11px] text-amber-700/90 mt-1 line-clamp-2 leading-relaxed">
            Not a medical diagnosis. Statistical machine learning assessment only.
          </p>
        </button>

        <div className="text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>India Helpline:</span>
            <span className="font-semibold text-red-600">112 / 108</span>
          </div>
          <div className="flex justify-between">
            <span>Primary Model:</span>
            <span className="font-medium text-slate-700">Random Forest</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('privacy')}
          className="w-full text-center text-[11px] text-slate-500 hover:text-teal-700 hover:underline pt-1 block"
        >
          Privacy Policy & Health Data Protection
        </button>
      </div>
    </aside>
  );
};
