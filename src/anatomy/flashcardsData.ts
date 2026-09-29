/**
 * Anatomy Flashcards Dataset
 * High-yield anatomical flashcards for rapid spaced repetition study
 */

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  system: string;
  systemName: string;
  structureId?: string;
  highYieldTip?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const ANATOMY_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    front: 'What are the four chambers of the human heart, and which has the thickest myocardium?',
    back: 'Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle.\n\nThe Left Ventricle has the thickest myocardium (approx. 3x thicker than the right) because it must generate enough systolic pressure to overcome systemic vascular resistance throughout the entire body.',
    system: 'cardiovascular',
    systemName: 'Cardiovascular System',
    structureId: 'heart',
    highYieldTip: 'Left ventricular hypertrophy (LVH) is a common clinical compensatory response to chronic systemic hypertension.',
    difficulty: 'easy'
  },
  {
    id: 'fc2',
    front: 'Which cranial nerve provides the primary parasympathetic innervation to the thoracic and abdominal viscera?',
    back: 'Cranial Nerve X — The Vagus Nerve.\n\nIt innervates the heart (slowing heart rate), lungs (bronchoconstriction), stomach, liver, pancreas, and small intestine up to the distal third of the transverse colon.',
    system: 'nervous',
    systemName: 'Nervous System',
    structureId: 'brain',
    highYieldTip: 'Vasovagal syncope occurs when excessive vagal discharge causes sudden bradycardia and vasodilation, resulting in fainting.',
    difficulty: 'medium'
  },
  {
    id: 'fc3',
    front: 'What is the largest bone in the human body, and what is its normal neck-shaft angle of inclination?',
    back: 'The Femur (thigh bone).\n\nThe normal neck-shaft angle of inclination in an adult is approximately 125 degrees (coxa norma). An angle >135° is coxa valga, while <120° is coxa vara.',
    system: 'skeletal',
    systemName: 'Skeletal System',
    structureId: 'femur_bone',
    highYieldTip: 'Femoral neck fractures jeopardize the medial circumflex femoral artery, predisposing to avascular necrosis (AVN) of the femoral head.',
    difficulty: 'medium'
  },
  {
    id: 'fc4',
    front: 'Name the three lobes of the right lung and the anatomical fissures separating them.',
    back: 'Superior Lobe, Middle Lobe, and Inferior Lobe.\n\nSeparated by the Horizontal Fissure (between superior and middle lobes) and the Oblique Fissure (separating the inferior lobe from both superior and middle lobes).',
    system: 'respiratory',
    systemName: 'Respiratory System',
    structureId: 'lungs',
    highYieldTip: 'Auscultation of the right middle lobe is performed anteriorly along the right 4th and 5th intercostal spaces.',
    difficulty: 'medium'
  },
  {
    id: 'fc5',
    front: 'What dual blood supply enters the liver, and what percentage of blood flow does each vessel provide?',
    back: '1. Hepatic Portal Vein: supplies ~75% of blood flow (nutrient-rich, partially deoxygenated from digestive tract).\n\n2. Hepatic Artery Proper: supplies ~25% of blood flow (high-oxygen arterial blood from celiac trunk).',
    system: 'digestive',
    systemName: 'Digestive System',
    structureId: 'liver',
    highYieldTip: 'In portal hypertension (due to cirrhosis), blood backs up into portosystemic anastomoses, producing esophageal varices and caput medusae.',
    difficulty: 'hard'
  },
  {
    id: 'fc6',
    front: 'What are the three major apertures (openings) in the human diaphragm, and at what vertebral levels do they occur?',
    back: '1. Caval Opening (Inferior Vena Cava): T8 level\n2. Esophageal Hiatus (Esophagus & Vagus Nerves): T10 level\n3. Aortic Hiatus (Aorta, Thoracic Duct, Azygos vein): T12 level\n\nMnemonic: "I 8 10 Eggs At 12" (IVC T8, Esophagus T10, Aorta T12).',
    system: 'respiratory',
    systemName: 'Respiratory System',
    structureId: 'diaphragm',
    highYieldTip: 'Hiatal hernia occurs when the upper stomach herniates through the T10 esophageal hiatus into the posterior mediastinum.',
    difficulty: 'hard'
  },
  {
    id: 'fc7',
    front: 'Which cells in the stomach gastric glands secrete Hydrochloric Acid (HCl) and Intrinsic Factor?',
    back: 'Parietal Cells (also called oxyntic cells), located predominantly in the gastric fundus and body.\n\nIntrinsic factor is essential for the ileal absorption of Vitamin B12.',
    system: 'digestive',
    systemName: 'Digestive System',
    structureId: 'stomach',
    highYieldTip: 'Autoimmune destruction of parietal cells results in Pernicious Anemia due to Vitamin B12 deficiency.',
    difficulty: 'easy'
  },
  {
    id: 'fc8',
    front: 'What is the anatomical function of the Spleen\'s Red Pulp versus White Pulp?',
    back: '• Red Pulp: Consists of splenic cords and venous sinusoids that mechanically filter blood, removing aged/damaged red blood cells and recycling iron.\n\n• White Pulp: Composed of periarteriolar lymphoid sheaths (PALS) and follicles containing T and B lymphocytes, initiating adaptive humoral immune responses against encapsulated blood-borne bacteria.',
    system: 'lymphatic',
    systemName: 'Lymphatic & Immune System',
    structureId: 'spleen',
    highYieldTip: 'Splenectomized patients have a life-long susceptibility to overwhelming post-splenectomy sepsis (OPSS) caused by encapsulated organisms like S. pneumoniae.',
    difficulty: 'medium'
  },
  {
    id: 'fc9',
    front: 'What are the four components of the Quadriceps Femoris muscle group, and what is their sole shared action?',
    back: '1. Rectus Femoris\n2. Vastus Lateralis\n3. Vastus Medialis\n4. Vastus Intermedius\n\nShared Action: Extension of the leg at the knee joint. All four insert into the tibial tuberosity via the patellar ligament.',
    system: 'muscular',
    systemName: 'Muscular System',
    structureId: 'quadriceps_muscle',
    highYieldTip: 'Testing the patellar tendon reflex (knee jerk) evaluates spinal cord segment levels L2, L3, and L4 via the femoral nerve.',
    difficulty: 'easy'
  },
  {
    id: 'fc10',
    front: 'Which hormone is secreted by the adrenal cortex Zona Glomerulosa, and what is its target organ?',
    back: 'Aldosterone (a mineralocorticoid).\n\nIts target is the distal convoluted tubule and collecting ducts of the Kidney, where it stimulates sodium and water reabsorption while promoting potassium excretion into urine.',
    system: 'endocrine',
    systemName: 'Endocrine System',
    structureId: 'adrenal_glands',
    highYieldTip: 'Primary hyperaldosteronism (Conn syndrome) leads to hypertension, hypokalemia, and metabolic alkalosis.',
    difficulty: 'hard'
  }
];
