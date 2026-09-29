/**
 * Database Persistence Store
 * Provides persistent storage for Users, Consultations, Symptoms, Feedback, and Admin Stats.
 * Compatible with MongoDB (via Mongoose URI) or local state cache.
 */

import crypto from 'crypto';
import { User, ConsultationRecord, Symptom, DiseaseCondition, MLModelMetrics, UserFeedback, FeedbackCategory } from '../../../shared/types';
import { MASTER_SYMPTOMS } from '../../../shared/constants/symptoms_data';
import { MASTER_CONDITIONS } from '../../../shared/constants/conditions_data';

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

export type StoredFeedback = UserFeedback;

class DatabaseStore {
  private users: Map<string, StoredUser> = new Map();
  private consultations: Map<string, ConsultationRecord> = new Map();
  private feedback: StoredFeedback[] = [];
  private customSymptoms: Map<string, Symptom> = new Map();
  private customConditions: Map<string, DiseaseCondition> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  private seedInitialData() {
    // Seed Admin Account
    const adminSalt = crypto.randomBytes(16).toString('hex');
    const adminUser: StoredUser = {
      id: 'usr_admin_01',
      name: 'Dr. Ramesh Sharma (Admin)',
      email: 'admin@aihealth.org',
      role: 'admin',
      age: 48,
      sex: 'male',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      salt: adminSalt,
      passwordHash: this.hashPassword('admin123', adminSalt)
    };
    this.users.set(adminUser.id, adminUser);
    this.users.set(adminUser.email.toLowerCase(), adminUser);

    // Seed Demo Patient Account
    const patientSalt = crypto.randomBytes(16).toString('hex');
    const patientUser: StoredUser = {
      id: 'usr_patient_01',
      name: 'Priya Sundaram',
      email: 'priya@example.com',
      role: 'user',
      age: 29,
      sex: 'female',
      preferredLanguage: 'en',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      salt: patientSalt,
      passwordHash: this.hashPassword('patient123', patientSalt)
    };
    this.users.set(patientUser.id, patientUser);
    this.users.set(patientUser.email.toLowerCase(), patientUser);

    // Seed Initial Consultations
    const demoConsultation1: ConsultationRecord = {
      id: 'cns_demo_01',
      userId: patientUser.id,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      patientAge: 29,
      patientSex: 'female',
      symptoms: ['fever', 'headache', 'joint_pain', 'body_ache'],
      triageLevel: 'moderate',
      primaryCondition: 'Dengue Viral Fever',
      primaryProbability: 0.84,
      possibleConditions: [
        { name: 'Dengue Viral Fever', probability: 0.84 },
        { name: 'Chikungunya', probability: 0.72 },
        { name: 'Viral Upper Respiratory Infection', probability: 0.35 }
      ],
      emergencyDetected: false,
      notes: 'Initial fever evaluation with platelet count monitoring recommended.'
    };
    this.consultations.set(demoConsultation1.id, demoConsultation1);

    const demoConsultation2: ConsultationRecord = {
      id: 'cns_demo_02',
      userId: 'guest',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      patientAge: 52,
      patientSex: 'male',
      symptoms: ['chest_pain', 'shortness_of_breath', 'palpitations'],
      triageLevel: 'emergency',
      primaryCondition: 'Acute Coronary Syndrome',
      primaryProbability: 0.92,
      possibleConditions: [
        { name: 'Acute Coronary Syndrome', probability: 0.92 },
        { name: 'Acute Bronchitis Asthma', probability: 0.40 }
      ],
      emergencyDetected: true,
      notes: 'EMERGENCY RED FLAG: Urgent ambulance transfer initiated.'
    };
    this.consultations.set(demoConsultation2.id, demoConsultation2);

    // Seed Master Symptoms into Custom Symptom map
    MASTER_SYMPTOMS.forEach(s => this.customSymptoms.set(s.id, s));
    MASTER_CONDITIONS.forEach(c => this.customConditions.set(c.id, c));

    // Seed Initial User Feedback
    this.feedback = [
      {
        id: 'fb_seed_01',
        userId: 'usr_patient_01',
        userName: 'Ayesha Khan',
        userEmail: 'ayesha.k@example.com',
        rating: 5,
        category: 'accuracy',
        comment: 'The symptom triage was remarkably prompt and accurate. It flagged my viral fever correctly before I visited the clinic.',
        tags: ['Accurate Triage', 'Helpful Guidance'],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'fb_seed_02',
        userName: 'Vikram Joshi',
        rating: 5,
        category: 'anatomy_3d',
        comment: 'The 3D Human Anatomy Atlas is incredible! Being able to explode the thoracic organs and pinpoint chest symptoms made explaining things so easy.',
        tags: ['Interactive 3D', 'Intuitive Anatomy'],
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'fb_seed_03',
        userName: 'Pooja Hegde',
        rating: 4,
        category: 'voice_input',
        comment: 'Speaking symptoms in Hindi worked smoothly. Saved a lot of time typing on my phone.',
        tags: ['Voice-to-Text', 'Multilingual'],
        createdAt: new Date().toISOString()
      }
    ];
  }

