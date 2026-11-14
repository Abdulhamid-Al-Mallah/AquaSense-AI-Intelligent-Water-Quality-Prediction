import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Water_Quality_Dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
PROD_ML_DIR = os.path.join(os.path.dirname(BASE_DIR), "backend", "ml-predict")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(PROD_ML_DIR, exist_ok=True)

print("=" * 60)
print(" AquaSense AI: Model Training & Artifact Export Pipeline")
print("=" * 60)

# 1. Ingestion
print("\n[Step 1] Loading dataset...")
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

# 2. Train/Test Split (80/20 Stratified)
print("\n[Step 2] Stratified 80/20 Train/Test split...")
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)
print(f"Train split: {X_train.shape[0]} samples | Test split: {X_test.shape[0]} samples")

# 3. SMOTE Resampling (on training set ONLY)
print("\n[Step 3] Applying SMOTE to training data (k_neighbors=4)...")
smote = SMOTE(k_neighbors=4, random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
print("Resampled class counts in training set:")
for cls_label, count in y_train_res.value_counts().sort_index().items():
    print(f"  Class {cls_label}: {count} samples")

# 4. Standard Scaler (fit on train resampled, transform test)
print("\n[Step 4] Fitting StandardScaler on training set...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_res)
X_test_scaled = scaler.transform(X_test)
print("Feature scaling complete.")

# 5. Classifier Training (Random Forest)
print("\n[Step 5] Training Random Forest Classifier...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    max_depth=None,
    class_weight=None
)
rf_model.fit(X_train_scaled, y_train_res)
print("Random Forest Classifier trained successfully.")

# 6. Evaluation on Unseen Test Set
print("\n[Step 6] Evaluating on Unseen Test Set (Ground Truth)...")
y_pred = rf_model.predict(X_test_scaled)
print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# 7. Probability to Continuous Drinkability Score
# Classes are [0 (Clean/Safe), 1 (Moderate), 2 (Severe Pollution)]
# Weighting formula: 1.0 * P(Class 0) + 0.5 * P(Class 1) + 0.0 * P(Class 2)
print("\n[Step 7] Validating Continuous Drinkability Percentage Logic...")
test_probs = rf_model.predict_proba(X_test_scaled)
score_weights = np.array([1.0, 0.5, 0.0])
drinkability_scores = np.dot(test_probs, score_weights) * 100

print(f"Sample test scores (first 5 samples): {[round(s, 2) for s in drinkability_scores[:5]]}")
print(f"Drinkability Score summary on test set:")
print(f"  Min : {drinkability_scores.min():.2f}%")
print(f"  Mean: {drinkability_scores.mean():.2f}%")
print(f"  Max : {drinkability_scores.max():.2f}%")

# 8. Export Artifacts (.pkl)
print("\n[Step 8] Exporting serialization artifacts...")
# Save in model-training/models/
model_save_path = os.path.join(MODELS_DIR, "model.pkl")
scaler_save_path = os.path.join(MODELS_DIR, "scaler.pkl")
joblib.dump(rf_model, model_save_path)
joblib.dump(scaler, scaler_save_path)
print(f"Exported to model-training: {model_save_path}")
print(f"Exported to model-training: {scaler_save_path}")

# Copy to backend/ml-predict/ for production inference
prod_model_path = os.path.join(PROD_ML_DIR, "model.pkl")
prod_scaler_path = os.path.join(PROD_ML_DIR, "scaler.pkl")
joblib.dump(rf_model, prod_model_path)
joblib.dump(scaler, prod_scaler_path)
print(f"Exported to production backend: {prod_model_path}")
print(f"Exported to production backend: {prod_scaler_path}")

print("\n" + "=" * 60)
print(" Pipeline Complete! Model & Scaler ready for backend inference.")
print("=" * 60)
