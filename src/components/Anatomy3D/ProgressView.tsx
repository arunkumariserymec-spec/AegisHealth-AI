import React, { useState } from 'react';
import { ANATOMY_SYSTEMS } from '../../anatomy/systemsData';
import { ANATOMY_STRUCTURES, AnatomicalStructure } from '../../anatomy/anatomyData';
import {
  Trophy,
  Flame,
  Bookmark,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface ProgressViewProps {
  bookmarkedIds: string[];
  notesMap: Record<string, string>;
  onRemoveBookmark: (id: string) => void;
  onSaveNote: (structureId: string, note: string) => void;
  onFocusStructure: (structure: AnatomicalStructure) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  bookmarkedIds,
  notesMap,
  onRemoveBookmark,
  onSaveNote,
  onFocusStructure
}) => {
  const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState<string>('');

  // Sample realistic curriculum progress calculation
  const systemProgress: Record<string, number> = {
    skeletal: 82,
    muscular: 71,
    nervous: 55,
    cardiovascular: 76,
    respiratory: 84,
    digestive: 63,
    urinary: 72,
    endocrine: 60,
    lymphatic: 50,
    reproductive: 45,
    integumentary: 90,
    sensory: 65
  };

  const overallProgress = Math.round(
    Object.values(systemProgress).reduce((a, b) => a + b, 0) / Object.values(systemProgress).length
  );

  const handleStartEditNote = (structId: string) => {
    setEditingStructureId(structId);
    setCurrentNoteText(notesMap[structId] || '');
  };

  const handleSaveNoteSubmit = (structId: string) => {
    onSaveNote(structId, currentNoteText);
    setEditingStructureId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Anatomy Learning & Mastery Dashboard</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Student Progress
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track system completion, spaced repetition streaks, personal study notes, and pinned structures
          </p>
        </div>

        {/* Study Streak Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 self-start sm:self-auto">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-sm font-black text-white">5-Day Study Streak</div>
            <div className="text-[10px] text-slate-400">Keep up the daily recall!</div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Mastery</span>
          <div className="text-2xl font-black text-teal-400 font-mono">{overallProgress}%</div>
          <p className="text-[10px] text-slate-500">Across all 12 human body systems</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Structures Learned</span>
          <div className="text-2xl font-black text-indigo-400 font-mono">148 / 206</div>
          <p className="text-[10px] text-slate-500">Interactive 3D structures explored</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Bookmarks</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{bookmarkedIds.length}</div>
          <p className="text-[10px] text-slate-500">Pinned for quick review</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-lg space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Personal Clinical Notes</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {Object.keys(notesMap).filter(k => notesMap[k]?.trim()).length}
          </div>
          <p className="text-[10px] text-slate-500">Custom student annotations</p>
        </div>
      </div>

      {/* Two Column Layout: System Progress Bars (Left) + Bookmarks & Notes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Systems Mastery Progress (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>System Mastery Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Curriculum Target</span>
          </div>

          <div className="space-y-3">
            {ANATOMY_SYSTEMS.slice(0, 8).map(sys => {
              const val = systemProgress[sys.id] || 60;
              return (
                <div key={sys.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{sys.emoji}</span>
                      <span>{sys.name}</span>
                    </span>
                    <span className="font-mono text-slate-400">{val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pinned Bookmarks & Notes (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Pinned Bookmarks Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Pinned Anatomical Structures ({bookmarkedIds.length})</span>
              </h3>
            </div>

            {bookmarkedIds.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {bookmarkedIds.map(id => {
                  const struct = ANATOMY_STRUCTURES[id];
                  if (!struct) return null;
                  return (
                    <div
                      key={id}
                      className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => onFocusStructure(struct)}
                        className="text-left font-bold text-slate-200 hover:text-teal-400 flex items-center gap-2 truncate"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: struct.color }} />
                        <span className="truncate">{struct.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal italic">({struct.systemName})</span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onFocusStructure(struct)}
                          className="p-1 text-teal-400 hover:text-teal-300 rounded"
                          title="Inspect in 3D"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveBookmark(id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/40 text-center text-xs text-slate-500">
                No structures bookmarked yet. Click the bookmark icon on any structure to pin it here.
              </div>
            )}
          </div>

          {/* Student Clinical Notes Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>My Clinical Study Notes</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {['heart', 'lungs', 'femur_bone'].map(structId => {
                const struct = ANATOMY_STRUCTURES[structId];
                if (!struct) return null;
                const note = notesMap[structId] || '';
                const isEditing = editingStructureId === structId;

                return (
                  <div key={structId} className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: struct.color }} />
                        <span>{struct.name}</span>
                      </span>

                      {!isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleStartEditNote(structId)}
                          className="text-[11px] text-teal-400 hover:underline"
                        >
                          {note ? 'Edit Note' : '+ Add Note'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSaveNoteSubmit(structId)}
                          className="text-[11px] text-emerald-400 font-bold hover:underline"
                        >
                          Save
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <textarea
                        value={currentNoteText}
                        onChange={(e) => setCurrentNoteText(e.target.value)}
                        placeholder={`Write clinical reminder or mnemonic for ${struct.name}...`}
                        rows={2}
                        className="w-full p-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="text-xs text-slate-300 italic">
                        {note || 'No notes added yet for this structure.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
