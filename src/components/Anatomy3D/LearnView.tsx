import React, { useState } from 'react';
import { ANATOMY_SYSTEMS, AnatomySystem } from '../../anatomy/systemsData';
import { ANATOMY_STRUCTURES, getStructuresBySystem, AnatomicalStructure } from '../../anatomy/anatomyData';
import {
  BookOpen,
  ChevronRight,
  Eye,
  Activity,
  Heart,
  Brain,
  Bone,
  Wind,
  Droplet,
  Shield,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LearnViewProps {
  onInspectSystemIn3D: (systemId: string) => void;
  onInspectStructureIn3D: (structure: AnatomicalStructure) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  onInspectSystemIn3D,
  onInspectStructureIn3D
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('cardiovascular');

  const currentSystem = ANATOMY_SYSTEMS.find(s => s.id === selectedSystemId) || ANATOMY_SYSTEMS[0];
  const systemStructures = getStructuresBySystem(selectedSystemId);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Anatomy & Physiology Learning Encyclopedia</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                12 Body Systems
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive medical curriculum with structural relations, microscopic histology, and clinical correlates
            </p>
          </div>
        </div>

        <button
          onClick={() => onInspectSystemIn3D(selectedSystemId)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Inspect {currentSystem.name} in 3D</span>
        </button>
      </div>

      {/* Two Column Layout: Systems Selector (Left) + Detail Reader (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Systems List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Choose Human System
          </span>
          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {ANATOMY_SYSTEMS.map(sys => {
              const isSelected = selectedSystemId === sys.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystemId(sys.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all duration-150 ${
                    isSelected
                      ? 'bg-slate-800 border-teal-500 shadow-md ring-1 ring-teal-500/40 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{sys.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{sys.name}</div>
                      <div className="text-[10px] text-slate-400 italic truncate">{sys.latinName}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-teal-400 translate-x-0.5' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* System Detailed Reading Panel (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* System Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentSystem.emoji}</span>
                <h3 className="text-xl font-bold text-white">{currentSystem.name}</h3>
              </div>
              <p className="text-xs text-teal-400 font-mono italic mt-0.5">{currentSystem.latinName}</p>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
              ~{currentSystem.structureCount} anatomical structures
            </span>
          </div>

          {/* Overview Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Overview</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentSystem.description}
            </p>
          </div>

          {/* Core Key Functions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Physiological Functions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSystem.keyFunctions.map((fn, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>{fn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Significance */}
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <Activity className="w-4 h-4" />
              <span>Clinical Significance & Common Pathologies</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentSystem.clinicalSignificance}
            </p>
          </div>

          {/* Constituent Interactive 3D Structures in this System */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selectable Structures in 3D Model ({systemStructures.length})
              </h4>
              <span className="text-[11px] text-teal-400">Click to explore in 3D</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {systemStructures.map(struct => (
                <div
                  key={struct.id}
                  onClick={() => onInspectStructureIn3D(struct)}
                  className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                      {struct.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {struct.function}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                    <span>Region: {struct.regionName}</span>
                    <span>·</span>
                    <span>Layer {struct.layer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
