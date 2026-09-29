import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, ExtractedSymptom, AssessmentResult, Symptom } from '../types';
import { MASTER_SYMPTOMS } from '../../shared/constants/symptoms_data';
import { ThreeHumanAtlas } from '../components/ThreeHumanAtlas';
import { getActiveSession, saveActiveSession } from '../services/sessionStorageService';
import {
  RotateCcw,
  AlertTriangle,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  HeartPulse,
  Bot,
  User,
  Activity,
  Layers,
  PhoneCall,
  X,
  Thermometer,
  Stethoscope,
  Eye,
  Flame,
  Droplets,
  Zap,
  Footprints,
  Box,
  Bone,
  Info,
  Maximize2,
  Filter,
  CheckCircle2,
  Building2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Move,
  Target,
  Scan,
  Bookmark
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

export type AnatomyLayerId = 'all' | 'internal' | 'skeletal' | 'muscular' | 'external';
export type SymptomNatureFilter = 'all' | 'internal' | 'external';

export interface AnatomyLayerDefinition {
  id: AnatomyLayerId;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ANATOMY_LAYERS: AnatomyLayerDefinition[] = [
  {
    id: 'all',
    name: 'All Anatomy Layers',
    tagline: 'Comprehensive Human Scan',
    description: 'Displays the complete physiological figure with all internal organs, bones, muscles, and surface symptoms.',
    badge: 'Full Body',
    color: 'teal',
    icon: Layers
  },
  {
    id: 'internal',
    name: 'Internal Organs',
    tagline: 'Visceral & Thoracoabdominal Organs',
    description: 'Highlights the brain, heart, lungs, stomach, liver, pancreas, intestines, kidneys, and bladder.',
    badge: 'Visceral Systems',
    color: 'rose',
    icon: HeartPulse
  },
  {
    id: 'skeletal',
    name: 'Skeletal Framework',
    tagline: 'Axial & Appendicular Skeleton',
    description: 'Isolates the skull/cranium, cervical & lumbar spine, ribcage, pelvic girdle, femur, and knee joints.',
    badge: 'Bones & Joints',
    color: 'amber',
    icon: Bone
  },
  {
    id: 'muscular',
    name: 'Muscular System',
    tagline: 'Striated Muscle & Neuromuscular',
    description: 'Focuses on pectorals, rectus abdominis, core wall, deltoids, biceps, and lower limb musculature.',
    badge: 'Muscles & Core',
    color: 'indigo',
    icon: Zap
  },
  {
    id: 'external',
    name: 'External & Sensory',
    tagline: 'Cutaneous, Dermatological & ENT',
    description: 'Visualizes skin rashes, eye orbital structures, nasopharynx, throat, and superficial somatic symptoms.',
    badge: 'Skin & Senses',
    color: 'emerald',
    icon: Sparkles
  }
];

export interface BodyRegionData {
  id: BodyRegionId;
  name: string;
  latinName: string;
  category: string;
  layers: AnatomyLayerId[];
  view: 'front' | 'back' | 'both';
  symptomIds: string[];
  description: string;
  structuralComposition: string;
  internalSymptomsDetails: string;
  externalSymptomsDetails: string;
  recommendedSpecialist: string;
  emergencyGuidance: string;
  icon: React.ComponentType<{ className?: string }>;
  iconName: string;
  // Hotspot positions on vector SVG
  frontPos?: { top: string; left: string };
  backPos?: { top: string; left: string };
  // Hotspot positions on realistic male/female medical image
  realisticPosMale?: { top: string; left: string };
  realisticPosFemale?: { top: string; left: string };
}

export const BODY_REGIONS: BodyRegionData[] = [
  {
    id: 'head',
    name: 'Head & Cranium',
    latinName: 'Caput, Cranium et Cerebrum',
    category: 'Neurological & Cerebrovascular',
    layers: ['internal', 'skeletal', 'external'],
    view: 'both',
    symptomIds: ['headache', 'sudden_weakness_paralysis', 'slurred_speech', 'loss_of_consciousness'],
    description: 'Encompasses the bony neurocranium, meninges, cerebral cortex, cerebellum, and brainstem.',
    structuralComposition: 'Frontal/parietal bones, meningeal dura mater, cerebral hemispheres, circle of Willis arterial ring, and cranial nerves I-XII.',
    internalSymptomsDetails: 'Intracranial pressure, severe migraines, cerebral ischemia, vascular pulsatile headaches, and syncope.',
    externalSymptomsDetails: 'Scalp tenderness, facial asymmetry/drooping, superficial temporal throbbing, and cranial nerve paresis.',
    recommendedSpecialist: 'Neurologist / Neurophysician',
    emergencyGuidance: 'Sudden weakness, facial drooping, or slurred speech indicates acute stroke (FAST alert) requiring hospital care within 3 hours.',
    icon: Thermometer,
    iconName: 'Head / Fever',
    frontPos: { top: '12%', left: '50%' },
    backPos: { top: '12%', left: '50%' },
    realisticPosMale: { top: '8%', left: '50%' },
    realisticPosFemale: { top: '8%', left: '50%' }
  },
  {
    id: 'eyes',
    name: 'Eyes & Upper Face',
    latinName: 'Bulbus Oculi & Apparatus Opticus',
    category: 'Ophthalmic & Sensory',
    layers: ['external', 'internal'],
    view: 'front',
    symptomIds: ['retro_orbital_pain'],
    description: 'Orbital cavities housing the eyeballs, extraocular muscles, optic nerves, and lacrimal apparatus.',
    structuralComposition: 'Cornea, sclera, uvea, neurosensory retina, optic nerve (CN II), and ophthalmic artery branch of internal carotid.',
    internalSymptomsDetails: 'Severe retro-orbital aching behind eyeballs (pathognomonic for dengue fever), optic neuritis, and elevated intraocular pressure.',
    externalSymptomsDetails: 'Conjunctival injection, eyelid puffiness, photophobia, and localized superficial orbital tenderness.',
    recommendedSpecialist: 'Ophthalmologist / Infectious Disease Physician',
    emergencyGuidance: 'Severe retro-orbital pain accompanied by high continuous fever and chills warrants immediate dengue NS1/platelet testing.',
    icon: Eye,
    iconName: 'Eyes',
    frontPos: { top: '8.5%', left: '68%' },
    realisticPosMale: { top: '11%', left: '54%' },
    realisticPosFemale: { top: '11%', left: '54%' }
  },
  {
    id: 'throat',
    name: 'Throat & Upper Airway',
    latinName: 'Pharynx, Larynx et Trachea',
    category: 'ENT & Upper Respiratory',
    layers: ['external', 'internal', 'muscular'],
    view: 'front',
    symptomIds: ['sore_throat', 'runny_nose'],
    description: 'Pharyngeal mucosa, tonsillar pillars, larynx, vocal cords, and upper cervical trachea.',
    structuralComposition: 'Pharyngeal constrictor muscles, thyroid/cricoid cartilages, epiglottis, recurrent laryngeal nerve, and tonsillar lymphatic ring.',
    internalSymptomsDetails: 'Deep pharyngeal pain on swallowing (odynophagia), laryngeal stridor, and upper airway mucosal edema.',
    externalSymptomsDetails: 'Anterior cervical lymphadenopathy, neck stiffness, rhinorrhea (runny nose), and nasal turbinate congestion.',
    recommendedSpecialist: 'ENT Specialist (Otolaryngologist)',
    emergencyGuidance: 'Inability to swallow saliva or audible whistling stridor when breathing requires urgent emergency airway clearance.',
    icon: Flame,
    iconName: 'Throat / Cold',
    frontPos: { top: '23%', left: '50%' },
    realisticPosMale: { top: '16.5%', left: '50%' },
    realisticPosFemale: { top: '16.5%', left: '50%' }
  },
  {
    id: 'chest',
    name: 'Chest & Cardiovascular',
    latinName: 'Thorax, Cor & Mediastinum',
    category: 'Cardiovascular & Mediastinal',
    layers: ['internal', 'muscular', 'skeletal'],
    view: 'front',
    symptomIds: ['chest_pain', 'palpitations'],
    description: 'Middle mediastinum containing the four-chambered heart, pericardium, ascending aorta, and great coronary vessels.',
    structuralComposition: 'Myocardium, pericardial sac, coronary arteries (LAD/RCA), aortic arch, sternum, and intercostal muscles.',
    internalSymptomsDetails: 'Substernal chest pressure, angina radiating to left arm/jaw, irregular cardiac palpitations, and tachycardia.',
    externalSymptomsDetails: 'Costochondral junction tenderness (costochondritis), chest wall muscular strain, and superficial bruising.',
    recommendedSpecialist: 'Cardiologist / Emergency Medicine Physician',
    emergencyGuidance: 'Crushing central chest pain with diaphoresis (sweating) or radiation to jaw/arm is a critical cardiac alert. Call 108 / 112 immediately.',
    icon: HeartPulse,
    iconName: 'Chest / Heart',
    frontPos: { top: '33%', left: '38%' },
    realisticPosMale: { top: '23.5%', left: '44%' },
    realisticPosFemale: { top: '23.5%', left: '44%' }
  },
  {
    id: 'lungs',
    name: 'Lungs & Respiratory',
    latinName: 'Pulmones, Pleura & Arbor Bronchialis',
    category: 'Pulmonary & Respiratory',
    layers: ['internal', 'skeletal', 'muscular'],
    view: 'front',
    symptomIds: ['shortness_of_breath', 'cough', 'wheezing'],
    description: 'Thoracic pleural cavities containing the right (3 lobes) and left (2 lobes) lungs and alveolar bronchial trees.',
    structuralComposition: 'Visceral & parietal pleura, pulmonary capillaries, alveoli (types I & II pneumocytes), diaphragm, and rib cage.',
    internalSymptomsDetails: 'Dyspnea (shortness of breath), bronchial spasms, wheezing, pleuritic chest friction, and lung consolidation.',
    externalSymptomsDetails: 'Accessory muscle retraction (sternocleidomastoid retractions during breathing), productive cough, and chest wall expansion lag.',
    recommendedSpecialist: 'Pulmonologist / Chest Physician',
    emergencyGuidance: 'Severe breathlessness accompanied by blue-tinged lips (cyanosis) or wheezing at rest requires urgent oxygenation & nebulization.',
    icon: Stethoscope,
    iconName: 'Chest / Cough',
    frontPos: { top: '35%', left: '62%' },
    realisticPosMale: { top: '25%', left: '56%' },
    realisticPosFemale: { top: '25%', left: '56%' }
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Digestive System',
    latinName: 'Abdomen, Ventriculus, Hepar & Intestina',
    category: 'Gastrointestinal & Enteric',
    layers: ['internal', 'muscular'],
    view: 'front',
    symptomIds: ['abdominal_pain', 'nausea', 'vomiting', 'loss_of_appetite'],
    description: 'Peritoneal cavity containing stomach, liver, gallbladder, pancreas, spleen, small intestine, and colon.',
    structuralComposition: 'Gastric mucosa, mesenteric vascular arcades, hepatic parenchyma, abdominal rectus muscular wall, and peritoneal serosa.',
    internalSymptomsDetails: 'Visceral periumbilical or epigastric cramping, biliary colic, nausea, reflex vomiting, and profound anorexia (loss of appetite).',
    externalSymptomsDetails: 'Abdominal wall muscular rigidity (guarding), cutaneous distension, localized McBurney point tenderness, and rebound discomfort.',
    recommendedSpecialist: 'Gastroenterologist / General Surgeon',
    emergencyGuidance: 'Severe unremitting lower right quadrant abdominal pain with fever suggests acute appendicitis; seek surgical assessment without taking laxatives.',
    icon: Activity,
    iconName: 'Stomach / Cramps',
    frontPos: { top: '48%', left: '50%' },
    realisticPosMale: { top: '36%', left: '50%' },
    realisticPosFemale: { top: '36%', left: '50%' }
  },
  {
    id: 'pelvis',
    name: 'Pelvis & Urinary Tract',
    latinName: 'Pelvis, Vesica Urinaria & Colorectum',
    category: 'Urological & Lower Gastrointestinal',
    layers: ['internal', 'skeletal'],
    view: 'front',
    symptomIds: ['diarrhea', 'burning_urination', 'frequent_urination'],
    description: 'True and false pelvis containing urinary bladder, distal ureters, urethra, rectum, and reproductive organs.',
    structuralComposition: 'Bony pelvic ring (ilium, ischium, pubis, sacrum), detrusor muscle, ureteral orifices, and rectosigmoid junction.',
    internalSymptomsDetails: 'Dysuria (burning during urination), urinary frequency, bladder spasms, and watery hypermotile intestinal diarrhea.',
    externalSymptomsDetails: 'Suprapubic tenderness, perineal soreness, pelvic girdle strain, and localized pelvic muscle spasm.',
    recommendedSpecialist: 'Urologist / Nephrologist / General Physician',
    emergencyGuidance: 'High fever with flank pain and burning urination signals ascending pyelonephritis (kidney infection) requiring prompt antibiotics.',
    icon: Droplets,
    iconName: 'Urinary / Pelvis',
    frontPos: { top: '59%', left: '50%' },
    realisticPosMale: { top: '47%', left: '50%' },
    realisticPosFemale: { top: '47%', left: '50%' }
  },
  {
    id: 'arms',
    name: 'Arms & Upper Limbs',
    latinName: 'Membrum Superius (Brachium & Antebrachium)',
    category: 'Neuromuscular & Musculoskeletal',
    layers: ['muscular', 'skeletal', 'external'],
    view: 'both',
    symptomIds: ['sudden_weakness_paralysis', 'joint_pain'],
    description: 'Shoulder girdle, humerus, radius, ulna, and peripheral brachial plexus nerve distribution.',
    structuralComposition: 'Deltoid, biceps, triceps muscles, glenohumeral & elbow joints, radial/median/ulnar nerves, and brachial artery.',
    internalSymptomsDetails: 'Deep neural radicular tingling, acute unilateral motor paralysis from corticospinal tract lesion, and bone marrow ache.',
    externalSymptomsDetails: 'Superficial joint arthralgia, wrist swelling, diminished grip strength, and localized muscular spasms.',
    recommendedSpecialist: 'Orthopedist / Neurologist / Rheumatologist',
    emergencyGuidance: 'Sudden onset unilateral arm drop or inability to raise both arms equally is a classic stroke sign; emergency 108 activation required.',
    icon: Zap,
    iconName: 'Arm / Weakness',
    frontPos: { top: '42%', left: '18%' },
    backPos: { top: '42%', left: '18%' },
    realisticPosMale: { top: '32%', left: '23%' },
    realisticPosFemale: { top: '32%', left: '23%' }
  },
  {
    id: 'legs',
    name: 'Legs, Knees & Lower Limbs',
    latinName: 'Membrum Inferius (Femur, Crus & Pes)',
    category: 'Musculoskeletal & Articular',
    layers: ['skeletal', 'muscular'],
    view: 'both',
    symptomIds: ['joint_pain'],
    description: 'Femoral framework, patella, tibia, fibula, knee hinge joint, ankle, and major weight-bearing muscles.',
    structuralComposition: 'Quadriceps, hamstrings, knee menisci, cruciate ligaments, sciatic/tibial nerves, and femoral vascular bundle.',
    internalSymptomsDetails: 'Deep articular joint effusion, synovial inflammation (chikungunya/dengue arthralgia), and bone marrow pain.',
    externalSymptomsDetails: 'Patellar swelling, knee warmth, restricted range of motion, and calf muscular cramping.',
    recommendedSpecialist: 'Orthopedic Surgeon / Rheumatologist',
    emergencyGuidance: 'Severe asymmetrical calf swelling with redness and sudden breathlessness warns of deep vein thrombosis (DVT) with pulmonary risk.',
    icon: Footprints,
    iconName: 'Knee / Joints',
    frontPos: { top: '74%', left: '42%' },
    backPos: { top: '74%', left: '42%' },
    realisticPosMale: { top: '71%', left: '43%' },
    realisticPosFemale: { top: '71%', left: '43%' }
  },
  {
    id: 'back',
    name: 'Spine, Back & Flank',
    latinName: 'Columna Vertebralis & Regio Lumbalis',
    category: 'Spinal & Musculoskeletal',
    layers: ['skeletal', 'muscular', 'internal'],
    view: 'back',
    symptomIds: ['body_ache'],
    description: 'Cervical, thoracic, and lumbar vertebral column housing the spinal cord, paraspinal muscles, and flank regions.',
    structuralComposition: '33 vertebrae, intervertebral discs, erector spinae muscle group, costovertebral joints, and posterior renal flanks.',
    internalSymptomsDetails: 'Deep renal angle tenderness, vertebral disc compression pain, and diffuse constitutional viral myalgia (body ache).',
    externalSymptomsDetails: 'Paraspinal muscular spasm, lumbar stiffness, cutaneous tenderness, and postural ache.',
    recommendedSpecialist: 'Spine Specialist / Orthopedist / Physiotherapist',
    emergencyGuidance: 'Severe back pain accompanied by sudden loss of bowel or bladder control is cauda equina syndrome requiring emergency neurosurgery.',
    icon: Layers,
    iconName: 'Spine / Backache',
    backPos: { top: '38%', left: '50%' },
    realisticPosMale: { top: '34%', left: '50%' },
    realisticPosFemale: { top: '34%', left: '50%' }
  },
  {
    id: 'general',
    name: 'Whole Body / Systemic',
    latinName: 'Status Systemicus & Constitutio',
    category: 'Systemic & Constitutional',
    layers: ['all', 'internal', 'external'],
    view: 'both',
    symptomIds: ['fever', 'chills', 'fatigue', 'body_ache', 'skin_rash'],
    description: 'System-wide immunological, metabolic, and hemodynamic processes throughout the entire human organism.',
    structuralComposition: 'Circulatory bloodstream, reticuloendothelial system, neuroendocrine hypothalamic thermostat, and dermal barrier.',
    internalSymptomsDetails: 'Elevated core body temperature (fever >= 100.4°F), rigors/chills from muscular involuntary shivering, and prostrating fatigue.',
    externalSymptomsDetails: 'Maculopapular skin rashes, flushed skin, peripheral diaphoresis (sweating), and generalized somatic aches.',
    recommendedSpecialist: 'General Physician / Internal Medicine Specialist',
    emergencyGuidance: 'Fever exceeding 103°F resistant to antipyretics or accompanied by petechial purpuric rash demands immediate medical admission.',
    icon: Sparkles,
    iconName: 'Whole Body'
  }
];

interface BodyMapViewProps {
  language: SupportedLanguage;
  collectedSymptoms: ExtractedSymptom[];
  onToggleSymptom: (symptomId: string, severity?: 'mild' | 'moderate' | 'severe') => void;
  onRemoveSymptom: (symptomId: string) => void;
  onClearSymptoms: () => void;
  onAssessmentComplete: (result: AssessmentResult) => void;
  onNavigate: (view: string) => void;
  onOpenSOS: () => void;
}

export const BodyMapView: React.FC<BodyMapViewProps> = ({
  language,
  collectedSymptoms,
  onToggleSymptom,
  onRemoveSymptom,
  onClearSymptoms,
  onAssessmentComplete,
  onNavigate,
  onOpenSOS
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<BodyRegionId>('head');
  const [viewOrientation, setViewOrientation] = useState<'front' | 'back'>('front');
  const [atlasMode, setAtlasMode] = useState<'2d' | '3d'>('3d');
  const [bodySex, setBodySex] = useState<'male' | 'female'>('male');
  const [visualModelType, setVisualModelType] = useState<'realistic' | 'silhouette'>('realistic');
  const [clickedSpotId, setClickedSpotId] = useState<string | null>(null);
  const [patientAge, setPatientAge] = useState<number>(26);
  const [patientSex, setPatientSex] = useState<'female' | 'male' | 'other'>('male');
  const [analyzingAssessment, setAnalyzingAssessment] = useState(false);

  // Anatomy Visual Layer & Symptom Filtering State
  const [selectedLayer, setSelectedLayer] = useState<AnatomyLayerId>('all');
  const [symptomNature, setSymptomNature] = useState<SymptomNatureFilter>('all');
  const [showDetailedOverlay, setShowDetailedOverlay] = useState<boolean>(false);
  const [infoActiveTab, setInfoActiveTab] = useState<'overview' | 'symptoms' | 'clinical'>('overview');

  // Zoom & Pan State for Precise Regional Anatomy Inspection
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3.2, Number((prev + 0.35).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(1, Number((prev - 0.35).toFixed(2)));
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Quick region zoom & pan presets for high-precision tagging
  const focusRegionPreset = (regionId: BodyRegionId) => {
    setSelectedRegionId(regionId);
    if (regionId === 'head' || regionId === 'eyes') {
      setZoomLevel(2.2);
      setPanPosition({ x: 0, y: 130 });
    } else if (regionId === 'throat') {
      setZoomLevel(2.2);
      setPanPosition({ x: 0, y: 95 });
    } else if (regionId === 'chest' || regionId === 'lungs') {
      setZoomLevel(2.0);
      setPanPosition({ x: 0, y: 55 });
    } else if (regionId === 'abdomen') {
      setZoomLevel(2.2);
      setPanPosition({ x: 0, y: -10 });
    } else if (regionId === 'pelvis') {
      setZoomLevel(2.2);
      setPanPosition({ x: 0, y: -65 });
    } else if (regionId === 'legs') {
      setZoomLevel(2.0);
      setPanPosition({ x: 0, y: -130 });
    } else if (regionId === 'arms') {
      setZoomLevel(1.8);
      setPanPosition({ x: 0, y: 20 });
    } else if (regionId === 'back') {
      setZoomLevel(2.0);
      setPanPosition({ x: 0, y: 40 });
    } else {
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsPanning(true);
    setDragStart({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel <= 1) return;
    const maxPanX = (zoomLevel - 1) * 110;
    const maxPanY = (zoomLevel - 1) * 180;
    const nextX = Math.max(-maxPanX, Math.min(maxPanX, e.clientX - dragStart.x));
    const nextY = Math.max(-maxPanY, Math.min(maxPanY, e.clientY - dragStart.y));
    setPanPosition({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0018;
    setZoomLevel(prev => {
      const next = Math.min(3.2, Math.max(1, Number((prev + delta).toFixed(2))));
      if (next === 1) {
        setPanPosition({ x: 0, y: 0 });
      } else {
        const maxPanX = (next - 1) * 110;
        const maxPanY = (next - 1) * 180;
        setPanPosition(p => ({
          x: Math.max(-maxPanX, Math.min(maxPanX, p.x)),
          y: Math.max(-maxPanY, Math.min(maxPanY, p.y))
        }));
      }
      return next;
    });
  };

  // Touch pinch-to-zoom & pan handlers for mobile/tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.hypot(dx, dy));
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsPanning(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const ratio = currentDist / touchDistance;
      setZoomLevel(prev => {
        const next = Math.min(3.2, Math.max(1, Number((prev * ratio).toFixed(2))));
        if (next === 1) setPanPosition({ x: 0, y: 0 });
        return next;
      });
      setTouchDistance(currentDist);
    } else if (e.touches.length === 1 && isPanning && zoomLevel > 1) {
      const maxPanX = (zoomLevel - 1) * 110;
      const maxPanY = (zoomLevel - 1) * 180;
      const nextX = Math.max(-maxPanX, Math.min(maxPanX, e.touches[0].clientX - dragStart.x));
      const nextY = Math.max(-maxPanY, Math.min(maxPanY, e.touches[0].clientY - dragStart.y));
      setPanPosition({ x: nextX, y: nextY });
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(null);
    setIsPanning(false);
  };

  const selectedRegion = BODY_REGIONS.find(r => r.id === selectedRegionId) || BODY_REGIONS[0];

  const handleSpotClick = (spotId: BodyRegionId) => {
    setSelectedRegionId(spotId);
    setClickedSpotId(spotId);
    setTimeout(() => {
      setClickedSpotId(prev => (prev === spotId ? null : prev));
    }, 650);
  };

  // Check if any emergency symptoms are in the assessment list
  const hasEmergencySymptom = collectedSymptoms.some(s =>
    ['chest_pain', 'shortness_of_breath', 'sudden_weakness_paralysis', 'slurred_speech', 'loss_of_consciousness'].includes(s.id)
  );

  const getRegionActiveCount = (region: BodyRegionData) => {
    return region.symptomIds.filter(id => collectedSymptoms.some(s => s.id === id)).length;
  };

  // Filter symptoms for the active region based on internal vs external symptom nature
  const currentRegionSymptoms = selectedRegion.symptomIds
    .map(id => MASTER_SYMPTOMS.find(s => s.id === id))
    .filter((s): s is Symptom => {
      if (!s) return false;
      if (symptomNature === 'internal') {
        return ['chest_pain', 'palpitations', 'shortness_of_breath', 'abdominal_pain', 'nausea', 'vomiting', 'burning_urination', 'frequent_urination', 'loss_of_consciousness'].includes(s.id);
      }
      if (symptomNature === 'external') {
        return ['headache', 'retro_orbital_pain', 'sore_throat', 'runny_nose', 'skin_rash', 'joint_pain', 'body_ache', 'sudden_weakness_paralysis', 'slurred_speech'].includes(s.id);
      }
      return true;
    });

  // Filter hotspots relevant for the current front or back view AND current layer
  const currentViewHotspots = BODY_REGIONS.filter(r => {
    const matchesOrientation = viewOrientation === 'front' ? Boolean(r.frontPos) : Boolean(r.backPos);
    if (!matchesOrientation) return false;
    if (selectedLayer === 'all') return true;
    return r.layers.includes(selectedLayer);
  });

  // Hotspot and analysis states
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Run full ML Disease Prediction Assessment
  const runAssessment = async () => {
    setAssessmentError(null);
    if (collectedSymptoms.length === 0) {
      setAssessmentError('Please add at least one symptom to your assessment list by clicking on a body region.');
      return;
    }

    setAnalyzingAssessment(true);
    try {
      const symptomsList = collectedSymptoms.map(s => s.id);
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsList,
          age: Number(patientAge),
          sex: patientSex
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Prediction service error');
      }

      const assessmentResult: AssessmentResult = await res.json();
      onAssessmentComplete(assessmentResult);
    } catch (err: any) {
      setAssessmentError(err?.message || 'Prediction failed. Please try again.');
    } finally {
      setAnalyzingAssessment(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Interactive Realistic Anatomy Explorer (Male & Female)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Realistic Human Body Anatomy & Symptom Map
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Explore photorealistic anatomical figures for both <strong>Male (Man)</strong> and <strong>Female (Woman)</strong> bodies. Click on distinct anatomical hotspots to identify symptoms, compare internal organs vs. surface systems, and run ML diagnostic triage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Realistic 2D Map vs 3D Engine Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setAtlasMode('2d')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  atlasMode === '2d'
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Realistic 2D Atlas</span>
              </button>
              <button
                type="button"
                onClick={() => setAtlasMode('3d')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  atlasMode === '3d'
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-teal-600" />
                <span>3D Engine</span>
              </button>
            </div>

            <button
              onClick={() => onNavigate('checker')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>AI Chat</span>
            </button>

            <button
              type="button"
              onClick={() => {
                saveActiveSession({
                  activeView: 'bodymap',
                  collectedSymptoms,
                  selectedBodyRegion: selectedRegionId,
                  isAutoSaved: false
                });
              }}
              className="px-3 py-1.5 border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Save current anatomy symptoms"
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-600" />
              <span>Save Progress</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS 108</span>
            </button>
          </div>
        </div>

        {/* Emergency Alert Banner if any critical symptom is selected */}
        {hasEmergencySymptom && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-3 flex items-center justify-between gap-3 text-xs text-red-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">
                Your assessment list contains emergency red-flag symptoms. Urgent emergency medical evaluation (108 / 112) is recommended.
              </span>
            </div>
            <button
              onClick={onOpenSOS}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shrink-0 shadow-2xs"
            >
              Call 108
            </button>
          </div>
        )}

        {assessmentError && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in duration-200">
            <span>{assessmentError}</span>
            <button onClick={() => setAssessmentError(null)} className="text-xs font-bold text-amber-800 underline">Dismiss</button>
          </div>
        )}
      </div>

      {/* 3D Human Atlas Mode vs 2D Realistic & Layer Map Mode */}
      {atlasMode === '3d' ? (
        <ThreeHumanAtlas
          collectedSymptoms={collectedSymptoms}
          onToggleSymptom={onToggleSymptom}
          onOpenSOS={onOpenSOS}
          onExecuteAssessment={runAssessment}
        />
      ) : (
        /* 4-Column Layout:
            1. Left Anatomy Layer Filtering Sidebar (3 Cols)
            2. Realistic Male & Female Body Canvas with Hotspots (3 Cols)
            3. Detailed Anatomical Description & Regional Symptoms Panel (3 Cols)
            4. Live Assessment List & ML Trigger (3 Cols)
        */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* SECTION 1: Anatomy Layer Filtering Sidebar (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
            
            {/* Realistic Body Sex Selector: Man vs Woman */}
            <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-700" />
                  <span>Anatomy Model:</span>
                </span>
                <span className="text-[10px] bg-teal-200/80 text-teal-900 px-1.5 py-0.5 rounded font-bold uppercase">
                  {bodySex}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setBodySex('male');
                    setPatientSex('male');
                  }}
                  className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    bodySex === 'male'
                      ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-400'
                      : 'bg-white border border-teal-200 text-teal-900 hover:bg-teal-100/50'
                  }`}
                >
                  <span className="text-sm">👨</span>
                  <span>Realistic Man</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBodySex('female');
                    setPatientSex('female');
                  }}
                  className={`py-2 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                    bodySex === 'female'
                      ? 'bg-teal-700 text-white shadow-xs ring-2 ring-teal-400'
                      : 'bg-white border border-teal-200 text-teal-900 hover:bg-teal-100/50'
                  }`}
                >
                  <span className="text-sm">👩</span>
                  <span>Realistic Woman</span>
                </button>
              </div>
            </div>

            {/* Rendering Style: Realistic Medical Atlas vs Silhouette Vector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Visual Representation:</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg text-center text-xs">
                <button
                  type="button"
                  onClick={() => setVisualModelType('realistic')}
                  className={`py-1.5 rounded font-medium transition-all flex items-center justify-center gap-1 ${
                    visualModelType === 'realistic'
                      ? 'bg-white text-teal-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>Realistic Body</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualModelType('silhouette')}
                  className={`py-1.5 rounded font-medium transition-all flex items-center justify-center gap-1 ${
                    visualModelType === 'silhouette'
                      ? 'bg-white text-teal-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Vector Outline</span>
                </button>
              </div>
            </div>

            {/* Internal vs External Scope Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Symptom Visibility Scope:</span>
                <span className="text-[10px] text-teal-600 font-semibold lowercase">
                  {symptomNature}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg text-center text-xs">
                <button
                  type="button"
                  onClick={() => setSymptomNature('all')}
                  className={`py-1 rounded font-medium transition-all ${
                    symptomNature === 'all'
                      ? 'bg-white text-teal-800 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSymptomNature('internal')}
                  className={`py-1 rounded font-medium transition-all ${
                    symptomNature === 'internal'
                      ? 'bg-rose-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Internal
                </button>
                <button
                  type="button"
                  onClick={() => setSymptomNature('external')}
                  className={`py-1 rounded font-medium transition-all ${
                    symptomNature === 'external'
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  External
                </button>
              </div>
            </div>

            {/* Visual Layers List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Visual Anatomical Layers:
              </span>

              {ANATOMY_LAYERS.map(layer => {
                const Icon = layer.icon;
                const isSelected = selectedLayer === layer.id;

                const layerSymptomsCount = collectedSymptoms.filter(sym => {
                  const region = BODY_REGIONS.find(r => r.symptomIds.includes(sym.id));
                  if (!region) return false;
                  if (layer.id === 'all') return true;
                  return region.layers.includes(layer.id);
                }).length;

                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200/60 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                          {layer.name}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                          {layer.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {layer.tagline}
                      </p>

                      {layerSymptomsCount > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-teal-700 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>{layerSymptomsCount} symptom{layerSymptomsCount > 1 ? 's' : ''} active</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Realistic Man/Woman Figure Canvas with Hotspots (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center justify-between relative overflow-hidden min-h-[640px]">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">
                  {bodySex === 'male' ? 'Realistic Man' : 'Realistic Woman'}
                </span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold border border-teal-200">
                  {visualModelType === 'realistic' ? 'Photo Medical' : 'Vector 2D'}
                </span>
              </div>

              {/* View Switcher if in Silhouette mode */}
              {visualModelType === 'silhouette' && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setViewOrientation('front')}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
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
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
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

            {/* Quick Anatomical Focus Presets Bar */}
            <div className="w-full pt-2 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px]">
              <span className="font-semibold text-slate-500 shrink-0 flex items-center gap-1">
                <Target className="w-3 h-3 text-teal-600" />
                <span>Focus:</span>
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => focusRegionPreset('head')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${selectedRegionId === 'head' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Head
                </button>
                <button
                  type="button"
                  onClick={() => focusRegionPreset('chest')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${selectedRegionId === 'chest' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Chest
                </button>
                <button
                  type="button"
                  onClick={() => focusRegionPreset('abdomen')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${selectedRegionId === 'abdomen' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Abdomen
                </button>
                <button
                  type="button"
                  onClick={() => focusRegionPreset('pelvis')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${selectedRegionId === 'pelvis' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Pelvis
                </button>
                <button
                  type="button"
                  onClick={() => focusRegionPreset('legs')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${selectedRegionId === 'legs' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  Legs
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-1.5 py-0.5 rounded bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold flex items-center gap-0.5"
                    title="Reset to 1x full view"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Center Body Canvas: Interactive Zoom, Pan & Hotspot Tagging */}
            <div
              className={`relative w-full max-w-[270px] h-[450px] my-2 select-none flex items-center justify-center rounded-xl overflow-hidden bg-slate-50/70 border border-slate-200 shadow-2xs ${
                zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
              }`}
              style={{ touchAction: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Floating Zoom & Pan Control Toolbar */}
              <div className="absolute top-2.5 right-2.5 z-40 flex flex-col items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-200/90 shadow-md">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3.2}
                  className="p-1 text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Zoom In (or scroll up / pinch out)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="px-1 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-700 rounded text-center min-w-[34px]">
                  {Math.round(zoomLevel * 100)}%
                </div>

                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Zoom Out (or scroll down / pinch in)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1 text-teal-700 hover:bg-teal-50 rounded transition-colors"
                    title="Reset Zoom to 100%"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Floating Helper Tip when Zoomed In */}
              {zoomLevel > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full pointer-events-none flex items-center gap-1 shadow-md border border-slate-700 animate-in fade-in duration-200 whitespace-nowrap">
                  <Move className="w-3 h-3 text-teal-400" />
                  <span>Pinch / drag to inspect organs</span>
                </div>
              )}

              {/* Transformed Figure & Hotspots Wrapper */}
              <div
                className="relative w-full h-full flex items-center justify-center pointer-events-auto"
                style={{
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {visualModelType === 'realistic' ? (
                  /* Photorealistic 3D Medical Human Body Figure (Man vs Woman) */
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={
                        bodySex === 'male'
                          ? '/src/assets/images/realistic_man_anatomy_1790532228432.jpg'
                          : '/src/assets/images/realistic_woman_anatomy_1790532242104.jpg'
                      }
                      alt={bodySex === 'male' ? 'Realistic Male Body Anatomy' : 'Realistic Female Body Anatomy'}
                      className="w-full h-full object-cover object-center drop-shadow-sm select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Translucent Layer Ambient Glow when specific layers selected */}
                    {selectedLayer === 'internal' && (
                      <div className="absolute inset-0 bg-rose-500/10 pointer-events-none mix-blend-color-burn" />
                    )}
                    {selectedLayer === 'skeletal' && (
                      <div className="absolute inset-0 bg-amber-500/10 pointer-events-none mix-blend-color-burn" />
                    )}
                    {selectedLayer === 'muscular' && (
                      <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none mix-blend-color-burn" />
                    )}

                    {/* Hotspots Positioned Directly on the Realistic Body Figure */}
                    {BODY_REGIONS.filter(r => selectedLayer === 'all' || r.layers.includes(selectedLayer)).map(spot => {
                      const Icon = spot.icon;
                      const isSelected = selectedRegionId === spot.id;
                      const count = getRegionActiveCount(spot);
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpotClick(spot.id);
                            }}
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
                  /* Vector Silhouette Representation */
                  <svg
                    viewBox="0 0 200 400"
                    className="w-full h-full drop-shadow-sm transition-all"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                      <linearGradient id="selectedRegionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0D9488" />
                        <stop offset="100%" stopColor="#0F766E" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 100 20 C 85 20, 75 35, 75 55 C 75 75, 85 90, 100 90 C 115 90, 125 75, 125 55 C 125 35, 115 20, 100 20 Z"
                      fill={selectedRegionId === 'head' || selectedRegionId === 'eyes' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('head')}
                    />
                    <path
                      d="M 92 90 L 108 90 L 112 105 L 88 105 Z"
                      fill={selectedRegionId === 'throat' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('throat')}
                    />
                    <path
                      d="M 88 105 L 112 105 L 140 120 L 132 170 L 68 170 L 60 120 Z"
                      fill={selectedRegionId === 'chest' || selectedRegionId === 'lungs' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('chest')}
                    />
                    <path
                      d="M 68 170 L 132 170 L 126 220 L 74 220 Z"
                      fill={selectedRegionId === 'abdomen' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('abdomen')}
                    />
                    <path
                      d="M 74 220 L 126 220 L 118 250 L 100 255 L 82 250 Z"
                      fill={selectedRegionId === 'pelvis' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('pelvis')}
                    />
                    <path
                      d="M 60 120 L 40 180 L 30 240 L 42 242 L 52 185 L 68 135 Z"
                      fill={selectedRegionId === 'arms' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('arms')}
                    />
                    <path
                      d="M 140 120 L 160 180 L 170 240 L 158 242 L 148 185 L 132 135 Z"
                      fill={selectedRegionId === 'arms' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('arms')}
                    />
                    <path
                      d="M 82 250 L 100 255 L 96 320 L 92 380 L 80 380 L 76 320 L 74 250 Z"
                      fill={selectedRegionId === 'legs' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('legs')}
                    />
                    <path
                      d="M 100 255 L 118 250 L 126 250 L 124 320 L 120 380 L 108 380 L 104 320 Z"
                      fill={selectedRegionId === 'legs' ? 'url(#selectedRegionGrad)' : 'url(#bodyBaseGrad)'}
                      stroke="#64748B"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-colors hover:opacity-90"
                      onClick={() => setSelectedRegionId('legs')}
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Quick Hotspot Legend Buttons */}
            <div className="w-full pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-1 justify-center">
                {BODY_REGIONS.slice(0, 9).map(reg => {
                  const Icon = reg.icon;
                  const isSelected = selectedRegionId === reg.id;
                  const count = getRegionActiveCount(reg);
                  return (
                    <button
                      key={reg.id}
                      onClick={() => handleSpotClick(reg.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-teal-700 text-white font-bold'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3 h-3 text-teal-600" />
                      <span>{reg.name.split('&')[0].trim()}</span>
                      {count > 0 && <span className="font-bold text-teal-500">({count})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: Detailed Anatomical Description & Symptoms Info Panel (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between space-y-3 min-h-[640px]">
            <div className="space-y-3">
              
              {/* Region Header with Overlay Zoom Action */}
              <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    {React.createElement(selectedRegion.icon, { className: "w-4 h-4 text-teal-600 shrink-0" })}
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                      {selectedRegion.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedRegion.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 italic">
                    {selectedRegion.latinName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetailedOverlay(true)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 text-xs font-semibold flex items-center gap-1 shrink-0"
                  title="Open Detailed Anatomical Description Overlay"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Inspect</span>
                </button>
              </div>

              {/* Sub-Tabs: Overview vs Symptoms vs Clinical Guidance */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setInfoActiveTab('overview')}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    infoActiveTab === 'overview'
                      ? 'bg-white text-teal-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Anatomy
                </button>
                <button
                  type="button"
                  onClick={() => setInfoActiveTab('symptoms')}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    infoActiveTab === 'symptoms'
                      ? 'bg-white text-teal-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Symptoms ({currentRegionSymptoms.length})
                </button>
                <button
                  type="button"
                  onClick={() => setInfoActiveTab('clinical')}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    infoActiveTab === 'clinical'
                      ? 'bg-white text-teal-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Triage
                </button>
              </div>

              {/* Tab 1: Detailed Anatomical Overview */}
              {infoActiveTab === 'overview' && (
                <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed max-h-72 overflow-y-auto pr-1">
                  <p>{selectedRegion.description}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] block">
                      Key Structures & Organs:
                    </span>
                    <p className="text-[11px] text-slate-600">
                      {selectedRegion.structuralComposition}
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-800 shrink-0">Internal Manifestations:</span>
                      <span className="text-slate-600">{selectedRegion.internalSymptomsDetails}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-800 shrink-0">External Manifestations:</span>
                      <span className="text-slate-600">{selectedRegion.externalSymptomsDetails}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Common Symptoms with 1-Click Toggle */}
              {infoActiveTab === 'symptoms' && (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Common Symptoms Associated with this Region:
                  </span>

                  {currentRegionSymptoms.length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-2 border border-dashed rounded-lg">
                      No symptoms matching the selected scope ({symptomNature}).
                    </p>
                  ) : (
                    currentRegionSymptoms.map(sym => {
                      const isAdded = collectedSymptoms.some(s => s.id === sym.id);
                      return (
                        <div
                          key={sym.id}
                          onClick={() => onToggleSymptom(sym.id)}
                          className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                            isAdded
                              ? 'bg-teal-50 border-teal-400 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {sym.name}
                              </span>
                              {sym.isEmergencyIndicator && (
                                <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded text-[9px] font-bold">
                                  Red Flag
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              Aliases: {sym.aliases.slice(0, 2).join(', ')}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                              isAdded
                                ? 'bg-teal-600 text-white'
                                : 'border border-slate-300 text-slate-400'
                            }`}
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 3: Clinical Triage & Specialist Referral */}
              {infoActiveTab === 'clinical' && (
                <div className="space-y-2.5 text-xs max-h-72 overflow-y-auto pr-1">
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
                    <span className="font-bold text-[11px] block flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      <span>When to Seek Immediate Care:</span>
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {selectedRegion.emergencyGuidance}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] block flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Recommended Specialty:</span>
                    </span>
                    <p className="text-[11px] text-teal-700 font-semibold">
                      {selectedRegion.recommendedSpecialist}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Whole Body Button Shortcut */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Systemic issues?</span>
              <button
                type="button"
                onClick={() => setSelectedRegionId('general')}
                className="font-bold text-teal-700 hover:underline"
              >
                Inspect Whole Body
              </button>
            </div>
          </div>

          {/* SECTION 4: Live Patient Assessment List & ML Prediction Execution (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between space-y-3 min-h-[640px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase">Assessment Intake</span>
                  <h3 className="text-sm font-bold text-slate-900">Selected Symptoms</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {collectedSymptoms.length}
                  </span>
                  {collectedSymptoms.length > 0 && (
                    <button
                      onClick={onClearSymptoms}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Clear All"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Added Symptoms List */}
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {collectedSymptoms.length === 0 ? (
                  <div className="p-3 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 space-y-1">
                    <p>No symptoms selected yet.</p>
                    <p className="text-[10px]">Click any hotspot icon or symptom button on the left to add.</p>
                  </div>
                ) : (
                  collectedSymptoms.map(item => {
                    const meta = MASTER_SYMPTOMS.find(s => s.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-1.5 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-800 truncate block text-[11px]">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize block truncate">
                            {meta?.category || 'Clinical'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveSymptom(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                          title="Remove symptom"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Patient Demographics */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Patient Parameters:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Sex</label>
                    <select
                      value={patientSex}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setPatientSex(val);
                        if (val === 'female') setBodySex('female');
                        else if (val === 'male') setBodySex('male');
                      }}
                      className="w-full px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs bg-white"
                    >
                      <option value="male">Male (Man)</option>
                      <option value="female">Female (Woman)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Assessment Button */}
            <div className="pt-2 space-y-1.5">
              <button
                onClick={runAssessment}
                disabled={analyzingAssessment || collectedSymptoms.length === 0}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <HeartPulse className="w-4 h-4" />
                <span>
                  {analyzingAssessment ? 'Executing Classifiers...' : 'Run ML Assessment'}
                </span>
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-tight">
                Simultaneously queries Random Forest, Decision Tree & Naive Bayes models.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* DETAILED ANATOMICAL DESCRIPTION OVERLAY MODAL */}
      {showDetailedOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                  {React.createElement(selectedRegion.icon, { className: 'w-4 h-4' })}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedRegion.name} · Anatomical & Clinical Dossier
                  </h3>
                  <p className="text-xs font-mono text-slate-500 italic">
                    {selectedRegion.latinName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailedOverlay(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  1. Comprehensive Anatomical Architecture
                </h4>
                <p>{selectedRegion.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">
                  Structural & Histological Elements:
                </span>
                <p className="text-slate-600">{selectedRegion.structuralComposition}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5 text-rose-900">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Internal (Visceral) Symptoms:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedRegion.internalSymptomsDetails}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
                  <span className="font-bold block flex items-center gap-1.5 text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>External (Somatic) Symptoms:</span>
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedRegion.externalSymptomsDetails}
                  </p>
                </div>
              </div>

              {/* Common Symptoms List */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">
                  2. Common Mapped Clinical Symptoms:
                </h4>
                <div className="space-y-1.5">
                  {selectedRegion.symptomIds.map(id => {
                    const meta = MASTER_SYMPTOMS.find(s => s.id === id);
                    if (!meta) return null;
                    const isAdded = collectedSymptoms.some(s => s.id === id);
                    return (
                      <div
                        key={id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{meta.name}</span>
                            {meta.isEmergencyIndicator && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold">
                                Emergency Red Flag
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Aliases: {meta.aliases.join(', ')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleSymptom(id)}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isAdded
                              ? 'bg-teal-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isAdded ? 'Added' : 'Add to List'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Protocol */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Clinical Urgency & Referral Protocol:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedRegion.emergencyGuidance}
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <span>Recommended Specialist:</span>
                  <span className="underline">{selectedRegion.recommendedSpecialist}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                AI Health Clinical Anatomy Reference
              </span>
              <button
                type="button"
                onClick={() => setShowDetailedOverlay(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
