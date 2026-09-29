/**
 * Medical Symptoms Master Dataset
 * Includes standardized IDs, multi-language aliases, categories, and emergency flags
 */

import { Symptom } from '../types';

export const MASTER_SYMPTOMS: Symptom[] = [
  // Cardiovascular / Emergency
  {
    id: 'chest_pain',
    name: 'Chest Pain or Pressure',
    category: 'cardiovascular',
    aliases: ['chest tightness', 'chest ache', 'pain in chest', 'angina', 'heavy chest', 'chhati me dard', 'ede novu', 'nenju vali'],
    severityOptions: ['mild', 'moderate', 'severe'],
    isEmergencyIndicator: true,
    commonFollowUps: ['shortness_of_breath', 'sweating', 'dizziness', 'nausea']
  },
  {
    id: 'shortness_of_breath',
    name: 'Shortness of Breath (Dyspnea)',
    category: 'respiratory',
    aliases: ['breathlessness', 'difficulty breathing', 'gasping', 'saans lene me dikkat', 'usiru kattuvike', 'swasa aada kapovadam'],
    severityOptions: ['mild', 'moderate', 'severe'],
    isEmergencyIndicator: true,
    commonFollowUps: ['chest_pain', 'cough', 'wheezing', 'fatigue']
  },
  {
    id: 'palpitations',
    name: 'Heart Palpitations / Rapid Heartbeat',
    category: 'cardiovascular',
    aliases: ['racing heart', 'fluttering chest', 'irregular pulse', 'dil ki dhadkan tezz', 'hrudaya baddane'],
    severityOptions: ['mild', 'moderate', 'severe'],
    isEmergencyIndicator: false,
    commonFollowUps: ['dizziness', 'chest_pain', 'anxiety']
  },
  {
    id: 'loss_of_consciousness',
    name: 'Fainting / Loss of Consciousness (Syncope)',
    category: 'neurological',
    aliases: ['fainted', 'passed out', 'blackout', 'behoshi', 'moorche'],
    severityOptions: ['moderate', 'severe'],
    isEmergencyIndicator: true,
    commonFollowUps: ['dizziness', 'headache', 'confusion']
  },
  {
    id: 'sudden_weakness_paralysis',
    name: 'Sudden Weakness / Numbness (Face/Arm/Leg)',
    category: 'neurological',
    aliases: ['paralysis', 'facial drooping', 'arm numbness', 'one sided weakness', 'lakwa', 'pakshaghata'],
    severityOptions: ['severe'],
    isEmergencyIndicator: true,
    commonFollowUps: ['slurred_speech', 'confusion', 'dizziness']
  },
  {
    id: 'slurred_speech',
    name: 'Difficulty Speaking / Slurred Speech',
    category: 'neurological',
    aliases: ['cannot talk properly', 'trouble speaking', 'bolne me dikkat', 'mathanadalu thondare'],
    severityOptions: ['severe'],
    isEmergencyIndicator: true,
    commonFollowUps: ['sudden_weakness_paralysis', 'confusion']
  },

  // General & Systemic
  {
    id: 'fever',
    name: 'Fever / High Temperature',
    category: 'general',
    aliases: ['high temperature', 'chills', 'feverish', 'bukhar', 'jwara', 'kaichal', 'jwaram'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['headache', 'body_ache', 'fatigue', 'chills']
  },
  {
    id: 'headache',
    name: 'Headache',
    category: 'neurological',
    aliases: ['head pain', 'migraine', 'throbbing head', 'sar dard', 'tale novu', 'thalai vali', 'thala noppi'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['nausea', 'sensitivity_to_light', 'dizziness']
  },
  {
    id: 'fatigue',
    name: 'Fatigue / Extreme Weakness',
    category: 'general',
    aliases: ['tiredness', 'exhaustion', 'lethargy', 'kamzori', 'thakan', 'ayasa', 'nirasam'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['fever', 'body_ache', 'loss_of_appetite']
  },
  {
    id: 'body_ache',
    name: 'Body Pain / Generalized Myalgia',
    category: 'musculoskeletal',
    aliases: ['muscle pain', 'joint pain', 'whole body ache', 'badan dard', 'deha novu', 'udambu vali'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['fever', 'joint_pain', 'fatigue']
  },
  {
    id: 'chills',
    name: 'Chills and Rigors',
    category: 'general',
    aliases: ['shivering', 'cold feeling with fever', 'thandi lagna', 'chali'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['fever', 'sweating']
  },
  {
    id: 'loss_of_appetite',
    name: 'Loss of Appetite',
    category: 'gastrointestinal',
    aliases: ['not feeling hungry', 'poor appetite', 'bhookh na lagna', 'oota sedadiruvudu'],
    severityOptions: ['mild', 'moderate'],
    commonFollowUps: ['nausea', 'fatigue', 'weight_loss']
  },

  // Respiratory & ENT
  {
    id: 'cough',
    name: 'Cough (Dry or Productive)',
    category: 'respiratory',
    aliases: ['coughing', 'hack', 'khasi', 'kemmu', 'irumal', 'daggu'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['sore_throat', 'fever', 'shortness_of_breath', 'chest_pain']
  },
  {
    id: 'sore_throat',
    name: 'Sore Throat / Throat Pain',
    category: 'ent',
    aliases: ['scratchy throat', 'pain swallowing', 'throat infection', 'gala kharab', 'gontlu novu', 'thondai vali'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['cough', 'fever', 'runny_nose']
  },
  {
    id: 'runny_nose',
    name: 'Runny or Congested Nose',
    category: 'ent',
    aliases: ['nasal congestion', 'stuffy nose', 'sneezing', 'naak behna', 'moogu soruvudu'],
    severityOptions: ['mild', 'moderate'],
    commonFollowUps: ['sore_throat', 'cough', 'headache']
  },
  {
    id: 'wheezing',
    name: 'Wheezing / Whistling Breathing',
    category: 'respiratory',
    aliases: ['chest whistling', 'asthma sound', 'swasa saddhu'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['shortness_of_breath', 'cough']
  },

  // Gastrointestinal
  {
    id: 'nausea',
    name: 'Nausea / Queasiness',
    category: 'gastrointestinal',
    aliases: ['feeling sick', 'urge to vomit', 'ji michlana', 'vanti baruvike'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['vomiting', 'abdominal_pain', 'loss_of_appetite']
  },
  {
    id: 'vomiting',
    name: 'Vomiting',
    category: 'gastrointestinal',
    aliases: ['throwing up', 'puking', 'ulti', 'vanti'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['nausea', 'diarrhea', 'abdominal_pain', 'dehydration']
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea / Loose Stools',
    category: 'gastrointestinal',
    aliases: ['watery stools', 'loose motions', 'dast', 'bedi'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['abdominal_pain', 'vomiting', 'fever', 'dehydration']
  },
  {
    id: 'abdominal_pain',
    name: 'Abdominal / Stomach Pain',
    category: 'gastrointestinal',
    aliases: ['stomach ache', 'belly pain', 'cramps', 'pet dard', 'hotte novu', 'vayiru vali'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['nausea', 'vomiting', 'diarrhea', 'fever']
  },

  // Musculoskeletal & Dermatological
  {
    id: 'joint_pain',
    name: 'Joint Pain and Swelling (Arthralgia)',
    category: 'musculoskeletal',
    aliases: ['knee pain', 'wrist pain', 'ankle pain', 'jodo ka dard', 'keelu novu'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['fever', 'skin_rash', 'fatigue']
  },
  {
    id: 'skin_rash',
    name: 'Skin Rash or Eruptions',
    category: 'dermatological',
    aliases: ['red spots', 'itching rash', 'hives', 'chakatte', 'kandu baruvudu', 'arippu'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['itching', 'fever', 'joint_pain']
  },
  {
    id: 'burning_urination',
    name: 'Burning Sensation During Urination (Dysuria)',
    category: 'general',
    aliases: ['painful urine', 'urine burning', 'peshab me jalan', 'moothra uritha'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['frequent_urination', 'fever', 'abdominal_pain']
  },
  {
    id: 'frequent_urination',
    name: 'Frequent Urination / Increased Thirst',
    category: 'general',
    aliases: ['peeing often', 'polyuria', 'excessive thirst', 'baar baar peshab', 'hecchu moothra'],
    severityOptions: ['mild', 'moderate'],
    commonFollowUps: ['burning_urination', 'fatigue', 'weight_loss']
  },
  {
    id: 'retro_orbital_pain',
    name: 'Pain Behind Eyes (Retro-orbital pain)',
    category: 'neurological',
    aliases: ['eye socket ache', 'pain when moving eyes', 'aankhon ke peeche dard', 'kannina hinde novu'],
    severityOptions: ['mild', 'moderate', 'severe'],
    commonFollowUps: ['fever', 'headache', 'joint_pain']
  }
];

export const EMERGENCY_SYMPTOMS_LOOKUP = new Set([
  'chest_pain',
  'shortness_of_breath',
  'loss_of_consciousness',
  'sudden_weakness_paralysis',
  'slurred_speech'
]);
