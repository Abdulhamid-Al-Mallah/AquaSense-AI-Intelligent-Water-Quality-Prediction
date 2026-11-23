import sys
import os
import json
import warnings
warnings.filterwarnings("ignore")
import joblib
import pandas as pd
import numpy as np

def run_prediction():
    try:
        # Step 1: Ensure arguments are provided
        if len(sys.argv) < 2:
            error_message = {
                "success": False,
                "error": "Missing input argument. Please provide a JSON string of water parameters."
            }
            print(json.dumps(error_message))
            sys.exit(1)

        input_json_string = sys.argv[1]
        input_data = json.loads(input_json_string)

        # Step 2: The exact 8 physical and chemical parameters required by the trained model
        required_parameters = [
            'pH',
            'Turbidity',
            'Temperature',
            'DO',
            'BOD',
            'Lead',
            'Mercury',
            'Arsenic'
        ]

        # Alternative spelling mappings to handle various frontend key conventions
        alternative_key_names = {
            'Turbidity': ['Turbidity (NTU)', 'turbidity'],
            'Temperature': ['Temperature (°C)', 'Temperature (Â°C)', 'temperature'],
            'DO': ['DO (mg/L)', 'do', 'dissolvedOxygen'],
            'BOD': ['BOD (mg/L)', 'bod', 'biochemicalOxygenDemand'],
            'Lead': ['Lead (mg/L)', 'lead'],
            'Mercury': ['Mercury (mg/L)', 'mercury'],
            'Arsenic': ['Arsenic (mg/L)', 'arsenic'],
            'pH': ['ph', 'PH']
        }

        # Extract values in the exact feature order
        ordered_feature_values = []
        for parameter_name in required_parameters:
            found_value = None
            if parameter_name in input_data:
                found_value = input_data[parameter_name]
            else:
                for alias in alternative_key_names.get(parameter_name, []):
                    if alias in input_data:
                        found_value = input_data[alias]
                        break

            if found_value is None:
                raise ValueError(f"Required water parameter '{parameter_name}' was not provided.")
            
            ordered_feature_values.append(float(found_value))

        # Step 3: Load serialized scaler, model, and anomaly detector artifacts
        current_script_directory = os.path.dirname(os.path.abspath(__file__))
        scaler_file_path = os.path.join(current_script_directory, "scaler.pkl")
        model_file_path = os.path.join(current_script_directory, "model.pkl")
        anomaly_file_path = os.path.join(current_script_directory, "anomaly_detector.pkl")

        if not os.path.exists(scaler_file_path) or not os.path.exists(model_file_path):
            raise FileNotFoundError("Model or Scaler (.pkl) files not found in backend/ml-predict directory.")

        scaler = joblib.load(scaler_file_path)
        trained_model = joblib.load(model_file_path)

        # Step 4: Scale features and calculate continuous drinkability score
        features_matrix = np.array([ordered_feature_values])
        scaled_features = scaler.transform(features_matrix)

        # Probabilities across [Class 0: Clean, Class 1: Moderate, Class 2: Polluted]
        class_probabilities = trained_model.predict_proba(scaled_features)[0]

        # Class weights: Class 0 = 100% clean, Class 1 = 50% clean, Class 2 = 0% clean
        drinkability_weights = np.array([1.0, 0.5, 0.0])
        raw_drinkability_score = float(np.dot(class_probabilities, drinkability_weights) * 100.0)
        final_drinkability_score = round(max(0.0, min(100.0, raw_drinkability_score)), 2)

        predicted_class_integer = int(trained_model.predict(scaled_features)[0])

        # Step 5: Multivariate Anomaly Detection (Isolation Forest)
        is_anomaly = False
        anomaly_score = 0.0
        if os.path.exists(anomaly_file_path):
            anomaly_detector = joblib.load(anomaly_file_path)
            # IsolationForest returns -1 for anomaly, 1 for inlier
            anomaly_pred = anomaly_detector.predict(scaled_features)[0]
            is_anomaly = bool(anomaly_pred == -1)
            # Decision function: negative values indicate outliers
            raw_score = float(anomaly_detector.decision_function(scaled_features)[0])
            # Normalize to an intuitive positive anomaly score where higher = more anomalous
            anomaly_score = round(float(max(0.0, min(1.0, -raw_score * 2.0))), 4)

        # Step 6: Output JSON string for Node.js child process to read from stdout
        response_data = {
            "success": True,
            "drinkabilityScore": final_drinkability_score,
            "predictedClass": predicted_class_integer,
            "isAnomaly": is_anomaly,
            "anomalyScore": anomaly_score,
            "classProbabilities": {
                "class0_clean": round(float(class_probabilities[0]), 4),
                "class1_moderate": round(float(class_probabilities[1]), 4),
                "class2_polluted": round(float(class_probabilities[2]), 4)
            }
        }
        print(json.dumps(response_data))

    except Exception as general_error:
        failure_response = {
            "success": False,
            "error": str(general_error)
        }
        print(json.dumps(failure_response))
        sys.exit(1)

if __name__ == "__main__":
    run_prediction()
