# AquaSense AI: Supervisor Quick Reference Sheet

**Project:** AquaSense AI – Intelligent Water Quality Prediction & Anomaly Detection  
**Course Code:** SENG491 (Senior Graduation Capstone)  
**Subject:** Model Selection, Anomaly Detection & Experimental Verification  

---

### 1. Requirements Met
- **Requirement:** Train and evaluate at least one baseline and two machine-learning models + multivariate anomaly detection.
- **Implemented:**
  1. *Baseline Model:* Multinomial Logistic Regression (`max_iter=1000`)
  2. *ML Model 1:* Random Forest Classifier (`n_estimators=100`)
  3. *ML Model 2 (Champion):* **XGBoost Classifier** (`eval_metric='mlogloss'`)
  4. *Multivariate Anomaly Detection:* **Isolation Forest** (`contamination=0.05`, `random_state=42`)

---

### 2. SENG491 Model Performance Comparison Table

All models evaluated on the same stratified, held-out test set ($n = 200$, 20% of data):

| Model Name | Type | Accuracy (%) | Macro F1 | Weighted F1 | Selected? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | Linear Baseline | 83.00% | 0.5686 | 0.8629 | ❌ Rejected |
| **Random Forest** | Bagging Ensemble | 97.00% | 0.5907 | 0.9655 | ❌ Runner-up |
| **XGBoost** | **Gradient Boosting** | **98.00%** | **0.6204** | **0.9794** | **✅ Champion** |

---

### 3. Key Methodological Correctness (Leakage-Free & Scaling-First)

1. **Stratified Split:** 80/20 train/test partition performed *before* any transformation.
2. **Scale-First Preprocessing:** `StandardScaler` is fitted strictly on $X_{\text{train}}$. SMOTE is applied *after* scaling to ensure Euclidean neighbor distances are not distorted by differences in measurement units (e.g. heavy metals in $\mu\text{g/L}$ vs. temperature/turbidity in tens of units).
3. **Multivariate Anomaly Detection:** An unsupervised `IsolationForest` model evaluates multivariate feature interaction to identify unexpected hydrological outliers.
4. **Minority Class Handling:** XGBoost correctly captures **81.25% (13/16)** of Moderate Contamination instances in the held-out test fold.

---

### 4. Reproducing Results

Run the comparison script in the terminal:
```powershell
python model-training/step4_model_comparison.py
```
This re-runs the entire pipeline and automatically outputs the formatted comparison table and exports all three artifacts (`model.pkl`, `scaler.pkl`, `anomaly_detector.pkl`).
