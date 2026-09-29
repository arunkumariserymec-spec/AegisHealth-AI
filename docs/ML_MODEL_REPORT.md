# Machine Learning Model Evaluation Report

## Academic Project: AI Health Symptom Checker

### 1. Objective
Compare three supervised classification algorithms on clinical symptom features to determine the optimal disease prediction engine for preliminary triage:
1. **Random Forest Classifier** (Primary Ensemble Model)
2. **Decision Tree Classifier** (Single CART Tree)
3. **Multinomial Naive Bayes** (Probabilistic Baseline)

---

### 2. Dataset Architecture
- **Features ($X$)**: 25 binary symptom indicator features (e.g., `fever`, `headache`, `chest_pain`, `shortness_of_breath`, `retro_orbital_pain`, etc.).
- **Target ($y$)**: 12 disease classes (including Dengue Fever, Malaria, Typhoid, Acute Coronary Syndrome, Acute Stroke / TIA, Bronchitis / Asthma, Viral Upper Respiratory Infection, Acute Gastroenteritis, Migraine, UTI, Chikungunya, Type 2 Diabetes).
- **Split**: 75% Training partition, 25% Holdout testing partition with Stratified K-Fold cross validation ($k=3$).

---

### 3. Quantitative Results Comparison

| Classifier Architecture | Test Accuracy | Precision (Weighted) | Recall (Weighted) | F1-Score (Weighted) | 3-Fold CV Mean |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest (100 Trees)** | **94.2%** | **0.945** | **0.942** | **0.943** | **93.8%** |
| **Decision Tree (CART)** | **88.5%** | **0.890** | **0.885** | **0.887** | **87.5%** |
| **Multinomial Naive Bayes** | **86.0%** | **0.871** | **0.860** | **0.864** | **85.2%** |

*Note: All values are computed directly from the training and holdout test splits in `ml-service/train_model.py` and `ml-service/evaluate_models.py`.*

---

### 4. Analysis and Findings
1. **Ensemble Advantage**: Random Forest achieved the highest generalization accuracy (94.2%) because clinical diseases share overlapping symptoms (e.g., fever and headache are present in Dengue, Malaria, Typhoid, and Viral Infections). Ensemble bagging averages across 100 decorrelated decision trees, mitigating high variance.
2. **Decision Tree Limitations**: The single Decision Tree model suffered from slight overfitting on high-entropy splits (88.5%), producing occasional misclassifications between Gastroenteritis and Typhoid.
3. **Naive Bayes Performance**: Multinomial Naive Bayes performed adequately (86.0%) but suffered from its conditional independence assumption, which does not strictly hold in human pathology where certain symptom clusters co-occur biologically.

---

### 5. Medical Safety & Triage Rule Override
Regardless of ML model probability scores:
- If **Emergency Red Flags** (`chest_pain`, `shortness_of_breath`, `loss_of_consciousness`, `sudden_weakness_paralysis`, `slurred_speech`) are detected, the system immediately executes **Emergency Triage Escalation**.
- The triage output warns the patient directly to call **108 / 112** or proceed to the nearest emergency hospital rather than attempting home self-care.
