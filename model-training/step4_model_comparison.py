import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

# Import XGBoost with fallback option if ever needed
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    from sklearn.ensemble import GradientBoostingClassifier
    HAS_XGBOOST = False

# Paths configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Water_Quality_Dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
PROD_ML_DIR = os.path.join(os.path.dirname(BASE_DIR), "backend", "ml-predict")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PROD_ML_DIR, exist_ok=True)

print("=" * 80)
print(" AquaSense AI: Leakage-Free Model Comparison & Anomaly Pipeline")
print("=" * 80)

# 1. Load Data
print("\n[1/6] Loading benchmark dataset...")
df = pd.read_csv(DATA_PATH)
print(f"Loaded {df.shape[0]} records from {DATA_PATH}")

FEATURE_COLS = [
    'pH',
    'Turbidity (NTU)',
    'Temperature (°C)',
    'DO (mg/L)',
    'BOD (mg/L)',
    'Lead (mg/L)',
    'Mercury (mg/L)',
    'Arsenic (mg/L)'
]
TARGET_COL = 'Pollution_Level'

X = df[FEATURE_COLS]
y = df[TARGET_COL]

# 2. Leakage-Free Preprocessing Pipeline
# a) Stratified 70/20/10 train/test/validation split. The test fold is reserved
# until after validation-based model selection.
print("\n[2/6] Performing Stratified 70/20/10 Train/Test/Validation Split (random_state=42)...")
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)
X_train, X_validation, y_train, y_validation = train_test_split(
    X_trainval, y_trainval, test_size=0.125, random_state=42, stratify=y_trainval
)
print(f"Train samples: {len(y_train)} | Validation samples: {len(y_validation)} | Test samples: {len(y_test)}")

