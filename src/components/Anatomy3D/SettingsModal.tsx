import React from 'react';
import { X, Sliders, Moon, Sun, Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  detailLevel: 'low' | 'medium' | 'high';
  onSetDetailLevel: (level: 'low' | 'medium' | 'high') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  showLabels,
  onToggleLabels,
  autoRotate,
  onToggleAutoRotate,
  soundEnabled,
  onToggleSound,
  detailLevel,
  onSetDetailLevel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3D Anatomy Settings</h3>
              <p className="text-[11px] text-slate-400">Rendering & visualization preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 space-y-4 text-xs">
          {/* Labels Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">3D Floating Anatomical Labels</span>
              <span className="text-[11px] text-slate-400">Show pins and leader lines to major organs</span>
            </div>
            <button
              onClick={onToggleLabels}
              className={`w-11 h-6 rounded-full transition-colors relative ${showLabels ? 'bg-teal-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${showLabels ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Auto-Rotate Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">Turntable Auto-Rotation</span>
              <span className="text-[11px] text-slate-400">Smooth 360° continuous rotation</span>
            </div>
            <button
              onClick={onToggleAutoRotate}
              className={`w-11 h-6 rounded-full transition-colors relative ${autoRotate ? 'bg-teal-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${autoRotate ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <span className="font-bold text-white block">Anatomical Audio Effects</span>
              <span className="text-[11px] text-slate-400">Heartbeat pulses and quiz audio cues</span>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-teal-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${soundEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Graphical Detail Level */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-white block">Mesh Geometric Resolution</span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['low', 'medium', 'high'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onSetDetailLevel(lvl)}
                  className={`py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-colors ${
                    detailLevel === lvl
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