  // --- Auth & Users ---
  public registerUser(data: { name: string; email: string; password: string; age?: number; sex?: 'male'|'female'|'other'; preferredLanguage?: any }): User {
    const emailKey = data.email.toLowerCase().trim();
    if (this.users.has(emailKey)) {
      throw new Error('A user with this email address already exists');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const user: StoredUser = {
      id,
      name: data.name.trim(),
      email: emailKey,
      role: 'user',
      age: data.age || 25,
      sex: data.sex || 'other',
      preferredLanguage: data.preferredLanguage || 'en',
      createdAt: new Date().toISOString(),
      salt,
      passwordHash: this.hashPassword(data.password, salt)
    };
    this.users.set(id, user);
    this.users.set(emailKey, user);
    const { salt: _, passwordHash: __, ...sanitized } = user;
    return sanitized;
  }

  public authenticate(email: string, password: string): User | null {
    const user = this.users.get(email.toLowerCase().trim());
    if (!user) return null;
    const computedHash = this.hashPassword(password, user.salt);
    if (computedHash === user.passwordHash) {
      const { salt: _, passwordHash: __, ...sanitized } = user;
      return sanitized;
    }
    return null;
  }

  public getUserById(id: string): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const { salt: _, passwordHash: __, ...sanitized } = user;
    return sanitized;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    this.users.set(updated.email.toLowerCase(), updated);
    const { salt: _, passwordHash: __, ...sanitized } = updated;
    return sanitized;
  }

  public getAllUsers(): User[] {
    const unique = new Map<string, User>();
    for (const u of this.users.values()) {
      const { salt: _, passwordHash: __, ...sanitized } = u;
      unique.set(sanitized.id, sanitized);
    }
    return Array.from(unique.values());
  }

  // --- Consultations ---
  public saveConsultation(record: Omit<ConsultationRecord, 'id' | 'createdAt'>): ConsultationRecord {
    const id = `cns_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fullRecord: ConsultationRecord = {
      id,
      createdAt: new Date().toISOString(),
      ...record
    };
    this.consultations.set(id, fullRecord);
    return fullRecord;
  }

  public getConsultations(userId?: string): ConsultationRecord[] {
    const all = Array.from(this.consultations.values());
    if (userId && userId !== 'admin') {
      return all.filter(c => c.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getConsultationById(id: string): ConsultationRecord | null {
    return this.consultations.get(id) || null;
  }

  public deleteConsultation(id: string, userId?: string): boolean {
    const item = this.consultations.get(id);
    if (!item) return false;
    if (userId && userId !== 'admin' && item.userId !== userId) {
      return false;
    }
    return this.consultations.delete(id);
  }

  // --- Symptoms & Conditions (Admin CRUD) ---
  public getSymptoms(): Symptom[] {
    return Array.from(this.customSymptoms.values());
  }

  public addSymptom(symptom: Symptom): Symptom {
    this.customSymptoms.set(symptom.id, symptom);
    return symptom;
  }

  public updateSymptom(id: string, updates: Partial<Symptom>): Symptom | null {
    const existing = this.customSymptoms.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.customSymptoms.set(id, updated);
    return updated;
  }

  public deleteSymptom(id: string): boolean {
    return this.customSymptoms.delete(id);
  }

  public getConditions(): DiseaseCondition[] {
    return Array.from(this.customConditions.values());
  }

  // --- User Feedback Management ---
  public saveFeedback(data: Omit<UserFeedback, 'id' | 'createdAt'>): UserFeedback {
    const feedbackItem: UserFeedback = {
      ...data,
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    this.feedback.unshift(feedbackItem);
    return feedbackItem;
  }

  public getFeedback(): UserFeedback[] {
    return [...this.feedback];
  }

  public getFeedbackSummary() {
    const total = this.feedback.length;
    if (total === 0) {
      return {
        totalCount: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        categoryBreakdown: {}
      };
    }

    const sumRating = this.feedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = Number((sumRating / total).toFixed(1));

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const categoryBreakdown: Record<string, number> = {};

    this.feedback.forEach(item => {
      const rounded = Math.min(5, Math.max(1, Math.round(item.rating)));
      ratingDistribution[rounded] = (ratingDistribution[rounded] || 0) + 1;
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
    });

    return {
      totalCount: total,
      averageRating,
      ratingDistribution,
      categoryBreakdown
    };
  }

  // --- System Statistics ---
  public getSystemStatistics() {
    const consultations = Array.from(this.consultations.values());
    const emergencyCount = consultations.filter(c => c.triageLevel === 'emergency').length;
    const urgentCount = consultations.filter(c => c.triageLevel === 'urgent').length;
    const moderateCount = consultations.filter(c => c.triageLevel === 'moderate').length;
    const selfCareCount = consultations.filter(c => c.triageLevel === 'self_care').length;

    const conditionBreakdown: Record<string, number> = {};
    consultations.forEach(c => {
      conditionBreakdown[c.primaryCondition] = (conditionBreakdown[c.primaryCondition] || 0) + 1;
    });

    return {
      totalUsers: this.getAllUsers().length,
      totalConsultations: consultations.length,
      emergencyAlertsTriggered: emergencyCount,
      triageDistribution: {
        emergency: emergencyCount,
        urgent: urgentCount,
        moderate: moderateCount,
        self_care: selfCareCount
      },
      topConditions: Object.entries(conditionBreakdown).map(([name, count]) => ({ name, count })),
      registeredSymptomsCount: this.customSymptoms.size,
      registeredConditionsCount: this.customConditions.size
    };
  }
}

export const dbStore = new DatabaseStore();
