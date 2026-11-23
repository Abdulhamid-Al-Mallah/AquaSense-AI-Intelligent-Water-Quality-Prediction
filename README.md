# AquaSense AI: Intelligent Water Quality Prediction & Contamination Early-Warning System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.12](https://img.shields.io/badge/Python-3.12-3776AB.svg?logo=python&logoColor=white)](https://python.org)
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
│  Python 3.12 ML Subsystem    │ │    MongoDB Atlas     │
│ - StandardScaler             │ │ - WaterRecord Store  │
│ - XGBoost (Champion Classifier) │ - User Auth Store   │
│ - Isolation Forest (Anomaly) │ └──────────────────────┘
└──────────────────────────────┘
```

1. **Client Tier (`/frontend`):** Built with React 18, Tailwind CSS, Lucide icons, and Recharts. Features manual physicochemical form entry, drag-and-drop CSV / JSON dataset batch ingestion, interactive "What-If" treatment simulation, and real-time GIS monitoring charts.
2. **Server Tier (`/backend`):** Express REST API configured with JSON Web Token (JWT) route protection, strict CORS origin filtering, input parameter sanity boundaries, and the WHO/EPA water safety advisory engine.
3. **Machine Learning Tier (`/model-training` & `/backend/ml-predict`):** Serialized Python inference engine executing feature standardization, extreme gradient boosting (XGBoost), and multivariate anomaly detection (Isolation Forest).

---

## 🧪 Dataset Provenance & Characteristics

- **Dataset File:** `model-training/data/Water_Quality_Dataset.csv`
- **Origin & Nature:** A controlled hydrological benchmark time-series dataset calibrated against official WHO and EPA drinking water parameters.
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
1. **Stratified Split:** 80/20 train/test partition ($N_{\text{train}} = 800$, $N_{\text{test}} = 200$) executed before any transformations.
2. **Standard Scaling FIRST:** `StandardScaler` is fitted strictly on $X_{\text{train}}$ and transforms both sets. This standardizes features across unit-free distributions, preventing heavy metal micro-values ($0.001$ mg/L) from being drowned out by temperature or turbidity during Euclidean distance calculations.
3. **SMOTE on Scaled Data:** Synthetic Minority Over-sampling Technique ($k=4$) expands minority classes strictly on the scaled training fold ($N = 2,196$ balanced samples). The test set remains completely untouched.
4. **Multivariate Anomaly Detection:** An unsupervised `IsolationForest(contamination=0.05)` model trains on the standardized space to detect unnatural sensor combinations.

---

## 📊 Experimental Results (SENG491 Model Benchmark)

Evaluated on the exact 200-sample unseen held-out test fold:

| Model Architecture | Model Category | Accuracy (%) | Macro F1 | Weighted F1 | Selection Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Multinomial Logistic Regression** | Linear Baseline | 83.00% | 0.5686 | 0.8629 | Rejected |
| **Random Forest Classifier** | Bagging Ensemble | 97.00% | 0.5907 | 0.9655 | Runner-up |
| **XGBoost Classifier** | **Gradient Boosting** | **98.00%** | **0.6204** | **0.9794** | **✅ Champion** |

> **Evaluation Limitations Acknowledgment:**  
> In the 200-sample test fold, Class 0 has 1 sample, Class 1 has 16 samples, and Class 2 has 183 samples. The 98.00% accuracy is primarily driven by the dominant class. Therefore, Weighted F1 (0.9794) and Moderate Recall (81.25%, capturing 13/16 instances) serve as the true measure of operational reliability.

---

## 🔒 Security & Access Control

- **JWT Authentication Guard:** All sensitive endpoints (`/api/predict`, `/api/predict/batch`, `/api/history`, `/api/history/:id`, `/api/analytics/*`) require a valid HTTP `Authorization: Bearer <token>` header verified by `authMiddleware.js`.
- **CORS Whitelist:** Configured in `server.js` to restrict origins to authorized client ports (`http://localhost:5173`, `http://127.0.0.1:5173`, or `FRONTEND_URL`), preventing arbitrary cross-origin request forgery.
- **Environment Isolation:** Credentials and secrets are managed via `.env`.

---

## 🚀 Setup & Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Python](https://python.org/) (v3.10 to v3.12)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AquaSense-AI.git
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
npm install
# Configure your environment variables
cp .env.example .env # or verify backend/.env
# Run automated backend test suite
node tests/run_tests.js
# Start development server
npm run dev
cd ..
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. Default administrator account is seeded automatically on initial database connection (`admin@aquasense.ai` / `Admin@123`).

---

## 🧪 Automated Testing Suite

To execute the test suites verifying software reliability and ML pipelines:

```bash
# 1. Run Backend Logic & Security Tests (7 unit & integration tests)
node backend/tests/run_tests.js

# 2. Run Machine Learning Pipeline Tests (Dataset, Scaling, SMOTE, XGBoost, Anomaly)
python model-training/tests/test_ml_pipeline.py
```
