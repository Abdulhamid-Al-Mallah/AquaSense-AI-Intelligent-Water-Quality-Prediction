# AquaSense AI: Supervisor Quick Reference Sheet

**Project:** AquaSense AI – Intelligent Water Quality Prediction  
**Subject:** Model Selection & Experimental Results Summary  

---

### 1. Requirements Met
- **Requirement:** Train and evaluate at least one baseline and two machine-learning models.
- **Implemented:**
  1. *Baseline Model:* Multinomial Logistic Regression (`max_iter=1000`)
  2. *ML Model 1:* Random Forest Classifier (`n_estimators=100`)
  3. *ML Model 2 (Champion):* **XGBoost Classifier** (`eval_metric='mlogloss'`)

---

### 2. SENG491 Model Performance Comparison Table

All models evaluated on the same stratified, held-out test set ($n = 200$, 20% of data):

| Model Name | Type | Accuracy (%) | Macro F1 | Weighted F1 | Selected? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | Linear Baseline | 85.50% | 0.5943 | 0.8819 | ❌ Rejected |
| **Random Forest** | Bagging Ensemble | 97.00% | 0.5907 | 0.9655 | ❌ Runner-up |
| **XGBoost** | **Gradient Boosting** | **97.50%** | **0.6065** | **0.9738** | **✅ Champion** |

---

### 3. Why XGBoost Was Selected (4 Key Points)

1. **Highest Overall Performance:**
   - Outperformed both Logistic Regression and Random Forest across **Accuracy (97.50%)**, **Macro F1 (0.6065)**, and **Weighted F1 (0.9738)**.
2. **Best Minority Class Detection:**
   - Captured **75% of Moderate Contamination (Class 1)** samples, compared to 68.75% for Random Forest and high false positives (precision 0.33) in Logistic Regression.
3. **Continuous Score Generation:**
   - Implements `predict_proba()` to compute continuous Drinkability Percentage ($0.0\% - 100.0\%$) using:
     $$\text{Score} = \left( 1.0 \cdot P(\text{Clean}) + 0.5 \cdot P(\text{Moderate}) + 0.0 \cdot P(\text{Polluted}) \right) \times 100$$
4. **Fast and Lightweight:**
   - Serialized artifact is only **~300 KB** and executes in under **10 ms** inside the Node.js backend.

---

### 4. Data Leakage Prevention

- **Train/Test Partition:** 80/20 stratified split performed *before* any transformation.
- **SMOTE Resampling ($k=4$):** Applied strictly to the 800 training samples (expanded to 2,196 balanced samples). The test set of 200 samples was never touched by SMOTE.
- **Scaling:** `StandardScaler` fitted only on training data.

---

### 5. Reproducing Results

Run the comparison script in the terminal:
```powershell
python model-training/step4_model_comparison.py
```
This re-runs the entire pipeline and automatically outputs the formatted comparison table.
