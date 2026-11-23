# AquaSense AI: Intelligent Water Quality Prediction & Contamination Early-Warning System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.9+](https://img.shields.io/badge/Python-3.9%2B-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Node.js: 18+](https://img.shields.io/badge/Node.js-18%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![React: 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost%20Champion-FF6600.svg)](https://xgboost.readthedocs.io)

AquaSense AI is a full-stack, machine learning-driven decision-support platform designed to evaluate drinking water quality, predict contamination severity, detect multivariate hydrological anomalies, and provide prescriptive water treatment advisories compliant with World Health Organization (WHO) and EPA regulatory standards.

---

## 👥 Project Team & Academic Supervision
- **Course:** SENG491 / SENG492 Senior Graduation Project
- **Institution:** Hasan Kalyoncu University, Department of Software Engineering
- **Supervisor:** Asst. Prof. Dr. Ali Karabaş
- **Team Members:**
  - Abdulhamid El Mellah
  - Cemre Öztaş
  - Beyza Erkan
  - Helin Yüksel

---

## 🏗️ System Architecture

AquaSense AI operates as a 3-tier decoupled micro-architecture:

```
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite UI                   │
│ (Single-Sample Assay Entry, CSV/JSON Batch, Simulator) │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP + JWT Bearer Auth
                            ▼
┌────────────────────────────────────────────────────────┐
│                Node.js / Express Server                │
│  (Auth Guard, CORS Whitelist, Validation, Mongoose)    │
└─────────────┬────────────────────────────┬─────────────┘
              │ Subprocess (JSON stdio)    │ MongoDB Driver
              ▼                            ▼
┌──────────────────────────────┐ ┌──────────────────────┐
│  Python ML Subsystem         │ │    MongoDB Atlas     │
│ - StandardScaler             │ │ - WaterRecord Store  │
│ - XGBoost (Champion Classifier) │ - User Auth Store   │
│ - Isolation Forest (Anomaly) │ └──────────────────────┘
└──────────────────────────────┘
```

1. **Client Tier (`/frontend`):** Built with React 18, Tailwind CSS, Lucide icons, and Recharts. Features manual parameter entry, CSV/JSON batch ingestion, an interactive hypothetical "What-If" parameter simulation, and historical trend/location summary charts.
2. **Server Tier (`/backend`):** Express REST API configured with JSON Web Token (JWT) route protection, strict CORS origin filtering, input parameter sanity boundaries, and the WHO/EPA water safety advisory engine.
3. **Machine Learning Tier (`/model-training` & `/backend/ml-predict`):** Serialized Python inference engine executing feature standardization, extreme gradient boosting (XGBoost), and multivariate anomaly detection (Isolation Forest).

---

## 🧪 Dataset Provenance & Characteristics

