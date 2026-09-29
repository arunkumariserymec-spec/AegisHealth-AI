/**
 * Medical Conditions and Clinical Guidance Dataset
 * Pre-calibrated clinical condition profiles with emergency triage rules
 */

import { DiseaseCondition } from '../types';

export const MASTER_CONDITIONS: DiseaseCondition[] = [
  {
    id: 'dengue_fever',
    name: 'Dengue Viral Fever',
    category: 'Infectious / Vector-borne',
    description: 'A mosquito-borne viral infection causing sudden high fever, intense retro-orbital pain, severe joint/muscle aches, and risk of platelet drop.',
    symptoms: ['fever', 'headache', 'retro_orbital_pain', 'body_ache', 'joint_pain', 'fatigue', 'nausea'],
    severity: 'high',
    precautions: [
      'Maintain rigorous oral hydration with ORS, coconut water, fresh juices, and clean water.',
      'Take paracetamol strictly under medical guidance for fever; strictly AVOID ibuprofen, aspirin, or NSAIDs as they increase bleeding risks.',
      'Get daily complete blood counts (CBC) to monitor platelet levels and hematocrit.',
      'Use mosquito repellent and bed nets to avoid spreading the virus to family members.'
    ],
    whenToSeekCare: [
      'Bleeding from gums, nose, or blood in vomiting or stool.',
      'Severe abdominal pain or persistent vomiting (unable to keep fluids down).',
      'Rapid platelet drop below 100,000 / uL or signs of extreme drowsiness/restlessness.'
    ],
    recommendedSpecialist: 'General Physician / Internal Medicine Specialist',
    isEmergency: false,
    emergencyIndicators: ['Severe bleeding', 'Persistent vomiting', 'Extreme drowsiness', 'Severe abdominal tenderness']
  },
  {
    id: 'malaria',
    name: 'Malaria Infection (Plasmodium vivax / falciparum)',
    category: 'Infectious / Parasitic',
    description: 'A life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes, characterized by cyclical chills, rigors, and high fever.',
    symptoms: ['fever', 'chills', 'headache', 'body_ache', 'fatigue', 'nausea', 'vomiting'],
    severity: 'high',
    precautions: [
      'Undergo a prompt peripheral blood smear or Rapid Diagnostic Test (RDT) for Malaria.',
      'Complete the full course of prescribed antimalarial medications (e.g., ACT or chloroquine/primaquine) without skipping doses.',
      'Rest adequately and drink plenty of fluids to prevent dehydration from heavy fever sweating.'
    ],
    whenToSeekCare: [
      'High grade continuous fever unresponsive to antipyretics.',
      'Yellowing of eyes or skin (jaundice) or dark brownish urine.',
      'Confusion, disorientation, or breathing difficulty (signs of complicated/cerebral malaria).'
    ],
    recommendedSpecialist: 'General Physician / Infectious Disease Specialist',
    isEmergency: false
  },
  {
    id: 'typhoid_fever',
    name: 'Typhoid (Enteric Fever)',
    category: 'Infectious / Bacterial',
    description: 'A systemic bacterial infection caused by Salmonella Typhi, spread through contaminated food or water, causing stepladder fever, abdominal discomfort, headache, and weakness.',
    symptoms: ['fever', 'headache', 'fatigue', 'abdominal_pain', 'loss_of_appetite', 'nausea', 'diarrhea'],
    severity: 'high',
    precautions: [
      'Drink strictly boiled or filtered water and consume only hot, freshly cooked meals.',
      'Complete prescribed antibiotic regimen strictly as directed by your physician.',
      'Avoid street food, raw vegetables, unpasteurized milk, and ice made from unverified water sources.'
    ],
    whenToSeekCare: [
      'High fever persisting past 4 to 5 days despite medication.',
      'Severe abdominal distention, excruciating pain, or black tarry stools.',
      'Inability to tolerate oral food or fluids due to extreme fatigue.'
    ],
    recommendedSpecialist: 'General Physician / Gastroenterologist',
    isEmergency: false
  },
  {
    id: 'acute_coronary_syndrome',
    name: 'Possible Acute Coronary Syndrome / Angina (CRITICAL EMERGENCY)',
    category: 'Cardiovascular / Emergency',
    description: 'A critical medical emergency involving suddenly reduced blood flow to the heart muscle, presenting with chest pain, pressure, or tightness that may radiate to the left arm, neck, or jaw.',
    symptoms: ['chest_pain', 'shortness_of_breath', 'palpitations', 'nausea', 'fatigue'],
    severity: 'critical',
    precautions: [
      'CRITICAL: STOP ALL PHYSICAL ACTIVITY IMMEDIATELY. Sit or lie down in a comfortable position with head slightly elevated.',
      'Do not drive yourself to the hospital; have someone call an emergency ambulance (108 / 112 in India).',
      'Loosen tight clothing around chest and neck.',
      'If previously prescribed sublingual nitroglycerin or emergency aspirin by a cardiologist and not allergic, administer as directed by an emergency doctor.'
    ],
    whenToSeekCare: [
      'IMMEDIATELY: Call 108 or 112 emergency services without delay.',
      'Chest tightness persisting more than 5 minutes or accompanied by cold sweat, dizziness, or jaw/arm radiation.'
    ],
    recommendedSpecialist: 'Emergency Department / Cardiologist',
    isEmergency: true,
    emergencyIndicators: ['chest_pain', 'shortness_of_breath', 'sweating', 'radiating pain']
  },
  {
    id: 'acute_stroke_tia',
    name: 'Suspected Acute Stroke / TIA (CRITICAL EMERGENCY)',
    category: 'Neurological / Emergency',
    description: 'A life-threatening medical emergency where blood supply to part of the brain is interrupted or reduced. Remember BE-FAST: Balance, Eyes, Face drooping, Arm weakness, Slurred speech, Time to call 108.',
    symptoms: ['sudden_weakness_paralysis', 'slurred_speech', 'loss_of_consciousness', 'headache', 'dizziness'],
    severity: 'critical',
    precautions: [
      'CRITICAL EMERGENCY: Time is brain tissue. Call 108 / 112 or transport immediately to a Stroke-Ready Hospital with 24x7 CT/MRI capability.',
      'Note the exact minute and hour symptoms started (the "last known normal" time) for thrombolysis decisions.',
      'Do NOT give the patient anything to eat or drink (choking hazard due to swallowing impairment).',
      'Keep patient lying down on their side if vomiting or unconscious.'
    ],
    whenToSeekCare: [
      'IMMEDIATELY: This is a 911/108 medical emergency. Every minute counts.'
    ],
    recommendedSpecialist: 'Emergency Department / Neurologist',
    isEmergency: true,
    emergencyIndicators: ['sudden_weakness_paralysis', 'slurred_speech', 'facial drooping']
  },
  {
    id: 'acute_bronchitis_asthma',
    name: 'Acute Bronchitis / Asthma Exacerbation',
    category: 'Respiratory',
    description: 'Inflammation of the airways causing bronchial constriction, wheezing, cough, chest tightness, and varying degrees of respiratory distress.',
    symptoms: ['cough', 'shortness_of_breath', 'wheezing', 'sore_throat', 'chest_pain', 'fatigue'],
    severity: 'moderate',
    precautions: [
      'If prescribed a fast-acting bronchodilator inhaler (such as Salbutamol / Albuterol), use as directed with spacer.',
      'Avoid exposure to active or passive cigarette smoke, dust, pollens, or chemical fumes.',
      'Steam inhalation and warm saline gargles can alleviate throat irritation and loosen mucus.',
      'Stay well-hydrated to thin bronchial secretions.'
    ],
    whenToSeekCare: [
      'Breathing difficulty worsening rapidly or unable to speak in full sentences without gasping.',
      'Bluish discoloration of lips, nails, or fingertips (cyanosis).',
      'Inhaler provides no relief within 15-20 minutes.'
    ],
    recommendedSpecialist: 'Pulmonologist / Chest Physician',
    isEmergency: false
  },
  {
    id: 'viral_upper_respiratory_infection',
    name: 'Viral Upper Respiratory Infection (Common Cold / Flu)',
    category: 'Respiratory / Viral',
    description: 'A common self-limiting viral infection of the nose and throat causing nasal congestion, mild fever, throat discomfort, and dry or mild productive cough.',
    symptoms: ['runny_nose', 'sore_throat', 'cough', 'fever', 'headache', 'fatigue', 'body_ache'],
    severity: 'mild',
    precautions: [
      'Prioritize rest and drink warm liquids (herbal teas, warm water with lemon, clear broths).',
      'Perform warm saline gargles twice daily to soothe irritated pharyngeal mucosa.',
      'Use saline nasal sprays or gentle steam inhalation for nasal congestion.',
      'Antibiotics are ineffective against viral infections and should never be taken without prescription.'
    ],
    whenToSeekCare: [
      'Fever exceeding 102°F (38.9°C) or lasting more than 3 consecutive days.',
      'Development of significant shortness of breath or stabbing chest pain.',
      'Inability to swallow fluids or severe ear pain.'
    ],
    recommendedSpecialist: 'General Physician / Family Doctor',
    isEmergency: false
  },
  {
    id: 'acute_gastroenteritis',
    name: 'Acute Gastroenteritis / Food Poisoning',
    category: 'Gastrointestinal',
    description: 'Inflammation of the stomach and intestines typically caused by viral or bacterial infection from contaminated food or water, leading to watery diarrhea, vomiting, and cramps.',
    symptoms: ['diarrhea', 'vomiting', 'nausea', 'abdominal_pain', 'fever', 'fatigue', 'loss_of_appetite'],
    severity: 'moderate',
    precautions: [
      'Immediate Oral Rehydration Salts (ORS) therapy: 1 packet in 1 liter clean water, sipped continuously after each loose stool.',
      'Eat bland, easily digestible foods (rice kanji, bananas, curd/yogurt, toast, applesauce - BRAT diet).',
      'Avoid dairy products (except fresh curd), fried/spicy foods, caffeine, and carbonated beverages.',
      'Wash hands thoroughly with soap before preparing or consuming food.'
    ],
    whenToSeekCare: [
      'Signs of severe dehydration: sunken eyes, dry mouth, extreme thirst, no urine output for over 8 hours.',
      'High fever with blood or mucus in stools (dysentery).',
      'Inability to retain any oral fluids for more than 12 hours.'
    ],
    recommendedSpecialist: 'General Physician / Gastroenterologist',
    isEmergency: false
  },
  {
    id: 'migraine',
    name: 'Migraine / Tension Headache Disorder',
    category: 'Neurological',
    description: 'A neurological condition causing moderate to severe throbbing headache, often unilateral, frequently accompanied by sensitivity to light/sound and nausea.',
    symptoms: ['headache', 'nausea', 'vomiting', 'fatigue'],
    severity: 'moderate',
    precautions: [
      'Rest in a quiet, dark, well-ventilated room away from bright screens and loud sounds.',
      'Apply a cool compress or ice pack gently to the forehead or temples.',
      'Identify and document dietary triggers (aged cheese, skipping meals, caffeine withdrawal, irregular sleep).',
      'Stay adequately hydrated throughout the day.'
    ],
    whenToSeekCare: [
      '"Thunderclap" headache: sudden explosive onset reaching peak intensity within seconds.',
      'Headache accompanied by fever, stiff neck, confusion, or visual loss.',
      'New headache pattern developing after age 50.'
    ],
    recommendedSpecialist: 'Neurologist / General Physician',
    isEmergency: false
  },
  {
    id: 'urinary_tract_infection',
    name: 'Urinary Tract Infection (Cystitis / Pyelonephritis)',
    category: 'Urological / Bacterial',
    description: 'A bacterial infection of the urinary bladder or kidneys, characterized by burning micturition, increased frequency, urgency, and pelvic/lower abdominal discomfort.',
    symptoms: ['burning_urination', 'frequent_urination', 'abdominal_pain', 'fever', 'fatigue'],
    severity: 'moderate',
    precautions: [
      'Drink 2.5 to 3 liters of water daily to help flush bacteria out of the urinary tract.',
      'Never hold urine for prolonged periods; void completely when the urge arises.',
      'Consult a doctor for a routine urine analysis and culture before taking antibiotics.',
      'Wipe front to back after using the washroom to prevent fecal bacteria from reaching the urethra.'
    ],
    whenToSeekCare: [
      'High fever accompanied by severe flank (one-sided back/kidney) pain and chills (signs of kidney involvement).',
      'Visible pink or reddish blood in the urine.',
      'Persistent vomiting preventing oral medication intake.'
    ],
    recommendedSpecialist: 'Urologist / General Physician',
    isEmergency: false
  },
  {
    id: 'chikungunya',
    name: 'Chikungunya Viral Infection',
    category: 'Infectious / Vector-borne',
    description: 'An Aedes mosquito-transmitted viral disease recognized by sudden onset of high fever and severe, debilitating, often symmetrical joint pains that can persist for weeks.',
    symptoms: ['fever', 'joint_pain', 'body_ache', 'skin_rash', 'headache', 'fatigue'],
    severity: 'high',
    precautions: [
      'Adequate joint rest and cold compresses on swollen joints during acute flares.',
      'Paracetamol under doctor advice for pain and fever control; avoid NSAIDs until dengue is ruled out.',
      'Gentle physiotherapy and joint mobilization once acute fever subsides.',
      'Ensure strict mosquito control around living spaces.'
    ],
    whenToSeekCare: [
      'Severe incapacitating joint swelling or inability to walk.',
      'Sudden decrease in urine output or extreme dizziness upon standing.',
      'Persistent symptoms lasting beyond 3 weeks without improvement.'
    ],
    recommendedSpecialist: 'Rheumatologist / General Physician',
    isEmergency: false
  },
  {
    id: 'type2_diabetes_hyperglycemia',
    name: 'Possible Hyperglycemia / Diabetes Mellitus Presentation',
    category: 'Endocrine / Metabolic',
    description: 'Metabolic disorder characterized by elevated blood glucose levels, leading to increased thirst (polydipsia), frequent urination (polyuria), unintended weight loss, and chronic fatigue.',
    symptoms: ['frequent_urination', 'fatigue', 'loss_of_appetite', 'headache'],
    severity: 'moderate',
    precautions: [
      'Undergo laboratory Fasting Blood Glucose (FBG) and HbA1c testing at a verified diagnostic laboratory.',
      'Limit refined sugars, sweets, sweetened beverages, and high-glycemic carbohydrates.',
      'Engage in regular moderate aerobic exercise (brisk walking 30 minutes daily).',
      'Schedule a comprehensive clinical consultation with an endocrinologist or diabetologist.'
    ],
    whenToSeekCare: [
      'Deep, rapid breathing accompanied by fruity-smelling breath, nausea, and confusion (signs of Diabetic Ketoacidosis - DKA).',
      'Extreme drowsiness, confusion, or unquenchable thirst.',
      'Non-healing sores or wounds on feet or extremities.'
    ],
    recommendedSpecialist: 'Endocrinologist / Diabetologist',
    isEmergency: false
  }
];
