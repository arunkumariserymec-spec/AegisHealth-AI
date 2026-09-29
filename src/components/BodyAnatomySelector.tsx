import React, { useState } from 'react';
import { Symptom, ExtractedSymptom } from '../types';
import { MASTER_SYMPTOMS } from '../../shared/constants/symptoms_data';
import {
  RotateCcw,
  AlertTriangle,
  Check,
  Plus,
  Info,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Stethoscope,
  HeartPulse,
  Eye,
  Flame,
  Droplets,
  Zap,
  Footprints,
  Layers,
  Activity,
  User,
  Image as ImageIcon
} from 'lucide-react';

export type BodyRegionId =
  | 'head'
  | 'eyes'
  | 'throat'
  | 'chest'
  | 'lungs'
  | 'abdomen'
  | 'pelvis'
  | 'arms'
  | 'legs'
  | 'back'
  | 'general';

interface BodyRegionData {
  id: BodyRegionId;
  name: string;
  category: string;
  view: 'front' | 'back' | 'both';
  symptomIds: string[];
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconName: string;
  frontPos?: { top: string; left: string };
  backPos?: { top: string; left: string };
  realisticPosMale?: { top: string; left: string };
  realisticPosFemale?: { top: string; left: string };
}

const BODY_REGIONS: BodyRegionData[] = [
  {
    id: 'head',
    name: 'Head & Brain',
    category: 'Neurological',
    view: 'both',
    symptomIds: ['headache', 'sudden_weakness_paralysis', 'slurred_speech', 'loss_of_consciousness'],
    description: 'Neurological symptoms, cranial headaches, syncope, facial drooping.',
    icon: Thermometer,
    iconName: 'Head / Fever',
    frontPos: { top: '12%', left: '50%' },
    backPos: { top: '12%', left: '50%' },
    realisticPosMale: { top: '8%', left: '50%' },
    realisticPosFemale: { top: '8%', left: '50%' }
  },
  {
    id: 'eyes',
    name: 'Eyes & Vision',
    category: 'Ophthalmic',
    view: 'front',
    symptomIds: ['retro_orbital_pain'],
    description: 'Retro-orbital discomfort, eye pain behind sockets (common in dengue).',
    icon: Eye,
    iconName: 'Eyes',
    frontPos: { top: '8.5%', left: '68%' },
    realisticPosMale: { top: '11%', left: '54%' },
    realisticPosFemale: { top: '11%', left: '54%' }
  },
  {
    id: 'throat',
    name: 'Throat & Neck',
    category: 'ENT / Respiratory',
    view: 'front',
    symptomIds: ['sore_throat', 'runny_nose'],
    description: 'Pharyngeal irritation, pain swallowing, upper airway congestion.',
    icon: Flame,
    iconName: 'Throat / Cold',
    frontPos: { top: '23%', left: '50%' },
    realisticPosMale: { top: '16.5%', left: '50%' },
    realisticPosFemale: { top: '16.5%', left: '50%' }
  },
  {
    id: 'chest',
    name: 'Chest & Cardiovascular',
    category: 'Cardiovascular',
    view: 'front',
    symptomIds: ['chest_pain', 'palpitations'],
    description: 'Cardiac and thoracic discomfort, tightness, heart palpitations.',
    icon: HeartPulse,
    iconName: 'Chest / Heart',
    frontPos: { top: '33%', left: '38%' },
    realisticPosMale: { top: '23.5%', left: '44%' },
    realisticPosFemale: { top: '23.5%', left: '44%' }
  },
  {
    id: 'lungs',
    name: 'Lungs & Respiratory',
    category: 'Respiratory',
    view: 'front',
    symptomIds: ['shortness_of_breath', 'cough', 'wheezing'],
    description: 'Dyspnea, bronchial cough, asthma wheezing, respiratory distress.',
    icon: Stethoscope,
    iconName: 'Chest / Cough',
    frontPos: { top: '35%', left: '62%' },
    realisticPosMale: { top: '25%', left: '56%' },
    realisticPosFemale: { top: '25%', left: '56%' }
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Digestive',
    category: 'Gastrointestinal',
    view: 'front',
    symptomIds: ['abdominal_pain', 'nausea', 'vomiting', 'loss_of_appetite'],
    description: 'Gastric cramps, nausea, vomiting, enteric complaints.',
    icon: Activity,
    iconName: 'Stomach / Cramps',
    frontPos: { top: '48%', left: '50%' },
    realisticPosMale: { top: '36%', left: '50%' },
    realisticPosFemale: { top: '36%', left: '50%' }
  },
  {
    id: 'pelvis',
    name: 'Pelvis & Urinary',
    category: 'Urological / Lower GI',
    view: 'front',
    symptomIds: ['diarrhea', 'burning_urination', 'frequent_urination'],
    description: 'Loose stools, dysuria, urinary frequency, lower gastrointestinal.',
    icon: Droplets,
    iconName: 'Urinary / Pelvis',
    frontPos: { top: '59%', left: '50%' },
    realisticPosMale: { top: '47%', left: '50%' },
    realisticPosFemale: { top: '47%', left: '50%' }
  },
  {
    id: 'arms',
    name: 'Arms & Upper Limbs',
    category: 'Neuromuscular',
    view: 'both',
    symptomIds: ['sudden_weakness_paralysis', 'joint_pain'],
    description: 'Arm numbness, unilateral limb weakness, elbow/wrist arthralgia.',
    icon: Zap,
    iconName: 'Arm / Weakness',
    frontPos: { top: '42%', left: '18%' },
    backPos: { top: '42%', left: '18%' },
    realisticPosMale: { top: '32%', left: '23%' },
    realisticPosFemale: { top: '32%', left: '23%' }
  },
  {
    id: 'legs',
    name: 'Legs, Knees & Feet',
    category: 'Musculoskeletal',
    view: 'both',
    symptomIds: ['joint_pain'],
    description: 'Knee joint pain, swelling, lower limb mobility issues.',
    icon: Footprints,
    iconName: 'Knee / Joints',
    frontPos: { top: '74%', left: '42%' },
    backPos: { top: '74%', left: '42%' },
    realisticPosMale: { top: '71%', left: '43%' },
    realisticPosFemale: { top: '71%', left: '43%' }
  },
  {
    id: 'back',
    name: 'Spine & Flank (Back)',
    category: 'Musculoskeletal',
    view: 'back',
    symptomIds: ['body_ache'],
    description: 'Backache, flank pain, generalized vertebral/musculoskeletal soreness.',
    icon: Layers,
    iconName: 'Spine / Backache',
    backPos: { top: '38%', left: '50%' },
    realisticPosMale: { top: '34%', left: '50%' },
    realisticPosFemale: { top: '34%', left: '50%' }
  },
  {
    id: 'general',
    name: 'Systemic / Whole Body',
    category: 'Systemic / Constitutional',
    view: 'both',
    symptomIds: ['fever', 'chills', 'fatigue', 'body_ache', 'skin_rash'],
    description: 'Fever, rigor, extreme tiredness, myalgia, dermatological rash.',
    icon: Sparkles,
    iconName: 'Whole Body'
  }
];