- **Dataset File:** `model-training/data/Water_Quality_Dataset.csv`
- **Origin & Nature:** Downloaded from [Kaggle](https://www.kaggle.com/datasets/ziya07/water-quality-and-pollution-monitoring-dataset). The repository does not include an accredited laboratory certificate for these records; model results describe this dataset and do not establish performance on certified field measurements.
- **Volume:** 1,000 hourly sequential records spanning 5 monitoring stations (`L1` through `L5`) for the 2024 calendar year.
- **Physical & Chemical Features (8 Inputs):**
  1. pH (6.5 – 8.5 safe range)
  2. Turbidity (NTU, $\le 5.0$ safe limit)
  3. Temperature (°C)
  4. Dissolved Oxygen (DO, mg/L, $\ge 5.0$ healthy baseline)
  5. Biochemical Oxygen Demand (BOD, mg/L, $\le 5.0$ organic limit)
  6. Lead ($\le 0.010$ mg/L)
  7. Mercury ($\le 0.006$ mg/L)
  8. Arsenic ($\le 0.010$ mg/L)
- **Target Distribution & Severe Class Imbalance:**
  - **Class 0 (Clean / Potable):** 6 samples (0.6%)
  - **Class 1 (Moderate Contamination):** 79 samples (7.9%)
  - **Class 2 (Severe Pollution):** 915 samples (91.5%)

### Preprocessing & Leakage Prevention Pipeline
1. **Stratified Split:** 70/20/10 train/test/validation partition ($N_{\text{train}} = 700$, $N_{\text{test}} = 200$, $N_{\text{validation}} = 100$) before transformations. Model selection uses validation results; the test fold is reserved for the selected model's final evaluation.
2. **Training-only scaling:** `StandardScaler` is fitted only on the 700 training records and transforms the validation and test folds without refitting. This standardizes features before SMOTE's distance calculations.
3. **Training-only SMOTE:** SMOTE (`k_neighbors=3`) is applied only to the scaled training fold, producing 1,923 balanced records (641 per class). The validation and test folds are never resampled. `k=3` is used because the training split contains four Class 0 records.
4. **Multivariate Anomaly Detection:** An unsupervised `IsolationForest(contamination=0.05)` model trains on the standardized space to detect unnatural sensor combinations.

---

## 📊 Experimental Results (SENG491 Model Benchmark)

Candidate models are compared on the 100-record validation fold:

| Model Architecture | Model Category | Accuracy (%) | Macro F1 | Weighted F1 | Selection Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Multinomial Logistic Regression** | Linear Baseline | 83.00% | 0.6649 | 0.8594 | Rejected |
| **Random Forest Classifier** | Bagging Ensemble | 97.00% | 0.5964 | 0.9641 | Runner-up |
| **XGBoost Classifier** | **Gradient Boosting** | **97.00%** | **0.6042** | **0.9659** | **✅ Selected** |

> **Final test evaluation:** The validation-selected XGBoost model achieved 98.50% accuracy, 0.9823 weighted F1, and 0.6326 macro F1 on the untouched 200-record test fold. Class 1 recall was 87.50% (14/16); Class 0 support was one record and was misclassified. These benchmark results do not establish field performance.

---

## 🔒 Security & Access Control

- **JWT Authentication Guard:** All sensitive endpoints (`/api/predict`, `/api/predict/batch`, `/api/history`, `/api/history/:id`, `/api/analytics/*`) require a valid HTTP `Authorization: Bearer <token>` header verified by `authMiddleware.js`.
- **CORS Allowlist:** Configured in `server.js` for the local frontend (`http://localhost:3000`, `http://127.0.0.1:3000`) and the configured `FRONTEND_URL`. CORS controls which browser origins may read API responses; it is not an authentication or CSRF control.
- **Environment Isolation:** Credentials and secrets are managed via `.env`.

---

## 🚀 Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.19 or higher)
- [Python](https://python.org/) (v3.9 or later; direct ML dependencies are pinned)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Abdulhamid-Al-Mallah/AquaSense-AI-Intelligent-Water-Quality-Prediction.git
cd AquaSense-AI-Intelligent-Water-Quality-Prediction
```

### 2. Python ML Environment Setup
```bash
cd model-training
pip install -r requirements.txt
# Run model training and export production artifacts (.pkl)
python step4_model_comparison.py
cd ..
```

### 3. Backend Setup
```bash
cd backend
npm ci
# In PowerShell, copy the template and edit .env:
Copy-Item .env.example .env
# Set a unique JWT_SECRET (at least 32 characters) and a reachable MONGO_URI.
# Run automated backend test suite
node tests/run_tests.js
# Start development server
npm run dev
cd ..
```

### 4. Frontend Setup
```bash
cd frontend
npm ci
npm run dev
```
Open your browser at `http://localhost:3000`. There is no seeded default account. Register an account through the application, or use an account your team has explicitly created. The backend refuses to start if `JWT_SECRET` is missing or shorter than 32 characters.

---

## 🧪 Automated Testing Suite

To execute the test suites verifying software reliability and ML pipelines:

```bash
# 1. Run backend validation, advisory, and ML integration checks
node backend/tests/run_tests.js

# 2. Run Machine Learning Pipeline Tests (Dataset, Scaling, SMOTE, XGBoost, Anomaly)
python model-training/tests/test_ml_pipeline.py
```
