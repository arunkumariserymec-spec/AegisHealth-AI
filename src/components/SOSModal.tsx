import React from 'react';
import { X, PhoneCall, AlertOctagon, Heart, ShieldAlert } from 'lucide-react';
import { EMERGENCY_HELPLINES_INDIA } from '../../shared/constants/doctors_data';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500 overflow-hidden relative">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Emergency Healthcare Contacts (India)</h3>
              <p className="text-xs text-red-600 font-medium">Immediate 24x7 Ambulance & Triage Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-900 leading-relaxed">
            <p className="font-bold mb-1">If experiencing severe chest pain, loss of consciousness, or difficulty breathing:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Do NOT drive yourself to the hospital.</li>
              <li>Sit comfortably in an upright position and loosen tight clothing.</li>
              <li>Immediately call the ambulance below.</li>
            </ul>
          </div>

          <div className="space-y-2">
            {EMERGENCY_HELPLINES_INDIA.map((line, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">{line.name}</div>
                  <div className="text-[11px] text-slate-500">{line.description}</div>
                </div>
                <a
                  href={`tel:${line.number}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold font-mono tracking-wide transition-colors shrink-0 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{line.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
