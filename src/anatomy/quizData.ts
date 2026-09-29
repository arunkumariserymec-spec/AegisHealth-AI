/**
 * Anatomical Quiz Dataset
 * Clinically verified anatomy questions across multiple testing modalities
 */

export interface QuizQuestion {
  id: string;
  type: 'identify_structure' | 'multiple_choice' | 'true_false' | 'system_id' | 'function_question';
  question: string;
  system: string;
  systemName: string;
  targetStructureId?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalRelevance?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'identify_structure',
    question: 'Which four-chambered muscular organ is situated in the middle mediastinum between the lungs?',
    system: 'cardiovascular',
    systemName: 'Cardiovascular System',
    targetStructureId: 'heart',
    options: ['Lungs', 'Heart', 'Stomach', 'Thymus'],
    correctIndex: 1,
    explanation: 'The heart is the four-chambered muscular pump located in the middle mediastinum of the thoracic cavity, encased in the pericardial sac.',
    clinicalRelevance: 'The heart is the primary organ affected by coronary artery disease and acute myocardial infarction.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    type: 'function_question',
    question: 'What is the primary mechanical function of the diaphragm during normal quiet inspiration?',
    system: 'respiratory',
    systemName: 'Respiratory System',
    targetStructureId: 'diaphragm',
    options: [
      'Elevates the sternum toward the chin',
      'Flattens its dome downward to generate negative intrathoracic pressure',
      'Compresses the abdominal viscera to force air out',
      'Pushes the trachea forward'
    ],
    correctIndex: 1,
    explanation: 'Upon contraction, the diaphragm flattens its central tendon downward, which increases the vertical volume of the thoracic cavity, creating subatmospheric pressure that draws air into the lungs.',
    clinicalRelevance: 'Phrenic nerve injury (C3-C5) causes hemidiaphragmatic paralysis and respiratory compromise.',
    difficulty: 'medium'
  },
  {
    id: 'q3',
    type: 'system_id',
    question: 'Which human organ system does the spleen belong to?',
    system: 'lymphatic',
    systemName: 'Lymphatic & Immune System',
    targetStructureId: 'spleen',
    options: ['Digestive System', 'Lymphatic & Immune System', 'Endocrine System', 'Urinary System'],
    correctIndex: 1,
    explanation: 'The spleen is the largest secondary lymphoid organ in the human body. Although located in the abdomen, its primary duties are blood filtration, erythrocyte culling, and adaptive immunity.',
    clinicalRelevance: 'Splenic rupture following blunt left abdominal trauma causes massive internal hemorrhage.',
    difficulty: 'easy'
  },
  {
    id: 'q4',
    type: 'multiple_choice',
    question: 'Which is the longest, heaviest, and strongest long bone in the human skeleton?',
    system: 'skeletal',
    systemName: 'Skeletal System',
    targetStructureId: 'femur_bone',
    options: ['Tibia', 'Humerus', 'Femur', 'Fibula'],
    correctIndex: 2,
    explanation: 'The femur (thigh bone) is the longest, heaviest, and strongest bone in the body, capable of supporting up to 30 times human body weight.',
    clinicalRelevance: 'Femoral neck fractures in osteoporotic elderly individuals carry a high risk of avascular necrosis due to circumflex artery disruption.',
    difficulty: 'easy'
  },
  {
    id: 'q5',
    type: 'multiple_choice',
    question: 'What is the largest internal solid metabolic organ in the human body?',
    system: 'digestive',
    systemName: 'Digestive System',
    targetStructureId: 'liver',
    options: ['Pancreas', 'Liver', 'Spleen', 'Stomach'],
    correctIndex: 1,
    explanation: 'The liver is the largest internal solid organ and gland, weighing approximately 1.5 kg (3.3 lbs) in adults and performing over 500 vital metabolic functions.',
    clinicalRelevance: 'Chronic hepatitis and alcoholism can lead to irreversible hepatic cirrhosis and portal hypertension.',
    difficulty: 'easy'
  },
  {
    id: 'q6',
    type: 'identify_structure',
    question: 'Which large nerve, originating from spinal roots L4 through S3, is the longest and thickest nerve in the body?',
    system: 'nervous',
    systemName: 'Nervous System',
    targetStructureId: 'sciatic_nerve',
    options: ['Femoral Nerve', 'Radial Nerve', 'Sciatic Nerve', 'Vagus Nerve'],
    correctIndex: 2,
    explanation: 'The sciatic nerve originates from the sacral plexus (L4-S3) and descends down the posterior thigh to innervate the hamstrings and entire lower leg.',
    clinicalRelevance: 'Lumbar disc herniation commonly causes sciatica (sharp shooting radicular pain down the leg).',
    difficulty: 'medium'
  },
  {
    id: 'q7',
    type: 'true_false',
    question: 'True or False: The right lung has three anatomical lobes, while the left lung has only two lobes.',
    system: 'respiratory',
    systemName: 'Respiratory System',
    targetStructureId: 'lungs',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True. The right lung has superior, middle, and inferior lobes separated by horizontal and oblique fissures. The left lung has only superior and inferior lobes, accommodating the cardiac notch for the heart.',
    clinicalRelevance: 'Aspirated foreign objects most frequently lodge in the right main bronchus because it is wider, shorter, and more vertically oriented.',
    difficulty: 'easy'
  },
  {
    id: 'q8',
    type: 'function_question',
    question: 'Which endocrine and exocrine organ produces both digestive enzymes (lipase, amylase) and insulin?',
    system: 'digestive',
    systemName: 'Digestive System',
    targetStructureId: 'pancreas',
    options: ['Gallbladder', 'Pancreas', 'Thyroid Gland', 'Adrenal Gland'],
    correctIndex: 1,
    explanation: 'The pancreas is a dual organ: its exocrine acinar cells secrete digestive juices into the duodenum, while endocrine Islets of Langerhans release insulin and glucagon into the blood.',
    clinicalRelevance: 'Autoimmune destruction of pancreatic beta cells results in Type 1 Diabetes Mellitus.',
    difficulty: 'easy'
  },
  {
    id: 'q9',
    type: 'multiple_choice',
    question: 'Which nerve roots provide the exclusive motor innervation to the human diaphragm?',
    system: 'nervous',
    systemName: 'Nervous System',
    targetStructureId: 'diaphragm',
    options: ['T1 to T4 thoracic roots', 'C3, C4, and C5 (Phrenic Nerve)', 'L1 to L3 lumbar roots', 'Cranial Nerve X (Vagus)'],
    correctIndex: 1,
    explanation: 'The phrenic nerves arise from the ventral rami of cervical roots C3, C4, and C5 ("C3, 4, 5 keeps the diaphragm alive").',
    clinicalRelevance: 'Cervical spinal cord injuries above C3 cause loss of voluntary respiration, requiring mechanical ventilation.',
    difficulty: 'hard'
  },
  {
    id: 'q10',
    type: 'multiple_choice',
    question: 'Which major anterior thigh muscle group is the primary extensor of the knee joint?',
    system: 'muscular',
    systemName: 'Muscular System',
    targetStructureId: 'quadriceps_muscle',
    options: ['Hamstrings', 'Quadriceps Femoris', 'Gluteus Maximus', 'Gastrocnemius'],
    correctIndex: 1,
    explanation: 'The Quadriceps Femoris (rectus femoris, vastus lateralis, vastus medialis, vastus intermedius) is the sole prime extensor of the knee joint.',
    clinicalRelevance: 'Weakness in the vastus medialis obliquus can cause lateral patellar tracking and patellofemoral pain syndrome.',
    difficulty: 'medium'
  },
  {
    id: 'q11',
    type: 'true_false',
    question: 'True or False: Adult kidneys receive approximately 20% to 25% of the total resting cardiac output.',
    system: 'urinary',
    systemName: 'Urinary System',
    targetStructureId: 'kidneys',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True. Despite accounting for less than 1% of total body weight, both kidneys receive approximately 1.2 liters of blood per minute (20-25% of cardiac output) to filter metabolic wastes.',
    clinicalRelevance: 'Hypotension or severe hypovolemic shock rapidly leads to acute tubular necrosis and acute renal failure.',
    difficulty: 'medium'
  },
  {
    id: 'q12',
    type: 'multiple_choice',
    question: 'Which pyramid-shaped glands sit atop the superior poles of the kidneys and secrete cortisol and adrenaline?',
    system: 'endocrine',
    systemName: 'Endocrine System',
    targetStructureId: 'adrenal_glands',
    options: ['Parathyroid Glands', 'Pituitary Gland', 'Adrenal (Suprarenal) Glands', 'Pineal Gland'],
    correctIndex: 2,
    explanation: 'The adrenal (suprarenal) glands cap both kidneys, with the outer cortex secreting steroid hormones (aldosterone, cortisol) and the inner medulla releasing catecholamines (epinephrine, norepinephrine).',
    clinicalRelevance: 'Pheochromocytoma is a catecholamine-secreting neuroendocrine tumor of the adrenal medulla causing hypertensive crises.',
    difficulty: 'easy'
  }
];
