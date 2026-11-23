import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Water_Quality_Dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
PROD_ML_DIR = os.path.join(os.path.dirname(BASE_DIR), "backend", "ml-predict")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PROD_ML_DIR, exist_ok=True)

print("=" * 70)
print(" AquaSense AI: Production XGBoost & Anomaly Export Pipeline")
print("=" * 70)

# 1. Ingestion
print("\n[Step 1] Loading benchmark dataset...")
df = pd.read_csv(DATA_PATH)
print(f"Loaded {df.shape[0]} records with {df.shape[1]} columns.")

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

# 2. Stratified 70/20/10 train/test/validation split.
print("\n[Step 2] Stratified 70/20/10 Train/Test/Validation split...")
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
print(f"Train split: {len(y_train)} | Validation split: {len(y_validation)} | Test split: {len(y_test)}")

# 3. Standard Scaler FIRST (on training fold only to prevent metric distortion in SMOTE)
print("\n[Step 3] Fitting StandardScaler on training set before resampling...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_validation_scaled = scaler.transform(X_validation)
X_test_scaled = scaler.transform(X_test)
print("Feature scaling complete.")

# 4. SMOTE Resampling on Scaled Training Data
print("\n[Step 4] Applying SMOTE on scaled training features (k_neighbors=3)...")
smote = SMOTE(k_neighbors=3, random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
print("Resampled class counts in scaled training set:")
for cls_label, count in y_train_res.value_counts().sort_index().items():
    print(f"  Class {cls_label}: {count} samples")

# 5. Train Multivariate Anomaly Detector (Isolation Forest)
print("\n[Step 5] Training Multivariate Isolation Forest for anomaly detection...")
anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
anomaly_detector.fit(X_train_scaled)
print("Anomaly detector trained.")

# 6. Classifier Training (Champion XGBoost)
print("\n[Step 6] Training Production Champion: XGBoost Classifier...")
xgb_model = XGBClassifier(
    random_state=42,
    eval_metric='mlogloss'
)
xgb_model.fit(X_train_res, y_train_res)
print("XGBoost Classifier trained successfully.")

# 7. Validation monitoring and final evaluation on the untouched test set
print("\n[Step 7] Monitoring validation fold...")
y_validation_pred = xgb_model.predict(X_validation_scaled)
print(f"Validation accuracy: {accuracy_score(y_validation, y_validation_pred):.4f}")
print(f"Validation weighted F1: {f1_score(y_validation, y_validation_pred, average='weighted', zero_division=0):.4f}")
print("\n[Step 7] Evaluating on Unseen Test Set (Ground Truth)...")
y_pred = xgb_model.predict(X_test_scaled)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# 8. Probability to Continuous Drinkability Score
print("\n[Step 8] Validating Continuous Drinkability Percentage Logic...")
test_probs = xgb_model.predict_proba(X_test_scaled)
score_weights = np.array([1.0, 0.5, 0.0])
drinkability_scores = np.dot(test_probs, score_weights) * 100
print(f"Drinkability Score summary on test set:")
print(f"  Min : {drinkability_scores.min():.2f}%")
print(f"  Mean: {drinkability_scores.mean():.2f}%")
print(f"  Max : {drinkability_scores.max():.2f}%")

# 9. Export Artifacts (.pkl)
print("\n[Step 9] Exporting serialization artifacts...")
for target_dir in [MODELS_DIR, PROD_ML_DIR]:
    joblib.dump(xgb_model, os.path.join(target_dir, "model.pkl"))
    joblib.dump(scaler, os.path.join(target_dir, "scaler.pkl"))
    joblib.dump(anomaly_detector, os.path.join(target_dir, "anomaly_detector.pkl"))
    print(f"Exported to {target_dir}")

print("\n" + "=" * 70)
print(" Pipeline Complete! Model, Scaler & Anomaly Detector ready for production.")
print("=" * 70)
