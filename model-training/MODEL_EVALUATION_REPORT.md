# AquaSense AI Model Evaluation

## Dataset and scope

The project's 1,000-row CSV was downloaded from Kaggle: [Water Quality and Pollution Monitoring Dataset](https://www.kaggle.com/datasets/ziya07/water-quality-and-pollution-monitoring-dataset). The repository does not contain a collection log or accredited laboratory certificate. Results describe only this dataset, not certified field measurements.

Class counts are 6, 79, and 915 for Classes 0, 1, and 2. A reproducible stratified split (`random_state=42`) creates 700 training, 100 validation, and 200 test records. Their class supports are respectively (4, 55, 641), (1, 8, 91), and (1, 16, 183).

## Leakage-controlled preprocessing and selection

`StandardScaler` is fitted only on the original 700-record training fold. The fitted scaler transforms validation and test data. SMOTE (`k_neighbors=3`, `random_state=42`) is applied only to scaled training data, producing 641 samples per class (1,923 total). The training fold has four Class 0 records, so `k=3` is the largest valid SMOTE neighborhood. Validation and test data are never resampled. Three candidate models are compared on validation weighted F1; the selected candidate is evaluated once on the untouched test fold.

## Validation model comparison

| Model | Accuracy | Macro F1 | Weighted F1 |
|---|---:|---:|---:|
| Multinomial Logistic Regression | 83.00% | 0.6649 | 0.8594 |
| Random Forest | 97.00% | 0.5964 | 0.9641 |
| XGBoost | 97.00% | 0.6042 | 0.9659 |

XGBoost is selected by validation weighted F1. Validation Class 0 contains only one record, so per-class conclusions for that class are highly uncertain.

## Final test result for selected XGBoost

| Metric | Result |
|---|---:|
| Accuracy | 98.50% |
| Macro F1 | 0.6326 |
| Weighted F1 | 0.9823 |
| Class 1 recall | 87.50% (14/16) |

Confusion matrix (rows: actual class; columns: predicted class):

```text
[[  0,   1,   0],
 [  0,  14,   2],
 [  0,   0, 183]]
```

The lone Class 0 test record was misclassified. Class 0 performance cannot be estimated from one test example; overall accuracy is dominated by Class 2. The evaluation is a single split, not a field validation or deployment benchmark.

## Artifacts and reproduction

From the repository root, install the pinned Python dependencies and run:

```powershell
python -m pip install -r model-training/requirements.txt
python model-training/step4_model_comparison.py
python -m unittest model-training/tests/test_ml_pipeline.py
```

The comparison script writes `model-training/models/evaluation_metrics.json`, exports the selected model/scaler/anomaly detector, and regenerates Figures 3.3 and 4.1–4.3. The IsolationForest is fitted only on the training fold. Latency and peak-memory claims are omitted because there is no controlled service benchmark.
