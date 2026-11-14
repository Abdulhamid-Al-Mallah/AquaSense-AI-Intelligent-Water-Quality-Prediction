import os
import pandas as pd

# Define relative path to the dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "Water_Quality_Dataset.csv")

print("--- Step 1: Data Ingestion and Feature Selection ---")
print(f"Loading dataset from: {DATA_PATH}...")

# 1. Load the dataset
df = pd.read_csv(DATA_PATH)

print(f"Dataset successfully loaded. Total rows: {df.shape[0]}, Total columns: {df.shape[1]}")
print("\nAll Dataset Columns:")
print(df.columns.tolist())

# 2. Define Features (X)
# Manual certified laboratory parameters (excluding administrative metadata: Timestamp, Location)
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

X = df[FEATURE_COLS]

# 3. Define Target (y)
TARGET_COL = 'Pollution_Level'
y = df[TARGET_COL]

print("\n--- Feature Selection Summary ---")
print(f"Selected Features ({len(FEATURE_COLS)}): {FEATURE_COLS}")
print(f"Target Variable: '{TARGET_COL}'")
print(f"Features (X) shape: {X.shape}")
print(f"Target (y) shape: {y.shape}")

print("\nTarget Class Distribution:")
print(y.value_counts().sort_index())

print("\nMissing values check in X:")
print(X.isnull().sum())

print("\n--- Step 1 Complete ---")
