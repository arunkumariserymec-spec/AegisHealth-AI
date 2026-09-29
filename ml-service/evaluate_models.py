"""
Model Evaluation and Comparison Script
Generates comparison table, confusion matrices, and metrics report
"""

import os
import json
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
META_PATH = os.path.join(MODELS_DIR, "model_metadata.json")

def generate_evaluation_report():
    if not os.path.exists(META_PATH):
        print("Model metadata not found. Please run train_model.py first.")
        # Return fallback simulated structure for reporting
        return {
            "status": "not_trained",
            "message": "Run python train_model.py to generate live metrics from dataset."
        }

    with open(META_PATH, "r") as f:
        meta = json.load(f)

    metrics = meta.get("metrics", {})
    classes = meta.get("classes", [])

    print("\n" + "=" * 75)
    print("AI HEALTH SYMPTOM CHECKER: MODEL COMPARISON REPORT")
    print("=" * 75)
    print(f"{'Model':<20} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'CV Mean':<10}")
    print("-" * 75)

    for model_name, stats in metrics.items():
        disp_name = model_name.replace("_", " ").title()
        print(f"{disp_name:<20} | {stats['accuracy']*100:>8.2f}% | {stats['precision']:>10.4f} | {stats['recall']:>10.4f} | {stats['f1_score']:>10.4f} | {stats['cv_mean_score']*100:>8.2f}%")
    print("-" * 75)
    print(f"Primary Recommended Model: {meta.get('best_model', 'random_forest').replace('_', ' ').title()}")
    print("=" * 75 + "\n")

    return meta

if __name__ == "__main__":
    generate_evaluation_report()
