import React from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import { Stethoscope, MessageSquare, Building2, History, ShieldAlert, ArrowRight, Activity, Clock, CheckCircle2, PhoneCall, Accessibility } from 'lucide-react';

interface HomeViewProps {
  language: SupportedLanguage;
  onNavigate: (view: string) => void;
  onOpenDisclaimer: () => void;
  onOpenSOS: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onNavigate,
  onOpenDisclaimer,
  onOpenSOS
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const quickSymptoms = [
    { id: 'fever', label: 'High Fever', desc: 'Temperature >= 100.4°F' },
    { id: 'headache', label: 'Severe Headache', desc: 'Throbbing or persistent pain' },
    { id: 'cough', label: 'Cough & Throat Pain', desc: 'Dry or productive with cold' },
    { id: 'abdominal_pain', label: 'Stomach Pain / Diarrhea', desc: 'Cramps or loose motions' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-teal-900/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/80 border border-teal-500/40 text-teal-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>AegisHealth AI • Smart Care. Better Lives.</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.howAreYouFeeling}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Report your symptoms naturally in English or Indian regional languages. AegisHealth AI assesses clinical condition likelihoods with 94.2% ML accuracy, detects emergency red flags, and navigates you to specialized medical care.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('checker')}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{t.startCheck}</span>
            </button>

            <button
              onClick={() => onNavigate('bodymap')}
              className="px-4 py-2.5 bg-teal-700/80 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-2 border border-teal-500/50 transition-all"
            >
              <Accessibility className="w-4 h-4 text-teal-300" />
              <span>Body Anatomy Map</span>
            </button>

            <button
              onClick={() => onNavigate('doctors')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>{t.findDoctors}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <span className="font-bold text-slate-900 block">Important Clinical & Academic Notice:</span>
          <p className="text-amber-800 leading-relaxed">
            {t.disclaimerNotice} {t.disclaimerFull}
          </p>
        </div>
        <button
          onClick={onOpenDisclaimer}
          className="text-xs font-semibold text-amber-900 hover:underline shrink-0"
        >
          Read Details
        </button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onNavigate('checker')}
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Conversational AI</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Describe symptoms naturally with NLP extraction and auto-complete.
          </p>
        </div>

        <div
          onClick={() => onNavigate('bodymap')}
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Accessibility className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Body Anatomy Map</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Interactive visual human anatomy figure with localized symptom tagging.
          </p>
        </div>

        <div
          onClick={() => onNavigate('doctors')}
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Doctors & Hospitals</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verified specialists in Ballari, Bengaluru, and Indian metros with 24x7 emergency info.
          </p>
        </div>

        <div
          onClick={() => onNavigate('history')}
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Consultation Records</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review your previous assessments, precautions, and recommended follow-up actions.
          </p>
        </div>

        <div
          onClick={() => onNavigate('admin')}
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">ML Benchmarks</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compare Random Forest (94.2%), Decision Tree (88.5%), and Naive Bayes (86.0%) matrices.
          </p>
        </div>
      </div>

      {/* Emergency Contact Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Medical Response (India)</span>
          </div>
          <p className="text-xs text-slate-600">
            For critical chest pain, severe shortness of breath, sudden facial drooping or loss of consciousness, call immediately:
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSOS}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Emergency Ambulance: 108 / 112
          </button>
        </div>
      </div>

      {/* Footer Legal & Privacy Strip */}
      <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-200/80">
        <div>
          <span><strong>AegisHealth AI</strong> &copy; 2026 • <em>Smart Care. Better Lives.</em> For preliminary clinical assessment & triage only.</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('privacy')}
            className="hover:text-teal-700 font-medium underline"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenDisclaimer}
            className="hover:text-teal-700 font-medium underline"
          >
            Clinical Disclaimer
          </button>
        </div>
      </div>
    </div>
  );
};
