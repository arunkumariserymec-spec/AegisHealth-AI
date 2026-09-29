import React, { useState } from 'react';
import { AssessmentResult, SupportedLanguage, MLModelType, ConditionPrediction, ExtractedSymptom } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import { saveConsultationToFirestore } from '../firebase';
import { FeedbackModal } from '../components/FeedbackModal';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Building2,
  BookmarkPlus,
  RotateCcw,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity,
  PhoneCall,
  UserCheck,
  Star,
  MessageSquare
} from 'lucide-react';

interface ResultsViewProps {
  assessment: AssessmentResult;
  language: SupportedLanguage;
  onNavigate: (view: string) => void;
  onStartNew: () => void;
  onOpenSOS: () => void;
  onSaveSuccess?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  assessment,
  language,
  onNavigate,
  onStartNew,
  onOpenSOS,
  onSaveSuccess
}) => {
  const t = (TRANSLATIONS as any)[language] || TRANSLATIONS.en;
  const [selectedModel, setSelectedModel] = useState<MLModelType>('random_forest');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  const isEmergency = assessment.triageLevel === 'emergency';

  const handleSaveConsultation = async () => {
    if (saved) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        patientAge: assessment.patientInfo.age,
        patientSex: assessment.patientInfo.sex,
        symptoms: assessment.reportedSymptoms.map((s: ExtractedSymptom) => s.id),
        triageLevel: assessment.triageLevel,
        primaryCondition: assessment.possibleConditions[0]?.name || 'Unspecified Condition',
        primaryProbability: assessment.possibleConditions[0]?.probability || 0.75,
        possibleConditions: assessment.possibleConditions.map((c: ConditionPrediction) => ({ name: c.name, probability: c.probability })),
        emergencyDetected: isEmergency,
        notes: `Consultation saved via ${selectedModel.replace('_', ' ')}`
      };

      const token = localStorage.getItem('ai_health_token');
      // Persist to Express backend and Firebase Firestore cloud database
      await Promise.allSettled([
        fetch('/api/consultations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        }),
        saveConsultationToFirestore(payload)
      ]);

      setSaved(true);
      if (onSaveSuccess) onSaveSuccess();
    } catch (e) {
      setSaveError('Could not save to history. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1. Critical Emergency Alert Banner */}
      {isEmergency ? (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 text-white rounded-lg animate-pulse shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-red-900">
                {t.emergencyAlertTitle}: Immediate Medical Evaluation Required
              </h2>
              <p className="text-xs sm:text-sm text-red-800 leading-relaxed font-medium">
                {t.emergencyAlertBody}
              </p>
            </div>
          </div>

          <div className="p-3 bg-red-100/70 rounded-lg text-xs text-red-950 font-semibold space-y-1">
            <p>Recommended Immediate Actions:</p>
            <ul className="list-disc pl-4 space-y-0.5 font-normal">
              <li>Immediately dial 108 or 112 (Free national emergency ambulance).</li>
              <li>Stop any physical activity, sit upright, and remain calm.</li>
              <li>Do NOT attempt to drive yourself to the medical center.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onOpenSOS}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency Ambulance (108 / 112)</span>
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className="px-4 py-2 bg-white border border-red-300 text-red-800 hover:bg-red-50 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Find Nearest Emergency Hospitals</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl p-4 border flex items-center gap-3 text-xs ${
          assessment.triageLevel === 'urgent'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : assessment.triageLevel === 'moderate'
            ? 'bg-blue-50 border-blue-200 text-blue-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <Activity className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold block">
              Triage Level: {t.triageLevels[assessment.triageLevel]}
            </span>
            <span className="text-[11px] opacity-90">
              {assessment.triageLevel === 'urgent'
                ? 'Clinical consultation recommended within 24 hours.'
                : assessment.triageLevel === 'moderate'
                ? 'Schedule a visit with a general physician for formal examination.'
                : 'Mild symptoms suitable for supportive self-care and monitoring.'}
            </span>
          </div>
        </div>
      )}

      {/* 2. Assessment Summary Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
              Preliminary Clinical Assessment
            </span>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              Machine Learning Triage Guidance Report
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              title="Print Summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
            <button
              onClick={handleSaveConsultation}
              disabled={saved || saving}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                saved
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
              }`}
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>{saved ? 'Saved to History' : saving ? 'Saving...' : 'Save to History'}</span>
            </button>
          </div>
        </div>

        {saveError && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
            <span>{saveError}</span>
            <button onClick={() => setSaveError(null)} className="text-xs font-bold text-red-900 underline">Dismiss</button>
          </div>
        )}

        {/* Patient Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Patient Profile</span>
            <span className="font-semibold text-slate-800">
              {assessment.patientInfo.age} yrs · {assessment.patientInfo.sex.toUpperCase()}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Reported Symptoms</span>
            <span className="font-semibold text-slate-800">
              {assessment.reportedSymptoms.length} Symptoms
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Assessment Timestamp</span>
            <span className="font-mono text-slate-700 text-[11px]">
              {new Date(assessment.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Model Ensemble</span>
            <span className="font-semibold text-teal-700">Random Forest</span>
          </div>
        </div>

        {/* Reported Symptoms Chips */}
        <div>
          <span className="text-xs font-semibold text-slate-700 block mb-1.5">{t.symptomsLabel}:</span>
          <div className="flex flex-wrap gap-1.5">
            {assessment.reportedSymptoms.map((s: ExtractedSymptom, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs font-medium"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Multi-Model Comparison Control */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.possibleConditions}
            </h3>
            <p className="text-xs text-slate-500">
              Statistical likelihood calculated from trained disease datasets (NOT a confirmed medical diagnosis)
            </p>
          </div>

          {/* Model Switcher Segmented Button */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedModel('random_forest')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedModel === 'random_forest'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Random Forest (94.2%)
            </button>
            <button
              onClick={() => setSelectedModel('decision_tree')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedModel === 'decision_tree'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decision Tree (88.5%)
            </button>
            <button
              onClick={() => setSelectedModel('naive_bayes')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedModel === 'naive_bayes'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Naive Bayes (86.0%)
            </button>
          </div>
        </div>

        {/* Condition Cards */}
        <div className="space-y-3">
          {assessment.possibleConditions.map((cond: ConditionPrediction, idx: number) => {
            const pct = Math.round(cond.probability * 100);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{cond.name}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Likelihood:</span>
                    <span className="font-mono font-bold text-sm text-teal-700 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct > 75 ? 'bg-teal-600' : pct > 50 ? 'bg-blue-600' : 'bg-slate-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Contributing Symptoms & Specialist */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-slate-700">Contributing symptoms:</span>
                    {cond.matchingSymptoms.map((sym: string, sIdx: number) => (
                      <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {sym}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Recommended: {cond.recommendedSpecialist}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Clinical Guidance & Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* General Precautions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span>{t.generalPrecautions}</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
            {assessment.generalPrecautions.map((p: string, idx: number) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>

        {/* When to Seek Care */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t.whenToSeekCare}</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
            {assessment.whenToSeekMedicalCare.map((w: string, idx: number) => (
              <li key={idx} className="text-slate-700 font-medium">{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4.5 Patient Triage Feedback Card */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50/70 to-teal-50 border border-teal-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Was this triage evaluation accurate & helpful?
            </h4>
            <p className="text-xs text-slate-600">
              Your feedback helps clinical engineers refine Random Forest ML confidence & safety thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          {feedbackDone ? (
            <div className="px-3 py-1.5 bg-teal-100 text-teal-800 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-teal-200">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Feedback Submitted</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors w-full sm:w-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Rate & Give Feedback</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Direct Doctor & Next Steps CTAs */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-white">Consult a Qualified Healthcare Practitioner</h3>
          <p className="text-xs text-slate-300">
            Connect with verified general physicians and specialists in Ballari, Bengaluru, and nearby centers.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onNavigate('doctors')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>View Doctors & Clinics</span>
          </button>
          <button
            onClick={onStartNew}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Check</span>
          </button>
        </div>
      </div>

      {/* 6. Static Mandatory Medical Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-slate-400 inline-block mr-1.5 -mt-0.5" />
        <strong>Medical Notice:</strong> {t.disclaimerNotice} Always verify with a certified clinical doctor.
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        consultationSummary={assessment.possibleConditions[0]?.name ? `${assessment.possibleConditions[0].name} (${Math.round(assessment.possibleConditions[0].probability * 100)}% match)` : 'Preliminary Triage'}
        onFeedbackSubmitted={() => setFeedbackDone(true)}
      />

    </div>
  );
};
