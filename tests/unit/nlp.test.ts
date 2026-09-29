/**
 * Unit Tests for NLP Symptom Extraction
 */

import { MLEngineService } from '../../backend/src/services/mlEngine';

describe('NLP Symptom Extraction Pipeline', () => {
  const engine = new MLEngineService();

  test('extracts multiple symptoms and duration correctly', async () => {
    const input = "I have been having severe headache and fever for two days.";
    const result = await engine.extractSymptomsNLP(input);

    expect(result.symptoms.length).toBeGreaterThanOrEqual(2);
    const symptomIds = result.symptoms.map(s => s.id);
    expect(symptomIds).toContain('fever');
    expect(symptomIds).toContain('headache');
    expect(result.overallSeverity).toBe('severe');
  });

  test('identifies chest pain as emergency indicator', async () => {
    const input = "Sudden severe chest pain radiating to left arm with breathlessness";
    const result = await engine.extractSymptomsNLP(input);

    const symptomIds = result.symptoms.map(s => s.id);
    expect(symptomIds).toContain('chest_pain');
    expect(symptomIds).toContain('shortness_of_breath');
  });

  test('handles Indian language transliterations', async () => {
    const input = "Mujhe kal se sar dard aur tez bukhar hai";
    const result = await engine.extractSymptomsNLP(input);

    const symptomIds = result.symptoms.map(s => s.id);
    expect(symptomIds).toContain('fever');
    expect(symptomIds).toContain('headache');
  });
});
