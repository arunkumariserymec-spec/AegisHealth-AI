import React, { useState } from 'react';
import { User, SupportedLanguage } from '../types';
import { TRANSLATIONS, LANGUAGE_OPTIONS } from '../../shared/constants/languages';
import { User as UserIcon, Shield, CheckCircle2, LogIn, Globe } from 'lucide-react';

interface ProfileViewProps {
  user: User | null;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenAuth,
  onLogout,
  onNavigate,
  onUpdateUser
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isGuest = !user || user.role === 'guest';

  const [name, setName] = useState(user?.name || 'Guest User');
  const [age, setAge] = useState(user?.age ? String(user.age) : '26');
  const [sex, setSex] = useState(user?.sex || 'female');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      onOpenAuth();
      return;
    }
    onUpdateUser({
      name,
      age: Number(age),
      sex: sex as any,
      preferredLanguage: language
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">{user?.name || 'Guest User'}</h1>
              <p className="text-xs text-slate-500">
                {isGuest ? 'Guest Session (Temporary)' : user?.email}
              </p>
            </div>
          </div>

          <div>
            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In / Sign Up</span>
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
              >
                Log Out
              </button>
            )}
          </div>
        </div>

        {isGuest && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold">{t.guestModeNotice}</p>
            <p className="mt-0.5 text-amber-800">
              Create an account or sign in to permanently save your consultation history and personalized medical preferences.
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              disabled={isGuest}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                disabled={isGuest}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono disabled:bg-slate-50 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Sex</label>
              <select
                value={sex}
                disabled={isGuest}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 text-xs bg-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white font-medium"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {!isGuest && (
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                Save Profile Changes
              </button>
              {savedSuccess && (
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile updated successfully</span>
                </span>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Privacy, Legal & App Store Compliance Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Privacy & App Store Compliance</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your health inquiries are protected under Google Play Developer Health Guidelines and Apple App Store Review policies. Data is not sold or monetized.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {onNavigate && (
            <button
              onClick={() => onNavigate('privacy')}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 transition-colors"
            >
              View Privacy Policy
            </button>
          )}
          <a
            href="/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors inline-flex items-center gap-1"
          >
            <span>Public URL (/privacy-policy.html)</span>
          </a>
        </div>
      </div>

    </div>
  );
};
