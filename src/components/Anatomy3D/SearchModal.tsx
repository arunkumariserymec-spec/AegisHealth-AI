import React, { useState, useEffect, useRef } from 'react';
import { ANATOMY_LIST, AnatomicalStructure } from '../../anatomy/anatomyData';
import { Search, X, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStructure: (structure: AnatomicalStructure) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStructure
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? ANATOMY_LIST.filter(s =>
        s.name.toLowerCase().includes(normalized) ||
        s.latinName.toLowerCase().includes(normalized) ||
        s.systemName.toLowerCase().includes(normalized) ||
        s.regionName.toLowerCase().includes(normalized) ||
        s.description.toLowerCase().includes(normalized)
      )
    : ANATOMY_LIST.slice(0, 10);

  const handlePick = (struct: AnatomicalStructure) => {
    onSelectStructure(struct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organs, bones, muscles, nerves, blood vessels (e.g. Heart, Femur, Aorta)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-slate-800/60 flex-1">
          {results.length > 0 ? (
            results.map(struct => (
              <div
                key={struct.id}
                onClick={() => handlePick(struct)}
                className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: struct.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                        {struct.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono truncate">
                        {struct.systemName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 italic truncate mt-0.5">{struct.latinName}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{struct.function}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-teal-400 font-semibold shrink-0 opacity-80 group-hover:opacity-100">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No anatomical structures matching "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click any structure to rotate and center 3D camera</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
