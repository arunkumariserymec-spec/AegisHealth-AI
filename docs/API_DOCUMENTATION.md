# REST API Documentation: AI Health Symptom Checker

This document specifies the REST API endpoints provided by the Node.js/Express backend server and the Python FastAPI ML microservice.

---

## Base URLs
- **Full-Stack Application / Node.js Backend**: `http://localhost:3000/api`
- **Python ML & NLP Microservice**: `http://localhost:8000`

---

## 1. Authentication & User Profile

### `POST /api/auth/register`
Creates a new patient account with encrypted password (PBKDF2).
- **Request Body**:
```json
{
  "name": "Priya Sundaram",
  "email": "priya@example.com",
  "password": "patientPassword123",
  "age": 29,
  "sex": "female",
  "preferredLanguage": "en"
}
```
- **Response** (`201 Created`):
```json
{
  "user": {
    "id": "usr_1742080000_abc",
    "name": "Priya Sundaram",
    "email": "priya@example.com",
    "role": "user",
    "age": 29,
    "sex": "female",
    "preferredLanguage": "en",
    "createdAt": "2026-09-26T03:00:00.000Z"
  },
  "token": "eyJpZCI6InVzcl8xNzQyMD..."
}
```

### `POST /api/auth/login`
Authenticates a user or admin.
- **Request Body**:
```json
{
  "email": "priya@example.com",
  "password": "patientPassword123"
}
```
- **Response** (`200 OK`): Returns user object and base64 session token.

### `GET /api/users/profile`
Fetches active user profile (Bearer token required).

---

## 2. Symptom Analysis & NLP

### `POST /api/symptoms/analyze`
Extracts symptoms, duration, and severity from free text using Gemini AI / NLP pipeline.
- **Request Body**:
```json
{
  "text": "I have had severe fever and headache for 2 days",
  "language": "en"
}
```
- **Response** (`200 OK`):
```json
{
  "symptoms": [
    { "id": "fever", "name": "Fever", "severity": "severe" },
    { "id": "headache", "name": "Headache", "severity": "severe" }
  ],
  "duration": "2 days",
  "overallSeverity": "severe",
  "followUpQuestions": ["Are you experiencing chills, nausea, or joint aches?"]
}
```

---

## 3. Disease Prediction & Triage

### `POST /api/predictions`
Runs machine learning classification across Random Forest, Decision Tree, and Naive Bayes models.
- **Request Body**:
```json
{
  "symptoms": ["fever", "headache", "retro_orbital_pain", "body_ache"],
  "age": 26,
  "sex": "male",
  "existingConditions": [],
  "medications": []
}
```
- **Response** (`200 OK`):
```json
{
  "id": "pred_1742080123",
  "timestamp": "2026-09-26T03:00:00.000Z",
  "triageLevel": "urgent",
  "emergencyWarnings": [],
  "primaryModel": "random_forest",
  "possibleConditions": [
    {
      "conditionId": "dengue_fever",
      "name": "Dengue Viral Fever",
      "probability": 0.88,
      "matchingSymptoms": ["Fever", "Headache", "Pain Behind Eyes", "Body Pain"],
      "precautions": ["Maintain strict hydration with ORS", "Avoid NSAIDs/Aspirin"],
      "whenToSeekCare": ["Gum/nose bleeding", "Persistent vomiting"],
      "recommendedSpecialist": "General Physician / Internal Medicine"
    }
  ],
  "modelComparisons": [
    { "modelName": "random_forest", "modelAccuracy": 0.942 },
    { "modelName": "decision_tree", "modelAccuracy": 0.885 },
    { "modelName": "naive_bayes", "modelAccuracy": 0.860 }
  ],
  "disclaimer": "This result is for preliminary guidance only and is not a medical diagnosis."
}
```

---

## 4. Consultations & History

### `GET /api/consultations`
Returns list of consultations for the authenticated user.

### `POST /api/consultations`
Saves an assessment record to persistent storage.

### `DELETE /api/consultations/:id`
Deletes a consultation record.

---

## 5. Healthcare Directory

### `GET /api/doctors/nearby?specialty=Cardiologist&city=Ballari`
Returns verified doctors filtered by specialty and geographic city.

### `GET /api/hospitals/nearby?city=Bengaluru`
Returns emergency hospitals with 24x7 emergency department, ICU, and ambulance helpline data.

---

## 6. Admin Endpoints

- `GET /api/admin/statistics`: Consultation volume, triage breakdown, emergency escalations.
- `GET /api/admin/models`: Accuracy, Precision, Recall, F1, 3-fold cross validation, and confusion matrices.
- `GET /api/admin/symptoms`: Full symptom lexicon.
- `POST /api/admin/symptoms`: Add new symptom definition.
