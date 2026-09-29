/**
 * Unit Tests for Machine Learning Disease Prediction & Triage
 */

import { MLEngineService } from '../../backend/src/services/mlEngine';

describe('ML Disease Prediction & Model Comparisons', () => {
  const engine = new MLEngineService();

  test('predicts Dengue when typical symptoms are presented', () => {
    const symptoms = ['fever', 'headache', 'retro_orbital_pain', 'joint_pain', 'body_ache'];
    const result = engine.predictConditions(symptoms, { age: 24, sex: 'male' });

    expect(result.primaryConditions.length).toBeGreaterThan(0);
    const topCondition = result.primaryConditions[0];
    expect(topCondition.conditionId).toBe('dengue_fever');
    expect(topCondition.probability).toBeGreaterThan(0.65);
    expect(result.triageLevel).toBe('urgent');
  });

  test('triggers immediate emergency triage for chest pain & breathlessness', () => {
    const symptoms = ['chest_pain', 'shortness_of_breath', 'palpitations'];
    const result = engine.predictConditions(symptoms, { age: 55, sex: 'male' });

    expect(result.triageLevel).toBe('emergency');
    expect(result.emergencyWarnings.length).toBeGreaterThan(0);
    expect(result.emergencyWarnings[0]).toContain('CRITICAL EMERGENCY');
  });

  test('evaluates Random Forest, Decision Tree, and Naive Bayes in comparison', () => {
    const symptoms = ['cough', 'fever', 'sore_throat', 'runny_nose'];
    const result = engine.predictConditions(symptoms, { age: 30, sex: 'female' });

    expect(result.modelComparisons.length).toBe(3);
    const modelNames = result.modelComparisons.map(m => m.modelName);
    expect(modelNames).toContain('random_forest');
    expect(modelNames).toContain('decision_tree');
    expect(modelNames).toContain('naive_bayes');
  });
});
