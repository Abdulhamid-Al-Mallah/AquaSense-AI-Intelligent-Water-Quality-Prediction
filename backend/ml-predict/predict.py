import sys
import os
import json
import warnings
warnings.filterwarnings("ignore")
import joblib
import pandas as pd
import numpy as np

def main():
    try:
        # 1. Parse JSON input from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "Missing input argument. Expected JSON string of water parameters."
            }))
            sys.exit(1)

        input_json_str = sys.argv[1]
        data = json.loads(input_json_str)

        # 2. Extract 8 certified lab features in exact required order
        feature_keys = [
            'pH',
            'Turbidity',
            'Temperature',
            'DO',
            'BOD',
            'Lead',
            'Mercury',
            'Arsenic'
        ]

        # Support both short keys and full dataset key names
        alt_keys = {
            'Turbidity': ['Turbidity (NTU)', 'turbidity'],
            'Temperature': ['Temperature (°C)', 'temperature'],
            'DO': ['DO (mg/L)', 'do', 'dissolvedOxygen'],
            'BOD': ['BOD (mg/L)', 'bod', 'biochemicalOxygenDemand'],
            'Lead': ['Lead (mg/L)', 'lead'],
            'Mercury': ['Mercury (mg/L)', 'mercury'],
            'Arsenic': ['Arsenic (mg/L)', 'arsenic'],
            'pH': ['ph', 'PH']
        }

        extracted_values = []
        for key in feature_keys:
            val = None
            if key in data:
                val = data[key]
            else:
                for alt in alt_keys.get(key, []):
                    if alt in data:
                        val = data[alt]
                        break

            if val is None:
                raise ValueError(f"Missing required parameter: '{key}'")
            extracted_values.append(float(val))

        # 3. Load pre-trained Scaler and Model
        current_dir = os.path.dirname(os.path.abspath(__file__))
        scaler_path = os.path.join(current_dir, "scaler.pkl")
        model_path = os.path.join(current_dir, "model.pkl")

        if not os.path.exists(scaler_path) or not os.path.exists(model_path):
            raise FileNotFoundError("Model or Scaler pickle file not found in ml-predict directory.")

        scaler = joblib.load(scaler_path)
        model = joblib.load(model_path)

        # 4. Scale inputs & calculate probability
        features_array = np.array([extracted_values])
        features_scaled = scaler.transform(features_array)

        # Predict probability across classes [0: Clean, 1: Moderate, 2: Polluted]
        probabilities = model.predict_proba(features_scaled)[0]

        # Weights: Class 0 = 1.0 (100% drinkable), Class 1 = 0.5 (50%), Class 2 = 0.0 (0%)
        weights = np.array([1.0, 0.5, 0.0])
        drinkability_score = float(np.dot(probabilities, weights) * 100)
        drinkability_score = round(max(0.0, min(100.0, drinkability_score)), 2)

        predicted_class = int(model.predict(features_scaled)[0])

        # 5. Output pure JSON response for Node.js child_process
        result = {
            "success": True,
            "drinkabilityScore": drinkability_score,
            "predictedClass": predicted_class,
            "classProbabilities": {
                "class0_clean": round(float(probabilities[0]), 4),
                "class1_moderate": round(float(probabilities[1]), 4),
                "class2_polluted": round(float(probabilities[2]), 4)
            }
        }
        print(json.dumps(result))

    except Exception as e:
        error_res = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_res))
        sys.exit(1)

if __name__ == "__main__":
    main()
