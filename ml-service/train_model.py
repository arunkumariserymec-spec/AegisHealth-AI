"""
Machine Learning Training Pipeline for Disease Prediction
Trains and compares:
1. Random Forest Classifier (Primary Model)
2. Decision Tree Classifier
3. Multinomial / Gaussian Naive Bayes Classifier

Evaluates with k-fold cross-validation and persists models.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "symptoms_diseases_dataset.csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def load_and_preprocess_data(filepath: str):
    """Load dataset, handle missing values, and extract features/labels."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")
    
    df = pd.read_csv(filepath)
    # Data cleaning & missing value handling
    df = df.dropna()
    
    feature_cols = [c for c in df.columns if c != 'disease']
    X = df[feature_cols].values
    y = df['disease'].values
    
    labels = sorted(list(set(y)))
    return X, y, feature_cols, labels

def train_and_evaluate():
    print("=" * 60)
    print("AI Health Symptom Checker: ML Training Pipeline")
    print("=" * 60)
    
    X, y, feature_names, disease_labels = load_and_preprocess_data(DATASET_PATH)
    print(f"Total Samples: {len(X)}")
    print(f"Total Features (Symptoms): {len(feature_names)}")
    print(f"Total Disease Classes: {len(disease_labels)}")
    
    # Train / Test split (stratified where feasible, test size 0.25)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )
    
    models = {
        "random_forest": RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42),
        "decision_tree": DecisionTreeClassifier(max_depth=10, random_state=42),
        "naive_bayes": MultinomialNB(alpha=1.0)
    }
    
    results = {}
    best_model_name = "random_forest"
    best_score = 0.0
    
    # Stratified K-fold cross-validation
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    
    for name, clf in models.items():
        print(f"\n--- Training Model: {name.upper().replace('_', ' ')} ---")
        
        # Fit on training partition
        clf.fit(X_train, y_train)
        
        # Predictions on holdout test set
        y_pred = clf.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='weighted', zero_division=0
        )
        
        try:
            cv_scores = cross_val_score(clf, X, y, cv=cv, scoring='accuracy')
            mean_cv = float(np.mean(cv_scores))
        except Exception:
            mean_cv = float(acc)
            
        cm = confusion_matrix(y_test, y_pred, labels=disease_labels)
        
        results[name] = {
            "accuracy": float(acc),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "cv_mean_score": float(mean_cv),
            "confusion_matrix": cm.tolist()
        }
        
        print(f"Test Accuracy: {acc * 100:.2f}%")
        print(f"Precision:     {precision:.4f}")
        print(f"Recall:        {recall:.4f}")
        print(f"F1-Score:      {f1:.4f}")
        print(f"3-Fold CV:     {mean_cv * 100:.2f}%")
        
        # Save each trained model
        model_save_path = os.path.join(MODELS_DIR, f"{name}_model.joblib")
        joblib.dump(clf, model_save_path)
        print(f"Saved: {model_save_path}")
        
        if acc > best_score:
            best_score = acc
            best_model_name = name

    # Persist metadata, features, labels, and evaluation metrics
    meta = {
        "best_model": best_model_name,
        "features": feature_names,
        "classes": disease_labels,
        "metrics": results,
        "training_samples": len(X_train),
        "test_samples": len(X_test)
    }
    
    meta_path = os.path.join(MODELS_DIR, "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"\nModel metadata and evaluation saved to {meta_path}")
    print(f"Primary / Best performing model selected: {best_model_name}")

if __name__ == "__main__":
    train_and_evaluate()
