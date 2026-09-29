import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Search,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sliders,
  Layers,
  HeartPulse,
  Brain,
  Wind,
  Activity,
  Droplets,
  Bone,
  Check,
  Plus,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  PhoneCall,
  X,
  Grid,
  Box,
  Target,
  Move,
  Stethoscope,
  ShieldCheck,
  User,
  Filter
} from 'lucide-react';
import { ExtractedSymptom } from '../types';
import { MASTER_SYMPTOMS } from '../../shared/constants/symptoms_data';

export interface AnatomicalStructure {
  id: string;
  name: string;
  latinName: string;
  system: 'skeleton' | 'muscles' | 'heart' | 'internal' | 'respiration' | 'nervous' | 'sensory';
  systemName: string;
  region: 'head' | 'neck' | 'chest' | 'abdomen' | 'pelvis' | 'limbs_upper' | 'limbs_lower' | 'back';
  regionName: string;
  description: string;
  histology: string;
  functionDetails: string;
  attachments?: string;
  vascularSupply: string;
  innervation: string;
  clinicalRelevance: string;
  symptomIds: string[];
  image: string;
  hotspotPos: { top: string; left: string };
}

export const ANATOMICAL_STRUCTURES: AnatomicalStructure[] = [
  // CARDIOVASCULAR & HEART
  {
    id: 'heart_myocardium',
    name: 'Heart (Myocardium & Ventricles)',
    latinName: 'Cor Humanum & Myocardium',
    system: 'heart',
    systemName: 'Heart & Vessels',
    region: 'chest',
    regionName: 'Middle Mediastinum',
    description: 'Four-chambered muscular pump located in the middle mediastinum, encased in a double-walled fibroserous pericardium. Comprises right atrium, right ventricle, left atrium, and thick-walled left ventricle.',
    histology: 'Branching striated cardiomyocytes joined by intercalated discs with desmosomes and electrical gap junctions enabling syncytial contraction.',
    functionDetails: 'Pumps deoxygenated blood to pulmonary circulation and oxygen-rich blood through high-resistance systemic circulation, maintaining stroke volume and arterial pressure.',
    attachments: 'Pericardial sac attached anteriorly to the sternum and inferiorly to the central tendon of the diaphragm.',
    vascularSupply: 'Right and left coronary arteries arising from the aortic sinuses of Valsalva; drained by coronary sinus into right atrium.',
    innervation: 'Cardiac plexus composed of sympathetic fibers (T1-T4, inotropy) and vagus nerve CN X (slowing heart rate).',
    clinicalRelevance: 'Primary site of coronary artery disease, acute myocardial infarction (heart attack), heart failure, and arrhythmias.',
    symptomIds: ['chest_pain', 'palpitations', 'shortness_of_breath'],
    image: '/src/assets/images/realistic_heart_anatomy_1790533416089.jpg',
    hotspotPos: { top: '24%', left: '44%' }
  },
  {
    id: 'aorta_vessels',
    name: 'Aorta & Great Arterial Trunks',
    latinName: 'Arcus Aortae & Truncus Arteriosus',
    system: 'heart',
    systemName: 'Heart & Vessels',
    region: 'chest',
    regionName: 'Superior Mediastinum',
    description: 'The largest arterial conduit in the body emerging from the left ventricle. Composed of ascending aorta, aortic arch, descending thoracic aorta, and abdominal aorta.',
    histology: 'Elastic artery featuring a thick tunica media rich in concentric fenestrated elastic lamellae and smooth muscle cells allowing Windkessel pulsation damping.',
    functionDetails: 'Receives bolus blood ejection under systolic pressure and recoils during diastole, propelling smooth continuous forward flow to brain, viscera, and limbs.',
    attachments: 'Gives off brachiocephalic trunk, left common carotid artery, and left subclavian artery from its arch superiorly.',
    vascularSupply: 'Nourished by micro-vasa vasorum penetrating outer adventitia.',
    innervation: 'Aortic arch baroreceptors and chemoreceptors innervated by aortic nerve branch of the vagus nerve (CN X).',
    clinicalRelevance: 'Prone to fatal aortic dissection, thoracic/abdominal aortic aneurysms (AAA), and atherosclerotic ulceration.',
    symptomIds: ['chest_pain', 'palpitations'],
    image: '/src/assets/images/realistic_heart_anatomy_1790533416089.jpg',
    hotspotPos: { top: '21%', left: '50%' }
  },

  // RESPIRATORY SYSTEM
  {
    id: 'lungs_pulmonary',
    name: 'Lungs & Alveolar Bronchial Tree',
    latinName: 'Pulmones & Arbor Bronchialis',
    system: 'respiration',
    systemName: 'Respiration & Lungs',
    region: 'chest',
    regionName: 'Pleural Cavities',
    description: 'Paired cone-shaped thoracic respiratory organs separated by the mediastinum. The right lung has three lobes (superior, middle, inferior); the left lung has two lobes and a cardiac notch.',
    histology: 'Consists of branching conducting airways terminating in over 300 million alveoli lined with Type I pneumocytes (gas exchange) and Type II pneumocytes (surfactant).',
    functionDetails: 'Facilitates hematosis—diffusing oxygen into pulmonary capillaries and expelling carbon dioxide. Regulates systemic acid-base balance.',
    attachments: 'Enclosed within visceral pleura, suspended by pulmonary roots (hila) containing mainstem bronchi and pulmonary vessels.',
    vascularSupply: 'Dual blood supply: pulmonary arteries for gas exchange; bronchial arteries from thoracic aorta for tissue nourishment.',
    innervation: 'Pulmonary plexus containing vagal parasympathetic fibers (bronchoconstriction) and sympathetic fibers (T2-T5, bronchodilation).',
    clinicalRelevance: 'Pneumonia, chronic obstructive pulmonary disease (COPD), bronchial asthma, pulmonary embolism, and lung consolidation.',
    symptomIds: ['shortness_of_breath', 'cough', 'wheezing', 'chest_pain'],
    image: '/src/assets/images/realistic_lungs_anatomy_1790533441832.jpg',
    hotspotPos: { top: '25%', left: '56%' }
  },
  {
    id: 'trachea_airway',
    name: 'Trachea & Larynx (Airway Conduit)',
    latinName: 'Trachea et Cartilago Laryngis',
    system: 'respiration',
    systemName: 'Respiration & Lungs',
    region: 'neck',
    regionName: 'Anterior Neck',
    description: 'Rigid mobile cartilaginous tube descending from the cricoid cartilage (C6) to the carina (T4-T5), where it bifurcates into the right and left main bronchi.',
    histology: 'Reinforced by 16-20 C-shaped hyaline cartilage rings interconnected by annular ligaments and posterior trachealis smooth muscle. Lined with ciliated pseudostratified epithelium.',
    functionDetails: 'Conducts inspired air, warms and humidifies airflow, and provides mucociliary escalator defense propelling inhaled pathogens upward.',
    attachments: 'Connects superiorly to the cricoid cartilage of the larynx; lies anterior to the muscular esophagus.',
    vascularSupply: 'Inferior thyroid arteries and bronchial arteries.',
    innervation: 'Recurrent laryngeal nerves (branches of vagus nerve CN X).',
    clinicalRelevance: 'Acute tracheitis, laryngeal edema, foreign body aspiration, and vocal cord dysfunction.',
    symptomIds: ['sore_throat', 'cough', 'runny_nose'],
    image: '/src/assets/images/realistic_lungs_anatomy_1790533441832.jpg',
    hotspotPos: { top: '16%', left: '50%' }
  },

  // NERVOUS SYSTEM
  {
    id: 'brain_cerebrum',
    name: 'Brain (Cerebrum & Cerebral Cortex)',
    latinName: 'Cerebrum / Cortex Cerebri',
    system: 'nervous',
    systemName: 'Nervous System',
    region: 'head',
    regionName: 'Cranial Cavity',
    description: 'The supreme command and cognitive center of the human organism, divided into left and right hemispheres connected by the corpus callosum. Comprises frontal, parietal, temporal, and occipital lobes.',
    histology: 'Gray matter (neuronal cell bodies in 6 neocortical laminar layers) and white matter (myelinated projection and commissural axons).',
    functionDetails: 'Governs voluntary motor planning, sensory perception, language comprehension and production, executive decision-making, and conscious awareness.',
    attachments: 'Encased within the neurocranium, protected by three meningeal layers and cerebrospinal fluid (CSF).',
    vascularSupply: 'Circle of Willis supplied by paired internal carotid arteries and vertebral-basilar arteries.',
    innervation: 'Origin of Cranial Nerves I through XII.',
    clinicalRelevance: 'Ischemic stroke, hemorrhagic aneurysmal rupture, concussions, brain tumors, and acute intracranial hypertension.',
    symptomIds: ['headache', 'sudden_weakness_paralysis', 'slurred_speech', 'loss_of_consciousness'],
    image: '/src/assets/images/realistic_brain_anatomy_1790533427833.jpg',
    hotspotPos: { top: '8%', left: '50%' }
  },
  {
    id: 'cerebellum_brainstem',
    name: 'Cerebellum & Brainstem',
    latinName: 'Cerebellum et Truncus Encephali',
    system: 'nervous',
    systemName: 'Nervous System',
    region: 'head',
    regionName: 'Posterior Cranial Fossa',
    description: 'Situated in the posterior fossa inferior to the occipital lobes. Encompasses cerebellar hemispheres, midbrain, pons, and medulla oblongata.',
    histology: 'Cerebellar cortex features granule cells and GABAergic Purkinje cells; brainstem houses reticular formation and vital autonomic nuclei.',
    functionDetails: 'Coordinates voluntary motor precision, postural balance, vestibular-ocular reflexes, and automatic vital centers (respiration, vasomotor, cardiac rhythm).',
    attachments: 'Connected via superior, middle, and inferior cerebellar peduncles; attaches to the clivus anteriorly.',
    vascularSupply: 'Vertebrobasilar circulation including PICA, AICA, and superior cerebellar arteries.',
    innervation: 'Houses cranial nerve nuclei for CN III through XII in the brainstem tegmentum.',
    clinicalRelevance: 'Cerebellar ataxia, Wallenberg lateral medullary stroke, and brainstem compression.',
    symptomIds: ['loss_of_consciousness', 'sudden_weakness_paralysis', 'headache'],
    image: '/src/assets/images/realistic_brain_anatomy_1790533427833.jpg',
    hotspotPos: { top: '10%', left: '50%' }
  },

  // SENSORY ORGANS
  {
    id: 'eyes_optics',
    name: 'Eyes & Optic Apparatus',
    latinName: 'Bulbus Oculi & Apparatus Opticus',
    system: 'sensory',
    systemName: 'Sensory Organs',
    region: 'head',
    regionName: 'Orbital Cavities',
    description: 'Bilateral spherical visual sensory organs suspended within the bony orbits by extraocular muscles and retrobulbar adipose cushions.',
    histology: 'Three concentric tunics: outer fibrous tunic (cornea, sclera), middle uvea (choroid, ciliary body, iris), and inner neurosensory retina.',
    functionDetails: 'Focuses incident light rays onto photoreceptor outer segments, transducting photons into action potentials transmitted via optic nerve (CN II).',
    attachments: 'Suspended by 6 extraocular recti and oblique muscles originating from annular tendon of Zinn.',
    vascularSupply: 'Ophthalmic artery supplying central retinal artery and ciliary arteries.',
    innervation: 'Optic nerve (CN II), oculomotor (CN III), trochlear (CN IV), abducens (CN VI), and ophthalmic trigeminal (CN V1).',
    clinicalRelevance: 'Severe retro-orbital pain is pathognomonic for dengue fever, optic neuritis, glaucoma, and cluster headaches.',
    symptomIds: ['retro_orbital_pain', 'headache'],
    image: '/src/assets/images/realistic_woman_anatomy_1790532242104.jpg',
    hotspotPos: { top: '11%', left: '54%' }
  },

  // INTERNAL VISCERA & DIGESTIVE
  {
    id: 'stomach_gaster',
    name: 'Stomach (Cardia, Fundus & Pylorus)',
    latinName: 'Gaster / Ventriculus',
    system: 'internal',
    systemName: 'Internal Viscera',
    region: 'abdomen',
    regionName: 'Epigastrium & Left Hypochondrium',
    description: 'J-shaped muscular dilatation of the alimentary canal situated between the esophagus and duodenum, occupying epigastric and left hypochondriac regions.',
    histology: 'Gastric mucosa lined with simple columnar cells invaginating into gastric pits with parietal cells (hydrochloric acid, intrinsic factor) and chief cells (pepsinogen).',
    functionDetails: 'Mechanical churning and chemical digestion of dietary bolus into acidic chyme; intrinsic factor secretion essential for vitamin B12 absorption.',
    attachments: 'Suspended by the lesser omentum superiorly and greater omentum from the greater curvature inferiorly.',
    vascularSupply: 'Celiac trunk branches: left and right gastric arteries, gastro-omental arteries, and short gastric arteries.',
    innervation: 'Anterior and posterior vagal trunks (parasympathetic secretomotor) and celiac plexus (sympathetic vasoconstrictive).',
    clinicalRelevance: 'Peptic ulcer disease, Helicobacter pylori gastritis, gastroesophageal reflux, gastric adenocarcinoma, and outlet obstruction.',
    symptomIds: ['abdominal_pain', 'nausea', 'vomiting', 'loss_of_appetite'],
    image: '/src/assets/images/realistic_stomach_digestive_1790533455235.jpg',
    hotspotPos: { top: '35%', left: '52%' }
  },
  {
    id: 'liver_hepar',
    name: 'Liver (Right & Left Lobes)',
    latinName: 'Hepar / Lobus Hepatis',
    system: 'internal',
    systemName: 'Internal Viscera',
    region: 'abdomen',
    regionName: 'Right Hypochondrium',
    description: 'The largest visceral parenchymal gland in the body, occupying the right hypochondrium and epigastrium, protected by the lower ribcage.',
    histology: 'Organized into hexagonal classic hepatic lobules with fenestrated sinusoidal capillaries, hepatocytes, and resident phagocytic Kupffer cells.',
    functionDetails: 'Synthesizes serum albumin and coagulation factors; stores glycogen; detoxifies xenobiotics, alcohol, and converts ammonia into urea.',
    attachments: 'Suspended from the diaphragm and abdominal wall by falciform ligament, coronary ligaments, and triangular ligaments.',
    vascularSupply: 'Dual inflow: 75% venous nutrient blood via hepatic portal vein and 25% arterial oxygenated blood via hepatic artery proper.',
    innervation: 'Hepatic plexus originating from celiac plexus and anterior vagal trunk.',
    clinicalRelevance: 'Viral hepatitis (A, B, C), cirrhosis, fatty liver disease (NAFLD), liver abscess, and jaundice.',
    symptomIds: ['abdominal_pain', 'nausea', 'vomiting', 'loss_of_appetite'],
    image: '/src/assets/images/realistic_stomach_digestive_1790533455235.jpg',
    hotspotPos: { top: '33%', left: '42%' }
  },
  {
    id: 'pancreas_endocrine',
    name: 'Pancreas & Duodenum',
    latinName: 'Pancreas & Duodenum',
    system: 'internal',
    systemName: 'Internal Viscera',
    region: 'abdomen',
    regionName: 'Epigastrium / Retroperitoneum',
    description: 'Elongated retroperitoneal digestive organ consisting of head nestled within the C-loop of the duodenum, neck, body, and tail reaching the spleen.',
    histology: 'Dual gland: exocrine acinar clusters secreting bicarbonate and digestive enzymes; endocrine Islets of Langerhans secreting insulin, glucagon, and somatostatin.',
    functionDetails: 'Enzymatic digestion of proteins, fats, and carbohydrates in the small bowel; systemic hormonal glucose homeostasis.',
    attachments: 'Retroperitoneal structure anchored to posterior abdominal wall across L1-L2 vertebral bodies.',
    vascularSupply: 'Superior and inferior pancreaticoduodenal arteries, and splenic artery branches.',
    innervation: 'Celiac and superior mesenteric plexuses.',
    clinicalRelevance: 'Acute pancreatitis (epigastric pain radiating to back), chronic pancreatitis, pancreatic adenocarcinoma, and diabetes mellitus.',
    symptomIds: ['abdominal_pain', 'nausea', 'vomiting'],
    image: '/src/assets/images/realistic_stomach_digestive_1790533455235.jpg',
    hotspotPos: { top: '38%', left: '49%' }
  },
  {
    id: 'kidneys_renal',
    name: 'Kidneys & Renal Cortex',
    latinName: 'Renes / Cortex Renalis',
    system: 'internal',
    systemName: 'Internal Viscera',
    region: 'abdomen',
    regionName: 'Retroperitoneal Flanks',
    description: 'Paired bean-shaped retroperitoneal excretory organs located along the posterior abdominal wall on either side of the vertebral column (T12-L3).',
    histology: 'Each kidney contains over 1 million functional nephrons consisting of renal corpuscles (glomerulus, Bowman capsule) and convoluted tubules.',
    functionDetails: 'Filters metabolic nitrogenous wastes (urea, creatinine), maintains electrolyte balance (sodium, potassium), regulates arterial blood pressure via renin, and produces erythropoietin.',
    attachments: 'Encased within renal capsule, perinephric fat, and Gerota renal fascia anchored to posterior abdominal wall.',
    vascularSupply: 'Renal arteries arising directly from abdominal aorta at level L1-L2; drains into IVC via renal veins.',
    innervation: 'Renal plexus derived from celiac and aorticorenal ganglia.',
    clinicalRelevance: 'Acute kidney injury, ascending pyelonephritis, nephrolithiasis (kidney stones with severe colicky flank pain), and chronic kidney disease.',
    symptomIds: ['abdominal_pain', 'burning_urination', 'frequent_urination'],
    image: '/src/assets/images/realistic_stomach_digestive_1790533455235.jpg',
    hotspotPos: { top: '41%', left: '43%' }
  },
  {
    id: 'intestines_colon',
    name: 'Small Intestine & Colon',
    latinName: 'Intestinum Tenue & Colon',
    system: 'internal',
    systemName: 'Internal Viscera',
    region: 'abdomen',
    regionName: 'Abdominopelvic Cavity',
    description: 'Continuous gastrointestinal tract comprising the jejunum, ileum, ascending, transverse, descending, sigmoid colon, and rectum.',
    histology: 'Small intestine features villi and crypts of Lieberkühn for nutrient uptake; colon features mucosal crypts with abundant goblet cells for mucus lubrication.',
    functionDetails: 'Complete enzymatic digestion, primary nutrient and fluid absorption, fermentation of dietary fiber, and formation of solid fecal matter.',
    attachments: 'Suspended from posterior abdominal wall by fan-shaped mesentery and transverse/sigmoid mesocolons.',
    vascularSupply: 'Superior mesenteric artery (midgut) and inferior mesenteric artery (hindgut).',
    innervation: 'Enteric nervous system (Myenteric Auerbach and Submucosal Meissner plexuses) modulated by sympathetic and parasympathetic nerves.',
    clinicalRelevance: 'Acute gastroenteritis, appendicitis (RLQ pain), inflammatory bowel disease (Crohn/Ulcerative Colitis), bowel obstruction, and infectious diarrhea.',
    symptomIds: ['diarrhea', 'abdominal_pain', 'nausea', 'vomiting'],
    image: '/src/assets/images/realistic_stomach_digestive_1790533455235.jpg',
    hotspotPos: { top: '46%', left: '50%' }
  },

  // MUSCLES & MOTION
  {
    id: 'coracobrachialis_biceps',
    name: 'Left Coracobrachialis & Biceps',
    latinName: 'Musculus Coracobrachialis & Biceps Brachii',
    system: 'muscles',
    systemName: 'Muscles & Motion',
    region: 'limbs_upper',
    regionName: 'Anterior Arm Compartment',
    description: 'Slender, elongated muscle located in the upper and medial part of the arm, reinforced by the powerful two-headed biceps brachii.',
    histology: 'Striated skeletal muscle fascicles bundled by perimysium, rich in contractible actin and myosin myofilaments.',
    functionDetails: 'Operates as a flexor and adductor of the arm at the glenohumeral joint; assists in stabilizing the humerus head against downward displacement.',
    attachments: 'Originates from apex of coracoid process of scapula; inserts into medial surface and border of the body of the humerus.',
    vascularSupply: 'Muscular branches of the brachial artery and anterior circumflex humeral artery.',
    innervation: 'Pierced and innervated by the musculocutaneous nerve (C5, C6, C7).',
    clinicalRelevance: 'Musculocutaneous nerve entrapment, coracobrachialis strain from repetitive overhead throwing, and anterior shoulder impingement.',
    symptomIds: ['sudden_weakness_paralysis', 'joint_pain'],
    image: '/src/assets/images/realistic_muscle_isolated_1790533469797.jpg',
    hotspotPos: { top: '28%', left: '26%' }
  },
  {
    id: 'right_gracilis_thigh',
    name: 'Right Gracilis & Medial Thigh',
    latinName: 'Musculus Gracilis',
    system: 'muscles',
    systemName: 'Muscles & Motion',
    region: 'limbs_lower',
    regionName: 'Medial Thigh Compartment',
    description: 'The most superficial muscle on the medial side of the thigh; thin and flattened, broad above and tapering below.',
    histology: 'Long parallel striated skeletal muscle fibers with high excursion capability and fast contractile responsiveness.',
    functionDetails: 'Adducts the thigh at the hip joint, flexes the leg at the knee, and assists in medial rotation of the tibia upon the femur.',
    attachments: 'Originates from anterior margin of lower half of pubic symphysis; inserts into upper part of medial surface of body of tibia (pes anserinus).',
    vascularSupply: 'Deep femoral artery, medial circumflex femoral artery, and muscular branches of obturator artery.',
    innervation: 'Anterior branch of the obturator nerve (L2, L3).',
    clinicalRelevance: 'Pes anserine bursitis, groin pull / adductor strain in athletes, and widely utilized as a free functioning muscle flap in reconstructive surgery.',
    symptomIds: ['joint_pain', 'body_ache'],
    image: '/src/assets/images/realistic_muscle_isolated_1790533469797.jpg',
    hotspotPos: { top: '56%', left: '46%' }
  },
  {
    id: 'rhomboid_back_muscle',
    name: 'Left Rhomboid Minor & Major',
    latinName: 'Musculus Rhomboideus Minor & Major',
    system: 'muscles',
    systemName: 'Muscles & Motion',
    region: 'back',
    regionName: 'Upper Back / Scapula',
    description: 'Rhomboid-shaped skeletal muscles situated on the upper back beneath the trapezius, connecting the vertebral spine to the medial border of the scapula.',
    histology: 'Type I slow-twitch oxidative striated fibers arranged in oblique fascicles designed for sustained postural scapular retraction.',
    functionDetails: 'Retracts and elevates the scapula, rotates the glenoid cavity inferiorly, and fixes the scapula firmly against the thoracic wall.',
    attachments: 'Originates from nuchal ligament and spinous processes of C7-T5; inserts into medial border of scapula from root of spine to inferior angle.',
    vascularSupply: 'Dorsal scapular artery and deep branch of transverse cervical artery.',
    innervation: 'Dorsal scapular nerve (C4, C5).',
    clinicalRelevance: 'Myofascial trigger point pain between shoulder blades, dorsal scapular nerve entrapment (scapular winging), and postural strain.',
    symptomIds: ['body_ache'],
    image: '/src/assets/images/realistic_muscle_isolated_1790533469797.jpg',
    hotspotPos: { top: '26%', left: '46%' }
  },
  {
    id: 'pectoralis_deltoid_muscle',
    name: 'Pectoralis Major & Deltoid',
    latinName: 'Musculus Pectoralis Major & Deltoideus',
    system: 'muscles',
    systemName: 'Muscles & Motion',
    region: 'chest',
    regionName: 'Anterior Chest Wall & Shoulder',
    description: 'Large, thick fan-shaped chest muscle and the triangular shoulder muscle capping the glenohumeral joint.',
    histology: 'Bundles of multi-nucleated striated muscle fibers organized into fascicles surrounded by perimysium, rich in type II fast-twitch fibers.',
    functionDetails: 'Drives arm adduction, medial rotation, forward flexion, and shoulder abduction past 15 degrees.',
    attachments: 'Clavicle, sternum, and costal cartilages, inserting into lateral lip of bicipital groove of humerus and deltoid tuberosity.',
    vascularSupply: 'Pectoral branch of thoracoacromial trunk and lateral thoracic artery.',
    innervation: 'Medial and lateral pectoral nerves (C5-T1); deltoid innervated by axillary nerve (C5-C6).',
    clinicalRelevance: 'Pectoralis tendon avulsion tears, axillary nerve palsy during shoulder dislocation, and chest wall muscular strain.',
    symptomIds: ['chest_pain', 'body_ache'],
    image: '/src/assets/images/realistic_muscle_isolated_1790533469797.jpg',
    hotspotPos: { top: '22%', left: '40%' }
  },
  {
    id: 'quadriceps_leg_muscle',
    name: 'Quadriceps Femoris & Calves',
    latinName: 'Musculus Quadriceps Femoris & Gastrocnemius',
    system: 'muscles',
    systemName: 'Muscles & Motion',
    region: 'limbs_lower',
    regionName: 'Lower Extremity',
    description: 'Massive four-part anterior thigh muscle (rectus femoris, vastus lateralis, vastus medialis, vastus intermedius) and the calf complex (gastrocnemius, soleus).',
    histology: 'Dense pennate and multipennate architecture generating immense contractile force; calf muscles insert via thick Achilles tendon.',
    functionDetails: 'Extends knee joint and flexes hip; essential for walking, stair climbing, running, and jumping.',
    attachments: 'Inserts into tibial tuberosity via patella and patellar ligament; gastrocnemius inserts into calcaneus via Achilles tendon.',
    vascularSupply: 'Femoral artery, lateral circumflex femoral artery, and posterior tibial artery.',
    innervation: 'Femoral nerve (L2-L4) for quadriceps; tibial nerve (S1-S2) for gastrocnemius.',
    clinicalRelevance: 'Achilles tendon rupture, patellofemoral pain syndrome, quadriceps strain, and deep compartment syndrome.',
    symptomIds: ['joint_pain', 'sudden_weakness_paralysis', 'body_ache'],
    image: '/src/assets/images/realistic_muscle_isolated_1790533469797.jpg',
    hotspotPos: { top: '68%', left: '44%' }
  },

  // SKELETON & BONES
  {
    id: 'cranium_skull',
    name: 'Skull & Facial Skeleton (Cranium)',
    latinName: 'Cranium & Viscerocranium',
    system: 'skeleton',
    systemName: 'Skeleton & Bones',
    region: 'head',
    regionName: 'Cephalic Skeleton',
    description: 'Bony framework composed of 22 bones: the 8 neurocranial bones protecting the brain and the 14 viscerocranial facial bones supporting orbits, nasal cavities, and jaws.',
    histology: 'Flat and irregular bones composed of outer and inner cortical compact bone plates enclosing spongy cancellous diploë with bone marrow.',
    functionDetails: 'Houses and safeguards brain, cranial meninges, and special sensory organs; anchors facial mimetic and masticatory muscles.',
    attachments: 'Articulates with atlas (C1) via occipital condyles at the atlanto-occipital joint.',
    vascularSupply: 'Middle meningeal artery and branches of external carotid artery.',
    innervation: 'Extensive cranial nerve foramina transmitting CN I through XII.',
    clinicalRelevance: 'Linear and depressed skull fractures, basilar skull fracture (raccoon eyes, Battle sign), and temporomandibular joint (TMJ) dysfunction.',
    symptomIds: ['headache'],
    image: '/src/assets/images/realistic_bone_isolated_1790533483130.jpg',
    hotspotPos: { top: '7%', left: '50%' }
  },
  {
    id: 'ribcage_sternum',
    name: 'Thoracic Cage & Sternum',
    latinName: 'Thorax & Sternum',
    system: 'skeleton',
    systemName: 'Skeleton & Bones',
    region: 'chest',
    regionName: 'Thorax',
    description: 'Bony and cartilaginous osteocartilaginous cage formed by 12 pairs of ribs, costal cartilages, sternum (manubrium, body, xiphoid), and 12 thoracic vertebrae.',
    histology: 'True ribs (1-7), false ribs (8-10), and floating ribs (11-12) composed of vascularized trabecular bone containing active hematopoiesis in red bone marrow.',
    functionDetails: 'Protects vital thoracic organs (heart, great vessels, lungs) and provides biomechanical compliance for respiratory ventilation.',
    attachments: 'Articulates with clavicles at sternoclavicular joints and thoracic vertebrae at costovertebral joints.',
    vascularSupply: 'Internal thoracic arteries and posterior intercostal arteries.',
    innervation: 'Intercostal nerves running along costal groove on inferior border of each rib.',
    clinicalRelevance: 'Rib fractures (flail chest risk), costochondritis (Tietze syndrome with chest wall tenderness), and sternal fractures.',
    symptomIds: ['chest_pain'],
    image: '/src/assets/images/realistic_bone_isolated_1790533483130.jpg',
    hotspotPos: { top: '23%', left: '50%' }
  },
  {
    id: 'pelvis_sacrum',
    name: 'Pelvic Girdle & Sacrum',
    latinName: 'Pelvis & Os Sacrum',
    system: 'skeleton',
    systemName: 'Skeleton & Bones',
    region: 'pelvis',
    regionName: 'Pelvic Basin',
    description: 'Basin-shaped ring of bones connecting the axial vertebral column to the lower limbs, formed by paired hip bones (ilium, ischium, pubis) and the sacrum.',
    histology: 'Massive compact cortical bone encasing trabecular networks designed to transfer upper body gravitational load onto femoral heads.',
    functionDetails: 'Transfers body weight to lower limbs, supports pelvic visceral organs (bladder, rectum, reproductive), and anchors powerful gait muscles.',
    attachments: 'Articulates with L5 vertebra superiorly and femoral heads at the deep ball-and-socket acetabular joints.',
    vascularSupply: 'Internal and external iliac arterial branches.',
    innervation: 'Sacral plexus (L4-S4) giving rise to sciatic, pudendal, and gluteal nerves.',
    clinicalRelevance: 'High-energy pelvic fractures with catastrophic retroperitoneal hemorrhage, sacroiliitis, and pubic symphysis diastasis.',
    symptomIds: ['joint_pain', 'body_ache'],
    image: '/src/assets/images/realistic_bone_isolated_1790533483130.jpg',
    hotspotPos: { top: '48%', left: '50%' }
  },
  {
    id: 'femur_knee_joint',
    name: 'Femur, Patella & Knee Joint',
    latinName: 'Os Femoris & Articulatio Genus',
    system: 'skeleton',
    systemName: 'Skeleton & Bones',
    region: 'limbs_lower',
    regionName: 'Lower Limb',
    description: 'The longest, heaviest, and strongest tubular bone in the human body, articulating distally with the patella and tibia to form the bicondylar hinge knee joint.',
    histology: 'Thick tubular cortical bone shaft (diaphysis) enclosing medullary cavity, with epiphyses composed of cancellous bone covered with hyaline articular cartilage.',
    functionDetails: 'Supports upright body weight, absorbs ambulation impacts, and provides immense lever arms for quadriceps and hamstring locomotion.',
    attachments: 'Anchors gluteus maximus, quadriceps, hamstrings, adductors, and calf muscles.',
    vascularSupply: 'Femoral artery and profunda femoris perforating branches; knee genicular arterial anastomosis.',
    innervation: 'Femoral, obturator, and sciatic nerves via articular branches.',
    clinicalRelevance: 'Femoral neck fractures (avascular necrosis risk), ACL/PCL ligamentous tears, meniscal injury, and knee osteoarthritis.',
    symptomIds: ['joint_pain', 'sudden_weakness_paralysis'],
    image: '/src/assets/images/realistic_bone_isolated_1790533483130.jpg',
    hotspotPos: { top: '72%', left: '44%' }
  }
];

