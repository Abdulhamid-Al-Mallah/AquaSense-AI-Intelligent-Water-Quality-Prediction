"""
AquaSense AI - Machine Learning Pipeline Unit Test Suite
Verifies data loading, scaling-before-SMOTE, XGBoost inference, and Isolation Forest anomaly detection.
"""

import os
import unittest
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import joblib

class TestAquaSenseMLPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cls.data_path = os.path.join(cls.base_dir, "data", "Water_Quality_Dataset.csv")
        cls.models_dir = os.path.join(cls.base_dir, "models")
        cls.feature_cols = [
            'pH',
            'Turbidity (NTU)',
            'Temperature (°C)',
            'DO (mg/L)',
            'BOD (mg/L)',
            'Lead (mg/L)',
            'Mercury (mg/L)',
            'Arsenic (mg/L)'
        ]

    def test_01_dataset_integrity(self):
        """Verifies dataset has 1000 rows and no missing values in feature set."""
        df = pd.read_csv(self.data_path)
        self.assertEqual(len(df), 1000)
        self.assertEqual(df[self.feature_cols].isnull().sum().sum(), 0)

    def test_02_train_test_validation_split_and_train_only_smote(self):
        """Ensures 70/20/10 partition sizes and keeps scaling/SMOTE training-only."""
        df = pd.read_csv(self.data_path)
        X = df[self.feature_cols]
        y = df['Pollution_Level']

        X_trainval, X_test, y_trainval, y_test = train_test_split(
            X, y, test_size=0.20, random_state=42, stratify=y
        )
        X_train, X_validation, y_train, y_validation = train_test_split(
            X_trainval, y_trainval, test_size=0.125, random_state=42, stratify=y_trainval
        )
        self.assertEqual((len(X_train), len(X_validation), len(X_test)), (700, 100, 200))
        self.assertEqual(y_train.value_counts().sort_index().tolist(), [4, 55, 641])
        self.assertEqual(y_validation.value_counts().sort_index().tolist(), [1, 8, 91])
        self.assertEqual(y_test.value_counts().sort_index().tolist(), [1, 16, 183])
        self.assertFalse(set(X_train.index) & set(X_validation.index))
        self.assertFalse(set(X_train.index) & set(X_test.index))
        self.assertFalse(set(X_validation.index) & set(X_test.index))

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_validation_scaled = scaler.transform(X_validation)
        X_test_scaled = scaler.transform(X_test)
        self.assertEqual(X_validation_scaled.shape[0], 100)
        self.assertEqual(X_test_scaled.shape[0], 200)

        smote = SMOTE(k_neighbors=3, random_state=42)
        X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

        # Training-only balanced set; validation/test are transformed but never resampled.
        class_counts = y_train_res.value_counts()
        self.assertEqual(class_counts[0], class_counts[1])
        self.assertEqual(class_counts[1], class_counts[2])
        self.assertEqual(class_counts[0], 641)
        self.assertEqual(len(y_train_res), 1923)

    def test_03_serialized_artifacts_exist(self):
        """Verifies that model.pkl, scaler.pkl, and anomaly_detector.pkl exist."""
        for artifact in ["model.pkl", "scaler.pkl", "anomaly_detector.pkl"]:
            artifact_path = os.path.join(self.models_dir, artifact)
            self.assertTrue(os.path.exists(artifact_path), f"Missing artifact: {artifact}")

    def test_04_xgboost_and_anomaly_inference(self):
        """Loads artifacts and tests inference prediction probabilities and anomaly flag."""
        model = joblib.load(os.path.join(self.models_dir, "model.pkl"))
        scaler = joblib.load(os.path.join(self.models_dir, "scaler.pkl"))
        anomaly_detector = joblib.load(os.path.join(self.models_dir, "anomaly_detector.pkl"))

        # Typical clean sample
        clean_sample = np.array([[7.2, 2.0, 19.0, 7.5, 2.0, 0.003, 0.0003, 0.002]])
        scaled = scaler.transform(clean_sample)

        probs = model.predict_proba(scaled)[0]
        self.assertEqual(len(probs), 3)

        # Anomaly detector output
        pred_anomaly = anomaly_detector.predict(scaled)[0]
        self.assertIn(pred_anomaly, [-1, 1])

if __name__ == "__main__":
    unittest.main()
