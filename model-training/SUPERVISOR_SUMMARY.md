# AquaSense AI Supervisor Summary

## Project implementation

AquaSense AI is a decision-support prototype with a React frontend, an Express API, MongoDB persistence, and a Python model-inference pipeline. It accepts manual measurements and CSV/JSON uploads; it does not connect to physical sensors or control a municipal water system.

The 1,000-row project dataset was downloaded from [Kaggle](https://www.kaggle.com/datasets/ziya07/water-quality-and-pollution-monitoring-dataset). The repository does not contain a field-collection log or accredited laboratory certificate, so the reported metrics describe this dataset only.

## Split and evaluation

A stratified split (`random_state=42`) uses 700 training, 100 validation, and 200 test records. `StandardScaler` is fitted only on training data. SMOTE (`k_neighbors=3`) is applied only to the scaled training fold, which has four Class 0 records and becomes 1,923 balanced samples. Validation data selects among models; the test data is reserved for one final evaluation of the selected model.

| Validation model | Accuracy | Macro F1 | Weighted F1 |
|---|---:|---:|---:|
| Multinomial Logistic Regression | 83.00% | 0.6649 | 0.8594 |
| Random Forest | 97.00% | 0.5964 | 0.9641 |
| XGBoost (selected) | 97.00% | 0.6042 | 0.9659 |

On the untouched test fold, selected XGBoost achieved 98.50% accuracy, 0.6326 macro F1, and 0.9823 weighted F1. Class 1 recall was 14/16 (87.50%). The single Class 0 test record was misclassified, so clean-water recognition remains unestablished. Results are limited to a single split of this Kaggle dataset.

IsolationForest flags point outliers for review; it does not detect persistence over time or independently determine water safety. The comparison script saves evaluation metrics and regenerates the methodology and result figures. Runtime latency and peak memory are not claimed without a controlled benchmark.

## Reproduction

With Python 3.9 or later, from the repository root:

```powershell
python -m pip install -r model-training/requirements.txt
python model-training/step4_model_comparison.py
python -m unittest model-training/tests/test_ml_pipeline.py
```
