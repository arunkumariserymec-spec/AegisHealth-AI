import React, { useState } from 'react';
import { X, Ruler, ArrowRight, Check } from 'lucide-react';
import { ANATOMY_LIST, AnatomicalStructure } from '../../anatomy/anatomyData';

interface MeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStructures: (struct1: AnatomicalStructure, struct2: AnatomicalStructure) => void;
}

export const MeasureModal: React.FC<MeasureModalProps> = ({
  isOpen,
  onClose,
  onSelectStructures
}) => {
  const [pointA, setPointA] = useState<string>('heart');
  const [pointB, setPointB] = useState<string>('femur_bone');

  if (!isOpen) return null;

  const structA = ANATOMY_LIST.find(s => s.id === pointA) || ANATOMY_LIST[0];
  const structB = ANATOMY_LIST.find(s => s.id === pointB) || ANATOMY_LIST[1];

  // Calculate 3D euclidean distance between anatomical coordinates
  const dx = structA.position3D[0] - structB.position3D[0];
  const dy = structA.position3D[1] - structB.position3D[1];
  const dz = structA.position3D[2] - structB.position3D[2];
  const distanceWorld = Math.hypot(dx, dy, dz);
  // Scale world units to standard anatomical anatomical scale (approx 45cm per unit)
  const distanceCm = (distanceWorld * 45).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Anatomical Caliper & Ruler</h3>
              <p className="text-[11px] text-slate-400">Measure distance between anatomical structures</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Caliper Points */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase">First Structure (Point A)</label>
            <select
              value={pointA}
              onChange={(e) => setPointA(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            >
              {ANATOMY_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.systemName})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase">Second Structure (Point B)</label>
            <select
              value={pointB}
              onChange={(e) => setPointB(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden"
            >
              {ANATOMY_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.systemName})</option>
              ))}
            </select>
          </div>

          {/* Result Display */}
          <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 text-center space-y-1">
            <span className="text-[11px] text-slate-400">Anatomical Distance</span>
            <div className="text-3xl font-black text-teal-400 font-mono">
              {distanceCm} cm
            </div>
            <p className="text-[10px] text-slate-400">
              Between {structA.name} and {structB.name}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSelectStructures(structA, structB);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
          >
            Inspect Both in 3D
          </button>
        </div>
      </div>
    </div>
  );
};
