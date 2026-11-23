import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE

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
# a) Stratified 80/20 train/test split
print("\n[2/6] Performing Stratified 80/20 Train/Test Split (random_state=42)...")
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)
print(f"Train samples: {X_train.shape[0]} | Test samples: {X_test.shape[0]}")

# b) StandardScaler fit strictly on training fold BEFORE SMOTE
print("\n[3/6] Fitting StandardScaler strictly on X_train (normalizing units before SMOTE)...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("StandardScaler transform complete.")

# c) SMOTE strictly on normalized training fold
print("\n[4/6] Applying SMOTE(k_neighbors=4, random_state=42) strictly to scaled training set...")
smote = SMOTE(k_neighbors=4, random_state=42)
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
print("\n[6/6] Training and Evaluating 3 Models on the Unseen Test Set...")

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

    # Evaluate on exact unseen test set
    y_pred = model.predict(X_test_scaled)

    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)
    weighted_f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    results.append({
        "Model": name,
        "Accuracy (%)": acc * 100,
        "Macro F1": macro_f1,
        "Weighted F1": weighted_f1,
        "Raw_Acc": acc
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

print(f"\nChampion Model: [{best_model_name}] with Weighted F1-Score = {best_weighted_f1:.4f}")

# Verify predict_proba capability for production compatibility
assert hasattr(best_model, "predict_proba"), f"{best_model_name} does not implement predict_proba!"

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