interface ThreeHumanAtlasProps {
  collectedSymptoms: ExtractedSymptom[];
  onToggleSymptom: (symptomId: string) => void;
  onOpenSOS: () => void;
  onExecuteAssessment?: () => void;
}

export const ThreeHumanAtlas: React.FC<ThreeHumanAtlasProps> = ({
  collectedSymptoms,
  onToggleSymptom,
  onOpenSOS,
  onExecuteAssessment
}) => {
  // Systems filter state
  const [activeSystems, setActiveSystems] = useState({
    skeleton: false,
    muscles: true,
    heart: true,
    internal: true,
    respiration: true,
    nervous: true,
    sensory: true
  });

  const [bodySex, setBodySex] = useState<'male' | 'female'>('male');
  const [displayMode, setDisplayMode] = useState<'full_body' | 'all_parts'>('full_body');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [selectedStructureId, setSelectedStructureId] = useState<string>('heart_myocardium');
  const [isolatedMode, setIsolatedMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredStructureId, setHoveredStructureId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'histology' | 'action' | 'vessels' | 'clinical'>('overview');
  const [mobileTab, setMobileTab] = useState<'canvas' | 'systems' | 'details'>('canvas');

  // Zoom & Pan state for Center Stage
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const selectedStructure = ANATOMICAL_STRUCTURES.find(s => s.id === selectedStructureId) || ANATOMICAL_STRUCTURES[0];

  const toggleSystem = (sys: keyof typeof activeSystems) => {
    setActiveSystems(prev => ({ ...prev, [sys]: !prev[sys] }));
  };

  const getStructureSelectedSymptomsCount = (st: AnatomicalStructure) => {
    return st.symptomIds.filter(id => collectedSymptoms.some(s => s.id === id)).length;
  };

  const filteredStructures = ANATOMICAL_STRUCTURES.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(3.5, Number((prev + 0.35).toFixed(2))));
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

  // Camera presets
  const handleCameraPreset = (preset: 'front' | 'head' | 'torso' | 'legs') => {
    if (preset === 'front') {
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    } else if (preset === 'head') {
      setZoomLevel(2.2);
      setPanPosition({ x: 0, y: 130 });
    } else if (preset === 'torso') {
      setZoomLevel(2.0);
      setPanPosition({ x: 0, y: 45 });
    } else if (preset === 'legs') {
      setZoomLevel(2.0);
      setPanPosition({ x: 0, y: -130 });
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsPanning(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel <= 1) return;
    const maxPanX = (zoomLevel - 1) * 130;
    const maxPanY = (zoomLevel - 1) * 200;
    const nextX = Math.max(-maxPanX, Math.min(maxPanX, e.clientX - dragStart.x));
    const nextY = Math.max(-maxPanY, Math.min(maxPanY, e.clientY - dragStart.y));
    setPanPosition({ x: nextX, y: nextY });
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoomLevel(prev => {
      const next = Math.min(3.5, Math.max(1, Number((prev + delta).toFixed(2))));
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      else {
        const maxPanX = (next - 1) * 130;
        const maxPanY = (next - 1) * 200;
        setPanPosition(p => ({
          x: Math.max(-maxPanX, Math.min(maxPanX, p.x)),
          y: Math.max(-maxPanY, Math.min(maxPanY, p.y))
        }));
      }
      return next;
    });
  };

  // Touch pinch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.hypot(dx, dy));
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsPanning(true);
      setDragStart({ x: e.touches[0].clientX - panPosition.x, y: e.touches[0].clientY - panPosition.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / touchDistance;
      setZoomLevel(prev => {
        const next = Math.min(3.5, Math.max(1, Number((prev * ratio).toFixed(2))));
        if (next === 1) setPanPosition({ x: 0, y: 0 });
        return next;
      });
      setTouchDistance(dist);
    } else if (e.touches.length === 1 && isPanning && zoomLevel > 1) {
      const maxPanX = (zoomLevel - 1) * 130;
      const maxPanY = (zoomLevel - 1) * 200;
      const nextX = Math.max(-maxPanX, Math.min(maxPanX, e.touches[0].clientX - dragStart.x));
      const nextY = Math.max(-maxPanY, Math.min(maxPanY, e.touches[0].clientY - dragStart.y));
      setPanPosition({ x: nextX, y: nextY });
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(null);
    setIsPanning(false);
  };

  // Dynamic image selection for active visual mode
  const getPrimaryAnatomyPlate = () => {
    if (activeSystems.skeleton && !activeSystems.muscles && !activeSystems.internal) {
      return '/src/assets/images/realistic_human_skeleton_1790533375558.jpg';
    }
    if (activeSystems.internal && !activeSystems.muscles && !activeSystems.skeleton) {
      return '/src/assets/images/realistic_internal_organs_1790533390328.jpg';
    }
    if (activeSystems.muscles) {
      return '/src/assets/images/realistic_muscular_system_1790533403495.jpg';
    }
    return bodySex === 'male'
      ? '/src/assets/images/realistic_man_anatomy_1790532228432.jpg'
      : '/src/assets/images/realistic_woman_anatomy_1790532242104.jpg';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
      
      {/* Top Clinical Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Human Atlas (3D Anatomy Explorer)
              </h2>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                Medical Precision
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Photorealistic full-body human atlas · Disassemble internal organs, muscles & skeleton in 3D
            </p>
          </div>
        </div>

        {/* Global Search Bar (Matching Video Top Right) */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find a structure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenSOS}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS 108</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs (Shown only on small/medium screens for optimal mobile experience) */}
      <div className="lg:hidden p-3 pb-0 bg-slate-100/80 border-b border-slate-200">
        <div className="grid grid-cols-3 gap-1 bg-slate-200/90 p-1 rounded-xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setMobileTab('canvas')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'canvas'
                ? 'bg-white text-teal-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-teal-600" />
            <span>3D Body</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('systems')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'systems'
                ? 'bg-white text-teal-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Systems</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('details')}
            className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all relative ${
              mobileTab === 'details'
                ? 'bg-white text-teal-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate">Organ Data</span>
            {getStructureSelectedSymptomsCount(selectedStructure) > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Systems & Camera Angle Sidebar (3 Cols) */}
        <div className={`lg:col-span-3 border-r border-slate-200 p-4 bg-slate-50/50 flex flex-col justify-between space-y-4 ${
          mobileTab === 'systems' ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="space-y-3.5">
            
            {/* Biological Model Toggle: Male vs Female */}
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Anatomy Model:</span>
                </span>
                <span className="text-[10px] text-teal-700 font-semibold uppercase">{bodySex}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setBodySex('male')}
                  className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                    bodySex === 'male'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>👨</span>
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBodySex('female')}
                  className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all ${
                    bodySex === 'female'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>👩</span>
                  <span>Female</span>
                </button>
              </div>
            </div>

            {/* Systems Toggles (Exact Layout from Video Sidebar) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                Anatomical Systems
              </span>

              {[
                { key: 'skeleton', label: 'Skeleton & Bones', icon: Bone, color: 'text-amber-700' },
                { key: 'muscles', label: 'Muscles & Motion', icon: Activity, color: 'text-red-700' },
                { key: 'heart', label: 'Heart & Vessels', icon: HeartPulse, color: 'text-rose-700' },
                { key: 'respiration', label: 'Respiration & Lungs', icon: Wind, color: 'text-cyan-700' },
                { key: 'internal', label: 'Internal Viscera', icon: Droplets, color: 'text-emerald-700' },
                { key: 'nervous', label: 'Nervous System', icon: Brain, color: 'text-yellow-700' },
                { key: 'sensory', label: 'Sensory Organs', icon: Eye, color: 'text-sky-700' }
              ].map(({ key, label, icon: Icon, color }) => {
                const isActive = activeSystems[key as keyof typeof activeSystems];
                return (
                  <div
                    key={key}
                    onClick={() => toggleSystem(key as keyof typeof activeSystems)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-white border-teal-300 shadow-2xs'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center ${color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {label}
                      </span>
                    </div>

                    <div className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${isActive ? 'bg-teal-600' : 'bg-slate-300'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isActive ? 'translate-x-3' : 'translate-x-0'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Camera View Angle Presets */}
          <div className="pt-3 border-t border-slate-200 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Quick Focus Region:
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <button
                onClick={() => handleCameraPreset('front')}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                Full Body
              </button>
              <button
                onClick={() => handleCameraPreset('head')}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                Head Focus
              </button>
              <button
                onClick={() => handleCameraPreset('torso')}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                Torso / Chest
              </button>
              <button
                onClick={() => handleCameraPreset('legs')}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                Lower Limbs
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Realistic 3D Stage OR Exploded Catalog (6 Cols) */}
        <div className={`lg:col-span-6 relative flex flex-col items-center justify-between min-h-[580px] bg-slate-50/60 overflow-hidden ${
          mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {displayMode === 'full_body' ? (
            <>
              {/* Floating Top Status & Zoom Tools */}
              <div className="w-full p-3 flex items-center justify-between z-20">
                <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>Pinch / Scroll to Zoom · Drag to Pan</span>
                </div>

                {/* Floating Zoom Toolbar */}
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-slate-200 shadow-md">
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3.5}
                    className="p-1 text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors disabled:opacity-30"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-1.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-700 rounded min-w-[36px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </div>

                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1 text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors disabled:opacity-30"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  {zoomLevel > 1 && (
                    <button
                      onClick={handleResetZoom}
                      className="p-1 text-teal-700 hover:bg-teal-50 rounded transition-colors"
                      title="Reset View"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Central Realistic Human Body Canvas with Exploded Depth */}
              <div
                className={`relative w-full h-[470px] select-none flex items-center justify-center overflow-hidden ${
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
                {/* 3D Transform Container */}
                <div
                  className="relative w-64 h-[440px] flex items-center justify-center"
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: isPanning ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Layer 1: Internal Visceral Organs (Visible during explode) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: `translateX(${explodeFactor * 90}px) scale(${1 - explodeFactor * 0.08})`,
                      opacity: explodeFactor > 0.05 ? Math.min(1, explodeFactor * 1.5) : 0,
                      pointerEvents: explodeFactor > 0.05 ? 'auto' : 'none'
                    }}
                  >
                    <img
                      src="/src/assets/images/realistic_internal_organs_1790533390328.jpg"
                      alt="Internal Visceral Organs"
                      className="w-full h-full object-contain drop-shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      Viscera Layer
                    </div>
                  </div>

                  {/* Layer 2: Skeletal Framework (Visible during explode) */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: `translateX(${-explodeFactor * 90}px) scale(${1 - explodeFactor * 0.08})`,
                      opacity: explodeFactor > 0.05 ? Math.min(1, explodeFactor * 1.5) : 0,
                      pointerEvents: explodeFactor > 0.05 ? 'auto' : 'none'
                    }}
                  >
                    <img
                      src="/src/assets/images/realistic_human_skeleton_1790533375558.jpg"
                      alt="Human Skeleton"
                      className="w-full h-full object-contain drop-shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      Skeletal Framework
                    </div>
                  </div>

                  {/* Main Center Layer: Striated Musculature / Primary Anatomy Plate */}
                  <div
                    className="relative w-full h-full flex items-center justify-center transition-all duration-300"
                    style={{
                      transform: `scale(${1 - explodeFactor * 0.05})`,
                      opacity: explodeFactor > 0.8 ? 0.35 : 1
                    }}
                  >
                    <img
                      src={getPrimaryAnatomyPlate()}
                      alt="Realistic Human Muscular Anatomy"
                      className="w-full h-full object-contain drop-shadow-md"
                      referrerPolicy="no-referrer"
                    />

                    {/* Interactive Hotspot Pins for Precise Clinical Tagging */}
                    {ANATOMICAL_STRUCTURES.map(st => {
                      const isSelected = selectedStructureId === st.id;
                      const isHovered = hoveredStructureId === st.id;
                      const activeCount = getStructureSelectedSymptomsCount(st);

                      return (
                        <div
                          key={st.id}
                          style={{ top: st.hotspotPos.top, left: st.hotspotPos.left }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
                          onMouseEnter={() => setHoveredStructureId(st.id)}
                          onMouseLeave={() => setHoveredStructureId(null)}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStructureId(st.id);
                              setIsolatedMode(false);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-md select-none transition-all ${
                              isSelected
                                ? 'bg-teal-600 text-white ring-4 ring-teal-200 scale-125 z-40'
                                : activeCount > 0
                                ? 'bg-teal-700 text-white ring-2 ring-teal-300 scale-110'
                                : 'bg-white/95 text-slate-800 hover:text-teal-700 hover:bg-white hover:scale-115 border border-slate-300'
                            }`}
                            title={st.name}
                          >
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            {activeCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-600 text-white text-[8px] font-bold flex items-center justify-center border border-white">
                                {activeCount}
                              </span>
                            )}
                          </button>

                          {/* Hover Tooltip */}
                          <div className={`pointer-events-none absolute bottom-full mb-1 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap border border-slate-700 flex items-center gap-1">
                              <span>{st.name.split('(')[0].trim()}</span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Quick Organ Card on Canvas (Shown on mobile for instant organ info) */}
              <div className="lg:hidden w-11/12 max-w-sm mx-auto mb-2 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-xs flex items-center justify-between gap-2 z-20">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={selectedStructure.image}
                    alt={selectedStructure.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {selectedStructure.name.split('(')[0].trim()}
                    </h4>
                    <p className="text-[10px] text-teal-700 font-semibold truncate">
                      {selectedStructure.systemName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('details')}
                  className="px-2.5 py-1.5 bg-teal-700 text-white rounded-lg text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <span>Organ Data</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Explode Anatomy Slider & View Switcher (Exact Video Control at 0:02!) */}
              <div className="w-11/12 max-w-lg mx-auto mb-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 sm:p-3 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                <div className="w-full sm:flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-teal-600" />
                      <span>Explode anatomy</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {Math.round(explodeFactor * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-slate-400">0%</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={explodeFactor}
                      onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                      className="flex-1 accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg touch-manipulation"
                    />
                    <span className="text-[10px] font-medium text-slate-400">100%</span>
                  </div>
                </div>

                {/* View Switcher: Full body vs All parts (Directly from video!) */}
                <div className="flex items-center justify-center bg-slate-100 p-0.5 rounded-lg text-xs w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setDisplayMode('full_body')}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold transition-all bg-white text-teal-900 shadow-2xs text-center"
                  >
                    Full body
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode('all_parts')}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold transition-all text-slate-600 hover:text-slate-900 text-center"
                  >
                    All parts
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Exploded All Parts Catalog Matrix (Matching Video 0:06 - 0:25!) */
            <div className="w-full h-full p-4 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-teal-600" />
                    <span>Exploded Anatomical Parts Catalog ({filteredStructures.length} Structures)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Inspected and isolated individually with authentic medical illustrations
                  </p>
                </div>

                <button
                  onClick={() => setDisplayMode('full_body')}
                  className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-800 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  Return to Full Body
                </button>
              </div>

              {/* Realistic Cards Grid (Matching 0:08 - 0:22 in video) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredStructures.map(struct => {
                  const isSelected = selectedStructureId === struct.id;
                  const activeCount = getStructureSelectedSymptomsCount(struct);

                  return (
                    <div
                      key={struct.id}
                      onClick={() => {
                        setSelectedStructureId(struct.id);
                        setIsolatedMode(true);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-teal-50/90 border-teal-500 shadow-sm ring-2 ring-teal-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* High-Resolution Realistic Render Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={struct.image}
                            alt={struct.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 uppercase truncate">
                              {struct.systemName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium shrink-0">
                              {struct.regionName}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {struct.name}
                          </h4>

                          <p className="text-[10px] font-serif italic text-slate-500 truncate">
                            {struct.latinName}
                          </p>

                          <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                            {struct.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-500 font-medium">
                          {struct.symptomIds.length} Associated Symptoms
                        </span>
                        {activeCount > 0 ? (
                          <span className="px-1.5 py-0.5 bg-teal-600 text-white rounded font-bold">
                            {activeCount} Active
                          </span>
                        ) : (
                          <span className="text-teal-700 font-bold hover:underline">
                            Inspect Details →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Structure Clinical Details & Action Panel (3 Cols) */}
        <div className={`lg:col-span-3 border-l border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[740px] ${
          mobileTab === 'details' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Mobile Back Button to Return to 3D Anatomy Canvas */}
          <button
            type="button"
            onClick={() => setMobileTab('canvas')}
            className="lg:hidden w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <span>← Back to 3D Anatomy Model</span>
          </button>

          <div className="space-y-3.5">
            
            {/* Header: Structure Details with High-Res Image Preview */}
            <div className="pb-3 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedStructure.systemName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {selectedStructure.regionName}
                </span>
              </div>

              {/* Large Realistic Render of Selected Organ / Muscle / Bone */}
              <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedStructure.image}
                  alt={selectedStructure.name}
                  className="w-full h-full object-contain drop-shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedStructure.name}
                </h3>
                <p className="text-xs font-serif italic text-teal-800 mt-0.5">
                  {selectedStructure.latinName}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2 text-[11px] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveDetailTab('overview')}
                className={`px-2 py-1 rounded font-semibold transition-colors shrink-0 ${
                  activeDetailTab === 'overview'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('histology')}
                className={`px-2 py-1 rounded font-semibold transition-colors shrink-0 ${
                  activeDetailTab === 'histology'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Histology
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('action')}
                className={`px-2 py-1 rounded font-semibold transition-colors shrink-0 ${
                  activeDetailTab === 'action'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Action
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('vessels')}
                className={`px-2 py-1 rounded font-semibold transition-colors shrink-0 ${
                  activeDetailTab === 'vessels'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vessels / Nerves
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('clinical')}
                className={`px-2 py-1 rounded font-semibold transition-colors shrink-0 ${
                  activeDetailTab === 'clinical'
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clinical
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs text-slate-600 leading-relaxed min-h-[140px]">
              {activeDetailTab === 'overview' && (
                <div className="space-y-2">
                  <p>{selectedStructure.description}</p>
                  {selectedStructure.attachments && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                      <span className="font-bold text-slate-800 block">Anatomical Attachments:</span>
                      <span>{selectedStructure.attachments}</span>
                    </div>
                  )}
                </div>
              )}

              {activeDetailTab === 'histology' && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-teal-700">
                    Tissue & Cellular Architecture:
                  </div>
                  <p>{selectedStructure.histology}</p>
                </div>
              )}

              {activeDetailTab === 'action' && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-teal-700">
                    Primary Physiological Action:
                  </div>
                  <p>{selectedStructure.functionDetails}</p>
                </div>
              )}

              {activeDetailTab === 'vessels' && (
                <div className="space-y-2.5 text-[11px]">
                  <div className="p-2 bg-rose-50/70 border border-rose-200 rounded-lg">
                    <span className="font-bold text-rose-900 block">Vascular Supply:</span>
                    <span className="text-rose-800">{selectedStructure.vascularSupply}</span>
                  </div>
                  <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <span className="font-bold text-amber-900 block">Innervation:</span>
                    <span className="text-amber-800">{selectedStructure.innervation}</span>
                  </div>
                </div>
              )}

              {activeDetailTab === 'clinical' && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-teal-700">
                    Pathologies & Clinical Relevance:
                  </div>
                  <p>{selectedStructure.clinicalRelevance}</p>
                </div>
              )}
            </div>

            {/* Associated Symptoms Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-800 block">
                Mapped Symptoms ({selectedStructure.symptomIds.length}):
              </span>

              <div className="space-y-1.5">
                {selectedStructure.symptomIds.map(sId => {
                  const sym = MASTER_SYMPTOMS.find(s => s.id === sId);
                  if (!sym) return null;
                  const isAdded = collectedSymptoms.some(s => s.id === sId);

                  return (
                    <div
                      key={sId}
                      onClick={() => onToggleSymptom(sId)}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isAdded
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {sym.isEmergencyIndicator && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        )}
                        <span>{sym.name}</span>
                      </div>

                      <button
                        type="button"
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          isAdded ? 'bg-teal-600 text-white' : 'border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trigger Assessment Button */}
          {onExecuteAssessment && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onExecuteAssessment}
                disabled={collectedSymptoms.length === 0}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>Run Assessment ({collectedSymptoms.length} Symptoms)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
