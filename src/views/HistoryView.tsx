import React, { useState, useEffect } from 'react';
import { ConsultationRecord, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import {
  History,
  Trash2,
  Eye,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  User,
  X
} from 'lucide-react';

interface HistoryViewProps {
  language: SupportedLanguage;
  onOpenSOS: () => void;
  onNavigate: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  onOpenSOS,
  onNavigate
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ai_health_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch('/api/consultations', { headers });
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      const token = localStorage.getItem('ai_health_token');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/consultations/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (selectedRecord?.id === id) setSelectedRecord(null);
      } else {
        setDeleteError('Unable to delete consultation record.');
      }
    } catch (e) {
      setDeleteError('Unable to delete consultation record.');
    }
  };

  const filteredRecords = records.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.primaryCondition.toLowerCase().includes(q) ||
      r.symptoms.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t.history}</h1>
            <p className="text-xs text-slate-500">
              Review and manage your previous triage assessments and clinical guidance notes
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by condition or symptom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} className="text-xs font-bold text-red-800 underline">Dismiss</button>
        </div>
      )}

      {/* Consultations List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
          Loading previous consultation records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700">No Consultation Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't saved any health assessments yet. Run your first assessment using the Symptom Checker.
          </p>
          <button
            onClick={() => onNavigate('checker')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold inline-block"
          >
            Start Symptom Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    item.triageLevel === 'emergency'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : item.triageLevel === 'urgent'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-teal-50 text-teal-800 border-teal-200'
                  }`}>
                    {item.triageLevel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">
                  {item.primaryCondition}
                  <span className="font-mono text-xs text-teal-700 ml-2">
                    ({Math.round(item.primaryProbability * 100)}% Likelihood)
                  </span>
                </h3>

                <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                  <span>Symptoms:</span>
                  {item.symptoms.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedRecord(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 overflow-hidden relative">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-teal-700 uppercase">Consultation Summary</span>
                <h3 className="text-base font-bold text-slate-900">{selectedRecord.primaryCondition}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Recorded {new Date(selectedRecord.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="font-semibold text-slate-700 block">Patient Profile:</span>
                <p className="text-slate-600">
                  {selectedRecord.patientAge} Years · {selectedRecord.patientSex.toUpperCase()}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Reported Symptoms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecord.symptoms.map((s, idx) => (
                    <span key={idx} className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px]">
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRecord.possibleConditions && selectedRecord.possibleConditions.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">ML Probabilities:</span>
                  <div className="space-y-1.5">
                    {selectedRecord.possibleConditions.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-800">{c.name}</span>
                        <span className="font-mono font-bold text-teal-700">{Math.round(c.probability * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                  <span className="font-semibold block mb-0.5">Clinical Note:</span>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
