import React, { useState, useRef, useEffect } from 'react';
import { ThreeBodyScene } from './ThreeBodyScene';
import { ANATOMY_STRUCTURES, ANATOMY_LIST, AnatomicalStructure } from '../../anatomy/anatomyData';
import { ANATOMY_SYSTEMS, ANATOMICAL_LAYERS } from '../../anatomy/systemsData';
import { QuizView } from './QuizView';
import { FlashcardsView } from './FlashcardsView';
import { LearnView } from './LearnView';
import { ProgressView } from './ProgressView';
import { SearchModal } from './SearchModal';
import { SettingsModal } from './SettingsModal';
import { MeasureModal } from './MeasureModal';

import {
  Heart,
  Activity,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Search,
  HelpCircle,
  Camera,
  Ruler,
  Scissors,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Trophy,
  Filter,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  FileText
} from 'lucide-react';

interface HumanAnatomyWorkstationProps {
  onBackToApp?: () => void;
}

export const HumanAnatomyWorkstation: React.FC<HumanAnatomyWorkstationProps> = ({ onBackToApp }) => {
  // Navigation tabs matching reference image: 3D Atlas, Systems, Layers, Views, Quiz, Search, plus Learn, Flashcards, Progress
  const [activeTab, setActiveTab] = useState<'atlas' | 'quiz' | 'flashcards' | 'learn' | 'progress'>('atlas');

  // Active biological systems filter
  const [activeSystems, setActiveSystems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ANATOMY_SYSTEMS.forEach(s => { initial[s.id] = true; });
    return initial;
  });

  // Selected anatomical structure (default to Heart matching the reference image!)
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructure>(
    ANATOMY_STRUCTURES.heart || ANATOMY_LIST[0]
  );

  // Inspector tabs: Overview, Structure, Function, Clinical
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'structure' | 'function' | 'clinical'>('overview');

  // Functional View mode: Circulation, Respiration, Digestion, Nervous Control, Lymph Flow
  const [functionalView, setFunctionalView] = useState<'circulation' | 'respiration' | 'digestion' | 'nervous' | 'lymph'>('circulation');

  // Anatomical layer (1 to 8)
  const [activeLayer, setActiveLayer] = useState<number>(8); // default to all layers visible

  // Camera preset view
  const [viewPreset, setViewPreset] = useState<'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'head' | 'chest' | 'abdomen' | 'pelvis' | 'upper_limb' | 'lower_limb'>('front');

  // Visualization modes
  const [isIsolatedMode, setIsIsolatedMode] = useState<boolean>(false);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [isExplodedMode, setIsExplodedMode] = useState<boolean>(false);
  const [explodeFactor, setExplodeFactor] = useState<number>(0.6);
  const [showExplodeSlider, setShowExplodeSlider] = useState<boolean>(false);
  const [transparencyValue, setTransparencyValue] = useState<number>(0); // 0 to 100
  const [showTransparencySlider, setShowTransparencySlider] = useState<boolean>(false);
  const [crossSectionAxis, setCrossSectionAxis] = useState<'none' | 'x' | 'y' | 'z'>('none');
  const [crossSectionPosition, setCrossSectionPosition] = useState<number>(0);
  const [showCrossSectionControls, setShowCrossSectionControls] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [bodySex, setBodySex] = useState<'male' | 'female'>('male');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMeasureOpen, setIsMeasureOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [detailLevel, setDetailLevel] = useState<'low' | 'medium' | 'high'>('high');

  // Bookmarks & Notes state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['heart', 'lungs', 'femur_bone']);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({
    heart: 'Remember the 4 chambers: RA receives IVC/SVC, RV pumps to pulmonary trunk, LA receives 4 pulmonary veins, LV pumps to aorta.',
    lungs: 'Right lung has 3 lobes with horizontal and oblique fissures; left lung has 2 lobes and cardiac notch.'
  });

  // Screenshot helper ref
  const captureScreenshotRef = useRef<(() => string) | null>(null);
  const workstationContainerRef = useRef<HTMLDivElement>(null);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workstationContainerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCaptureScreenshot = () => {
    if (captureScreenshotRef.current) {
      const dataUrl = captureScreenshotRef.current();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `human-anatomy-3d-${selectedStructure.id}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    }
  };

  const handleToggleSystem = (sysId: string) => {
    setActiveSystems(prev => ({
      ...prev,
      [sysId]: !prev[sysId]
    }));
  };

  const handleToggleBookmark = (structId: string) => {
    setBookmarkedIds(prev =>
      prev.includes(structId) ? prev.filter(id => id !== structId) : [...prev, structId]
    );
  };

  const handleSaveNote = (structId: string, noteText: string) => {
    setNotesMap(prev => ({
      ...prev,
      [structId]: noteText
    }));
  };

  // Keyboard shortcut listener for Search (Cmd/Ctrl + K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={workstationContainerRef}
      className="w-full h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans select-none overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. TOP GLOBAL NAVIGATION HEADER (Matching reference image) */}
      {/* ======================================================== */}
      <header className="h-14 bg-[#0c1324] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 z-30 shadow-md">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-2">
              <span>HUMAN ANATOMY 3D</span>
            </h1>
            <p className="text-[10px] text-teal-400 font-mono tracking-tight -mt-0.5">Clinical Medical Atlas</p>
          </div>
        </div>

        {/* Center Navigation Tabs (Matching image: Systems, Layers, Views, Quiz, Search) */}
        <div className="hidden md:flex items-center bg-[#070b16] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('atlas')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'atlas'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Anatomy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'learn'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Systems Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'quiz'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Quiz Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'flashcards'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'progress'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Progress & Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-400 hover:text-white transition-all"
            title="Global Anatomical Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-teal-400" />
            <span>Search</span>
          </button>
        </div>

        {/* Right Controls: Male/Female Toggle, Settings, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Sex Toggle */}
          <div className="flex items-center bg-[#070b16] p-0.5 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setBodySex('male')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                bodySex === 'male'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setBodySex('female')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                bodySex === 'female'
                  ? 'bg-pink-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Female
            </button>
          </div>

          {/* Settings Gear */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Viewer Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Back to App Option */}
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              title="Return to Main Application"
            >
              App
            </button>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      {activeTab === 'quiz' ? (
        <div className="flex-1 overflow-y-auto bg-[#080d1a] p-4">
          <QuizView
            onFocusStructure={(id) => {
              const struct = ANATOMY_STRUCTURES[id];
              if (struct) {
                setSelectedStructure(struct);
                setActiveTab('atlas');
              }
            }}
            onExitQuiz={() => setActiveTab('atlas')}
          />
        </div>
      ) : activeTab === 'flashcards' ? (
        <div className="flex-1 overflow-y-auto bg-[#080d1a] p-4">
          <FlashcardsView
            onFocusStructure={(id) => {
              const struct = ANATOMY_STRUCTURES[id];
              if (struct) {
                setSelectedStructure(struct);
                setActiveTab('atlas');
              }
            }}
            onExit={() => setActiveTab('atlas')}
          />
        </div>
      ) : activeTab === 'learn' ? (
        <div className="flex-1 overflow-y-auto bg-[#080d1a] p-4">
          <LearnView
            onInspectSystemIn3D={(sysId) => {
              setActiveSystems({ [sysId]: true });
              setActiveTab('atlas');
            }}
            onInspectStructureIn3D={(struct) => {
              setSelectedStructure(struct);
              setActiveTab('atlas');
            }}
          />
        </div>
      ) : activeTab === 'progress' ? (
        <div className="flex-1 overflow-y-auto bg-[#080d1a] p-4">
          <ProgressView
            bookmarkedIds={bookmarkedIds}
            notesMap={notesMap}
            onRemoveBookmark={handleToggleBookmark}
            onSaveNote={handleSaveNote}
            onFocusStructure={(struct) => {
              setSelectedStructure(struct);
              setActiveTab('atlas');
            }}
          />
        </div>
      ) : (
        /* ======================================================== */
        /* 3D ATLAS WORKSTATION (Matching reference image exactly) */
        /* ======================================================== */
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          
          <div className="flex-1 flex min-h-0 overflow-hidden">
            
            {/* ---------------------------------------------------- */}
            {/* LEFT SIDEBAR: SYSTEMS, TOOLS, VIEWS, INFORMATION     */}
            {/* ---------------------------------------------------- */}
            <aside className="w-56 lg:w-60 bg-[#0c1324] border-r border-slate-800/80 flex flex-col shrink-0 overflow-y-auto text-xs divide-y divide-slate-800/60 z-20">
              
              {/* SYSTEMS List */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>SYSTEMS</span>
                  <button
                    onClick={() => {
                      const allActive = Object.values(activeSystems).every(Boolean);
                      const updated: Record<string, boolean> = {};
                      ANATOMY_SYSTEMS.forEach(s => { updated[s.id] = !allActive; });
                      setActiveSystems(updated);
                    }}
                    className="text-[10px] text-teal-400 hover:underline normal-case font-normal"
                  >
                    Toggle All
                  </button>
                </div>

                <div className="space-y-1">
                  {ANATOMY_SYSTEMS.map(sys => {
                    const isActive = activeSystems[sys.id] !== false;
                    return (
                      <div
                        key={sys.id}
                        onClick={() => handleToggleSystem(sys.id)}
                        className={`flex items-center justify-between p-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          isActive ? 'bg-slate-800/80 text-white font-medium' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm shrink-0">{sys.emoji}</span>
                          <span className="truncate">{sys.name}</span>
                        </div>
                        {isActive ? (
                          <Eye className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TOOLS Palette (Matching image: Isolate, Hide, Transparent, X-Ray, Cross Section, Reset View, Screenshot, Measure) */}
              <div className="p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  TOOLS
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Isolate */}
                  <button
                    type="button"
                    onClick={() => setIsIsolatedMode(prev => !prev)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[11px] font-semibold ${
                      isIsolatedMode
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">⌖</span>
                    <span>Isolate</span>
                  </button>

                  {/* Hide */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStructure) {
                        handleToggleSystem(selectedStructure.system);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-left flex items-center gap-1.5 text-[11px] font-semibold transition-all"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </button>

                  {/* Explode View */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExplodedMode(prev => !prev);
                      setShowExplodeSlider(prev => !prev);
                      setShowTransparencySlider(false);
                      setShowCrossSectionControls(false);
                    }}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[11px] font-semibold ${
                      isExplodedMode
                        ? 'bg-orange-500 text-slate-950 border-orange-400'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">💥</span>
                    <span>Explode</span>
                  </button>

                  {/* Show All */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated: Record<string, boolean> = {};
                      ANATOMY_SYSTEMS.forEach(s => { updated[s.id] = true; });
                      setActiveSystems(updated);
                      setActiveLayer(8);
                      setIsIsolatedMode(false);
                    }}
                    className="p-2 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-left flex items-center gap-1.5 text-[11px] font-semibold transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    <span>Show All</span>
                  </button>

                  {/* Transparent */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowTransparencySlider(prev => !prev);
                      setShowCrossSectionControls(false);
                      setShowExplodeSlider(false);
                    }}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[11px] font-semibold ${
                      transparencyValue > 0
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">🫥</span>
                    <span>Transparent</span>
                  </button>

                  {/* X-Ray */}
                  <button
                    type="button"
                    onClick={() => setIsXRayMode(prev => !prev)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[11px] font-semibold ${
                      isXRayMode
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">🩻</span>
                    <span>X-Ray</span>
                  </button>

                  {/* Cross Section */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCrossSectionControls(prev => !prev);
                      setShowTransparencySlider(false);
                      setShowExplodeSlider(false);
                    }}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[11px] font-semibold ${
                      crossSectionAxis !== 'none'
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Cross Section</span>
                  </button>

                  {/* Reset View */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewPreset('front');
                      setIsIsolatedMode(false);
                      setIsXRayMode(false);
                      setIsExplodedMode(false);
                      setTransparencyValue(0);
                      setCrossSectionAxis('none');
                    }}
                    className="p-2 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-left flex items-center gap-1.5 text-[11px] font-semibold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset View</span>
                  </button>

                  {/* Screenshot */}
                  <button
                    type="button"
                    onClick={handleCaptureScreenshot}
                    className="p-2 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-left flex items-center gap-1.5 text-[11px] font-semibold transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Screenshot</span>
                  </button>

                  {/* Measure */}
                  <button
                    type="button"
                    onClick={() => setIsMeasureOpen(true)}
                    className="p-2 rounded-lg bg-slate-850/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white text-left flex items-center gap-1.5 text-[11px] font-semibold transition-all"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Measure</span>
                  </button>
                </div>

                {/* Explode Distance Slider Popover */}
                {showExplodeSlider && (
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 text-[11px] mt-2 animate-in fade-in">
                    <div className="flex justify-between text-slate-300">
                      <span>Explode Spread</span>
                      <span className="font-mono text-orange-400">{Math.round(explodeFactor * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.5}
                      step={0.05}
                      value={explodeFactor}
                      onChange={(e) => setExplodeFactor(Number(e.target.value))}
                      className="w-full accent-orange-400"
                    />
                  </div>
                )}

                {/* Transparency Slider Popover */}
                {showTransparencySlider && (
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5 text-[11px] mt-2 animate-in fade-in">
                    <div className="flex justify-between text-slate-300">
                      <span>Body Opacity</span>
                      <span className="font-mono text-teal-400">{100 - transparencyValue}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      value={transparencyValue}
                      onChange={(e) => setTransparencyValue(Number(e.target.value))}
                      className="w-full accent-teal-400"
                    />
                  </div>
                )}

                {/* Cross Section Controls Popover */}
                {showCrossSectionControls && (
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-[11px] mt-2 animate-in fade-in">
                    <span className="font-bold text-slate-300 block">Cutting Plane Axis</span>
                    <div className="grid grid-cols-4 gap-1">
                      {(['none', 'x', 'y', 'z'] as const).map(axis => (
                        <button
                          key={axis}
                          type="button"
                          onClick={() => setCrossSectionAxis(axis)}
                          className={`py-1 rounded text-center font-mono uppercase text-[10px] font-bold ${
                            crossSectionAxis === axis
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {axis === 'none' ? 'Off' : axis.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {crossSectionAxis !== 'none' && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Cutting Position</span>
                          <span className="font-mono">{crossSectionPosition.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min={-1.8}
                          max={1.8}
                          step={0.05}
                          value={crossSectionPosition}
                          onChange={(e) => setCrossSectionPosition(Number(e.target.value))}
                          className="w-full accent-indigo-400"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* VIEWS (Camera presets matching the image & requirements) */}
              <div className="p-3.5 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    CAMERA PRESETS
                  </span>

                  <div className="grid grid-cols-2 gap-1">
                    {([
                      { id: 'front', label: 'Front' },
                      { id: 'back', label: 'Back' },
                      { id: 'left', label: 'Left' },
                      { id: 'right', label: 'Right' },
                      { id: 'top', label: 'Top' },
                      { id: 'bottom', label: 'Bottom' }
                    ] as const).map(preset => {
                      const isActive = viewPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setViewPreset(preset.id)}
                          className={`py-1.5 px-2 rounded-lg text-left text-xs capitalize transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span>{preset.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    REGIONAL FOCUS
                  </span>

                  <div className="space-y-1">
                    {([
                      { id: 'head', label: 'Head & Brain' },
                      { id: 'chest', label: 'Chest & Thorax' },
                      { id: 'abdomen', label: 'Abdomen & Viscera' },
                      { id: 'pelvis', label: 'Pelvic Cavity' },
                      { id: 'upper_limb', label: 'Upper Limbs (Arms)' },
                      { id: 'lower_limb', label: 'Lower Limbs (Legs)' }
                    ] as const).map(preset => {
                      const isActive = viewPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setViewPreset(preset.id)}
                          className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                            isActive
                              ? 'bg-teal-600 text-white font-bold shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <span>{preset.label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* INFORMATION WIDGET (Matching the image) */}
              <div className="p-3.5 space-y-2 mt-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  INFORMATION
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Select any part of the body to learn more about its structure, function and relations.
                </p>
                <div className="p-2 rounded-xl bg-slate-850/80 border border-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-400">Drag to rotate 360° · Pinch to zoom</span>
                </div>
              </div>

            </aside>

            {/* ---------------------------------------------------- */}
            {/* CENTER: 3D WEBGL THREE.JS CANVAS VIEWPORT            */}
            {/* ---------------------------------------------------- */}
            <main className="flex-1 relative flex flex-col min-w-0 bg-radial from-[#0e172a] via-[#080d1a] to-[#040711] overflow-hidden">
              
              {/* Top Quick Status Pill */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold flex items-center gap-2 text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>3D Model: {selectedStructure.name}</span>
                  <span className="text-slate-400 text-[10px]">({selectedStructure.systemName})</span>
                </div>

                {isIsolatedMode && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    Isolated View
                  </span>
                )}
                {isXRayMode && (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                    X-Ray Active
                  </span>
                )}
              </div>

              {/* The 3D Canvas Scene */}
              <div className="flex-1 relative w-full h-full min-h-0">
                <ThreeBodyScene
                  selectedStructureId={selectedStructure.id}
                  onSelectStructure={(struct) => setSelectedStructure(struct)}
                  activeSystems={activeSystems}
                  activeLayer={activeLayer}
                  viewPreset={viewPreset}
                  isXRayMode={isXRayMode}
                  transparencyValue={transparencyValue}
                  isIsolatedMode={isIsolatedMode}
                  crossSectionAxis={crossSectionAxis}
                  crossSectionPosition={crossSectionPosition}
                  showLabels={showLabels}
                  autoRotate={autoRotate}
                  bodySex={bodySex}
                  functionalView={functionalView}
                  onCaptureScreenshotRef={(cb) => { captureScreenshotRef.current = cb; }}
                />
              </div>

            </main>

            {/* ---------------------------------------------------- */}
            {/* RIGHT SIDEBAR: STRUCTURE DETAILS & FUNCTIONAL VIEW   */}
            {/* ---------------------------------------------------- */}
            <aside className="w-80 lg:w-96 bg-[#0c1324] border-l border-slate-800/80 flex flex-col shrink-0 overflow-y-auto text-xs divide-y divide-slate-800/60 z-20">
              
              {/* Structure Header & Visual Card (Matching the image) */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-black text-rose-500 uppercase tracking-wide">
                      {selectedStructure.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      {selectedStructure.systemName}
                    </p>
                    <p className="text-[11px] text-teal-400 italic font-mono mt-0.5">
                      {selectedStructure.latinName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(selectedStructure.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      bookmarkedIds.includes(selectedStructure.id)
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Bookmark Structure"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Anatomical Card Preview */}
                {selectedStructure.image && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-md group">
                    <img
                      src={selectedStructure.image}
                      alt={selectedStructure.name}
                      className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2.5 text-[10px] text-white/90 font-mono bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                      Photorealistic 3D Specimen
                    </span>
                  </div>
                )}

                {/* Sub-tabs: OVERVIEW, STRUCTURE, FUNCTION, CLINICAL */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-850 rounded-xl text-center text-[10px] font-bold">
                  {(['overview', 'structure', 'function', 'clinical'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setInspectorTab(tab)}
                      className={`py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                        inspectorTab === tab
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content Display */}
                {inspectorTab === 'overview' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">{selectedStructure.description}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedStructure.location}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Related Structures</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStructure.relatedStructures.map(relId => {
                          const rel = ANATOMY_STRUCTURES[relId];
                          return (
                            <button
                              key={relId}
                              type="button"
                              onClick={() => {
                                if (rel) setSelectedStructure(rel);
                              }}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-teal-300 border border-slate-700 text-[11px] font-medium transition-colors"
                            >
                              • {rel ? rel.name : relId.replace('_', ' ')}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-1">
                      <span className="text-[11px] font-bold text-teal-400 block">Fun Fact</span>
                      <p className="text-xs text-slate-300 leading-relaxed italic">{selectedStructure.funFact}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsIsolatedMode(true)}
                      className="w-full py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Explore in 3D</span>
                    </button>
                  </div>
                )}

                {inspectorTab === 'structure' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Microscopic Histology</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">{selectedStructure.histology}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vascular Supply</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedStructure.bloodSupply}</p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Innervation</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedStructure.innervation}</p>
                    </div>
                  </div>
                )}

                {inspectorTab === 'function' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Physiology</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">{selectedStructure.function}</p>
                    </div>
                  </div>
                )}

                {inspectorTab === 'clinical' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                      <span className="text-[11px] font-bold text-rose-400 block">Clinical Correlates & Pathology</span>
                      <p className="text-xs text-slate-200 leading-relaxed">{selectedStructure.clinicalNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* FUNCTIONAL VIEW (Matching the image) */}
              <div className="p-4 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  FUNCTIONAL VIEW
                </span>

                <div className="space-y-1.5">
                  {[
                    { id: 'circulation', label: 'Circulation' },
                    { id: 'respiration', label: 'Respiration' },
                    { id: 'digestion', label: 'Digestion' },
                    { id: 'nervous', label: 'Nervous Control' },
                    { id: 'lymph', label: 'Lymph Flow' }
                  ].map(item => {
                    const isSelected = functionalView === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setFunctionalView(item.id as any)}
                        className="flex items-center gap-2.5 cursor-pointer py-1 text-slate-300 hover:text-white"
                      >
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-teal-400 bg-teal-500/20' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                        </div>
                        <span className={`text-xs ${isSelected ? 'font-bold text-white' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanatory description */}
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  {functionalView === 'circulation'
                    ? 'This view shows blood circulation. Oxygen-rich blood (Arteries) is shown in red and oxygen-poor blood (Veins) is shown in blue.'
                    : functionalView === 'respiration'
                    ? 'Displays the respiratory airway from larynx down to the alveolar capillary gas exchange boundary.'
                    : functionalView === 'digestion'
                    ? 'Visualizes chemical digestion, peristalsis transit, and hepatic nutrient processing.'
                    : functionalView === 'nervous'
                    ? 'Highlights sensorimotor electrical conduction along central tracts and peripheral nerve plexuses.'
                    : 'Shows lymphatic drainage returning interstitial fluid through lymph nodes into the thoracic duct.'}
                </p>

                {/* Color Legend Indicators */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-2 rounded-sm bg-red-600" />
                    <span className="text-[11px] text-slate-300">Arteries (Oxygenated)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-2 rounded-sm bg-blue-500" />
                    <span className="text-[11px] text-slate-300">Veins (Deoxygenated)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-2 rounded-sm bg-purple-500" />
                    <span className="text-[11px] text-slate-300">Capillaries & Anastomoses</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>

          {/* ======================================================== */}
          {/* BOTTOM BAR: ANATOMICAL LAYERS (Matching the image)        */}
          {/* ======================================================== */}
          <footer className="h-28 bg-[#0c1324] border-t border-slate-800/80 flex flex-col justify-between shrink-0 z-20 px-4 py-2">
            
            {/* Title & Layer Tiles */}
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                ANATOMICAL LAYERS:
              </span>

              <div className="flex items-center gap-2">
                {ANATOMICAL_LAYERS.map(layer => {
                  const isActive = activeLayer >= layer.id;
                  const isCurrent = activeLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setActiveLayer(layer.id)}
                      className={`px-3 py-1.5 rounded-xl border text-center transition-all shrink-0 flex items-center gap-2 ${
                        isCurrent
                          ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md ring-1 ring-white/20'
                          : isActive
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                      <div className="text-left">
                        <div className="text-[11px] font-bold truncate leading-tight">{layer.name}</div>
                        <div className="text-[9px] text-slate-400 truncate opacity-80 leading-tight">{layer.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveLayer(8)}
                className="text-[11px] text-teal-400 hover:underline shrink-0"
              >
                Reset All Layers
              </button>
            </div>

            {/* Bottom Floating Controls Toolbar (Matching the image: Rotate, Zoom In, Zoom Out, Pan, Center, Cross Section, Transparency, Labels, Help) */}
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setAutoRotate(r => !r)}
                  className={`flex items-center gap-1.5 hover:text-white transition-colors ${autoRotate ? 'text-teal-400 font-bold' : ''}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const scene = workstationContainerRef.current;
                    if (scene) {
                      scene.dispatchEvent(new WheelEvent('wheel', { deltaY: -200 }));
                    }
                  }}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span>Zoom In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const scene = workstationContainerRef.current;
                    if (scene) {
                      scene.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
                    }
                  }}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span>Zoom Out</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewPreset('front')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span>Center</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCrossSectionControls(prev => !prev)}
                  className={`flex items-center gap-1.5 hover:text-white transition-colors ${crossSectionAxis !== 'none' ? 'text-indigo-400 font-bold' : ''}`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Cross Section</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTransparencySlider(prev => !prev)}
                  className={`flex items-center gap-1.5 hover:text-white transition-colors ${transparencyValue > 0 ? 'text-teal-400 font-bold' : ''}`}
                >
                  <span>Transparency</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLabels(l => !l)}
                  className={`flex items-center gap-1.5 hover:text-white transition-colors ${showLabels ? 'text-teal-400 font-bold' : ''}`}
                >
                  <span>Labels ({showLabels ? 'ON' : 'OFF'})</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Help & Shortcuts</span>
                </button>
              </div>
            </div>

          </footer>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS: SEARCH, SETTINGS, MEASURE                        */}
      {/* ======================================================== */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStructure={(struct) => {
          setSelectedStructure(struct);
          setActiveTab('atlas');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(l => !l)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(r => !r)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(s => !s)}
        detailLevel={detailLevel}
        onSetDetailLevel={setDetailLevel}
      />

      <MeasureModal
        isOpen={isMeasureOpen}
        onClose={() => setIsMeasureOpen(false)}
        onSelectStructures={(s1, s2) => {
          setSelectedStructure(s1);
          setActiveTab('atlas');
        }}
      />
    </div>
  );
};