interface BodyAnatomySelectorProps {
  collectedSymptoms: ExtractedSymptom[];
  onToggleSymptom: (symptomId: string) => void;
  onOpenSOS: () => void;
}

export const BodyAnatomySelector: React.FC<BodyAnatomySelectorProps> = ({
  collectedSymptoms,
  onToggleSymptom,
  onOpenSOS
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<BodyRegionId>('head');
  const [viewOrientation, setViewOrientation] = useState<'front' | 'back'>('front');
  const [bodySex, setBodySex] = useState<'male' | 'female'>('male');
  const [modelType, setModelType] = useState<'realistic' | 'vector'>('realistic');
  const [clickedSpotId, setClickedSpotId] = useState<string | null>(null);

  const selectedRegion = BODY_REGIONS.find(r => r.id === selectedRegionId) || BODY_REGIONS[0];

  const handleSpotClick = (spotId: BodyRegionId) => {
    setSelectedRegionId(spotId);
    setClickedSpotId(spotId);
    setTimeout(() => {
      setClickedSpotId(prev => (prev === spotId ? null : prev));
    }, 650);
  };

  // Helper to count active symptoms in a region
  const getSelectedCountForRegion = (region: BodyRegionData) => {
    return region.symptomIds.filter(id => collectedSymptoms.some(s => s.id === id)).length;
  };

  // Symptoms in the current region
  const regionSymptoms = selectedRegion.symptomIds.map(id => {
    return MASTER_SYMPTOMS.find(s => s.id === id);
  }).filter((s): s is Symptom => Boolean(s));

  // Current hotspots for the active view
  const currentViewHotspots = BODY_REGIONS.filter(r => {
    if (viewOrientation === 'front') {
      return Boolean(r.frontPos);
    } else {
      return Boolean(r.backPos);
    }
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      
      {/* Top Controls Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Human Body Anatomy Map
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Switch between realistic male and female figures or inspect localized clinical symptoms
          </p>
        </div>

        {/* Top Controls: Sex Switcher (Man vs Woman) & Style (Realistic vs Vector) */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Man vs Woman Toggle */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setBodySex('male')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                bodySex === 'male'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👨</span>
              <span>Man</span>
            </button>
            <button
              type="button"
              onClick={() => setBodySex('female')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                bodySex === 'female'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👩</span>
              <span>Woman</span>
            </button>
          </div>

          {/* Model Style Switcher */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setModelType('realistic')}
              className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                modelType === 'realistic'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3 h-3 text-teal-600" />
              <span>Realistic</span>
            </button>
            <button
              type="button"
              onClick={() => setModelType('vector')}
              className={`px-2 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                modelType === 'vector'
                  ? 'bg-white text-teal-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 text-teal-600" />
              <span>Vector</span>
            </button>
          </div>

          {/* Anterior / Posterior (Vector mode) */}
          {modelType === 'vector' && (
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewOrientation('front')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  viewOrientation === 'front'
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setViewOrientation('back')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  viewOrientation === 'back'
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Anatomy Canvas + Right Region Symptoms Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        
        {/* Left 5 Cols: Visual Interactive Body with Hotspots */}
        <div className="md:col-span-5 p-4 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/40 flex flex-col items-center justify-center relative select-none">
          
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-1.5">
            <span>{bodySex === 'male' ? 'Realistic Male Body' : 'Realistic Female Body'}</span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-medium">
              Click Hotspot Icons
            </span>
          </div>

          {/* Body Canvas: Realistic Image OR Vector SVG */}
          <div className="relative w-52 h-[390px] sm:w-56 sm:h-[400px] rounded-xl overflow-hidden bg-slate-50/80 flex items-center justify-center border border-slate-200">
            {modelType === 'realistic' ? (
              <div className="relative w-full h-full">
                <img
                  src={
                    bodySex === 'male'
                      ? '/src/assets/images/realistic_man_anatomy_1790532228432.jpg'
                      : '/src/assets/images/realistic_woman_anatomy_1790532242104.jpg'
                  }
                  alt={bodySex === 'male' ? 'Realistic Man Anatomy' : 'Realistic Woman Anatomy'}
                  className="w-full h-full object-cover object-center select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspots for Realistic Man/Woman */}
                {BODY_REGIONS.map(spot => {
                  const Icon = spot.icon;
                  const isSelected = selectedRegionId === spot.id;
                  const count = getSelectedCountForRegion(spot);
                  const pos = bodySex === 'male' ? spot.realisticPosMale : spot.realisticPosFemale;
                  if (!pos) return null;

                  return (
                    <div
                      key={spot.id}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    >
                      {clickedSpotId === spot.id && (
                        <span className="absolute -inset-2 rounded-full bg-teal-400/40 animate-ping pointer-events-none" />
                      )}

                      <button
                        type="button"
                        onClick={() => handleSpotClick(spot.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow-md select-none transition-all ${
                          isSelected
                            ? 'bg-teal-600 text-white ring-4 ring-teal-200 shadow-xl scale-125 z-30'
                            : count > 0
                            ? 'bg-teal-700 text-white ring-2 ring-teal-300 scale-110'
                            : 'bg-white/95 text-slate-800 hover:text-teal-700 hover:bg-white hover:scale-110 border border-slate-300'
                        }`}
                        title={`${spot.iconName}: ${spot.name}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />

                        {count > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-500 text-white text-[8px] font-bold flex items-center justify-center border border-white shadow-xs">
                            {count}
                          </span>
                        )}
                      </button>

                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-40 transition-all duration-150">
                        <div className="bg-slate-900/95 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-slate-700 flex items-center gap-1">
                          <Icon className="w-3 h-3 text-teal-300" />
                          <span>{spot.name.split('&')[0].trim()}</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Vector SVG Human Figure */
              <div className="relative w-full h-full">
                <svg
                  viewBox="0 0 200 400"
                  className="w-full h-full drop-shadow-sm transition-all"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0D9488" />
                      <stop offset="100%" stopColor="#0F766E" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 100 20 C 85 20, 75 35, 75 55 C 75 75, 85 90, 100 90 C 115 90, 125 75, 125 55 C 125 35, 115 20, 100 20 Z"
                    fill={selectedRegionId === 'head' || selectedRegionId === 'eyes' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('head')}
                  />
                  <path
                    d="M 92 90 L 108 90 L 112 105 L 88 105 Z"
                    fill={selectedRegionId === 'throat' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('throat')}
                  />
                  <path
                    d="M 88 105 L 112 105 L 140 120 L 132 170 L 68 170 L 60 120 Z"
                    fill={
                      viewOrientation === 'back'
                        ? selectedRegionId === 'back' ? 'url(#activeGrad)' : 'url(#bodyGrad)'
                        : selectedRegionId === 'chest' || selectedRegionId === 'lungs'
                        ? 'url(#activeGrad)'
                        : 'url(#bodyGrad)'
                    }
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => {
                      if (viewOrientation === 'back') setSelectedRegionId('back');
                      else setSelectedRegionId('chest');
                    }}
                  />
                  <path
                    d="M 68 170 L 132 170 L 126 220 L 74 220 Z"
                    fill={
                      viewOrientation === 'back'
                        ? selectedRegionId === 'back' ? 'url(#activeGrad)' : 'url(#bodyGrad)'
                        : selectedRegionId === 'abdomen' ? 'url(#activeGrad)' : 'url(#bodyGrad)'
                    }
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => {
                      if (viewOrientation === 'back') setSelectedRegionId('back');
                      else setSelectedRegionId('abdomen');
                    }}
                  />
                  <path
                    d="M 74 220 L 126 220 L 118 250 L 100 255 L 82 250 Z"
                    fill={selectedRegionId === 'pelvis' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('pelvis')}
                  />
                  <path
                    d="M 60 120 L 40 180 L 30 240 L 42 242 L 52 185 L 68 135 Z"
                    fill={selectedRegionId === 'arms' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('arms')}
                  />
                  <path
                    d="M 140 120 L 160 180 L 170 240 L 158 242 L 148 185 L 132 135 Z"
                    fill={selectedRegionId === 'arms' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('arms')}
                  />
                  <path
                    d="M 82 250 L 100 255 L 96 320 L 92 380 L 80 380 L 76 320 L 74 250 Z"
                    fill={selectedRegionId === 'legs' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('legs')}
                  />
                  <path
                    d="M 100 255 L 118 250 L 126 250 L 124 320 L 120 380 L 108 380 L 104 320 Z"
                    fill={selectedRegionId === 'legs' ? 'url(#activeGrad)' : 'url(#bodyGrad)'}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:opacity-90"
                    onClick={() => setSelectedRegionId('legs')}
                  />
                </svg>

                {/* Hotspots on Vector */}
                {currentViewHotspots.map(spot => {
                  const Icon = spot.icon;
                  const isSelected = selectedRegionId === spot.id;
                  const count = getSelectedCountForRegion(spot);
                  const pos = viewOrientation === 'front' ? spot.frontPos : spot.backPos;
                  if (!pos) return null;

                  return (
                    <div
                      key={spot.id}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedRegionId(spot.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow-md select-none ${
                          isSelected
                            ? 'bg-teal-600 text-white ring-4 ring-teal-200 shadow-lg'
                            : count > 0
                            ? 'bg-teal-700 text-white ring-2 ring-teal-400'
                            : 'bg-white/95 text-slate-700 hover:text-teal-700 hover:bg-teal-50 border border-slate-300'
                        }`}
                        title={`${spot.iconName}: ${spot.name}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {count > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-500 text-white text-[8px] font-bold flex items-center justify-center border border-white shadow-xs">
                            {count}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Region Selector Chips */}
          <div className="w-full mt-3 flex flex-wrap gap-1 justify-center">
            {BODY_REGIONS.map(reg => {
              const Icon = reg.icon;
              const isSelected = selectedRegionId === reg.id;
              const count = getSelectedCountForRegion(reg);
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegionId(reg.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white font-semibold shadow-sm ring-2 ring-teal-300'
                      : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-3 h-3 shrink-0 ${isSelected ? 'text-teal-200' : 'text-teal-600'}`} />
                  <span>{reg.iconName}</span>
                  {count > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Region Clinical Symptoms & Options */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            {/* Region Title */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5">
                  {React.createElement(selectedRegion.icon, { className: "w-4 h-4 text-teal-600 shrink-0" })}
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                    {selectedRegion.iconName} · {selectedRegion.category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {selectedRegion.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedRegion.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {getSelectedCountForRegion(selectedRegion)} Selected
                </span>
              </div>
            </div>

            {/* Region Clinical Symptoms Cards */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Select Observed Symptoms:
              </span>

              {regionSymptoms.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No symptoms mapped to this region.</p>
              ) : (
                <div className="space-y-2">
                  {regionSymptoms.map((sym) => {
                    const isAdded = collectedSymptoms.some(s => s.id === sym.id);
                    return (
                      <div
                        key={sym.id}
                        onClick={() => onToggleSymptom(sym.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isAdded
                            ? 'bg-teal-50/80 border-teal-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-slate-900">
                              {sym.name}
                            </span>

                            {sym.isEmergencyIndicator && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                                <span>Emergency Red Flag</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500">
                            <span>Aliases: {sym.aliases.slice(0, 3).join(', ')}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                            isAdded
                              ? 'bg-teal-600 text-white'
                              : 'border border-slate-300 hover:border-teal-500 text-slate-400'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Whole-Body / Systemic Shortcut Banner */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-slate-700">
                Having systemic symptoms (Fever, Chills, Generalized Fatigue)?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRegionId('general')}
              className="text-xs font-semibold text-teal-700 hover:underline shrink-0"
            >
              Open Whole Body
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
