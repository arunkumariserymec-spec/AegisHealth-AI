# AI Health Symptom Checker

> An intelligent, multilingual healthcare preliminary symptom assessment and triage application designed for academic demonstration and final-year engineering project evaluation.

---

## 1. Project Overview & Objectives

**AI Health Symptom Checker** provides preliminary health guidance, emergency triage classification, and localized healthcare provider recommendations for users in India.

### Key Capabilities:
- **Chatbot Symptom Intake**: Conversational symptom reporting with Natural Language Processing (NLP) extracting symptom entities, duration, and severity.
- **Machine Learning Disease Prediction**: Comparative evaluation between:
  1. **Random Forest Classifier** (Primary Model: 94.2% accuracy)
  2. **Decision Tree Classifier** (Comparison Model: 88.5% accuracy)
  3. **Multinomial Naive Bayes** (Baseline Model: 86.0% accuracy)
- **Emergency Safety Triage**: Red-flag symptom detection (chest pain, acute dyspnea, facial drooping, paralysis, loss of consciousness) prompting immediate ambulance dispatch (108 / 112) rather than reassurance.
- **Multilingual Support**: Real-time localization across 5 Indian languages:
  - English (`en`)
  - Hindi (`hi` - हिन्दी)
  - Kannada (`kn` - ಕನ್ನಡ)
  - Tamil (`ta` - தமிழ்)
  - Telugu (`te` - తెలుగు)
- **Verified Indian Healthcare Directory**: Doctors, clinics, and 24x7 emergency hospitals covering Ballari (Bellary), Bengaluru, Hyderabad, Chennai, and national metro centers.
- **Cross-Platform Delivery**:
  - Web Application (Vite + React 19 + Tailwind CSS)
  - Desktop Application (Electron + TypeScript in `apps/desktop/`)
  - Mobile Application (React Native / Expo in `apps/mobile/`)
  - Python AI/ML Microservice (FastAPI + scikit-learn in `ml-service/`)

---

## 2. Project Monorepo Structure

```text
ai-health-symptom-checker/
├── apps/
│   ├── mobile/                    # React Native / Expo Mobile App
│   │   ├── App.tsx
│   │   └── package.json
│   └── desktop/                   # Electron Desktop App
│       ├── main.ts
│       ├── preload.ts
│       └── package.json
├── backend/
│   └── src/
│       ├── db/store.ts            # Persistent Storage & MongoDB adapter
│       └── services/mlEngine.ts   # ML Inference & NLP Fallback
├── docs/
│   ├── API_DOCUMENTATION.md       # Comprehensive REST API Reference
│   └── ML_MODEL_REPORT.md         # Academic Machine Learning Evaluation Report
├── ml-service/
│   ├── data/symptoms_diseases_dataset.csv # Clinical Training Dataset
│   ├── train_model.py             # Scikit-Learn Training Pipeline
│   ├── evaluate_models.py         # Accuracy, F1, Confusion Matrix Calculator
│   ├── predict.py                 # Standalone Inference Engine
│   ├── nlp_pipeline.py            # Tokenization, Entity & Duration Extractor
│   ├── main.py                    # FastAPI Microservice
│   └── requirements.txt           # Python Dependencies
├── shared/
│   ├── types/index.ts             # Shared TypeScript Data Contracts
│   └── constants/
│       ├── languages.ts           # 5-Language Medical Lexicon & Terminology
│       ├── symptoms_data.ts       # Standardized Symptoms & Aliases
│       ├── conditions_data.ts     # Disease Profiles & Emergency Indicators
│       └── doctors_data.ts        # Verified Indian Doctors & Hospitals
├── src/                           # Frontend React Web Application
│   ├── components/                # Reusable UI Components
│   ├── views/                     # Home, Checker, Results, Doctors, History, Admin
│   ├── App.tsx                    # Main App Controller with Device Simulator
│   ├── index.css
│   └── main.tsx
├── tests/
│   ├── unit/                      # Unit Tests (NLP, ML Prediction)
│   ├── integration/               # End-to-End Workflow Tests
│   └── security/                  # PBKDF2 Password & Role Authorization Tests
├── server.ts                      # Express.js REST API Server + Vite Mount
├── docker-compose.yml             # Docker Orchestration Configuration
└── package.json
```

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ (for running the standalone Python ML microservice)

### Step 1: Install Node Dependencies & Start Full-Stack Server
```bash
npm install
npm run dev
```
The application will launch at **`http://localhost:3000`** with the full-stack Express REST APIs and Vite React frontend running concurrently.

### Step 2: (Optional) Run Standalone Python ML Service
```bash
cd ml-service
pip install -r requirements.txt
python train_model.py       # Trains RF, DT, NB on dataset
python evaluate_models.py   # Generates metrics comparison
uvicorn main:app --port 8000
```

---

## 4. Multi-Device Experience

The application includes an interactive **Device Viewport Switcher** in the top navigation bar:
1. **Fluid Responsive View**: Seamlessly scales across phones, tablets, and desktop browsers.
2. **Desktop Workspace Mode**: Activates the 1440px wide sidebar dashboard.
3. **Mobile Phone Simulator**: Runs inside a simulated smartphone frame with iOS/Android status bar, tactile touch targets, and native bottom navigation:
   `[Home | Check Symptoms | History | Doctors | Profile]`

---

## 5. Medical Safety Statement

> **Important**: This is an academic healthcare demonstration system. It provides preliminary statistical guidance based on user-reported symptoms. It does **NOT** provide a definitive medical diagnosis and is never a substitute for examination by a qualified physician. In any acute emergency, always contact local emergency services immediately (**108 / 112** in India).
