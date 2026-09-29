import React, { useState, useEffect } from 'react';
import { SavedAssessmentSession, SupportedLanguage, ExtractedSymptom } from '../types';
import {
  getActiveSession,
  getSavedDrafts,
  saveAsDraftSnapshot,
  deleteSavedDraft,
  clearActiveSession,
  saveActiveSession
} from '../services/sessionStorageService';
import {
  Bookmark,
  Save,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Download,
  Copy,
  Check,
  X,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SaveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  currentSymptoms: ExtractedSymptom[];
  activeView: string;
  onResumeSession: (session: SavedAssessmentSession) => void;
  onSessionCleared: () => void;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
  isOpen,
  onClose,
  language,
  currentSymptoms,
  activeView,
  onResumeSession,
  onSessionCleared
}) => {
  const [draftName, setDraftName] = useState('');
  const [savedDrafts, setSavedDrafts] = useState<SavedAssessmentSession[]>([]);
  const [activeSession, setActiveSession] = useState<SavedAssessmentSession | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveSession();
      setActiveSession(active);
      setSavedDrafts(getSavedDrafts());
      setSaveSuccess(false);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateNamedDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim() && currentSymptoms.length === 0 && !activeSession) return;

    try {
      const draft = saveAsDraftSnapshot(draftName.trim() || undefined);
      setSavedDrafts(getSavedDrafts());
      setActiveSession(draft);
      setDraftName('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteSavedDraft(draftId);
    setSavedDrafts(getSavedDrafts());
  };

  const handleClearCurrent = () => {
    clearActiveSession();
    setActiveSession(null);
    onSessionCleared();
    onClose();
  };

  const handleExportJSON = () => {
    const dataToExport = activeSession || {
      savedAt: new Date().toISOString(),
      activeView,
      collectedSymptoms: currentSymptoms
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aegishealth_session_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const symptomsList = currentSymptoms.map(s => `• ${s.name} (${s.severity})`).join('\n') || 'None recorded yet';
    const text = `=== AegisHealth AI Assessment Session ===
Date: ${new Date().toLocaleString()}
View: ${activeView}
Captured Symptoms (${currentSymptoms.length}):
${symptomsList}
==========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/70 via-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Assessment Session Manager</h2>
              <p className="text-xs text-slate-500">Pick up where you left off or save named drafts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Active Auto-Save Status Banner */}
          <div className="bg-teal-50/80 border border-teal-200/80 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider">Continuous Auto-Save Active</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Synced
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Your symptoms, messages, and selected body anatomy are automatically saved to your browser and synchronized locally as you navigate.
              </p>
            </div>
          </div>

          {/* Save Named Draft Form */}
          <form onSubmit={handleCreateNamedDraft} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Save Current Progress as Named Draft
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="e.g., Mom's Fever Assessment, Morning Cough Check"
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
            {saveSuccess && (
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Draft saved successfully! You can resume it anytime.
              </p>
            )}
          </form>

          {/* Quick Actions (Copy / Export / Clear) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Session (JSON)</span>
            </button>
          </div>

          {/* Saved Drafts List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Saved Drafts & Snapshots</span>
              <span className="text-[11px] font-normal text-slate-500">({savedDrafts.length})</span>
            </h3>

            {savedDrafts.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200/80 text-slate-500 text-xs">
                No custom drafts saved yet. Create one above to keep a snapshot.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {draft.sessionName || 'Untitled Draft'}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(draft.savedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span>•</span>
                        <span className="capitalize">{draft.activeView}</span>
                        {draft.collectedSymptoms.length > 0 && (
                          <span>• {draft.collectedSymptoms.length} symptoms</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onResumeSession(draft);
                          onClose();
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Load</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClearCurrent}
            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Current Session</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
