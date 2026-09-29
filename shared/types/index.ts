/**
 * Shared Type Definitions for AI Health Symptom Checker
 * Used across Web, Mobile, Desktop, and Backend
 */

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export type TriageLevel = 'emergency' | 'urgent' | 'moderate' | 'self_care';

export type MLModelType = 'random_forest' | 'decision_tree' | 'naive_bayes';

export interface Symptom {
  id: string;
  name: string;
  category: 'general' | 'respiratory' | 'cardiovascular' | 'neurological' | 'gastrointestinal' | 'musculoskeletal' | 'dermatological' | 'ent';
  aliases: string[];
  severityOptions: ('mild' | 'moderate' | 'severe')[];
  isEmergencyIndicator?: boolean;
  commonFollowUps?: string[];
}

export interface ExtractedSymptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
  duration?: string;
  notes?: string;
}

export interface DiseaseCondition {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'high' | 'critical';
  precautions: string[];
  whenToSeekCare: string[];
  recommendedSpecialist: string;
  isEmergency?: boolean;
  emergencyIndicators?: string[];
}

export interface ConditionPrediction {
  conditionId: string;
  name: string;
  probability: number; // 0.00 to 1.00
  matchingSymptoms: string[];
  precautions: string[];
  whenToSeekCare: string[];
  recommendedSpecialist: string;
  severity: 'mild' | 'moderate' | 'high' | 'critical';
}

export interface ModelComparisonResult {
  modelName: MLModelType;
  displayName: string;
  predictions: {
    condition: string;
    probability: number;
  }[];
  modelAccuracy: number;
}

export interface AssessmentResult {
  id: string;
  timestamp: string;
  userId?: string;
  patientInfo: {
    age: number;
    sex: 'male' | 'female' | 'other';
    existingConditions?: string[];
    medications?: string[];
  };
  reportedSymptoms: ExtractedSymptom[];
  triageLevel: TriageLevel;
  emergencyWarnings: string[];
  primaryModel: MLModelType;
  possibleConditions: ConditionPrediction[];
  modelComparisons: ModelComparisonResult[];
  generalPrecautions: string[];
  whenToSeekMedicalCare: string[];
  recommendedSpecialists: string[];
  disclaimer: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  qualification: string;
  hospital: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  rating: number;
  consultationFee: number;
  availability: string;
  languages: string[];
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Government' | 'Private Multi-Specialty' | 'Teaching / Medical College';
  city: string;
  state: string;
  address: string;
  emergencyPhone: string;
  generalPhone: string;
  is24x7Emergency: boolean;
  ambulanceAvailable: boolean;
  icuAvailable: boolean;
  distanceKm?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guest';
  age?: number;
  sex?: 'male' | 'female' | 'other';
  preferredLanguage: SupportedLanguage;
  createdAt: string;
}

export interface ConsultationRecord {
  id: string;
  userId?: string;
  createdAt: string;
  patientAge: number;
  patientSex: string;
  symptoms: string[];
  triageLevel: TriageLevel;
  primaryCondition: string;
  primaryProbability: number;
  possibleConditions: { name: string; probability: number }[];
  emergencyDetected: boolean;
  notes?: string;
}

export type FeedbackCategory =
  | 'accuracy'
  | 'anatomy_3d'
  | 'voice_input'
  | 'ui_experience'
  | 'doctor_referral'
  | 'other';

export interface UserFeedback {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  consultationId?: string;
  rating: number; // 1 to 5
  category: FeedbackCategory;
  comment: string;
  tags?: string[];
  createdAt: string;
}

export interface MLModelMetrics {
  modelName: MLModelType;
  displayName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  cvMeanScore: number;
  confusionMatrix: {
    labels: string[];
    matrix: number[][];
  };
  trainingSamplesCount: number;
  testSamplesCount: number;
  featuresCount: number;
  lastTrained: string;
}

export interface SavedAssessmentSession {
  id: string;
  userId?: string;
  sessionName?: string;
  savedAt: string; // ISO string
  activeView: string;
  collectedSymptoms: ExtractedSymptom[];
  patientDemographics: {
    age: number;
    sex: 'female' | 'male' | 'other';
    duration: string;
    severity: 'mild' | 'moderate' | 'severe';
    medications?: string;
    existingConditions?: string;
  };
  chatMessages?: {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    timestamp: string;
    extracted?: ExtractedSymptom[];
    duration?: string;
    isEmergencyAlert?: boolean;
  }[];
  selectedBodyRegion?: string | null;
  currentAssessment?: AssessmentResult | null;
  isAutoSaved?: boolean;
  summaryText?: string;
}