# b) StandardScaler fit strictly on training fold BEFORE SMOTE
print("\n[3/6] Fitting StandardScaler strictly on X_train (normalizing units before SMOTE)...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_validation_scaled = scaler.transform(X_validation)
X_test_scaled = scaler.transform(X_test)
print("StandardScaler transform complete.")

# c) SMOTE strictly on normalized training fold
print("\n[4/6] Applying SMOTE(k_neighbors=3, random_state=42) strictly to scaled training set...")
# The smallest training class has four records after this split, so k=3 is valid.
smote = SMOTE(k_neighbors=3, random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
print(f"Resampled training set shape: {X_train_res.shape}")
for cls_label, count in y_train_res.value_counts().sort_index().items():
    print(f"  Class {cls_label}: {count} samples")

# d) Train Multivariate Anomaly Detection Model (Isolation Forest)
print("\n[5/6] Training Multivariate Anomaly Detector (Isolation Forest, contamination=0.05)...")
anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
anomaly_detector.fit(X_train_scaled)
anomalies_in_test = (anomaly_detector.predict(X_test_scaled) == -1).sum()
print(f"Anomaly detector trained. Detected {anomalies_in_test} anomalous samples in held-out test set.")

# 3. Model Definitions
print("\n[6/6] Training three models and comparing them on the validation fold...")

models = {}

# Baseline Model
models["Baseline: Logistic Regression"] = LogisticRegression(
    max_iter=1000,
    random_state=42
)

# ML Model 1
models["ML Model 1: Random Forest"] = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# ML Model 2 (Champion candidate)
if HAS_XGBOOST:
    models["ML Model 2: XGBoost"] = XGBClassifier(
        random_state=42,
        eval_metric='mlogloss'
    )
else:
    models["ML Model 2: Gradient Boosting (Fallback)"] = GradientBoostingClassifier(
        random_state=42
    )

# Evaluation container
results = []
trained_models = {}

for name, model in models.items():
    print(f"-> Training {name}...")
    model.fit(X_train_res, y_train_res)
    trained_models[name] = model

    # Use validation data for model selection; do not use test labels here.
    y_pred = model.predict(X_validation_scaled)

    acc = accuracy_score(y_validation, y_pred)
    macro_f1 = f1_score(y_validation, y_pred, average='macro', zero_division=0)
    weighted_f1 = f1_score(y_validation, y_pred, average='weighted', zero_division=0)

    results.append({
        "Model": name,
        "Accuracy (%)": acc * 100,
        "Macro F1": macro_f1,
        "Weighted F1": weighted_f1,
        "Raw_Acc": acc,
        "Class_Report": classification_report(y_validation, y_pred, labels=[0, 1, 2], output_dict=True, zero_division=0),
        "Confusion_Matrix": confusion_matrix(y_validation, y_pred, labels=[0, 1, 2]).tolist()
    })

# Format comparison table
df_results = pd.DataFrame(results)

print("\n" + "=" * 80)
print("                   SENG491 MODEL PERFORMANCE COMPARISON TABLE")
print("=" * 80)
header = f"{'Model':<35} | {'Accuracy (%)':<14} | {'Macro F1':<12} | {'Weighted F1':<12}"
print(header)
print("-" * len(header))
for res in results:
    print(f"{res['Model']:<35} | {res['Accuracy (%)']:>13.2f}% | {res['Macro F1']:>12.4f} | {res['Weighted F1']:>12.4f}")
print("=" * 80)

# Determine champion model by Weighted F1-Score
best_idx = df_results['Weighted F1'].idxmax()
best_model_name = df_results.loc[best_idx, 'Model']
best_weighted_f1 = df_results.loc[best_idx, 'Weighted F1']
best_model = trained_models[best_model_name]

print(f"\nValidation-selected model: [{best_model_name}] with Weighted F1-Score = {best_weighted_f1:.4f}")

# Verify predict_proba capability for production compatibility
assert hasattr(best_model, "predict_proba"), f"{best_model_name} does not implement predict_proba!"

# Evaluate the selected model exactly once on the untouched test fold.
y_test_pred = best_model.predict(X_test_scaled)
test_report = classification_report(
    y_test, y_test_pred, labels=[0, 1, 2], output_dict=True, zero_division=0
)
test_matrix = confusion_matrix(y_test, y_test_pred, labels=[0, 1, 2])
print("\nFinal selected-model test metrics:")
print(classification_report(y_test, y_test_pred, labels=[0, 1, 2], zero_division=0))
metrics_path = os.path.join(MODELS_DIR, "evaluation_metrics.json")
with open(metrics_path, "w", encoding="utf-8") as metrics_file:
    json.dump({
        "dataset_records": int(len(df)),
        "train_samples": int(len(y_train)),
        "validation_samples": int(len(y_validation)),
        "test_samples": int(len(y_test)),
        "train_resampled_samples": int(len(y_train_res)),
        "class_counts_train_resampled": {str(k): int(v) for k, v in y_train_res.value_counts().sort_index().items()},
        "train_class_support": {str(k): int(v) for k, v in y_train.value_counts().sort_index().items()},
        "validation_class_support": {str(k): int(v) for k, v in y_validation.value_counts().sort_index().items()},
        "test_class_support": {str(k): int(v) for k, v in y_test.value_counts().sort_index().items()},
        "validation_models": [{
            "name": row["Model"],
            "accuracy": float(row["Raw_Acc"]),
            "macro_f1": float(row["Macro F1"]),
            "weighted_f1": float(row["Weighted F1"]),
            "classification_report": row["Class_Report"],
            "confusion_matrix_labels_0_1_2": row["Confusion_Matrix"]
        } for row in results],
        "champion": best_model_name,
        "test_classification_report": test_report,
        "test_confusion_matrix_labels_0_1_2": test_matrix.tolist(),
        "anomaly_detector": {"algorithm": "IsolationForest", "contamination": 0.05,
                             "test_anomalies_flagged": int(anomalies_in_test)}
    }, metrics_file, indent=2)

FIGURES_DIR = os.path.join(os.path.dirname(BASE_DIR), "figures")
os.makedirs(FIGURES_DIR, exist_ok=True)
model_labels = [row["Model"].replace("Baseline: ", "").replace("ML Model 1: ", "").replace("ML Model 2: ", "") for row in results]
positions = np.arange(len(results))
bar_width = 0.36
fig, ax = plt.subplots(figsize=(9.2, 5.2), layout="constrained")
accuracy_values = [row["Raw_Acc"] * 100 for row in results]
weighted_values = [row["Weighted F1"] * 100 for row in results]
bars1 = ax.bar(positions - bar_width / 2, accuracy_values, bar_width, label="Accuracy", color="#168aad")
bars2 = ax.bar(positions + bar_width / 2, weighted_values, bar_width, label="Weighted F1 × 100", color="#52b69a")
ax.set_ylabel("Score (%)")
ax.set_ylim(0, 105)
ax.set_xticks(positions, model_labels)
ax.set_title("Validation Model Comparison (n = 100)")
ax.legend(frameon=False)
ax.grid(axis="y", alpha=0.2)
for bars in (bars1, bars2):
    ax.bar_label(bars, fmt="%.2f", padding=2, fontsize=8)
fig.savefig(os.path.join(FIGURES_DIR, "Figure_4_1_Model_Comparison.png"), dpi=220)
plt.close(fig)

fig, ax = plt.subplots(figsize=(6.4, 5.4), layout="constrained")
sns.heatmap(test_matrix, annot=True, fmt="d", cmap="Blues", cbar=False,
            xticklabels=["Clean (0)", "Moderate (1)", "Severe (2)"],
            yticklabels=["Clean (0)", "Moderate (1)", "Severe (2)"], ax=ax)
ax.set_xlabel("Predicted class")
ax.set_ylabel("Actual class")
ax.set_title(f"{best_model_name} Final Test Confusion Matrix (n = {len(y_test)})")
fig.savefig(os.path.join(FIGURES_DIR, "Figure_4_2_Confusion_Matrix.png"), dpi=220)
plt.close(fig)

if hasattr(best_model, "feature_importances_"):
    importances = best_model.feature_importances_
    sorted_indices = np.argsort(importances)
    fig, ax = plt.subplots(figsize=(8.2, 5.2), layout="constrained")
    ax.barh(np.array(FEATURE_COLS)[sorted_indices], importances[sorted_indices] * 100, color="#168aad")
    ax.set_xlabel("Relative feature importance (%)")
    ax.set_title("XGBoost Feature Importance")
    ax.grid(axis="x", alpha=0.2)
    fig.savefig(os.path.join(FIGURES_DIR, "Figure_4_3_Feature_Importance.png"), dpi=220)
    plt.close(fig)
    with open(os.path.join(MODELS_DIR, "feature_importance.json"), "w", encoding="utf-8") as importance_file:
        json.dump({FEATURE_COLS[i]: float(importances[i]) for i in range(len(FEATURE_COLS))}, importance_file, indent=2)

# Reproducible methodology diagram: fit the scaler on raw training data, then SMOTE.
fig, ax = plt.subplots(figsize=(12, 5.6), layout="constrained")
ax.set_xlim(0, 12); ax.set_ylim(0, 6); ax.axis("off")
def flow_box(x, y, w, h, title, detail, color):
    ax.text(x + w/2, y + h/2, f"{title}\n{detail}", ha="center", va="center", fontsize=10,
            bbox={"boxstyle":"round,pad=0.7", "facecolor":color, "edgecolor":"#334155", "linewidth":1.4})
def flow_arrow(x1, y1, x2, y2):
    ax.annotate("", xy=(x2,y2), xytext=(x1,y1), arrowprops={"arrowstyle":"->", "lw":1.8, "color":"#0f6b9a"})
flow_box(0.2, 3.7, 2.0, 1.2, "Project dataset", "1,000 rows", "#f1f5f9")
flow_box(3.1, 3.7, 2.4, 1.2, "Stratified split", "Train 700 | Val 100 | Test 200", "#e0f2fe")
flow_arrow(2.25,4.3,3.0,4.3)
flow_box(6.1, 4.3, 2.5, 1.15, "Training fold only", "Fit StandardScaler on X_train", "#dcfce7")
flow_box(9.2, 4.3, 2.5, 1.15, "SMOTE k=3", f"Train fold → {len(y_train_res):,} rows", "#dcfce7")
flow_arrow(5.55,4.3,6.0,4.85); flow_arrow(8.65,4.85,9.1,4.85)
flow_box(6.1, 1.5, 2.5, 1.15, "Validation + test folds", "Transform with fitted scaler", "#fee2e2")
flow_box(9.2, 1.5, 2.5, 1.15, "Evaluation", "Select on val; test once", "#fee2e2")
flow_arrow(5.55,4.0,6.0,2.2); flow_arrow(8.65,2.08,9.1,2.08)
ax.text(6.0, 0.55, "Scaler/SMOTE fit on training only; validation selects the model; test remains untouched for final evaluation.",
        ha="center", va="center", fontsize=10, color="#334155")
fig.savefig(os.path.join(FIGURES_DIR, "Figure_3_3_Preprocessing_Pipeline.png"), dpi=220)
plt.close(fig)
print(f"Saved reproducible metrics to {metrics_path} and model figures to {FIGURES_DIR}.")

# 4. Export Artifacts
print("\nExporting champion model, scaler, and anomaly detector artifacts...")

for target_dir in [MODELS_DIR, PROD_ML_DIR]:
    joblib.dump(best_model, os.path.join(target_dir, "model.pkl"))
    joblib.dump(scaler, os.path.join(target_dir, "scaler.pkl"))
    joblib.dump(anomaly_detector, os.path.join(target_dir, "anomaly_detector.pkl"))
    print(f"Saved artifacts to {target_dir}")

print("\n" + "=" * 80)
print(" Model Comparison & Artifact Generation Completed Successfully!")
print("=" * 80)
