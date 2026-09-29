import React, { useState, useEffect, useRef } from 'react';
import { Symptom, ExtractedSymptom } from '../types';
import { MASTER_SYMPTOMS } from '../../shared/constants/symptoms_data';
import {
  Search,
  Check,
  AlertTriangle,
  Sparkles,
  BookOpen,
  X,
  ChevronDown,
  Mic,
  MicOff
} from 'lucide-react';

interface SymptomAutocompleteProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSelectSymptom: (symptom: Symptom) => void;
  collectedSymptoms: ExtractedSymptom[];
  onSubmit: (e?: React.FormEvent) => void;
  loading: boolean;
  isListening?: boolean;
  onToggleVoice?: () => void;
  interimTranscript?: string;
  speechSupported?: boolean;
  speechLanguageLabel?: string;
  speechError?: string | null;
  onDismissSpeechError?: () => void;
}

export const SymptomAutocomplete: React.FC<SymptomAutocompleteProps> = ({
  inputText,
  onInputChange,
  onSelectSymptom,
  collectedSymptoms,
  onSubmit,
  loading,
  isListening = false,
  onToggleVoice,
  interimTranscript = '',
  speechSupported = true,
  speechLanguageLabel = 'English',
  speechError = null,
  onDismissSpeechError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showLexiconBrowser, setShowLexiconBrowser] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Extract the current query word or phrase
  const query = inputText.trim().toLowerCase();

  // Filter symptoms based on search query or category
  const filteredSymptoms = MASTER_SYMPTOMS.filter(sym => {
    // If browsing lexicon
    if (showLexiconBrowser) {
      if (filterCategory !== 'all' && sym.category !== filterCategory) {
        return false;
      }
      if (!query) return true;
    }

    if (!query) return false;

    // Matching checks:
    const nameMatch = sym.name.toLowerCase().includes(query);
    const idMatch = sym.id.toLowerCase().replace(/_/g, ' ').includes(query);
    const categoryMatch = sym.category.toLowerCase().includes(query);
    const aliasMatch = sym.aliases.some(alias => alias.toLowerCase().includes(query));

    return nameMatch || idMatch || categoryMatch || aliasMatch;
  });

  // Open dropdown when query has at least 1 character, or if browsing lexicon
  useEffect(() => {
    if (showLexiconBrowser) {
      setIsOpen(true);
      setSelectedIndex(0);
    } else if (query.length >= 1 && filteredSymptoms.length > 0) {
      setIsOpen(true);
      setSelectedIndex(0);
    } else if (query.length === 0 && !showLexiconBrowser) {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [inputText, showLexiconBrowser, filterCategory]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowLexiconBrowser(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSymptoms.length === 0) {
      if (e.key === 'Enter') {
        onSubmit(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredSymptoms.length - 1 ? prev + 1 : 0));
      scrollActiveItemIntoView(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredSymptoms.length - 1));
      scrollActiveItemIntoView(selectedIndex - 1);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (selectedIndex >= 0 && selectedIndex < filteredSymptoms.length) {
        e.preventDefault();
        handleSelect(filteredSymptoms[selectedIndex]);
      } else {
        onSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setShowLexiconBrowser(false);
    }
  };

  const scrollActiveItemIntoView = (index: number) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('.autocomplete-item');
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest' });
      }
    }
  };

  const handleSelect = (symptom: Symptom) => {
    onSelectSymptom(symptom);

    // Natural sentence insertion or replacement
    const cleanName = symptom.name.split('/')[0].trim();
    if (inputText.toLowerCase().includes(query) && query.length > 0) {
      // If user typed e.g. "i have fev", replace the matched fragment
      onInputChange(`I have ${cleanName.toLowerCase()}`);
    } else {
      onInputChange(cleanName);
    }

    setIsOpen(false);
    setShowLexiconBrowser(false);
    inputRef.current?.focus();
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'cardiovascular', label: 'Heart' },
    { id: 'respiratory', label: 'Lungs' },
    { id: 'neurological', label: 'Brain/Nerves' },
    { id: 'gastrointestinal', label: 'Stomach' },
    { id: 'general', label: 'General' },
    { id: 'musculoskeletal', label: 'Joints/Muscle' },
    { id: 'ent', label: 'ENT' }
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Auto-Complete Floating Dropdown */}
      {isOpen && filteredSymptoms.length > 0 && (
        <div className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          
          {/* Top Lexicon Category Filter Bar */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] py-0.5">
              <span className="font-semibold text-slate-700 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Predefined Lexicon:</span>
              </span>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    filterCategory === cat.id
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setShowLexiconBrowser(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              title="Close Dropdown"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Results List */}
          <div ref={listRef} className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
            {filteredSymptoms.map((sym, idx) => {
              const isSelected = selectedIndex === idx;
              const alreadyAdded = collectedSymptoms.some(s => s.id === sym.id);
              const matchedAlias = sym.aliases.find(a => query && a.toLowerCase().includes(query));

              return (
                <div
                  key={sym.id}
                  onClick={() => handleSelect(sym)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`autocomplete-item p-3 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{sym.name}</span>
                      
                      {/* Emergency indicator */}
                      {sym.isEmergencyIndicator && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                          <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                          <span>Emergency Red Flag</span>
                        </span>
                      )}

                      {/* Already added tag */}
                      {alreadyAdded && (
                        <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded text-[10px] font-semibold flex items-center gap-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5" />
                          <span>Added to Assessment</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata & Aliases (Zero-Pill discipline) */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span className="capitalize text-slate-700 font-medium">{sym.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400">ID: {sym.id}</span>
                      {matchedAlias && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-teal-700 font-medium">Matches alias: "{matchedAlias}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`px-2 py-1 rounded text-[11px] font-semibold shrink-0 transition-colors ${
                      alreadyAdded
                        ? 'bg-slate-100 text-slate-500'
                        : isSelected
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'border border-slate-200 text-teal-700 hover:bg-teal-50'
                    }`}
                  >
                    {alreadyAdded ? 'Added' : 'Select'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ML Quality Notice Footer */}
          <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <Check className="w-3 h-3 text-teal-600" />
              <span>Standardized term ensures 100% Random Forest ML feature encoding</span>
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
              ↑↓ to navigate · Enter to pick · Esc to close
            </span>
          </div>
        </div>
      )}

      {/* Speech Recognition Error Banner */}
      {speechError && (
        <div className="mb-2 p-2 px-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{speechError}</span>
          </div>
          {onDismissSpeechError && (
            <button
              type="button"
              onClick={onDismissSpeechError}
              className="p-1 text-amber-700 hover:text-amber-900 rounded shrink-0"
              title="Dismiss warning"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Active Speech Recognition Live Bar */}
      {isListening && (
        <div className="mb-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-2 text-xs shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-rose-900 whitespace-nowrap">
                Listening ({speechLanguageLabel}):
              </span>
              <span className="italic text-rose-700 truncate">
                {interimTranscript ? `"${interimTranscript}"` : 'Describe your symptoms verbally...'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleVoice}
            className="px-2 py-0.5 bg-rose-200 hover:bg-rose-300 text-rose-900 rounded font-semibold text-[11px] shrink-0 transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* Input Bar with Auto-Complete & Lexicon Trigger */}
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
        
        {/* Browse Lexicon Button */}
        <button
          type="button"
          onClick={() => {
            setShowLexiconBrowser(prev => !prev);
            inputRef.current?.focus();
          }}
          className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors shrink-0 ${
            showLexiconBrowser
              ? 'bg-teal-600 text-white border-teal-600'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
          title="Browse standardized medical symptoms lexicon for ML prediction"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Lexicon</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {/* Text Input with Auto-Complete */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length >= 1) setIsOpen(true);
            }}
            placeholder={
              isListening
                ? `Listening in ${speechLanguageLabel}... speak now...`
                : "Type or use microphone to speak symptoms (e.g. fever, headache)..."
            }
            className={`w-full pl-8 pr-3 py-2 text-xs border rounded-lg focus:outline-none transition-all ${
              isListening
                ? 'border-rose-400 bg-rose-50/30 ring-1 ring-rose-400'
                : 'border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500 bg-white'
            }`}
          />
        </div>

        {/* Voice-to-Text Microphone Button */}
        {onToggleVoice && (
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={loading}
            className={`p-2 sm:px-2.5 sm:py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300 animate-pulse'
                : !speechSupported
                ? 'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                : 'border border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700 text-slate-700 active:scale-95'
            }`}
            title={
              !speechSupported
                ? "Speech recognition is not supported in this browser (Use Chrome/Edge/Safari)"
                : isListening
                ? "Click to stop voice recognition"
                : `Describe symptoms verbally using Voice-to-Text (${speechLanguageLabel})`
            }
            aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span className="hidden md:inline text-xs">
              {isListening ? 'Stop' : 'Voice'}
            </span>
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!inputText.trim() && !interimTranscript) || loading}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 shadow-2xs"
        >
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
