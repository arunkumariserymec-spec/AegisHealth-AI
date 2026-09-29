import React from 'react';
import { SavedAssessmentSession, SupportedLanguage } from '../types';
import { Clock, RotateCcw, X, Sparkles, CheckCircle2, ChevronRight, Activity, Trash2 } from 'lucide-react';

interface ResumeSessionBannerProps {
  session: SavedAssessmentSession;
  language: SupportedLanguage;
  onResume: (session: SavedAssessmentSession) => void;
  onDismiss: () => void;
  onClear: () => void;
}

export const ResumeSessionBanner: React.FC<ResumeSessionBannerProps> = ({
  session,
  language,
  onResume,
  onDismiss,
  onClear
}) => {
  // Format relative time
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'just now';
      if (diffMins === 1) return '1 minute ago';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'earlier';
    }
  };

  const symptomCount = session.collectedSymptoms?.length || 0;
  const messagesCount = session.chatMessages?.length || 0;
  const hasResults = Boolean(session.currentAssessment);
  const timeAgo = formatTimeAgo(session.savedAt);

  return (
    <div className="relative z-30 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white border-b border-teal-500/30 shadow-lg px-4 sm:px-6 py-3 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left info column */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0 mt-0.5 md:mt-0 text-teal-300">
            <RotateCcw className="w-4 h-4 animate-spin-slow" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-500/40">
                Session Restored
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                Saved {timeAgo}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-100 mt-0.5 truncate">
              {session.sessionName || 'In-Progress Assessment'}
              <span className="text-slate-400 font-normal text-xs ml-2">
                ({symptomCount > 0 ? `${symptomCount} symptom${symptomCount > 1 ? 's' : ''}` : ''}
                {symptomCount > 0 && messagesCount > 1 ? ' • ' : ''}
                {messagesCount > 1 ? `${messagesCount} messages` : ''}
                {hasResults ? ' • Results Available' : ''})
              </span>
            </p>

            {/* Preview of captured symptoms */}
            {session.collectedSymptoms && session.collectedSymptoms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {session.collectedSymptoms.slice(0, 4).map((sym) => (
                  <span
                    key={sym.id}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 hover:bg-white/15 text-teal-200 px-2 py-0.5 rounded-md border border-white/10"
                  >
                    <Activity className="w-2.5 h-2.5 text-teal-400" />
                    {sym.name}
                  </span>
                ))}
                {session.collectedSymptoms.length > 4 && (
                  <span className="text-[11px] text-slate-400">
                    +{session.collectedSymptoms.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 border border-transparent hover:border-red-800/40"
            title="Discard previous draft and start fresh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Start Fresh</span>
          </button>

          <button
            type="button"
            onClick={() => onResume(session)}
            className="px-4 py-1.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg shadow-md hover:shadow-teal-500/25 transition-all flex items-center gap-1.5 font-sans"
          >
            <span>Resume Assessment</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
