/**
 * Systems Data for 3D Human Anatomy Education
 * Supports all 12 anatomical systems matching the user interface specifications
 */

export interface AnatomySystem {
  id: string;
  name: string;
  latinName: string;
  iconName: string;
  emoji: string;
  color: string;
  hexColor: string;
  structureCount: number;
  description: string;
  majorOrgans: string[];
  keyFunctions: string[];
  clinicalSignificance: string;
}

export const ANATOMY_SYSTEMS: AnatomySystem[] = [
  {
    id: 'skeletal',
    name: 'Skeletal System',
    latinName: 'Systema Skeletale',
    iconName: 'Bone',
    emoji: '💀',
    color: 'text-slate-200',
    hexColor: '#e2e8f0',
    structureCount: 206,
    description: 'The internal rigid framework of 206 bones, cartilages, and ligaments that provides structural support, anchors muscles for locomotion, protects vital visceral organs, and manufactures blood cells via hematopoiesis.',
    majorOrgans: ['Skull (Cranium)', 'Vertebral Column', 'Rib Cage & Sternum', 'Pelvis & Sacrum', 'Femur & Tibia', 'Humerus & Radius'],
    keyFunctions: ['Body weight support', 'Organ physical protection', 'Biomechanical leverage', 'Mineral (calcium/phosphate) reservoir', 'Bone marrow hematopoiesis'],
    clinicalSignificance: 'Osteoporosis, fractures, osteoarthritis, osteomyelitis, and scoliosis deformities.'
  },
  {
    id: 'muscular',
    name: 'Muscular System',
    latinName: 'Systema Musculare',
    iconName: 'Flame',
    emoji: '💪',
    color: 'text-red-500',
    hexColor: '#ef4444',
    structureCount: 650,
    description: 'Over 600 skeletal muscles together with smooth and cardiac muscle tissues, responsible for voluntary motor movement, stabilization of posture, internal organ peristalsis, and metabolic thermogenesis.',
    majorOrgans: ['Pectoralis Major', 'Deltoids', 'Biceps & Triceps', 'Rectus Abdominis', 'Quadriceps Femoris', 'Gastrocnemius & Soleus'],
    keyFunctions: ['Voluntary motion and locomotion', 'Joint stabilization', 'Continuous posture maintenance', 'Body heat production (thermogenesis)'],
    clinicalSignificance: 'Muscular dystrophies, tendon tears, compartment syndrome, myasthenia gravis, and sports strains.'
  },
  {
    id: 'nervous',
    name: 'Nervous System',
    latinName: 'Systema Nervosum',
    iconName: 'Brain',
    emoji: '🧠',
    color: 'text-purple-400',
    hexColor: '#c084fc',
    structureCount: 86,
    description: 'The central and peripheral command network comprising the brain, spinal cord, cranial/spinal nerves, and autonomic ganglia. It coordinates rapid electrical signaling for cognition, reflex responses, and sensory perception.',
    majorOrgans: ['Cerebrum & Cortex', 'Cerebellum', 'Brainstem (Pons/Medulla)', 'Spinal Cord', 'Sciatic Nerve', 'Brachial & Sacral Plexuses'],
    keyFunctions: ['Sensory information input', 'Higher cognitive processing & memory', 'Motor command output', 'Autonomic visceral regulation'],
    clinicalSignificance: 'Ischemic stroke, epilepsy, Alzheimer and Parkinson neurodegeneration, peripheral neuropathy, and spinal cord trauma.'
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    latinName: 'Systema Cardiovasculare',
    iconName: 'Heart',
    emoji: '❤️',
    color: 'text-red-600',
    hexColor: '#dc2626',
    structureCount: 120,
    description: 'The closed circulatory loop driven by the muscular four-chambered heart and an extensive network of elastic arteries, capillaries, and low-pressure veins distributing oxygen, hormones, and nutrients.',
    majorOrgans: ['Heart (Myocardium)', 'Ascending & Abdominal Aorta', 'Superior & Inferior Vena Cava', 'Pulmonary Arteries/Veins', 'Coronary Arteries'],
    keyFunctions: ['Oxygen and nutrient delivery to tissues', 'Carbon dioxide and metabolic waste clearance', 'Hormone transport', 'Systemic blood pressure maintenance'],
    clinicalSignificance: 'Coronary artery disease, myocardial infarction, hypertension, heart failure, and aneurysms.'
  },
  {
    id: 'respiratory',
    name: 'Respiratory System',
    latinName: 'Systema Respiratorium',
    iconName: 'Wind',
    emoji: '🫁',
    color: 'text-pink-400',
    hexColor: '#f472b6',
    structureCount: 45,
    description: 'The ventilatory airway and paired pulmonary alveolar beds enabling atmospheric oxygen intake and metabolic carbon dioxide release across an expansive thin capillary-alveolar interface.',
    majorOrgans: ['Lungs (Right 3 Lobes, Left 2 Lobes)', 'Trachea', 'Bronchial Tree', 'Larynx & Pharynx', 'Diaphragm'],
    keyFunctions: ['Pulmonary gas exchange (O2 in, CO2 out)', 'Acid-base balance (pH regulation)', 'Vocalization (phonation)', 'Airway filtration & humidification'],
    clinicalSignificance: 'Pneumonia, asthma, chronic bronchitis/emphysema (COPD), pulmonary embolism, and respiratory failure.'
  },
  {
    id: 'digestive',
    name: 'Digestive System',
    latinName: 'Systema Digestorium',
    iconName: 'Coffee',
    emoji: '🫃',
    color: 'text-amber-500',
    hexColor: '#f59e0b',
    structureCount: 75,
    description: 'The continuous gastrointestinal tract spanning from mouth to anus along with accessory digestive organs (liver, gallbladder, pancreas) dedicated to mechanical ingestion, enzymatic breakdown, nutrient absorption, and waste excretion.',
    majorOrgans: ['Stomach', 'Liver', 'Gallbladder', 'Pancreas', 'Small Intestine (Duodenum/Jejunum/Ileum)', 'Large Intestine (Colon & Appendix)'],
    keyFunctions: ['Macronutrient chemical digestion', 'Water, vitamin, and electrolyte absorption', 'Hepatic detoxification and bile production', 'Solid waste elimination'],
    clinicalSignificance: 'Gastroesophageal reflux disease (GERD), peptic ulcers, viral hepatitis, cirrhosis, pancreatitis, and appendicitis.'
  },
  {
    id: 'urinary',
    name: 'Urinary System',
    latinName: 'Systema Urinarium',
    iconName: 'Droplet',
    emoji: '🫘',
    color: 'text-yellow-500',
    hexColor: '#eab308',
    structureCount: 30,
    description: 'The renal metabolic filtering system including bilateral kidneys, paired ureters, urinary bladder, and urethra, maintaining blood plasma volume, electrolyte equilibrium, and waste excretion.',
    majorOrgans: ['Right & Left Kidneys', 'Renal Cortex & Medulla', 'Ureters', 'Urinary Bladder', 'Urethra'],
    keyFunctions: ['Nitrogenous waste filtration (urea, creatinine)', 'Fluid volume and osmolarity homeostasis', 'Renin-angiotensin blood pressure control', 'Erythropoietin hormonal secretion'],
    clinicalSignificance: 'Chronic kidney disease, kidney stones (nephrolithiasis), urinary tract infections, and glomerulonephritis.'
  },
  {
    id: 'endocrine',
    name: 'Endocrine System',
    latinName: 'Systema Endocrinum',
    iconName: 'Activity',
    emoji: '🧬',
    color: 'text-teal-400',
    hexColor: '#2dd4bf',
    structureCount: 22,
    description: 'A ductless network of hormone-producing glands and specialized tissue clusters releasing biochemical messengers directly into the bloodstream to regulate metabolism, growth, and reproduction.',
    majorOrgans: ['Pituitary Gland', 'Thyroid Gland', 'Adrenal Glands (Cortex/Medulla)', 'Pancreatic Islets', 'Parathyroid Glands', 'Pineal Gland'],
    keyFunctions: ['Basal metabolic rate regulation', 'Blood glucose control (insulin/glucagon)', 'Stress response adaptation (cortisol/adrenaline)', 'Circadian rhythms & calcium balance'],
    clinicalSignificance: 'Diabetes mellitus, thyroid disorders (hypo/hyperthyroidism), Cushing syndrome, and Addison disease.'
  },
  {
    id: 'lymphatic',
    name: 'Lymphatic & Immune',
    latinName: 'Systema Lymphoideum',
    iconName: 'Shield',
    emoji: '🩸',
    color: 'text-emerald-400',
    hexColor: '#34d399',
    structureCount: 40,
    description: 'A specialized vascular system of lymphatic capillaries, vessels, lymph nodes, the spleen, and thymus that drains interstitial fluid back into the venous system while mounting adaptive immune defenses.',
    majorOrgans: ['Spleen', 'Thymus', 'Lymph Nodes (Cervical, Axillary, Inguinal)', 'Thoracic Duct', 'Bone Marrow'],
    keyFunctions: ['Excess interstitial fluid return to circulation', 'Pathogen surveillance and lymphocyte activation', 'Dietary lipid absorption via lacteals'],
    clinicalSignificance: 'Lymphedema, lymphadenopathy, lymphomas (Hodgkin / non-Hodgkin), and splenomegaly.'
  },
  {
    id: 'reproductive',
    name: 'Reproductive System',
    latinName: 'Systema Genitale',
    iconName: 'Users',
    emoji: '🚻',
    color: 'text-indigo-400',
    hexColor: '#818cf8',
    structureCount: 28,
    description: 'The internal and external genitalia dedicated to gametogenesis (spermatozoa and ova), sex hormone synthesis (testosterone, estrogen, progesterone), and in females, gestating developing offspring.',
    majorOrgans: ['Testes / Ovaries', 'Prostate / Uterus', 'Epididymis / Fallopian Tubes', 'Vas Deferens / Cervix'],
    keyFunctions: ['Gametogenesis (sperm & egg production)', 'Secondary sexual characteristic maintenance', 'Fertilization and embryo gestation'],
    clinicalSignificance: 'Benign prostatic hyperplasia (BPH), endometriosis, ovarian cysts, and testicular/cervical cancers.'
  },
  {
    id: 'integumentary',
    name: 'Integumentary System',
    latinName: 'Systema Integumentarium',
    iconName: 'Sparkles',
    emoji: '🧴',
    color: 'text-amber-300',
    hexColor: '#fcd34d',
    structureCount: 15,
    description: 'The outermost defensive envelope of the human body comprising the skin (epidermis, dermis, hypodermis), hair follicles, nails, sebaceous glands, and sudoriferous sweat glands.',
    majorOrgans: ['Epidermis', 'Dermis', 'Subcutaneous Tissue (Hypodermis)', 'Hair Follicles', 'Sweat & Sebaceous Glands'],
    keyFunctions: ['Physical and microbiological barrier defense', 'Thermoregulation (perspiration & vasodilation)', 'Cutaneous sensation (touch, pain, temp)', 'Vitamin D cutaneous synthesis'],
    clinicalSignificance: 'Skin cancers (melanoma, basal cell carcinoma), burns, eczema, psoriasis, and dermatitis.'
  },
  {
    id: 'sensory',
    name: 'Sensory Organs',
    latinName: 'Organa Sensuum',
    iconName: 'Eye',
    emoji: '👁️',
    color: 'text-cyan-400',
    hexColor: '#22d3ee',
    structureCount: 20,
    description: 'Specialized peripheral receptors transducing electromagnetic waves (vision), acoustic pressure waves (hearing), equilibrium acceleration (vestibular), volatile chemicals (olfaction), and tastants (gustation).',
    majorOrgans: ['Eyes (Retina, Cornea, Lens)', 'Ears (Cochlea, Vestibule, Tympanic Membrane)', 'Olfactory Bulb', 'Tongue Gustatory Papillae'],
    keyFunctions: ['Visual photon transduction', 'Auditory soundwave frequency analysis', 'Spatial equilibrium balance', 'Chemical smell and taste sensing'],
    clinicalSignificance: 'Cataracts, glaucoma, sensorineural hearing loss, vertigo (BPPV), and anosmia.'
  }
];

export const ANATOMICAL_LAYERS = [
  { id: 1, name: 'Skin', label: '1. Skin', desc: 'Epidermis & Dermis', color: '#f87171' },
  { id: 2, name: 'Subcutaneous Tissue', label: '2. Subcutaneous', desc: 'Superficial Fascia & Adipose', color: '#fb923c' },
  { id: 3, name: 'Muscles (Superficial)', label: '3. Muscles (Superficial)', desc: 'Locomotion & Posture', color: '#ef4444' },
  { id: 4, name: 'Muscles (Deep)', label: '4. Muscles (Deep)', desc: 'Core & Intrinsic Muscles', color: '#b91c1c' },
  { id: 5, name: 'Bones', label: '5. Bones', desc: 'Axial & Appendicular Skeleton', color: '#e2e8f0' },
  { id: 6, name: 'Nervous System', label: '6. Nervous System', desc: 'Brain, Cord & Peripheral Nerves', color: '#c084fc' },
  { id: 7, name: 'Arteries', label: '7. Arteries', desc: 'High-Pressure Oxygenated Conduits', color: '#dc2626' },
  { id: 8, name: 'Veins & Organs', label: '8. Veins & Organs', desc: 'Visceral Organs & Venous Return', color: '#3b82f6' }
];
