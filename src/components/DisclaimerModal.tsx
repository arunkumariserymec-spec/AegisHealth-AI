import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 overflow-hidden relative">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Medical Safety & Academic Disclaimer</h3>
              <p className="text-xs text-slate-500">Notice for Students, Evaluators, and Patients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-600">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-amber-900">
            <p className="font-semibold text-xs mb-1">Important Legal & Medical Limitation:</p>
            <p>{t.disclaimerFull}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs">Clinical Principles Enforced:</h4>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              <li>
                <strong className="text-slate-800">No Definitive Diagnosis:</strong> This application calculates statistical possibilities using Machine Learning models (Random Forest, Decision Tree, Naive Bayes).
              </li>
              <li>
                <strong className="text-slate-800">Emergency Red-Flag Escaping:</strong> If potentially life-threatening indicators (such as chest pain radiating to arm, acute dyspnea, or paralysis) are detected, triage overrides self-care guidance and mandates immediate 108 emergency service dispatch.
              </li>
              <li>
                <strong className="text-slate-800">Verified Healthcare Providers:</strong> All referenced hospitals, clinics, and emergency lines represent verified facilities in India.
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
            <div className="flex items-center justify-between">
              <span>National Emergency Helpline (India):</span>
              <span className="font-mono font-bold text-red-600">112 / 108</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
