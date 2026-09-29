/**
 * Express Server for AegisHealth AI (Smart Care. Better Lives.)
 * Handles REST APIs, Authentication, ML Prediction, and Vite middleware
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbStore } from './backend/src/db/store';
import { mlEngine } from './backend/src/services/mlEngine';
import { MASTER_DOCTORS, MASTER_HOSPITALS, EMERGENCY_HELPLINES_INDIA } from './shared/constants/doctors_data';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from './shared/constants/languages';
import { MASTER_SYMPTOMS } from './shared/constants/symptoms_data';
import { MASTER_CONDITIONS } from './shared/constants/conditions_data';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Request logging & security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple JWT-like bearer token auth middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Check if guest user
    (req as any).user = { id: 'guest', role: 'guest', name: 'Guest User' };
    return next();
  }

  try {
    // Decode base64 payload
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const user = dbStore.getUserById(decoded.id);
    if (!user) {
      (req as any).user = { id: 'guest', role: 'guest' };
    } else {
      (req as any).user = user;
    }
  } catch (e) {
    (req as any).user = { id: 'guest', role: 'guest' };
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privilege required.' });
  }
  next();
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Auth & Profile
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, age, sex, preferredLanguage } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const user = dbStore.registerUser({ name, email, password, age, sex, preferredLanguage });
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = dbStore.authenticate(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');
  res.json({ user, token });
});

app.get('/api/users/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.id === 'guest') {
    return res.json({ id: 'guest', name: 'Guest User', role: 'guest', preferredLanguage: 'en' });
  }
  res.json(user);
});

app.put('/api/users/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.id === 'guest') {
    return res.status(400).json({ error: 'Cannot update guest profile' });
  }
  const updated = dbStore.updateUser(user.id, req.body);
  res.json(updated);
});

// 2. NLP Symptom Extraction
app.post('/api/symptoms/analyze', async (req: Request, res: Response) => {
  try {
    const { text, language } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text query is required' });
    }
    const result = await mlEngine.extractSymptomsNLP(text);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to analyze symptoms', details: err.message });
  }
});

// 3. Conversational Chatbot Helper
app.post('/api/chat/message', async (req: Request, res: Response) => {
  try {
    const { message, history, language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const nlpResult = await mlEngine.extractSymptomsNLP(message);
    const emergencyDetected = nlpResult.symptoms.some(s => ['chest_pain', 'shortness_of_breath', 'loss_of_consciousness', 'sudden_weakness_paralysis', 'slurred_speech'].includes(s.id));

    let reply = '';
    let readyForAssessment = false;

    if (emergencyDetected) {
      reply = `⚠️ URGENT ALERT: Your description contains emergency indicators (${nlpResult.symptoms.filter(s => ['chest_pain', 'shortness_of_breath', 'loss_of_consciousness', 'sudden_weakness_paralysis'].includes(s.id)).map(s => s.name).join(', ')}). We strongly recommend immediate emergency evaluation. Please call 108 / 112 in India immediately.`;
      readyForAssessment = true;
    } else if (nlpResult.symptoms.length > 0) {
      const symptomList = nlpResult.symptoms.map(s => s.name).join(', ');
      reply = `I have noted the following symptoms: ${symptomList} (Duration: ${nlpResult.duration || 'recent'}). `;
      
      if (nlpResult.followUpQuestions && nlpResult.followUpQuestions.length > 0) {
        reply += `\n\nTo help understand your condition better: ${nlpResult.followUpQuestions[0]}`;
      } else {
        reply += `\n\nWould you like to complete a comprehensive assessment with patient demographics (age, sex)?`;
        readyForAssessment = true;
      }
    } else {
      reply = "Hello! I can help you understand your symptoms and provide preliminary healthcare triage. Could you describe what you are experiencing, such as fever, headache, body ache, or stomach upset?";
    }

    res.json({
      reply,
      extractedSymptoms: nlpResult.symptoms,
      duration: nlpResult.duration,
      emergencyDetected,
      readyForAssessment
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Chat processing error', details: err.message });
  }
});

// 4. ML Disease Prediction Endpoint
app.post('/api/predictions', authenticateToken, (req: Request, res: Response) => {
  try {
    const { symptoms, age = 25, sex = 'male', existingConditions = [], medications = [] } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array is required and must not be empty' });
    }

    const predictionData = mlEngine.predictConditions(symptoms, { age, sex });

    // Format full assessment result
    const assessmentResult = {
      id: `pred_${Date.now()}`,
      timestamp: new Date().toISOString(),
      patientInfo: { age, sex, existingConditions, medications },
      reportedSymptoms: symptoms.map((s: string) => {
        const meta = MASTER_SYMPTOMS.find(item => item.id === s.toLowerCase());
        return {
          id: s,
          name: meta ? meta.name : s.replace('_', ' '),
          severity: 'moderate' as const
        };
      }),
      triageLevel: predictionData.triageLevel,
      emergencyWarnings: predictionData.emergencyWarnings,
      primaryModel: 'random_forest' as const,
      possibleConditions: predictionData.primaryConditions,
      modelComparisons: predictionData.modelComparisons,
      generalPrecautions: predictionData.primaryConditions[0]?.precautions || [
        'Maintain adequate rest and hydration.',
        'Consult a registered physician if symptoms persist.'
      ],
      whenToSeekMedicalCare: predictionData.primaryConditions[0]?.whenToSeekCare || [
        'High fever lasting more than 3 days',
        'Breathing difficulties or severe acute pain'
      ],
      recommendedSpecialists: [predictionData.primaryConditions[0]?.recommendedSpecialist || 'General Physician'],
      disclaimer: 'This application provides preliminary health information and is NOT a substitute for professional medical diagnosis or treatment.'
    };

    res.json(assessmentResult);
  } catch (err: any) {
    res.status(500).json({ error: 'Prediction error', details: err.message });
  }
});

// 5. Consultations
app.get('/api/consultations', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const list = dbStore.getConsultations(user.role === 'admin' ? undefined : user.id);
  res.json(list);
});

app.post('/api/consultations', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const saved = dbStore.saveConsultation({
    userId: user.id || 'guest',
    patientAge: req.body.patientAge || 25,
    patientSex: req.body.patientSex || 'unspecified',
    symptoms: req.body.symptoms || [],
    triageLevel: req.body.triageLevel || 'moderate',
    primaryCondition: req.body.primaryCondition || 'General Health Review',
    primaryProbability: req.body.primaryProbability || 0.75,
    possibleConditions: req.body.possibleConditions || [],
    emergencyDetected: req.body.emergencyDetected || false,
    notes: req.body.notes || ''
  });
  res.status(201).json(saved);
});

app.get('/api/consultations/:id', authenticateToken, (req: Request, res: Response) => {
  const consultation = dbStore.getConsultationById(req.params.id);
  if (!consultation) {
    return res.status(404).json({ error: 'Consultation record not found' });
  }
  res.json(consultation);
});

app.delete('/api/consultations/:id', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = dbStore.deleteConsultation(req.params.id, user.id);
  if (!success) {
    return res.status(404).json({ error: 'Record not found or unauthorized' });
  }
  res.json({ message: 'Consultation deleted successfully' });
});

// 5.5 User Feedback Management
app.post('/api/feedback', authenticateToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { rating, category, comment, tags, consultationId, userName, userEmail } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required.' });
    }

    const savedFeedback = dbStore.saveFeedback({
      userId: user && user.id !== 'guest' ? user.id : undefined,
      userName: userName || (user && user.name !== 'Guest User' ? user.name : 'Anonymous Patient'),
      userEmail: userEmail || (user && user.email ? user.email : undefined),
      consultationId,
      rating: Number(rating),
      category: category || 'ui_experience',
      comment: String(comment).trim(),
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json(savedFeedback);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record feedback', details: err.message });
  }
});

app.get('/api/feedback', (req: Request, res: Response) => {
  const list = dbStore.getFeedback();
  res.json(list);
});

app.get('/api/feedback/summary', (req: Request, res: Response) => {
  const summary = dbStore.getFeedbackSummary();
  res.json(summary);
});

// 6. Doctors & Hospitals Recommendation
app.get('/api/doctors/nearby', (req: Request, res: Response) => {
  const { specialty, city } = req.query;
  let results = [...MASTER_DOCTORS];

  if (specialty && specialty !== 'all') {
    results = results.filter(d => d.specialty.toLowerCase().includes(String(specialty).toLowerCase()));
  }
  if (city && city !== 'all') {
    results = results.filter(d => d.city.toLowerCase().includes(String(city).toLowerCase()));
  }
  res.json(results);
});

app.get('/api/hospitals/nearby', (req: Request, res: Response) => {
  const { city } = req.query;
  let results = [...MASTER_HOSPITALS];
  if (city && city !== 'all') {
    results = results.filter(h => h.city.toLowerCase().includes(String(city).toLowerCase()));
  }
  res.json({ hospitals: results, helplines: EMERGENCY_HELPLINES_INDIA });
});

// 7. Languages & Medical Dictionaries
app.get('/api/languages', (req: Request, res: Response) => {
  res.json({
    languages: LANGUAGE_OPTIONS,
    translations: TRANSLATIONS
  });
});

// 9. Admin Routes
// Allow read-only access to academic statistics and model benchmarks for verification/evaluation
app.get('/api/admin/statistics', (req: Request, res: Response) => {
  const stats = dbStore.getSystemStatistics();
  res.json(stats);
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const users = dbStore.getAllUsers();
  res.json(users);
});

app.get('/api/admin/models', (req: Request, res: Response) => {
  const metrics = mlEngine.getModelMetrics();
  res.json(metrics);
});

app.get('/api/admin/symptoms', authenticateToken, (req: Request, res: Response) => {
  res.json(dbStore.getSymptoms());
});

app.post('/api/admin/symptoms', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const symptom = dbStore.addSymptom(req.body);
  res.status(201).json(symptom);
});

app.put('/api/admin/symptoms/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = dbStore.updateSymptom(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Symptom not found' });
  res.json(updated);
});

app.delete('/api/admin/symptoms/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = dbStore.deleteSymptom(req.params.id);
  if (!success) return res.status(404).json({ error: 'Symptom not found' });
  res.json({ message: 'Symptom deleted successfully' });
});

// JSON fallback for any unhandled /api/* route to prevent returning HTML from Vite SPA
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS SETUP
// -------------------------------------------------------------

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AegisHealth AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
