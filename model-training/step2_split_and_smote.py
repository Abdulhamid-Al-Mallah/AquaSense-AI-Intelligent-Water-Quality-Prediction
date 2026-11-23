import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE

# 1. Load the dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Water_Quality_Dataset.csv")

print("--- Step 2: Stratified Train/Test Split, Standard Scaling & SMOTE Resampling ---")
print(f"Loading data from: {DATA_PATH}...")
df = pd.read_csv(DATA_PATH)

# Define 8 laboratory parameters as features
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

# 2. Train/Test Split (80/20) with Stratification
# Stratification ensures the severe class imbalance (especially Class 0) is proportionally split
print("\n[1/3] Performing Stratified 80/20 Train/Test Split...")
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Original Dataset Shape : X={X.shape}, y={y.shape}")
print(f"X_train Shape          : {X_train.shape}")
print(f"X_test Shape           : {X_test.shape}")
print(f"y_train Shape          : {y_train.shape}")
print(f"y_test Shape           : {y_test.shape}")

print("\n--- Training Set Class Distribution (Before SMOTE) ---")
print(y_train.value_counts().sort_index())

print("\n--- Test Set Class Distribution (Untouched Ground Truth) ---")
print(y_test.value_counts().sort_index())

# 3. Mathematically Sound Preprocessing: Feature Scaling BEFORE SMOTE
# SMOTE computes Euclidean distances among nearest neighbors. If features have disparate units,
# large features dominate small concentrations (e.g. Lead/Mercury). Fitting StandardScaler strictly on
# X_train normalizes feature dimensions before neighbor synthesis.
print("\n[2/3] Fitting StandardScaler strictly on X_train before SMOTE...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
print("Features standardized across unit-free zero-mean unit-variance distribution.")

# 4. SMOTE Resampling on Scaled Training Data
print("\n[3/3] Applying SMOTE strictly to Scaled Training Data (k_neighbors=4)...")
smote = SMOTE(k_neighbors=4, random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)

print("\n--- Training Set Class Distribution (After SMOTE on Scaled Data) ---")
print(y_train_resampled.value_counts().sort_index())
print(f"X_train_resampled Shape: {X_train_resampled.shape}")
print(f"y_train_resampled Shape: {y_train_resampled.shape}")

print("\n--- Step 2 Complete: Leakage-free, scale-normalized pipeline established ---")
