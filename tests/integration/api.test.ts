/**
 * Full End-to-End Integration Flow Test:
 * User -> Input Symptoms -> NLP Extraction -> ML Prediction -> Consultation Record -> Database
 */

import { MLEngineService } from '../../backend/src/services/mlEngine';
import { dbStore } from '../../backend/src/db/store';

describe('Integration Flow: Patient Symptom Check to Record Persistence', () => {
  const engine = new MLEngineService();

  test('executes end-to-end clinical workflow', async () => {
    // 1. User reports symptoms via text
    const userSpeech = "I have had loose motions, vomiting, and stomach cramps for 1 day.";
    
    // 2. NLP Pipeline extracts symptoms
    const nlpOutput = await engine.extractSymptomsNLP(userSpeech);
    expect(nlpOutput.symptoms.length).toBeGreaterThan(0);
    const extractedIds = nlpOutput.symptoms.map(s => s.id);

    // 3. Backend ML service predicts condition
    const prediction = engine.predictConditions(extractedIds, { age: 34, sex: 'female' });
    expect(prediction.primaryConditions.length).toBeGreaterThan(0);
    expect(prediction.triageLevel).not.toBe('emergency');

    // 4. Record is saved into database
    const saved = dbStore.saveConsultation({
      userId: 'test_user_integration',
      patientAge: 34,
      patientSex: 'female',
      symptoms: extractedIds,
      triageLevel: prediction.triageLevel,
      primaryCondition: prediction.primaryConditions[0].name,
      primaryProbability: prediction.primaryConditions[0].probability,
      possibleConditions: prediction.primaryConditions.map(c => ({ name: c.name, probability: c.probability })),
      emergencyDetected: false,
      notes: 'Gastroenteritis presentation with ORS recommendation'
    });

    expect(saved.id).toBeDefined();

    // 5. Query consultation history
    const history = dbStore.getConsultations('test_user_integration');
    expect(history.length).toBe(1);
    expect(history[0].primaryCondition).toBe(saved.primaryCondition);
  });
});
