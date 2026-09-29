import React from 'react';
import { SupportedLanguage, User } from '../types';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../../shared/constants/languages';
import { PhoneCall, ShieldAlert, Monitor, Smartphone, Globe, UserCheck, LogIn, LayoutGrid, MessageSquare, Bookmark, Save } from 'lucide-react';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  deviceMode: 'responsive' | 'desktop' | 'mobile';
  onDeviceModeChange: (mode: 'responsive' | 'desktop' | 'mobile') => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenSOS: () => void;
  onOpenDisclaimer: () => void;
  onOpenFeedback?: () => void;
  onOpenSaveSession?: () => void;
  savedSymptomsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeView,
  onNavigate,
  deviceMode,
  onDeviceModeChange,
  user,
  onOpenAuth,
  onOpenSOS,
  onOpenDisclaimer,
  onOpenFeedback,
  onOpenSaveSession,
  savedSymptomsCount = 0
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'checker', label: 'Symptom Check' },
    { id: 'bodymap', label: 'Body Map' },
    { id: 'doctors', label: 'Doctors & Care' },
    { id: 'history', label: t.history },
    { id: 'admin', label: 'Admin / ML' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand title single text element */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <button
            onClick={() => onNavigate('home')}
            className="text-left group flex items-center gap-2.5 min-w-0"
          >
            {/* Stylized AegisHealth AI Logo Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center p-1.5 shadow-md border border-teal-500/30 shrink-0 group-hover:border-teal-400 transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-400" fill="none">
                {/* Orbit ring */}
                <circle cx="50" cy="50" r="42" stroke="url(#aegis-grad-1)" strokeWidth="4" strokeDasharray="210 50" strokeLinecap="round" />
                <circle cx="86" cy="30" r="4" fill="#2dd4bf" />
                {/* Stylized A letter mark */}
                <path d="M50 16 L28 76 L40 76 L46 58 L54 58 L60 76 L72 76 Z" fill="url(#aegis-grad-2)" opacity="0.9" />
                {/* Medical Cross */}
                <path d="M46 42 H54 V56 H46 Z M42 46 H58 V52 H42 Z" fill="#38bdf8" />
                {/* ECG Pulse Line */}
                <path d="M30 68 L44 68 L47 62 L50 74 L53 65 L56 68 L70 68" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="aegis-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="aegis-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors block leading-tight truncate">
                  AegisHealth <span className="text-teal-600">AI</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-0.5">
                Smart Care • Better Lives
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`transition-colors py-1 relative whitespace-nowrap ${
                activeView === link.id
                  ? 'text-teal-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {link.label}
              {activeView === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Device Switcher (Mobile / Desktop / Responsive) */}
          <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onDeviceModeChange('responsive')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'responsive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Responsive Web View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Fluid</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('desktop')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Desktop 1440px Workspace Mode"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Desktop</span>
            </button>
            <button
              onClick={() => onDeviceModeChange('mobile')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                deviceMode === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile Smartphone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mobile</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">Language</label>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Session / Drafts Button */}
          {onOpenSaveSession && (
            <button
              type="button"
              onClick={onOpenSaveSession}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 bg-white rounded-lg text-xs font-semibold text-slate-700 transition-colors whitespace-nowrap shadow-2xs group"
              title="Save current progress or resume previous drafts"
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Saved</span>
              {savedSymptomsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
              )}
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors whitespace-nowrap animate-pulse shrink-0"
            title="Emergency Ambulances & Helplines (108 / 112)"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">SOS</span>
            <span>108</span>
          </button>

          {/* User Feedback Button */}
          {onOpenFeedback && (
            <button
              type="button"
              onClick={onOpenFeedback}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-300 hover:border-teal-500 hover:text-teal-700 bg-white rounded-lg text-xs font-semibold text-slate-700 transition-colors whitespace-nowrap shadow-2xs"
              title="Share feedback on triage accuracy, 3D atlas, or voice recognition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Feedback</span>
            </button>
          )}

          {/* User Auth Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 border border-slate-300 hover:border-slate-400 bg-white rounded-lg text-xs font-medium text-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            {user && user.role !== 'guest' ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="max-w-[60px] sm:max-w-[120px] truncate">{user.name}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">Guest</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
