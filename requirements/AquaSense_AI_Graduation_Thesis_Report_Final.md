![]()

**HASAN KALYONCU UNIVERSITY**

**FACULTY OF ENGINEERING**

**SOFTWARE ENGINEERING DEPARTMENT**

**AQUASENSE AI: INTELLIGENT WATER QUALITY PREDICTION AND CONTAMINATION EARLY-WARNING SYSTEM**

**GRADUATION THESIS**

**IN**

**SOFTWARE ENGINEERING**

**BY**

**ABDULHAMİD EL MELLAH**

**CEMRE ÖZTAŞ** 

**BEYZA ERKAN**

**HELİN YÜKSEL**

**FALL 2026–2027**

**MAY 2027**

## **DECLARATION** **OF** **ACADEMIC ETHICS AND ORIGINALITY**
We hereby declare that all information in this document has been obtained and presented in accordance with academic rules and ethical conduct. We also declare that, as required by these rules and conduct, we have fully cited and referenced all material and results that are not original to this work.

Student Names & Signatures:

1.  Abdulhamid EL MELLAH 

 Signature: _______________________

2.  Cemre ÖZTAŞ 

Signature: _______________________

3.  Beyza ERKAN

Signature: _______________________

4.  Helin YÜKSEL

Signature: _______________________

Date: May 2027

## **ABSTRACT**
AQUASENSE AI: INTELLIGENT WATER QUALITY PREDICTION AND CONTAMINATION EARLY-WARNING SYSTEM 

Abdulhamid EL MELLAH; Cemre ÖZTAŞ; Beyza ERKAN; Helin YÜKSEL Graduation Thesis in Software Engineering Supervisor: Asst. Prof. Dr. Ali Karabaş May 2027, 84 pages

Although safe, untainted drinking water is universal human right, our freshwater supplies are heavily under threat from industrial effluents, pesticides and fertilisers, and urban waste. Conventional lab-based water quality tests comprise chemical sampling coupled with microbiological incubation testing requiring anywhere between 24 and 72 hours for results processing. This operational latency disables water utility managers and environmental regulators from counteracting temporary toxic pollution incidents before contaminated water has entered water mains and distribution infrastructure. To fill this critical latency gap for actionable decision support, this graduation thesis develops Aqua Sense AI, a smart, full-stack decision support and early warning platform for contamination.

The system is based on a certified environmental database of 1,000 multi-variable water measurements assessed for the following 8 critical physical and chemical parameters: pH, Turbidity, Temperature, Dissolved Oxygen (DO), BOD (Biochemical Oxygen Demand), Pb (Lead), Hg (Mercury), and As (Arsenic). Within in a real municipal water supply, clean water and residual effluent outnumber occasional contamination events; so in this raw database, there is extreme class imbalance per each of the target classes (target variable classes: Class 0 (Clean / Potable) 0.6%, Class 1 (Moderate Contamination) 7.9%, Class 2 (Severe pollution) 91.5%). There was no data-leakage, so an 80/20 stratified split was done prior to any mathematical operation or scaling, in order to retain 200 samples as perfectly blind testing ground truth. SMOTE (k=4) was used strictly on the 800 sample training set to oversample each class of interest to 732 instances, 2748 samples total; again, Standard Scaler was used to normalize features.

As per the SENG491 capstone guidelines, three different predictive models were developed, evaluated and compared; a Multinomial Logistic Regression (multiclass baseline), a Random Forest (bagging ensemble) and an XGBoost (boosting classifier) model. The champion XGBoost model was able to generalize correctly on the predictive data set with 97.50% test accuracy, 0.9738Weighted F1-Score and 0.6065 Macro F1-Score. Most importantly, the moderate contamination class (Class 1) was able to be delineated at 75.00% (Class 1 recall), better than the Random Forest (68.75%) and circumventing the false-alarm rate that linear models fell prey to (Precision 0.33).

In addition to discrete classification, the system provides a continuous Drinkability Score (0.00% - 100.00%) derived mathematically from multi-class calibrated prediction probabilities:

Which is stratified into Safe ( 75%), Moderate (40% - 74.99%) and Critical (< 40%) risk thresholds. A comprehensive integrated environmental consultancy engine provides parameter-specific assessments against WHO and US EPA benchmarks, with prescribed physical/chemical remediation measures, such as calcite neutralisation, coagulation/flocculation, advanced oxidation, reverse osmosis and granular activated carbon. This software is implemented as an enterprise-grade full-stack web application comprising Express.js/Node.js REST API, asynchronous child-process Python inference bridge, document-based MongoDB persistence, React 18-based modern frontend with Tailwind CSS, Recharts dashboard and data visualisation, batch JSON ingestion and "What-If" treatment simulation.

Key Words: Water Quality Prediction; Water Pollution Monitoring; Machine Learning; Extreme Gradient Boosting (XGBoost); Synthetic Minority Over-sampling Technique (SMOTE); Contamination Early Warning; Full-Stack Decision Support System.

## **ÖZET**
AQUASENSE AI: YAPAY ZEKA DESTEKLİ SU KALİTESİ TAHMİNİ VE KİRLİLİK ERKEN UYARI SİSTEMİ 

Abdulhamid EL MELLAH; Cemre ÖZTAŞ; Beyza ERKAN; Helin YÜKSEL Bitirme Tezi, Yazılım Mühendisliği Bölümü Tez Yöneticisi: Dr. Öğr. Üyesi Ali Karabaş Mayıs 2027, 84 sayfa

Temiz ve güvenli içme suyuna erişim, temel bir insan hakkı olarak kabul edilmektedir; ancak tatlı su kaynakları endüstriyel atıklar, tarımsal kimyasal sızıntılar ve kentsel kirlilik nedeniyle her geçen gün daha büyük tehditlerle karşı karşıya kalmaktadır. Geleneksel laboratuvar su analizleri kimyasal titrasyon ve biyolojik inkübasyon gerektirmekte olup sonuçların elde edilmesi 24 ila 72 saat arasında sürmektedir. Bu operasyonel gecikme, su şebekesi yöneticilerinin ve çevre denetleme kurumlarının ani kirlenme olaylarını erken aşamada tespit ederek şebekeye ulaşmasını engellemesini imkansız kılmaktadır. Bu kritik gecikme ve karar destek eksikliğini gidermek amacıyla, bu bitirme tezi kapsamında Hasan Kalyoncu Üniversitesi Yazılım Mühendisliği Bölümü SENG491 bitirme projesi gereksinimleri doğrultusunda AquaSense AI adlı yapay zeka destekli karar destek ve kirlilik erken uyarı platformu geliştirilmiştir.

Sistem, sekiz kritik fiziksel ve kimyasal parametre (pH, Bulanıklık, Sıcaklık, Çözünmüş Oksijen [DO], Biyokimyasal Oksijen İhtiyacı [BOD], Kurşun [Pb], Cıva [Hg] ve Arsenik [As]) içeren 1.000 adet onaylı su kalitesi ölçüm verisi üzerinde çalışmaktadır. Gerçek saha koşullarında içilebilir temiz su ve arıtılmış su örnekleri ani kirlilik vakalarına kıyasla sayıca çok daha fazla olduğundan, veri kümesi hedef sınıflar arasında aşırı dengesizlik (Sınıf 0: Temiz/İçilebilir %0,6; Sınıf 1: Orta Dereceli Kirlilik %7,9; Sınıf 2: Ağır Kirlilik %91,5) barındırmaktadır. Veri sızıntısını (data leakage) kesin olarak engellemek amacıyla, herhangi bir matematiksel dönüşüm yapılmadan önce %80/%20 oranında tabakalı (stratified) bölme uygulanmış ve 200 adet test verisi tamamen izole edilmiştir. Sentetik Azınlık Aşırı Örnekleme Tekniği (SMOTE, k=4) yalnızca 800 eğitim verisine uygulanarak her sınıf 732 örneğe (toplam 2.196 dengelenmiş örnek) eşitlenmiş ve ardından StandardScaler ile özellik normalizasyonu gerçekleştirilmiştir.

Proje yönergesi doğrultusunda üç farklı mimari eğitilmiş ve kıyaslanmıştır: Multinomial Lojistik Regresyon (temel referans), Random Forest (torbalama topluluğu) ve Ekstrem Gradyan Artırma (XGBoost - artırma topluluğu). Bağımsız test kümesi üzerinde yapılan değerlendirmelerde XGBoost; %97,50 test doğruluğu, 0,9738 Ağırlıklı F1-Skoru ve 0,6065 Makro F1-Skoru elde ederek şampiyon model seçilmiştir. En önemlisi XGBoost, orta dereceli kirlilik sınıfında (Sınıf 1) %75,00 duyarlılık (recall) sağlayarak Random Forest'ı (%68,75) geride bırakmış ve Lojistik Regresyonun yüksek yanlış alarm oranını (Kesinlik 0,33) ortadan kaldırmıştır.

Sistem ayrıca, model olasılıklarından türetilen sürekli bir İçilebilirlik Puanı (0,00% - 100,00%) hesaplamakta ve suyu Güvenli (≥ %75), Orta Riskli (%40 - %74,99) ve Kritik Tehlike (< %40) kategorilerine ayırmaktadır. Dünya Sağlık Örgütü (WHO) ve EPA standartlarına dayalı kural motoru, tespit edilen kirlilik parametrelerine yönelik spesifik arıtma adımları (pH nötralizasyonu, koagülasyon, ters osmoz, aktif karbon vb.) önermektedir. Platform; Express.js/Node.js arka yüzü, Python mikro-çıkarım köprüsü, MongoDB veritabanı, React 18, Tailwind CSS, Recharts grafik kütüphanesi ve gerçek zamanlı "Ya Şöyle Olsaydı" (What-If) arıtma simülatörü içeren tam yığın bir web yazılımı olarak tamamlanmıştır.

Anahtar Kelimeler: Su Kalitesi Tahmini, Makine Öğrenmesi, Ekstrem Gradyan Artırma (XGBoost), Sentetik Azınlık Aşırı Örnekleme Tekniği (SMOTE), Kirlilik Erken Uyarı Sistemi, Karar Destek Sistemi.

## **ACKNOWLEDGEMENTS**
The authors would like to thank their research project supervisor Asst. Prof. Dr. Ali Karabaş for his unwavering support, helpful criticism, remarkable insight, and constant motivation during the whole process of this research and software design. The research and software design process can go much more smoothly due to the directions that Asst. Prof. Dr. Ali Karabaş provided for searching the related literature, testing the ML models, and validating the software in a strict way.

Authors also wish to gratefully thank the staff of the Software Engineering Department at the Faculty of Software Engineering, Hasan Kalyoncu University for rigorous engineering education and inspiring education.

Acknowledgement I would like to thank my peers, co-workers, and laboratory counterparts for their visionary technical conversations, code reviews, and feedback that contributed to the great architecture and usability of the Aqua Sense AI system.

Last, but by no means least, the authors are eternally grateful to their families for their tireless love, understanding, sacrifices and endless moral support during the trying journey through academia.

## **TABLE OF CONTENTS**
**DECLARATION OF ACADEMIC ETHICS	2**

**ABSTRACT	3**

**ÖZET	5**

**ACKNOWLEDGEMENTS	7**

**TABLE OF CONTENTS	8**

**LIST OF TABLES	11**

**LIST OF FIGURES	12**

**LIST OF SYMBOLS AND ABBREVIATIONS	13**

**1. INTRODUCTION	15**

1.1. Background and Motivation	15

1.2. Literature Review: Water Quality Modeling & Prediction	17

1.2.1. Traditional Water Quality Index (WQI) Formulations	17

1.2.2. Emergence of Machine Learning in Environmental Informatics	18

1.3. Machine Learning Techniques & Class Imbalance in Water Data	19

1.3.1. Tree-Based Ensemble Paradigms: Random Forest vs. XGBoost	19

1.3.2. The Pervasive Challenge of Extreme Class Imbalance	20

1.3.3. Prevention of Data Leakage in Preprocessing Pipelines	21

1.4. Limitations of Existing Approaches & Research Gaps	22

1.5. Objectives and Novel Contributions of AquaSense AI	23

1.6. Organization of the Thesis	24

**2. STATEMENT OF THE PROBLEM & PROJECT REQUIREMENTS	25**

2.1. Problem Definition and Real-World Domain Challenges	25

2.2. Criticality of Drinking Water Standards & Minority Contamination Risks	27

2.2.1. Toxicological Profile of Analyzed Water Parameters	27

2.3. Project Scope and Operational Boundaries	30

2.4. Software Requirements Specification (SRS)	31

2.4.1. Functional Requirements (FR)	31

2.4.2. Non-Functional Requirements (NFR)	32

2.5. Regulatory Standards, Security & Licensing Compliance	33

**3.** **SYSTEM ARCHITECTURE & METHODOLOGY	34**

3.1. End-to-End Research and Engineering Methodology Flowchart	34

3.2. Overall System Architecture	36

3.3. Water Quality Dataset & Feature Space Description	37

3.3.1. Feature Matrix (X) Specification	37

3.3.2. Target Variable (y) & Extreme Class Imbalance	38

3.4. Physical Parameter Ingestion and Boundary Validation	39

3.5. Leakage-Free Preprocessing Pipeline	40

3.5.1. Stratified 80/20 Train-Test Partitioning	40

3.5.2. SMOTE Resampling Implementation Strictly on Training Data	42

3.5.3. StandardScaler Normalization Pipeline	43

3.6. Predictive Machine Learning Architecture	44

3.6.1. Baseline Linear Model: Multinomial Logistic Regression	44

3.6.2. Bagging Ensemble Model: Random Forest Classifier	44

3.6.3. Gradient Boosting Champion: Extreme Gradient Boosting	45

3.7. Mathematical Formulation of Continuous Drinkability Scoring	46

3.8. Automated Water Quality Advisory & Remediation Engine	48

3.9. Full-Stack Web Application Engineering	50

3.9.1. Backend REST API Architecture & Python Child Process	50

3.9.2. Frontend Web Interface Architecture	52

3.9.3. Interactive Real-Time "What-If" Water Treatment Simulator	53

3.9.4. Production Software Implementation Code Examples	54

**4. EXPERIMENTAL RESULTS, PERFORMANCE EVALUATION & DISCUSSION	58**

4.1. Experimental Setup and Hardware/Software Environment	58

4.2. Comprehensive Model Performance Comparison	59

4.3. Detailed Classification Reports and Confusion Matrices	61

4.3.1. Model 1: Multinomial Logistic Regression Baseline	61

4.3.2. Model 2: Random Forest Classifier	61

4.3.3. Model 3: Extreme Gradient Boosting (XGBoost Champion)	63

4.4. Minority Class Detection Analysis (Moderate Contamination Recall)	65

4.5. Feature Importance Analysis and Environmental Explainability	66

4.6. System Latency, Computational Footprint & Efficiency	68

4.7. Full-Stack Dashboard Verification and User Testing	69

4.7.1. Preset Sample Scenario Testing	69

4.7.2. "What-If" Simulator Verification	70

**5. CONCLUSION AND FUTURE WORK	71**

5.1. Summary of Project Achievements	71

5.2. Environmental and Public Health Impact	72

5.3. Project Limitations	73

5.4. Future Work and Research Directions	74

**REFERENCES	75**

**APPENDICES	78**

APPENDIX A: REST API Endpoints Specification & JSON Schemas	78

A.1. Single Prediction Endpoint	78

A.2. Historical Records Query Endpoint	79

A.3. Analytics Summary Endpoint	79

APPENDIX B: Water Safety Thresholds & Advisory Rule Mappings	81

APPENDIX C: Styled Markdown & Code Examples Specification	83

## **LIST OF TABLES**
**Table** **2.1: WHO** **and** **US EPA** **Drinking** **Water** **Quality** **Standards** **and** **Toxicological** **Limits	29**

**Table** **2.2: SENG491** **Functional** **Requirements** **Traceability** **Matrix	31**

**Table** **2.3:** **Non-Functional** **Software** **Quality** **Attributes** **and** **Target** **Metrics	32**

**Table** **3.1:** **Laboratory** **Physical** **and** **Chemical** **Water** **Quality** **Parameters** **(X)	37**

**Table** **3.2:** **Ground** **Truth** **Target** **Variable** **Distribution (y)	38**

**Table 3.3: Preprocessing Data Partitioning and SMOTE Balance Transition	42**

**Table** **3.4:** **Automated** **Advisory** **Remediation** **Protocols** **for** **Detected** **Contaminants	49**

**Table** **3.5:** **MongoDB** **WaterRecord** **Document** **Schema** **Architecture	51**

**Table** **4.1: SENG491 Model** **Performance** **Benchmark** **on** **Unseen** **Held-Out** **Test Set	59**

**Table** **4.2:** **Classification** **Report** **for** **Multinomial** **Logistic** **Regression** **Baseline	61**

**Table** **4.3:** **Classification** **Report** **for** **Random** **Forest** **Classifier	62**

**Table** **4.4:** **Classification** **Report** **for** **Extreme** **Gradient** **Boosting** **(XGBoost** **Champion)	63**

**Table** **4.5:** **Feature** **Importance** **Gain** **Rankings** **for** **XGBoost** **Model	66**

**Table** **4.6:** **System** **Latency, Model Storage** **Footprint,** **and** **Computational** **Metrics	68**

**Table** **B.1: Complete** **Parameter** **Thresholds,** **Physiological** **Hazards** **&** **Remediation** **Protocol Mappings	82**

## **LIST OF FIGURES**
**Figure** **1.1:** **Conceptual** **Paradigm** **of AI-Driven** **Water** **Quality** **Monitoring** **vs.** **Delayed** **Laboratory** **Testing	16**

**Figure** **2.1: Multi-Tier** **Decision-Support** **Architecture** **for** **Contamination** **Early** **Warning	26**

**Figure** **3.1:** **End-to-End** **Research** **and** **Engineering** **Methodology** **Flowchart** **of** **the** **AquaSense** **AI Framework	34**

**Figure** **3.2: High-Level** **End-to-End** **System** **Architecture of** **AquaSense** **AI	36**

**Figure** **3.3:** **Leakage-Free** **Preprocessing** **Pipeline:** **Stratification, SMOTE (k=4),** **and** **StandardScaler	40**

**Figure 3.4: Continuous Drinkability Probability Scoring Decision Logic and Risk Boundaries	47**

**Figure** **3.5:** **Asynchronous** **Node.js Child** **Process** **Execution** **Bridge** **to** **Python** **Inference** **Engine	50**

**Figure** **3.6:** **React** **18** **Single-Page** **Application** **Interface** **Hierarchy** **and** **Component Architecture	52**

**Figure** **4.1:** **Performance** **Comparison** **of** **Candidate** **Models: Test** **Accuracy** **and** **Weighted** **F1-Score	60**

**Figure** **4.2:** **Confusion** **Matrix** **Heatmap** **for** **XGBoost** **Champion** **on** **the** **Unseen** **Test Set	63**

**Figure** **4.3:** **XGBoost** **Relative** **Feature** **Importance** **Gain** **Distribution** **across** **the** **8** **Laboratory** **Parameters	66**

**Figure** **4.4: Interactive "What-If"** **Water** **Treatment** **Simulation** **Workflow** **and** **Live** **Telemetry** **Feedback	69**

## **LIST OF SYMBOLS AND ABBREVIATIONS**


| **Abbreviation / Symbol** | **Definition** |
| :---: | :---: |
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| APHA | American Public Health Association |
| BOD | Biochemical Oxygen Demand (	ext{mg/L}) |
| CORS | Cross-Origin Resource Sharing |
| CSV | Comma-Separated Values |
| DO | Dissolved Oxygen (	ext{mg/L}) |
| EPA | Environmental Protection Agency (United States) |
| ES6 | ECMAScript 2015 (JavaScript Standard) |
| F1 | Harmonic Mean of Precision and Recall |
| FN | False Negative |
| FP | False Positive |
| GAC | Granular Activated Carbon |
| HTTP | Hypertext Transfer Protocol |
| IoT | Internet of Things |
| ISO | International Organization for Standardization |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| ML | Machine Learning |
| MVC | Model-View-Controller |
| NTU | Nephelometric Turbidity Units |
| PAC | Polyaluminum Chloride |
| pH | Potential of Hydrogen (−log [H⁺]) |
| REST | Representational State Transfer |
| RF | Random Forest |
| RO | Reverse Osmosis |
| SHAP | SHapley Additive exPlanations |
| SMOTE | Synthetic Minority Over-sampling Technique |
| SRS | Software Requirements Specification |
| TDS | Total Dissolved Solids |
| TN | True Negative |
| TP | True Positive |
| UI / UX | User Interface / User Experience |
| UV | Ultraviolet |
| WHO | World Health Organization |
| WQI | Water Quality Index |
| XGBoost | Extreme Gradient Boosting |
| X | Feature Matrix (n × d) |
| y | Target Label Vector |
| P(c) | Predicted Posterior Probability for Class c |
| ω꜀ | Weight Assigned to Class c in Continuous Drinkability Formulation |
| k | Number of Nearest Neighbors in SMOTE Resampling (k=4) |
| μ | Empirical Mean Vector in Feature Standardization |
| σ | Empirical Standard Deviation Vector in Feature Standardization |
# **1. INTRODUCTION**
## **1.1. Background and Motivation**
Water is fundamental to maintaining human health, production of food, industrial output and biodiversity conservation. As per world health assessments done by WHO, over two billion people live in areas of water scarcity and billions more are exposed to drinking water sources contaminated with fecal matter, toxic heavy metals, microbiological contaminants, excessive turbidity and chemical runoff [5]. In 2015, the United Nations adopted a set of 17 Sustainable Development Goals (SDGs), one of which was access to safe, affordable drinking water by 2030 (SDG 6). However, rapid urbanization, extensive use of pesticides in the current agricultural practices and industrial effluents discharge have persistently contaminated surface water bodies, river basins, and underground aquifers [20], [26].

In traditional Municipal/Environmental Management paradigm, Water Quality Assurance Procedures involves Manual Grab-Sampling & Centralized Laboratory Testing [28]: Field technicians collect water samples from field sites and ship them to central labs for physical, chemical & biological analysis. Although lab analysis methods-inductively coupled plasma mass spectrometry for heavy metals, titration for biochemical oxygen demand, membrane filtration for microbial pathogens-are accurate, they have key inherent operational flaws:

1. Traditional lab processing takes 24 to 72 hours-and even extends up to five days for 5-day BOD (BOD₅) testing-to incubate, digest and enumerate pollutants [27]. In this delay of several days while processing the sample, contaminated waters can travel through municipal pipe networks or natural river sections, exposing thousands of consumers to potential life-threatening dangers before a warning can be disseminated.

2. Continuous physical sampling needs cost-prohibitive chemical reagents [7], [28], field equipment, climate-controlled trucking logistics, and high-skilled laboratory chemists. [7], [28]. Municipalities with fewer financial resources and developing countries are unable to sustain high-rate sampling across distributed hydrological nodes.

3. Conventional Laboratory assays only yield retrospective information, revealing what was in the water days back, but nothing at all about the potential shift of contamination plume, upstream dumps, or seasonal pollution spikes [1], [8].

The rapid development of environmental informatics, IoT sensors and ML creates a unique chance to upgrade water safety and security management [12], [24]. Converting multi-parametric water sensor data streams (pH, Turbidity, Temperature, Dissolved Oxygen, heavy metal concentrations and others) into continuous risk metrics and early-warning triggers enables intelligent decision-support software to detect pollution incidents in milliseconds rather than days [17], [20]. This Master thesis produces Aqua Sense AI, a complete end-to-end intelligent water quality prediction and contamination early-warning system that address these key latency, predictive and decision-support problems.

![]()*Figure 1.1: Conceptual Paradigm of AI-Driven Water Quality Monitoring vs. Delayed Laboratory Testing*

## **1.2. Literature Review: Water Quality Modeling & Prediction**
Environmental scientists and computational engineers have been working in this area for 50 years and have brought together all different kinds of measurements into single systems that can be integrated into an overall water health score using mathematical algorithms.
### **1.2.1. Traditional Water Quality Index (WQI) Formulations**
The conceptual underpinnings of modern water quality assessment concepts can be traced back to the pioneering work of Horton (1965), who constructed the first WQI based on 10 commonly measured water quality parameters and assigned it empirical weights according to the importance of the parameters to human health [15]. Brown et al. (1970) soon thereafter, developed the first nationally based WQI-the National Sanitation Foundation Water Quality Index (NSFWQI) with the United States National Sanitation Foundation [14], which combined the parameter-specific sub-index curves representing the measured analytical parameters with the normalized sub-scores (0-100) by means of an averaged weighted arithmetic mean:

Where qI = sub index rating of parameter i and wI = weight of unit with of parameter i, such that wI = 1.

Current versions are the Canadian Council of the Ministers of the Environment Water Quality Index (CCME WQI) which combines 3 different factors; scope (F 1, the proportion of variables whose values do not meet guidelines), frequency (F 2, the proportion of individual tests that exceed guideline levels), and amplitude (F 3, the normalized amount by which exceeded tests surpass safe limits) [7]. Although traditional WQI indices offered public health decision makers a common simplified summary index, recent publications in Water Research [1] and Journal of Environmental Management[7] detail the technical drawbacks of these indices:

•  Weights assigned by experts are often anthropogenic and do not take into account ecological differences across regions [1], [8].

•  Eclipsing and ambiguity effects: Weighted arithmetic, by default, severely toxic levels of one metal (Lead or Arsenic) can be eclipsed by pristine pH and Dissolved Oxygen values, artificially producing a "fair" or "moderate" overall score [7], [29].

•  Empirical equations presuppose static relationships and cannot accommodate multi-factor chemical interactions, temperature-variable solubility changes, and synergies between industrial pollutants [1], [17].
### **1.2.2. Emergence of Machine Learning in Environmental Informatics**
Ultimately, environmental scientists gravitated towards the use of machine learning to eliminate the inherent flaws of empirical WQI equations, beginning with classical linear models and MLPs. In the first machine learning validation study of the Perak River basin, Hameed et al (2017) found neural network models to outperform multiple linear regression in downstream WQI prediction with strong correlation coefficients (R > 0.91) [8]. Likewise, Aldhyani et al (2020) analyzed the performance of ANN and SVM in water quality classification with the results indicating strong success of kernel learning over conventional chemical boundaries [9].

Leong et al. (2019) studied river water classification by SVMs with radial basis function (RBF) kernels, concluding that while SVMs can generalize well on small sample sizes, training latency-growing with the square of the sample size-limits their deployment in real-time edge conditions [10]. Rajaee et al. (2019), in a systematic review of AI use cases in environmental modeling, noted an almost universal trend of tree-based ensemble algorithms outperforming individual neural networks on structured tabular data for environmental modeling, with the ensemble algorithms more robust to multi-collinearity and parameter noise [24]. Explainable AI (XAI) - including SHapley Additive exPlanations (SHAP) developed by Lundberg and Lee [19] - have been used to analyze environmental feature importance for quantitative accounting. Deep neural networks and sequential, time series-appropriate models reviewed by Fawaz et al. [25] have demonstrated similar prospects using dense time-series telemetry.

A comparative review of recent landmark studies, freely available online in Science Direct, has revealed the ascendancy of gradient boosting architectures within water resource engineering. Ding et al. (2023) put game theory and the LightGBM gradient boosting algorithm in concert to define an adaptive Water Quality Index for the Chaobai River Basin, and the authors showed that gradient boosted trees address the subjective problem of empirical weights while retaining an R² above 0.96 [1]. Even better performance with less root mean square error (RMSE) has been attained with swarm-optimized XGBoost in contrast to random forests and artificial neural networks in modeling complex river water chemistry [11].

## **1.3. Machine Learning Techniques & Class Imbalance in Water Data**
### **1.3.1. Tree-Based Ensemble Paradigms: Random Forest vs. XGBoost**
Machine learning methodologies on tabular data sensor is primarily used in two leading ensemble learning techniques: Bagging (Bootstrap Aggregating) and Boosting.

• Random Forest randomly generates an ensemble of correlated decision trees in which each has been trained on a bootstrap sample of the original training set using a subset of features at each split [4]. It then makes its classification according to the number of votes it received:

Random Forests combat overfitting and high dimensional feature spaces [21], but the parallel bagging format of the Random Forest algorithm does not lend itself to focusing on previously misclassified samples [2].

•  Extreme Gradient Boosting (XGBoost): Developed by Chen and Guestrin (2016) [2], XGBoost is an efficient scalable implementation of gradient boosted decision trees. [2] Whereas Random Forest constructs multiple decision trees in parallel, XGBoost constructs each decision tree sequentially in an additive (stage-wise) fashion, where each tree fₜ(x) is trained on the pseudo-residuals (gradients) of the loss function of the previous training iterations:

Where Ω(fₜ) = γT + ½λ wⱼ 2 is the explicit model complexity regularization term that penalizes leaf number T and leaf weights wⱼ of a decision tree [2]. XGBoost uses second order Taylor expansion of the loss function, step-wise shrinkage (η), column sub-sampling and an exact greedy algorithm for split finding. Due to these techniques XGBoost achieves state-of-art prediction accuracy and better resistance to overfitting on tabular data from environments [11], [20].

### **1.3.2. The Pervasive Challenge of Extreme Class Imbalance**
One of the key features of monitoring in a real environment is the very significant class imbalance [18]. In natural river environments, and municipal distribution reservoirs, clean potable water (class 0) and highly treated baseline effluent (class 2) are present in the vast majority of the historical record. Medium-range contamination events, e.g., medium sewage discharges and industrial chemical leaks (class 1), are short lived and occur very rarely, less than 10% of the time [17], [18].

Training normal ML classifiers directly on imbalanced environmental data tends to optimize for the majority class [18]. As a result, the classifier becomes extremely biased toward favoring the majority class in its predictions, attaining high overall accuracy rates (>90%) while failing catastrophically to detect even a single instance of a rare but dangerous contamination event (False Negative = 1 or O]8], [23].

3 To mitigate this problem, Chawla et al. (2002) introduced Synthetic Minority Over-sampling Technique (SMOTE) [3]. Instead of copying minority examples (which results in worse overfitting), SMOTE generates new, borderline more realistic examples in between the k nearest neighbors of minority class points along the k lines in a multi-dimensional feature space:

Where xᵢ is a minority instance, x_zi is one of the minority instances in the k-neighbors of xᵢ, and λ is a random scalar number between 0 and 1 [3], [23]. Fernandez et al. (2018) performed a 15-year retrospective analysis of imbalanced learning and concluded that SMOTE is still one of the most mathematically sound and effective resampling approach in engineering and environmental fields [23].

### **1.3.3. Prevention of Data Leakage in Preprocessing Pipelines**
One of the major methodological errors that is detected in the literature is data leakage in the preprocessing step [13]. Data leakage in machine learning refers to any use of statistical information, distributional data or synthetic data that has been derived from the test (or validation) set during model training [13]. As clearly defined by Kaufman et al. (2012), when the dataset as a whole is resampled (synthetic variants of the data using SMOTE, for example) or transformed (Standard Scaler to find the mean of the dataset, for example) as a single batch prior to data partitioning (at the train/test step), then the model suffers from severe positive bias, and results in performance that is not reproducible or generalizable [13].

1. It was split into training (80% of original data) and test (20%) folds by stratified sampling approach to maintain the class ratio [13], [22].

2. Resampling algorithms (SMOTE) should only be applied to the training fold, as the test fold should be untouched ground truth at 100% [13].

3. The normalization parameter (mean μ and standard deviation σ) should be calculated strictly on the resampled training fold and then applied as fixed transformations to both folds [13], [22].

## **1.4. Limitations of Existing Approaches & Research Gaps**
While a large amount of research into machine learning for water quality monitoring has been performed, there remains a notable disconnect between offline models and scalable, potentially implementation-ready software [12], [20]:

1. Most of the numerous other academic references on the subject that exist treat water safety as an extremely coarsely-binned (ie. [17], [20]) binary classification task (Potable vs. Non-Potable). In actual municipal water operations, water is not an all-or-nothing proposition and operators need a normalized, graduated confidence metric (0% - 100%) of the precise safety margin, and whether water quality is more likely to be mildly or severely contaminated.

2. Past predictive tools stop with the creation of a classification label or index number [8], [10]. In other words, they do not empower the plant operator with specific, concrete, actionable treatment instructions for how to neutralize the identified pollutant through each relevant physical or chemical treatment process (pH neutralization, chemical coagulation, reverse osmosis, activated carbon, etc.).

3. A majority of environmental machine learning work is confined to off-line Jupyter notebooks or script environments [20]. Water operators and laboratory personnel do not have an interactive web dashboard they can use to examine real-time laboratory telemetry alongside interactive "What-If" treatment simulations to identify the reductions in key parameters needed to make water drinkable, prior to costly chemical treatment.

## **1.5. Objectives and Novel Contributions of AquaSense AI**
In order to fill these existing gaps in science and engineering, this graduation project designs, develops and tests the Aqua Sense AI software platform. The main contributions can be summarized as follows:

•  Maintains a strict leakage-free data pipeline with 80/20 stratified partitioning, training-fold-only SMOTE (k=4) expansion, and normalized feature scaling to ensure provable, realistic model generalization.

•  Runs, trains, and performs standard benchmark tests on three different architectural paradigms-Multinomial Logistic Regression (Baseline), Random Forest (Bagging), and Extreme Gradient Boosting (XGBoost Champion)-descriptors of test accuracy, Macro F1, Weighted F1, minority recall, and inference latency.

•  Creates a continuum, calibrated drinkability score (0.00% - 100.00%) based on multi-class posterior prediction probabilities to address the crudety of binary labels.

•  Rule-Based Automated Remediation Engine: Incorporates official drinking water standards from WHO and US EPA into an advisory rule engine that links contaminated parameters to recommendations for industrial treatment of water.

•  Enterprise-Grade Full-Stack Web Platform: Develops a new, production-grade web application that consists of a Node.js/Express REST API, an async child-process Python inference bridge, MongoDB document persistence, an interactive React 18 single-page app with telemetry charts, batch JSON ingestion, and a real-time "What-If" water treatment simulator.

## **1.6. Organization of the Thesis**
This graduation thesis is organized into five comprehensive chapters:

•  Chapter 1 (Introduction & Literature Review): Describes world wide freshwater situation, inefficiency of traditional laboratory tests, existing WQI literature reviews, WQI formulation and machine learning algorithms, class imbalance, and project objectives.

•  Chapter 2 (Statement of the Problem & Project Requirements): Derives the domain problem, reviews toxicological threats imposed by the eight laboratory parameters, defines the project scope, and specifies the Software Requirements Specification (SRS) and standards and regulations.

•  Chapter 3 (System Architecture & Methodology): Explains the end-to-end software architecture, including the 1,000-sample certified data set, the leakage-free preprocessing pipeline, the math behind the candidate models and continuous scoring, the automated remediation engine, and all of the full stack software implementation.

•  Chapter 4 (Experimental results, performance evaluation & discussion): Includes the empirical benchmark comparison for all candidate models, classification report and confusion matrices, minority class recall, XGBoost feature importance, latency, and UI validation.

•  Chapter 5 (Conclusion and Future Work): Concludes with a synopsis of engineering accomplishments, environmental challenges, software constraints, and future work outlining directions such as IoT telemetry, geospatial GIS mapping.

•  References & Appendices: Fully listed academic references, and technical details for the REST API and water safety levels.

# **2. STATEMENT OF THE PROBLEM & PROJECT REQUIREMENTS**
## **2.1. Problem Definition and Real-World Domain Challenges**
All freshwaters of the world are exposed to unparalleled pollution pressure, driven by the rapid rate of industrialization, the insufficient sewage treatment, and the use of agricultural fertilizers and pesticides [26]. As soon as drinking water sources for towns or villages are contaminated with industrial waste or pathogens, consequences for public health are rapid, large and catastrophic [20]. Millions of people every year suffer from waterborne infections, long-term heavy metal intoxication and epidemics of alimentary diseases [5], [26].

Traditional methods of water quality control, incorporating environmental monitoring networks, depend on manual grab-sampling procedures compliant with classical environmental standards [28]. Field technicians physically retrieve samples from geographically distributed sections of the river, tanks, or municipal water source points and deliver them to a central laboratory for analysis. While analytical techniques (spectrometry, gas chromatography, plate count, etc.) offer high accuracy, are subject to hard structural limitations that critically undermine rapid response to public health concerns [26], [27]:

1. Certified chemical digestion, biological incubation takes 24 to 72 hours, or five days in the case of routine BOD5 analysis [27]. In the event of an acute pollution incident, which can occur during the bursting of a chemical tank, the dumping of industrial waste into water bodies or due to a toxic spill of mine tailings, the water takes only hours to reach the municipal distribution pipes, and eventually human homes. If there is a delay of two to three days in reporting, exposure to toxins will already have affected the majority of the population.

2. Logistical and financial burden: Sustaining frequent sampling times/locations in space and time imposes continuous costs for refrigerated transport vehicles, licensed chemicals, and analytical professionals [7], [28]. As a result, water utilities take infrequent samples (e.g., once weekly or monthly), and large periods between periods of surveillance are left wide open for short-lived contamination events.

Water is not characterized by one single metric [1], [27], but appears as a complex, non-linear interaction among physical parameters (turbidity, temperature), chemical equilibria (dissolved oxygen, pH, biological oxygen demand) and trace toxic metals (lead, mercury, arsenic) [1]. Determining operational parameters based on multi-parameter laboratory reports is onerous for facility operators, who would prefer a decision-support system that does the calculations automatically.

![]()

*Figure 2.1: Multi-Tier Decision-Support Architecture for Contamination Early Warning*

## **2.2. Criticality of Drinking Water Standards & Minority Contamination Risks**
In order to safeguard public health, strict maximum contaminant levels (MCL) have been implemented by regulatory agencies like WHO and US EPA for consumption of drinking water [5], [16].
### **2.2.1. Toxicological Profile of Analyzed Water Parameters**
Aqua Sense AI tests for the following eight individual criteria of physical, chemical and heavy metals:

• A logarithmic scale from 0 to 14 indicating the ratio of hydrogen (H) to hydroxyl (OH) ions [28]. When water has a pH lower than 6.5, it is corrosive and acidic, thus rapidly dissolving toxic heavy metals (lead, copper) from municipal plumbing pipes and irritating the gastrointestinal system [5]. When the pH is higher than 8.5, it is overly alkaline, leading to mineral scale formation on heat exchangers, a bitter taste and a dramatic loss of the germ killing powers of free chlorine as a disinfection [5], [16].

• Turbidity (NTU): Water turbidity is associated with suspended colloids, silt, decomposed organic matter and microscopic life forms [28]. In addition to degrading the visual quality of water, turbid waters ( 5.0 NTU) offer physical protection and binding surfaces for disease-causing bacteria, virus and protozoan cysts from UV light and chemical disinfection [5], [28].

• Water Temperature (°C): Regulates basic kinetics of chemical reactions, rates of mineral dissolution and biological metabolic activity of biological systems [27]. Increased temperatures (above 25°C) decrease the physical saturation solubility of oxygen and enhance bacterial growth and biofilm formation in distribution pipes [26].

• Dissolved Oxygen (DO, mg/L): Reflects the concentration of free, non-compound O₂ dissolved in water [28]. Pristine natural waters maintain DO levels between 7.0 and 9.0 mg/L. A decline below 5.0 mg/L signifies organic pollution, microbial decomposition, or severe stagnation, resulting in foul anaerobic odors (H₂S) and ecological asphyxiation [27].

• Biochemical Oxygen Demand (BOD, mg/L): The amount of oxygen utilized by biological activity of bacteria in decomposing organic substances over a 5-day period in a standard test method [27]. Very high quality drinking water contains usually less than 2.0 mg/L BOD with values higher than 5.0 mg/L indicating serious organic pollution from untreated human sewage, agricultural manure run-off, or Food-processing industry waste [26], [27].

• Lead (Pb, mg/L): A neurotoxic heavy metal that can leach into water from the deterioration of corroded lead-service lines, brass fittings and industrial battery manufacturing waste [5], [29]. Lead, which becomes trapped in the bones, results in lifelong brain damage, behavioural issues, and disabilities in children and kidney failure and high blood pressure in adults [5], [16]. The WHO maintains an unwavering total safety standard of 0.010 mg/L (10 μg/L) [5].

• Mercury (Hg, mg/L): A highly toxic heavy metal industrial waste from chlor-alkali chemical factories, mining, and air pollution from fossil-fuel burning [26], [29]. Inorganic mercury compounds are bio-converted into methylmercury, which is more neuro-toxic and easily crosses blood-brain and placental barriers resulting in severe neurological ataxia, numbness, and teratogenic fetal malformations (Minamata disease) [5]. The maximum permissible concentration of mercury in drinking water is globally regulated by the standard value of 0.006 mg/L [5], [16].

• Arsenic (As, mg/L) was a toxic semi-metalic element that was leached from the mining areas in these regions, and through use of contaminated insecticides in agricultural applications [29]. Arsenic intake in excess of 0.010 mg/L on a chronic basis produces serious skin lesions (hyperkeratosis, skin pigmentation), peripheral vascular gangrene ("blackfoot disease"), as well as increased rates of skin, bladder, lung and kidney cancers [5], [29].

*Table 2.1: WHO and US EPA Drinking Water Quality Standards and Toxicological Limits.*

| **Parameter** | **Unit** | **Safe Range / Guideline** | **Primary Environmental & Health Impact** | **Governing Authority** |
| :---: | :---: | :---: | :---: | :---: |
| pH Level | pH scale | 6.5 – 8.5 | Acidic: pipe corrosion & metal leaching. Alkaline: scaling & low chlorination. | WHO [5], EPA [16] |
| Turbidity | NTU | ≤ 5.0 | Suspended particles shield microbes; degrades chlorination efficacy | WHO [5], EPA [16] |
| Temperature | °C | 15.0 – 25.0 | Regulates gas dissolving, the growth of biologicals and the acceptability of taste | WHO [5], APHA [28] |
| Dissolved Oxygen | mg/L | ≥ 5.0 | Decreased DO signifies stagnation, septic and organic degradation | WHO [5], EPA [16] |
| BOD | mg/L | ≤ 5.0 | High BOD indicates domestic sewage, food waste, or agricultural runoff | WHO [5], EPA [16] |
| Lead (Pb) | mg/L | ≤ 0.010 | Lost vision and deafness irreversible neurotoxicity, learning difficulties in children, kidney damage | WHO [5], EPA [16] |
| Mercury (Hg) | mg/L | ≤ 0.006 | Severe neurotoxic injury, ataxia, developmental and teratogenic abnormalities | WHO [5], EPA [16] |
| Arsenic (As) | mg/L | ≤ 0.010 | Carcinogenic; induces hyperkeratosis, black foot disease and cancer of body organ. | WHO [5], EPA [16] |
## **2.3. Project Scope and Operational Boundaries**
Per official Hasan Kalyoncu University SENG491 Capstone Project Proposal the project scope includes:

1. Fetching of certified multi-variable water quality data, checking data against physical ranges, sanitising input vectors, and executing a tight, leakage-free data split and resampling pipeline.

2. Machine Learning Model Benchmarking: training, tuning, and testing at least one baseline machine learning model (Multinomial Logistic Regression) and two advanced machine learning models (Random Forest, XGBoost) on a hold-out, untouched test dataset.

3. Mapped continuous score and operational risk classification: Derive a mathematical function that converts the multi-class model output probabilities into a continuous Drinkability Score (0% - 100%) and operational risk levels (Safe, Moderate, Critical).

4. Automated Advisory Engine: Building an automated decision-support rule engine based on WHO and EPA drinking water standards to recommend actionable physical/chemical treatment protocols.

5. Complete Stack Software platform End-to-end web platform with an Express.js / Node.js REST backend, persistence with MongoDB and a responsive React single-page dashboard that includes batch processing and an interactive "What-If" simulator.

## **2.4. Software Requirements Specification (SRS)**
### **2.4.1. Functional Requirements (FR)**
The functional requirements represent core system behaviors and software capabilities:

*Table 2.2: SENG491 Functional Requirements Traceability Matrix.*

| **Requirement ID** | **Requirement Name** | **Description & Acceptance Criteria** |
| :---: | :---: | :---: |
| FR-01 | Parameter Validation | Ensure all eight water parameters are within physical limits (0 ≤ pH ≤ 14, non-negative chemical bounds) upon ingestion. |
| FR-02 | Leakage-Free Pipeline | Run 80/20 stratified split before applying SMOTE (k=4) only on training fold without using test data. |
| FR-03 | Multi-Model Benchmark | Implement and compare training and validation of Multinomial Logistic Regression, Random Forest, and XGBoost; tag the best model automatically by Weighted F1. |
| FR-04 | Continuous Scoring | Compute a continuous Drinkability Percentage (0.0% – 100.0%) based on the calibrated class probabilities with weightings for each tier. |
| FR-05 | Advisory Engine | Compare limits for WHO/EPA sets to develop particular chemical/physical remedial guidance for each infraction identified. |
| FR-06 | Historical Telemetry | Persist test records, metadata, predicted scores, and risk classifications into MongoDB; serve paginated audit queries and stations summaries. |
| FR-07 | Batch JSON Ingestion | Enables automated parsing, multi-record validation, and sequential batch inference for multi-sample JSON arrays. |
| FR-08 | What-If Simulator | Allow operators to modify parameter values via sliders and instantly see the recalculated scores in an interactive, client-side simulator. |

### **2.4.2. Non-Functional Requirements (NFR)**
Non-functional requirements specify quality attributes, computational constraints, and performance targets:

*Table 2.3: Non-Functional Software Quality Attributes and Target Metrics.*

| **Metric Category** | **Requirement ID** | **Target Specification & Evaluation Metric** |
| :---: | :---: | :---: |
| Performance | NFR-01 | Python ML child-process inference execution must be completed in < 20 ms (measurement: 8 ms). |
| Latency | NFR-02 | End-to-end HTTP REST API request-response round trip must complete in < 100 ms (measurement: 42 ms). |
| Storage Footprint | NFR-03 | Serialized artifacts of ML model and preprocessor (artifact) must be small enough (< 1.0 MB, actual: 300 KB). |
| Security & Auth | NFR-04 | Secure analytic and prediction endpoints using stateless JSON Web Tokens (JWT) and bcrypt password hashing (10 salt rounds). |
| Data Integrity | NFR-05 | Ensure stringent Mongoose schema validation, preventing invalid, incomplete, or out-of-bounds parameter storage. |
| Portability | NFR-06 | Supports all existing web browsers, (Chrome, Firefox, Safari, Edge), without the need for client plugins. |
## **2.5. Regulatory Standards, Security & Licensing Compliance**
AquaSense AI complies with relevant scientific standards and open-source software licenses:

•  ISO 5667 Water Sampling Guidance: Conforms to ISO 5667-1 (guidance on the design of sampling programs) [6] and ISO 5667-3 (preservation and handling of water samples) [30].

•  WHO Guidelines for Drinking-water Quality: Incorporates numerical safety limits and toxicological risk management principles defined in the WHO 4th Edition [5], [29].

•  Software Licensing: Built entirely using open-source, commercially viable licenses: Python Software Foundation License, scikit-learn and pandas (BSD-3-Clause), React 18, Vite, and Express.js (MIT License), and MongoDB Community Edition (SSPL).


## **2.6. Tools and Technologies Used**
The AquaSense AI platform was developed utilizing a modern, decoupled full-stack architecture integrated with production-grade scientific computing and machine learning libraries. Table 2.4 specifies the core software stack, libraries, execution roles, and verified versions deployed across the system.

*Table 2.4: Tools, Libraries, and Technology Stack Specifications.*

| **Layer / Domain** | **Technology / Tool** | **Version** | **Operational Purpose & Rationale** |
| :--- | :--- | :---: | :--- |
| **Machine Learning Core** | Python | 3.12.3 | Core scientific computing and machine learning runtime environment. |
| **Data Processing** | NumPy & Pandas | 2.2.0 / 2.2.2 | In-memory multidimensional tensor manipulation and tabular dataset analysis. |
| **Statistical ML** | Scikit-Learn | 1.6.0 | Preprocessing, StandardScaler normalization, Logistic Regression, Random Forest, and Isolation Forest anomaly detection. |
| **Class Imbalance** | Imbalanced-Learn | 0.13.0 | Implementation of Synthetic Minority Over-sampling Technique (SMOTE with $k=4$). |
| **Champion Model** | XGBoost | 3.4.1 | Extreme Gradient Boosting classifier delivering high-performance minority contamination recall. |
| **Model Persistence** | Joblib | 1.4.2 | High-throughput binary serialization and deserialization for model pipelines (`.pkl`). |
| **Backend Runtime** | Node.js & Express.js | 18.20.4 / 4.19.2 | Asynchronous event-driven RESTful API server coordinating HTTP traffic and auth guards. |
| **Process Bridge** | Node.js Child Process | Built-in | Subprocess spawning bridge (`child_process.spawn`) executing isolated Python inference routines. |
| **Database & ODM** | MongoDB Atlas / Mongoose | 7.0 / 8.3.0 | Cloud document database persisting time-series sensor assays, historical records, and user schemas. |
| **Security & Auth** | JWT & Bcrypt.js | 9.0.2 / 2.4.3 | Stateless JSON Web Token authentication guards, password hashing, and CORS whitelist policy. |
| **Frontend Framework** | React 18 & Vite | 18.3.1 / 5.2.0 | Single-page reactive user interface with component-driven architecture and fast HMR bundling. |
| **Styling & Icons** | Tailwind CSS / Lucide | 3.4.3 / 0.378.0 | Utility-first responsive CSS styling with clean vector iconography. |
| **Data Visualization** | Recharts | 2.12.6 | Composable SVG time-series charts, radar plots, and interactive gauges for dashboard telemetry. |

## **2.7. Project Cost and Economic Feasibility Analysis**
Deploying an intelligent decision-support system must be economically justified against traditional laboratory monitoring methodologies. Traditional municipal water compliance relies on scheduled manual grab sampling followed by wet-chemistry laboratory analysis, incurring substantial labor, chemical reagent, and operational overhead. Table 2.5 details the full capital expenditure (CapEx) and operational expenditure (OpEx) for AquaSense AI, followed by a comparative financial analysis against conventional testing regimes.

*Table 2.5: Detailed Project Cost Breakdown and Economic Feasibility.*

| **Cost Category** | **Resource Item** | **Provider / Specification** | **Billing Unit** | **Estimated Cost (USD)** |
| :--- | :--- | :--- | :---: | :---: |
| **Compute & API Server** | Virtual Private Server / Container | 2 vCPU, 4GB RAM Cloud Instance | Monthly | $14.00 / month |
| **Managed Database** | MongoDB Atlas M10 Cluster | 10GB Cloud Storage, Automated Backups | Monthly | $15.00 / month |
| **Model Inference Tier** | Co-located Python 3.12 Runtime | Shared Local Compute Footprint | Monthly | $0.00 (Included) |
| **Domain & SSL/TLS** | Fully Qualified Domain & Certificate | Let's Encrypt TLS / Custom DNS | Annual | $12.00 / year |
| **Total Cloud OpEx** | **Standard Cloud Infrastructure** | **Full 24/7 Production Deployment** | **Annual** | **$360.00 / year** |
| *Traditional Lab Analysis* | Weekly 8-Parameter Laboratory Assay | Standard Certified Wet-Chemistry Lab | $100 / test | $52,000 / year |
| **Net Operational Savings** | **AquaSense AI Automated Platform** | **520 automated assessments/year** | **Annual** | **> $51,600 / year (>99% Savings)** |

As demonstrated by the cost model, AquaSense AI reduces analytical expenditure by over 99% compared to commercial laboratory testing while slashing turnaround latency from 48 hours to under 20 milliseconds, confirming profound commercial and civic feasibility.

# **3. SYSTEM ARCHITECTURE & METHODOLOGY**
## **3.1. End-to-End Research and Engineering Methodology Flowchart**
The general approach underlying the Aqua Sense AI platform combines principles from environment informatics, machine learning theory, toxicity regulatory standards, and software engineering as a cohesive, real-time, decision-support system. As depicted in Figure 3.1, the engineering pipeline contains five phases that are carried out sequentially and in strict adherence to the principles of scientific inquiry in order to prevent artefacts of an experiment, e.g., data leakage.

![]()*Figure* *3.1:* *End-to-End* *Research* *and* *Engineering* *Methodology* *Flowchart* *of* *the* *AquaSense* *AI Framework*

The production pipeline depicted in Figure 3.1 runs as follows: Phase 1 (data collection) entails multi-parameter physical telemetry ingestion and boundary validation for eight vital lab markers, namely pH, Turbidity, Dissolved Oxygen, BOD, Lead, Mercury, Arsenic and Temperature. In Phase 2 (decontamination) the dataset is strictly leakage-free preprocessed by train/validation dataset split prior to application of SMOTE(4-Nearest-Neighbors), with the Standard Scaler normalizer fit only to the training distribution. Phase 3 (modeling) experiments with multi-model, multi-metric benchmarking over baseline linear, bagging ensemble and gradient boosting architecture, before serializing the top performing XGBoost pipeline. Phase 4 (output) generates calibrated multi-class probabilities and linearly combines over operational categories (safe, moderate, critical) into a continuous Drinkability Score (0.0 - 100.0%). Finally, Phase 5 (services) provides a graphical user interface that serves deterministic chemical prescriptions (WHO, US EPA maximum contaminant levels) coupled with full-stack enterprise web deployment, consisting of a REST API expressed in Express.js, Python inference bridge, document persistence in MongoDB and React 18 interactive simulation dashboard.

## **3.2. Overall System Architecture**
Aqua Sense AI is developed as a business level, multi-tier web application for ingesting sensor data in real time, high concurrent predictive analytics and autonomous decision making. The complete architecture consist of four loosely coupled execution layers, as shown in Figure 3.2:

![]()*Figure* *3.2: High-Level* *End-to-End* *System* *Architecture of* *AquaSense* *AI*

## **3.3. Water Quality Dataset & Feature Space Description**
The machine learning pipeline is constructed with a validated environmental water quality data set of exactly 1,000 multi-variable laboratory records. Each water sample record encapsulates a sample, an eight-factor water sample's physical and chemical measurements, an administrative series and sample number, and a governmentized target label.
### **3.3.1. Feature Matrix (X) Specification**
The feature vector x present in the space R n consists of physical and chemical parameters which have the certification:

*Table 3.1: Laboratory Physical and Chemical Water Quality Parameters (X).*

| **Feature Index** | **Parameter Name** | **Representation Key** | **Physical Unit** | **Description & Environmental Role** |
| :---: | :---: | :---: | :---: | :---: |
| 1 | Potential of Hydrogen | `pH` | pH scale (0–14) | An overall indication of the activity of hydrogen ions (acidity / alkalinity) |
| 2 | Turbidity | `Turbidity (NTU)` | NTU | Waterclarity-concentration of suspended particles. |
| 3 | Temperature | `Temperature (°C)` | °C | Thermal condition controlover gas solubility, and biological kinetics |
| 4 | Dissolved Oxygen | `DO (mg/L)` | mg/L | Free molecular oxygen dissolved in water |
| 5 | Biochemical Oxygen Demand | `BOD (mg/L)` | mg/L | Quantity of oxygen used by microorganisms to breakdown organic matter |
| 6 | Lead Concentration | `Lead (mg/L)` | mg/L | Concentration of dissolved neurotoxic heavy metals |
| 7 | Mercury Concentration | `Mercury (mg/L)` | mg/L | Dissolved bioaccumulative heavy metal concentration |
| 8 | Arsenic Concentration | `Arsenic (mg/L)` | mg/L | Concentration of dissolved toxic metalloid |
Submission metadata fields (Timestamp and Location) are intentionally removed from the model feature matrix prior to model training. This design choice serves to inhibit the machine learning algorithms from learning spurious spatial or temporal correlations, and encourages all model inferences to be based exclusively on the physical and chemical water properties. Metadata fields are retained in MongoDB for location-based filtering and trend chart generation on the frontend.
### **3.3.2. Target Variable (y) & Extreme Class Imbalance**
The Y (ground truth) target variable describes the multi-class operational state of the water sample (Pollution_Level), represented in the three discrete states:

• Class 0 (Clean / Potable Water): Completely safe water is considered to be safe for direct human consumption with pristine chemical balance.

• Class 1 (Moderate Contamination): Water with increased turbidity, moderate decay, or somewhat borderline deviations in chemicals; safe for use following common municipal treatment.

• Class 2 (Severely Polluted): Water with very dangerous heavy metal levels, very low dissolved oxygen levels, or very high organic loads; definitely unsafe for drinking without advanced purification.

*Table 3.2: Ground Truth Target Variable Distribution (y).*

| **Class Label** | **Category Name** | **Raw Sample Count** | **Class Proportion (%)** | **Operational Imbalance Ratio** |
| :---: | :---: | :---: | :---: | :---: |
| Class 0 | Clean / Potable Water | 6 | 0.60% | 1 : 152.5 (Severe Minority) |
| Class 1 | Moderate Contamination | 79 | 7.90% | 1 : 11.6 (Minority) |
| Class 2 | Severe Pollution | 915 | 91.50% | 1 : 1.0 (Dominant Majority) |
| Total | All Categories | 1,000 | 100.00% | Multi-Class Imbalance |
Distribution illustrated in table 3.2 was on the basis of true field situation with samples of clean natural baseline water or heavily treated municipal inflow being dominant and that of medium grade contamination having very low, though occasional, occurrence. Trained in the absence of guidance, machine learning algorithms would logically fall back on Class 2 with an accuracy of 91.5% and no success in medium or clean conditions.

## **3.4. Physical Parameter Ingestion and Boundary Validation**
To ensure end-to-end data integrity throughout the system, the ingestion pipeline makes rigorous boundary assertions before running the model. When a lab record is submitted, the validation controller verifies each and every parameter within physical and thermodynamic boundaries:

1. Numeric Format Verification: Asserts that all eight parameters are valid floating-point numbers; NaN, null, or undefined values trigger immediate rejection.

2. Thermodynamic pH Range: Specifies 0.0 pH 14.0. Values less than 0.0 pH or greater than 14.0 pH are invalid measurements and not accepted.

3. Non-Negativity Constraints: States Turbidity, Dissolved Oxygen, Biochemical Oxygen Demand, Lead, Mercury, and Arsenic are all ≥ 0.0. Indicates that these physical concentrations are non-negative.

4. Flexible Parameter AliasingTo allow natively translating between different heterogeneous client formats (e.g., camelCase JSON from web clients, snakease from sensor probes, or parenthesized column headers from CSV files) to a canonical internal schema:

•  `Turbidity (NTU)`, `turbidity`, and `Turbidity` → `turbidity`

•  `DO (mg/L)`, `do`, and `dissolvedOxygen` → `do`

•  `BOD (mg/L)`, `bod`, and `biochemicalOxygenDemand` → `bod`

•  `Lead (mg/L)`, `lead`, and `Lead` → `lead`

•  `Mercury (mg/L)`, `mercury`, and `Mercury` → `mercury`

•  `Arsenic (mg/L)`, `arsenic`, and `Arsenic` → `arsenic`

## **3.5. Leakage-Free Preprocessing Pipeline**
In order to eliminate the potential risk of data leakage and provide a true evaluation of the model performance, the structure of preprocessing pipeline is limited to strict three steps operations:

![]()*Figure* *3.3:* *Leakage-Free* *Preprocessing* *Pipeline*
### **3.5.1. Stratified 80/20 Train-Test Partitioning**
The data is divided into a training set (80%) and a test set (20%) with stratified random sampling and a set seed (random_state=42). The vector y target, due to the nature of stratification, is stratified such that for each fold, the proportions of the classes are equivalent to those of y;

•  Train Set (n=800): Class 0 = 5 Class 1 = 63 Class 2 = 732

•  Hold-Out Test Set (n=200): Class 0 = 1, Class 1=16, Class 2=183.

Most importantly, the 200 test instances are isolated in real time and kept in pristine condition. No synthetic sampling, mean imputation or standard deviation calculation are performed on test set.

### **3.5.2. SMOTE Resampling Implementation Strictly on Training Data**
SMOTE is only used on the training data of 800 samples. Since the training fold has only 5 examples of Class 0, SMOTE's standard nearest neighbours settings ( k=5 i.e. at least 6 minority examples needed to function) is not possible, hence the explicit setting of the neighbour value at k=4.

The SMOTE algorithm creates synthetic feature vectors by interpolating between each original feature vector xᵢ and its randomly chosen neighbor x_zi:

This oversamples Class 0 and Class 1 until they match the majority count of 732 instances:

*Table 3.3: Preprocessing Data Partitioning and SMOTE Balance Transition.*

| **Dataset Partition** | **Class 0 (Clean)** | **Class 1 (Moderate)** | **Class 2 (Polluted)** | **Total Samples** | **Partition Description** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Raw Dataset | 6 | 79 | 915 | 1,000 | Original imbalanced measurements |
| Training Fold (Raw) | 5 | 63 | 732 | 800 | Stratified 80% partition |
| Training Fold (SMOTE k=4) | 732 | 732 | 732 | 2,196 | Balanced training space |
| Held-Out Test Fold | 1 | 16 | 183 | 200 | Untouched real ground truth |

### **3.5.3. StandardScaler Normalization Pipeline**
Chemical parameters exhibit different order of magnitudes (e.g., pH varies from 5 to 9; Hg varies from 0.0001 to 0.01 mg/L). Prior to running gradient-based and distance-based algorithms, these parameters were scaled to avoid these higher-magnitude parameters dominating the results.

The Standard Scaler is only fitted on the resampled train set, 2,196 instances. The empirical mean vector μ ℝ⁸ and standard deviation vector σ ℝ⁸ are given by:

The training and test folds are normalized to these same fixed training statistics:

The scaled artifact is saved as an serialized file, scaler.pkl, and exported to the production directory.

## **3.6. Predictive Machine Learning Architecture**
Three different machine learning architectures were trained using the same balanced training fold (N=2,196) and evaluated on the same held-out test fold (N=200) as defined by SENG491's capstone requirements.
### **3.6.1. Baseline Linear Model: Multinomial Logistic Regression**
A simple baseline model was trained with the multinomial cross-entropy loss. For example, when the K=3 classes, the posterior of class k is:

The model was initialized with a L₂ regularization, inverse regularization strength (C=1.0) and a maximum number of iterations maxᵢter=1000. It was optimized with the Broyden-Fletcher-Goldfarb-Shanno (L-BFGS) quasi-Newton solver.
### **3.6.2. Bagging Ensemble Model: Random Forest Classifier**
Decorrelated Ensemble as an Intermediate Nonlinear Benchmark To produce an ensemble of decorrelated decision trees, we used Random Forest. Random Forest leads to a B=100 decision trees classifier. B tree classifiers are generated from bootstrap samples of the resampled training set. At each node, the selection of a random subset of features (m = √d = √8 ≈ 2.82 → 3 features) is performed at each node. This subset is used to perform the split that minimizes the Gini impurity:

The ensemble probability predictions are formed by taking the average of the leaf class distributions across all the 100 trees:

### **3.6.3. Gradient Boosting Champion: Extreme Gradient Boosting (XGBoost)**
Champion model is built using Extreme Gradient Boosting (XGBoost). XGBoost constructs an ensemble of T regression trees iteratively to reduce a regularized objective function:

L=multi-class logarithmic loss(eval_metric='mlogloss') where the tree complexity comes with this penalty, Ω( fₜ):

The term Tt is the number of terminal leaves, w_t, j is the output weight of each leaf, γ is the leaf creation penalty, and λ is the term that imposes L 2 leaf regularization.

At stage t, the target is approximated by:

Where gᵢ ≡ l(yᵢ, ŷᵢ^(t-1)) / ŷ^(t-1) is the first order gradient, hᵢ ≡ ² l(yᵢ, ŷᵢ^(t-1)) / ( ŷ^(t-1))² the second order Hessian. The best weight for leaf j, consisting of sample set Iⱼ, can be calculated analytically:

The tree structure is expanded with a precise greedy split finding approach computing the gain of splitting a leaf into an L and an R:

The

The

 The XGBoost model artifact is serialized to disk as model.pkl.

## **3.7. Mathematical Formulation of Continuous Drinkability Scoring**
Traditional ML models produce categorical labels for predictions (y {0, 1, 2}) that lack finer distinctions in chemical safety. At Aqua Sense AI, we provide well-calibrated decision support from the Continuous Drinkability Score: mathematically formulated to provide finer granularity in chemical safety.

Where P(Class k) is the posterior probability returned by the winner model using predict_proba() and ωₖ is the operational safety weight for each class:

•  ω₀ = 1.00 (Clean / Drinking Water: 100% water to drink contribution)

•  ω₁ = 0.50 (Moderate Contamination: 50% drinkability contribution; needs conventional filter to treat)

•  ω₂ = 0.00 (Severe Pollution: 0% drinkability contribution; acute toxic hazard)

Expanding the linear combination yields:

The calculated score is capped to [0.00%, 100.00%] and interpolated to three standard operational levels:

• Safe Tier (Score 75.00%): The sample meets all of the applicable municipally potable standards.

• Moderate Tier (40.00% Score < 75.00%): High turbidity/organic load; water must be filtered for public use.

• Critical Hazard Tier (Score < 40.00%): Detect of severe contamination or heavy metal toxicity; and initiate immediate early-warning isolation.

![]()*Figure* *3.4:* *Continuous* *Drinkability* *Probability* *Scoring* *Decision* *Logic* *and* *Risk* *Boundaries*

## **3.8. Automated Water Quality Advisory & Remediation Engine**
In order to be implemented at the engineering level, Aqua Sense AI applies an automated advisory engine that compares values received to other parameters to WHO and EPA drinking water guidelines, providing targeted diagnostic warnings with associated remediation recommendations:

*Table 3.4: Automated Advisory Remediation Protocols for Detected Contaminants.*

| **Parameter Violation** | **Safety Threshold** | **Diagnostic Warning Message** | **Prescribed Engineering Remediation Protocol** |
| :---: | :---: | :---: | :---: |
| Acidic pH | pH < 6.5 | Acidic Water Alert: Below the minimum safe threshold of 6.5 | Insert calcite/corosex filter or sodium carbonate (soda ash) injection to neutralize pH and prevent pipe and fixture corrosion and metal leaching. |
| Alkaline pH | pH > 8.5 | Alkaline Water Alert: Exceeds the maximum safe threshold of 8.5 | Re-acidify the water to a neutral 7.0-7.5 by adding food-grade neutralizing acid (diluted citric or hydrochloric acid). |
| High Turbidity | > 5.0 NTU | High Cloudiness Alert: Exceeds clarity standard of 5.0 NTU | Clarify suspended solids using chemical coagulation by alum or polyaluminum chloride. This treatment should be followed by rapid sand filtration or multimedia filtration. |
| Low Dissolved Oxygen | < 5.0 mg/L | Low Dissolved Oxygen Alert: Below the healthy limit of 5.0 mg/L | Increase dissolved oxygen levels and remove sulfurous odor by implementing cascade or diffused bubble aeration. |
| High BOD | > 5.0 mg/L | High Organic Load Alert: Exceeds guideline of 5.0 mg/L | Use biological filtration or advanced oxidation processes (UV light with hydrogen peroxide/ozone) to remove organic pollution. |
| Lead Toxicity | > 0.010 mg/L | Hazardous Lead Toxicity: Exceeds the strict limit of 0.010 mg/L | Immediately go through lead select ion-exchange resin filters or high-rejection membranes of Reverse Osmosis (RO). |
| Mercury Toxicity | > 0.006 mg/L | Critical Mercury Toxicity: Exceeds threshold of 0.006 mg/L | Use a GAC filtration with reverse osmosis to remove the dissolved toxic mercury compounds. |
| Arsenic Toxicity | > 0.010 mg/L | Dangerous Arsenic Alert: Exceeds permissible limit of 0.010 mg/L | Employ activated alumina adsorption media or ferric chloride co-precipitation to remove arsenic ions from your feed water. |
## **3.9. Full-Stack Web Application Engineering**
### **3.9.1. Backend REST API Architecture & Python Child Process Execution**
The backend server is implemented in Node.js using the Express framework, employing the latest ES Modules (import/export) syntax. Controller code is wrapped with express-async-handler to avoid unhandled asynchronous rejections.

In order to connect the Node.js JavaScript environment to the Python machine learning runtime, the prediction controller uses the Node.js child_process.spawn() method:

![]()*Figure* *3.5:* *Asynchronous* *Node.js Child* *Process* *Execution* *Bridge* *to* *Python* *Inference* *Engine*

This architecture provides two significant engineering benefits:

1. Memory Isolation – The Python runtime will start, execute inference and shut down, avoiding memory leaks from building up within the primary Node.js web process.

2. Python is running in its native machine learning environment without running additional HTTP microservice or network socket load.

*Table 3.5: MongoDB WaterRecord Document Schema Architecture.*

| **Field Key** | **Mongoose Data Type** | **Validation Constraints** | **Schema Description** |
| :---: | :---: | :---: | :---: |
| `ph` | `Number` | `required: true`, min: 0, max: 14 | Laboratory pH measurement |
| `turbidity` | `Number` | `required: true`, min: 0 | Nephelometric turbidity units |
| `temperature` | `Number` | `required: true` | Water temperature in Celsius |
| `do` | `Number` | `required: true`, min: 0 | Dissolved oxygen in mg/L |
| `bod` | `Number` | `required: true`, min: 0 | Biochemical oxygen demand in mg/L |
| `lead` | `Number` | `required: true`, min: 0 | Lead heavy metal concentration |
| `mercury` | `Number` | `required: true`, min: 0 | Mercury heavy metal concentration |
| `arsenic` | `Number` | `required: true`, min: 0 | Arsenic metalloid concentration |
| `drinkabilityScore` | `Number` | `required: true`, min: 0, max: 100 | Continuous ML score (0%-100%) |
| `predictedClass` | `Number` | `required: true`, enum: [0, 1, 2] | Discrete predicted class index |
| `riskStatus` | `String` | `required: true`, enum: [Safe, Moderate, Critical] | Operational risk stratification |
| `warnings` | `[String]` | Array of warning messages | Specific threshold violation alerts |
| `recommendations` | `[String]` | Array of remediation steps | Recommended treatment protocols |
| `location` | `String` | `trim: true`, default: 'Main Lab' | Sampling station identifier |
| `timestamp` | `Date` | default: `Date.now` | Ingestion timestamp |

### **3.9.2. Frontend Web Interface Architecture**
The Client UI is a single page React 18 Application built with Vite.

![]()*Figure* *3.6:* *React* *18* *Single-Page* *Application* *Interface* *Hierarchy* *and* *Component Architecture*

The user interface is divided into three operational views:

• Telemetry Dashboard (Dashboard.jsx): Displays telemetry wide Key Performance Indicators (Number of samples tested, fleet average drinkability, number of critical hazards, proportion of safe water). Uses Recharts for: responsive 30-day-area-charts of temporal drinkability trends, Bar charts of monitoring station averages, and a Donut chart of hazard categories distribution.

• Sample Analyzer (Analyze.jsx): Includes a manual parameter entry form with 1-click test presets (Clean Natural Spring Water, Moderate Urban River Sample and Severe Industrial Runoff). Also includes a batch ingestion utility that can take multiple records as a multi-record JSON array and process them in turn.

• Historical Audit Log (History.jsx): Features an interactive data table showing: all historical tests, risk status badges, number values for each parameter, and a diagnostic expand dialog in a single click.

### **3.9.3. Interactive Real-Time "What-If" Water Treatment Simulator**
One of the more important innovations that the Aqua Sense AI platform delivers is the "What-If" Water Treatment Simulator found in Analyze.jsx. When an operator selects a contaminated water sample to analyze, the interface brings up a set of interactive parameter sliders with pre-existing values.

The operator can modify single parameter values (for instance, drag the turbidity slider down from 16.5 NTU to 1.8 NTU by coagulation, or drag the lead slider down from 0.024 mg/L to 0.002 mg/L by reverse osmosis). As the sliders are moved, the client initiates the prediction pipeline and updates the Drinkability Gauge and our advisory guidance in real-time. This empowers plant operators to check precisely how much of the treatment intervention they are proposing needs to be applied with chemicals in the field.

### **3.9.4. Production Software Implementation Code Examples**
##### JavaScript Backend Service Implementation Here is a production snippet showcasing the asynchronous child-process execution bridge and validation controller used in backend/controllers/predictionController.js:

`/**`

` * Executes Python machine learning inference via child process.`

` * Standardizes inputs, spawns sub-process, and streams stdout JSON.`

` */`

`export function executePythonPrediction(cleanParameters) {`

`  return new Promise((resolve, reject) => {`

`    const pythonExecutable = getPythonExecutablePath();`

`    const scriptPath = path.resolve(__dirname, '..', 'ml-predict', 'predict.py');`

`    const parametersPayload = JSON.stringify({`

`      pH: cleanParameters.ph,`

`      Turbidity: cleanParameters.turbidity,`

`      Temperature: cleanParameters.temperature,`

`      DO: cleanParameters.do,`

`      BOD: cleanParameters.bod,`

`      Lead: cleanParameters.lead,`

`      Mercury: cleanParameters.mercury,`

`      Arsenic: cleanParameters.arsenic`

`    });`

`    const pythonChildProcess = childProcess.spawn(pythonExecutable, [scriptPath, parametersPayload]);`

`    let standardOutput = '';`

`    let standardError = '';`

`    pythonChildProcess.stdout.on('data', (chunk) => { standardOutput += chunk.toString(); });`

`    pythonChildProcess.stderr.on('data', (chunk) => { standardError += chunk.toString(); });`

`    pythonChildProcess.on('close', (statusCode) => {`

`      if (statusCode !== 0) {`

``        return reject(new Error(`Inference engine failed: ${standardError}`));``

`      }`

`      try {`

`        const parsedResponse = JSON.parse(standardOutput.trim());`

`        resolve(parsedResponse);`

`      } catch (parseError) {`

``        reject(new Error(`Failed to parse ML output JSON: ${parseError.message}`));``

`      }`

`    });`

`  });`

`}`

#### Python Machine Learning Inference Implementation The following production snippet shows the Python inference engine `backend/ml-predict/predict.py` calculating continuous drinkability scores via dot product:

`import sys`

`import json`

`import joblib`

`import numpy as np`

`def run_prediction():`

`    # 1. Parse incoming JSON arguments`

`    input_data = json.loads(sys.argv[1])`

`    ordered_features = [`

`        float(input_data['pH']),`

`        float(input_data['Turbidity']),`

`        float(input_data['Temperature']),`

`        float(input_data['DO']),`

`        float(input_data['BOD']),`

`        float(input_data['Lead']),`

`        float(input_data['Mercury']),`

`        float(input_data['Arsenic'])`

`    ]`

`    # 2. Load serialized preprocessor and champion model`

`    scaler = joblib.load('scaler.pkl')`

`    model = joblib.load('model.pkl')`

`    # 3. Transform features and evaluate class probabilities`

`    scaled_vector = scaler.transform(np.array([ordered_features]))`

`    probabilities = model.predict_proba(scaled_vector)[0]`

`    # 4. Continuous Drinkability formulation via dot product`

`    # Weights: Class 0 (Clean)=1.0, Class 1 (Moderate)=0.5, Class 2 (Polluted)=0.0`

`    weights = np.array([1.0, 0.5, 0.0])`

`    raw_score = float(np.dot(probabilities, weights) * 100.0)`

`    final_score = round(max(0.0, min(100.0, raw_score)), 2)`

`    # 5. Output JSON payload to stdout`

`    print(json.dumps({`

`        "success": True,`

`        "drinkabilityScore": final_score,`

`        "predictedClass": int(model.predict(scaled_vector)[0]),`

`        "classProbabilities": {`

`            "class0_clean": round(float(probabilities[0]), 4),`

`            "class1_moderate": round(float(probabilities[1]), 4),`

`            "class2_polluted": round(float(probabilities[2]), 4)`

`        }`

`    }))`

# **4. EXPERIMENTAL RESULTS, PERFORMANCE EVALUATION & DISCUSSION**
## **4.1. Experimental Setup and Hardware/Software Environment**
The following experiments, resampling procedures, and comparisons were performed in the computing environment:

• Operating System: Microsoft Windows 11 Enterprise (x64 architecture)

• Technical Specifications Intel Core i7 / AMD Ryzen multi-core architecture at 3.2 GHz.

• Primary Memory: 16 GB DDR4 RAM

• Machine Learning Environment: Python 3.12 (via Windows virtualized Python environment)

• Basic Libraries for Computation: scikit-learn 1.9.1, imbalanced-learn 0.14.2, xgboost 3.4.1, pandas 3.0.6, numpy 2.5.4, and joblib 1.6.0

• Application Execution Stack: Node.js v20.x, Express.js v4.x, MongoDB Community Edition v7.x, React v18.x, Vite v5.x, Tailwind CSS v3.x

All stochastic operations utilized global random seeds (random_state=42) to remove non-deterministic factors across run iterations; all 80/20 stratified split, SMOTE sample synthesis and Random Forest / XGBoost sub-sampling processes used random seed application.

## **4.2. Comprehensive Model Performance Comparison**
In accordance with the SENG491 capstone standards, three model architectures are trained on the same balanced training fold (N=2,196) and tested on the same holdout test fold (N=200):

1. Multinomial Logistic Regression: Linear classification baseline (maxᵢter=1000, L-BFGS solver)

2. Random Forest Classifier: Bagging ensemble benchmark (B=100 trees, Gini impurity)

3. Extreme Gradient Boosting (XGBoost): Gradient boosting champion architecture (eval_metric='mlogloss')

*Table 4.1: SENG491 Model Performance Benchmark on Unseen Held-Out Test Set (N=200).*

| **Architecture Candidate** | **Model Paradigmatic Category** | **Test Accuracy (%)** | **Macro F1-Score** | **Weighted F1-Score** | **Selection Status** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Multinomial Logistic Regression | Linear Softmax Baseline | 85.50% | 0.5943 | 0.8819 | ❌ Rejected |
| Random Forest Classifier | Bagging Tree Ensemble | 97.00% | 0.5907 | 0.9655 | ❌ Runner-Up |
| Extreme Gradient Boosting (XGBoost) | Gradient Boosted Trees | 97.50% | 0.6065 | 0.9738 | ✅ Champion |
![]()*Figure* *4.1:* *Performance* *Comparison* *of* *Candidate* *Models: Test* *Accuracy* *and* *Weighted* *F1-Score*

We can see from Table 4.1 and Figure 4.1 that XGBoost emerges as the best performing model, in terms of the main metrics, with a Test Accuracy of 97.50%, a Weighted F1-Score of 0.9738 and a Macro F1-Score of 0.6065.

## **4.3. Detailed Classification Reports and Confusion Matrices**
In order to gain insight into the structural class annotation mechanics for each candidate architecture, per-class classification reports were obtained on the held-out test fold (N=200, Class 0: 1 sample, Class 1: 16 samples, and Class 2: 183 samples).
### **4.3.1. Model 1: Multinomial Logistic Regression Baseline**
The linear baseline obtained an overall accuracy of 85.50% and a Weighted F1-Score of 0.8819. Looking at the per-class performance, we see a strongly lopsided performance between classes:

*Table 4.2: Classification Report for Multinomial Logistic Regression Baseline.*

| **Category Label** | **Target Class Name** | **Precision** | **Recall** | **F1-Score** | **Support (Actual Ground Truth)** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Class 0 | Clean / Potable Water | 0.25 | 1.00 | 0.40 | 1 |
| Class 1 | Moderate Contamination | 0.33 | 0.75 | 0.46 | 16 |
| Class 2 | Severe Pollution | 0.99 | 0.86 | 0.92 | 183 |
| Accuracy | Overall Correct Predictions | — | — | 0.8550 | 200 |
| Macro Average | Unweighted Mean Across Classes | 0.52 | 0.87 | 0.5943 | 200 |
| Weighted Average | Support-Weighted Metric Mean | 0.93 | 0.85 | 0.8819 | 200 |
Analytic finding: The Logistic Regression isolated all pristine samples (100%), and obtained a recall of 75% for Class 1, but precision for the Moderate Contamination set was catastrophically low (Precision = 0.33). The linear decision boundary was incapable of separating the complex interactions of chemical byproducts, and so many heavily contaminated samples were classified as less contaminated, producing lots of false-safe alarms.
### **4.3.2. Model 2: Random Forest Classifier**
The ensemble of the Random Forest bagging classifier greatly enhanced the overall performance. The Test Accuracy and the weighted F1-Score were 97.00% and 0.9655 respectively:

*Table 4.3: Classification Report for Random Forest Classifier.*

| **Category Label** | **Target Class Name** | **Precision** | **Recall** | **F1-Score** | **Support (Actual Ground Truth)** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Class 0 | Clean / Potable Water | 0.00 | 0.00 | 0.00 | 1 |
| Class 1 | Moderate Contamination | 0.92 | 0.69 | 0.79 | 16 |
| Class 2 | Severe Pollution | 0.97 | 1.00 | 0.99 | 183 |
| Accuracy | Overall Correct Predictions | — | — | 0.9700 | 200 |
| Macro Average | Unweighted Mean Across Classes | 0.63 | 0.56 | 0.5907 | 200 |
| Weighted Average | Support-Weighted Metric Mean | 0.96 | 0.97 | 0.9655 | 200 |
*Analytical Observation: Random Forest Acquired Excellent precision in Class 1 (0.92) as can be seen by tree ensemble methods bypassed the false-positive errors observed by linear approaches. Moreover, Random Forest identified 11 of 16 these waters with moderate contamination; hence contamination recall was moderate at 68.75% (missed 31.25% contaminated waters).

### **4.3.3. Model 3: Extreme Gradient Boosting (XGBoost Champion)**
XGBoost (Gradient boosting classifier) XGBoost the generalizer overall was the best classifier with a Test Accuracy 97.50% and a Weighted F1-Score of 0.9738.

*Table 4.4: Classification Report for Extreme Gradient Boosting (XGBoost Champion).*

| **Category Label** | **Target Class Name** | **Precision** | **Recall** | **F1-Score** | **Support (Actual Ground Truth)** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| Class 0 | Clean / Potable Water | 0.00 | 0.00 | 0.00 | 1 |
| Class 1 | Moderate Contamination | 0.92 | 0.75 | 0.83 | 16 |
| Class 2 | Severe Pollution | 0.98 | 1.00 | 0.99 | 183 |
| Accuracy | Overall Correct Predictions | — | — | 0.9750 | 200 |
| Macro Average | Unweighted Mean Across Classes | 0.64 | 0.58 | 0.6065 | 200 |
| Weighted Average | Support-Weighted Metric Mean | 0.97 | 0.97 | 0.9738 | 200 |
![]()

*Figure 4.2: Confusion Matrix Heatmap for XGBoost Champion on the Unseen Test Set*

Analytical conclusion:On Moderate Contamination, XGBoost identified 75.00% of the positive cases (12/16 samples) with a precision of 0.92 and increased the minority F1 to 0.83. With Severe Pollution (Class 2), it identified 182 of 183 cases (98%) with a precision of 0.98 and with a recall of 1.00 (F1-score 0.99).

## **4.4. Minority Class Detection Analysis (Moderate Contamination Recall)**
In municipal and environmental water management, detection of Class 1 water (Moderate Contamination) can mean life or death for a community. Whereas a Class 2 (Severe Pollution) has obvious chemical anomalies that are relatively easier to uncover; Class 1 (borderline water degradation -- moderate sewer contamination, slight heavy-metal increase) can slip through the cracks and lead to serious chronic health problems.

Compare the candidate models on Class 1:

• Logistic Regression: Through 75.00% recall but precision was too low for this use case at a level of 0.33. In order to catch one real moderate contamination still generated alarm for two alarm for severely polluted water.

• Random Forest: Reached an accuracy of 0.92, but the high precision does not compensate the false negatives from moderate contamination, 31.25% (Recall = 68.75%).

• XGBoost: Same high precision of 0.92 with the ability to identify 75.00% of the moderate contamination occurrences, raising the minority F1-score from 0.79 to 0.83.

This additional sensitivity to minority contamination without sacrificing the false alarms is what made XGBoost the clear winner model for production.

## **4.5. Feature Importance Analysis and Environmental Explainability**
To ensure transparency for environmental engineers and regulatory agencies, the decision logic of the champion XGBoost model was audited based on Gini gain feature importance, as follows:

*Table 4.5: Feature Importance Gain Rankings for XGBoost Model.*

| **Rank** | **Parameter Name** | **Representation Key** | **Gain Importance (%)** | **Cumulative Importance (%)** |
| :---: | :---: | :---: | :---: | :---: |
| 1 | Biochemical Oxygen Demand | `BOD (mg/L)` | 35.16% | 35.16% |
| 2 | Turbidity | `Turbidity (NTU)` | 31.02% | 66.18% |
| 3 | Potential of Hydrogen | `pH` | 13.38% | 79.56% |
| 4 | Lead Concentration | `Lead (mg/L)` | 6.45% | 86.01% |
| 5 | Mercury Concentration | `Mercury (mg/L)` | 6.21% | 92.22% |
| 6 | Arsenic Concentration | `Arsenic (mg/L)` | 4.84% | 97.06% |
| 7 | Dissolved Oxygen | `DO (mg/L)` | 2.24% | 99.30% |
| 8 | Water Temperature | `Temperature (°C)` | 0.70% | 100.00% |
![]()*Figure* *4.3:* *XGBoost* *Relative* *Feature* *Importance* *Gain* *Distribution* *across* *the* *8* *Laboratory* *Parameters*
### **Environmental Interpretation of Feature Importance**
1. Organic & Physical Clarity (66.18%): Nearly two thirds of all split decisions rely on Biochemical Oxygen Demand (35.16%) and turbidity (31.02%) respectively. Both a high biochemical oxygen demand and increased turbidity in an aqueous environment are clear proxies for discharge of sewage, leaking municipal wastewater as well as agricultural runoff.

2. Acid-Base Equilibrium (13.38%): pH is a close third. Both ends of the pH scale 

rule– chemical speciation, how the metal dissolves, and the coagulant's performance.

3. Trace Toxic Heavy Metals (17.50%) – Lead, Mercury and Arsenic (at low levels, parts per millions/liter) – the combined increase of 17.50% actually shows the model uses significant split importance on heavy metals when these variables are executing the shift into the severe category of pollution.

4. Environmental Modulators (2.94%): Dissolved Oxygen (2.24%) and Temperature (0.70%) are secondary modulators of biological decay rate and oxygen solubility.

## **4.6. System Latency, Computational Footprint & Efficiency**
In production software systems, the model inference speed and storage overhead are the key operational metrics. The following measurements were taken for 500 consecutive test iterations:

*Table 4.6: System Latency, Model Storage Footprint, and Computational Metrics.*

| **Performance Attribute** | **Evaluation Target** | **Measured Metric Value** | **Evaluation Status** |
| :---: | :---: | :---: | :---: |
| Model Disk Size (`model.pkl`) | < 1.0 MB | 298.4 KB | ✅ Highly Compact |
| Scaler Disk Size (`scaler.pkl`) | < 50 KB | 1.2 KB | ✅ Minimal Overhead |
| Python Child Process Execution | < 20 ms | 7.84 ms (Average) | ✅ Exceeds Target |
| End-to-End REST Request Latency | < 100 ms | 41.60 ms (Average) | ✅ Real-Time |
| Peak RAM Consumption (Node.js) | < 150 MB | 48.2 MB | ✅ Lightweight |
| Peak RAM Consumption (Python Child) | < 100 MB | 34.1 MB | ✅ Isolated Lifecycle |
The serialized XGBoost artifact is <300 KB and inference time is <8ms as demonstrated in Table 4.6. The above result verifies that the Aqua Sense AI system meets the set non-functional requirements and can operate efficiently on municipal edge devices in real-time.

## **4.7. Full-Stack Dashboard Verification and User Testing**
End to end software suite was validated by means of complete functional and scenario test suites:
### **4.7.1. Preset Sample Scenario Testing**
The system was subjected to the three inbuilt laboratory presets:

1. Pristine Spring Water; pH 7.6, Turbidity 1.8 NTU, Temp 18.5°C, DO 8.4 mg/L, BOD 1.5 mg/L, Lead 0.003 mg/L, Mercury 0.0003 mg/L, Arsenic 0.003 mg/L

Result Model output: 97.8% Drinkability Score, Risk status: Safe, Warnings: 0, Recommendations: "Water is within safe drinking guidelines"

2. Moderate Urban River Sample: pH 7.2, Turbidity 5.8 NTU, Temp 25.0°C, DO 6.2 mg/L, BOD 4.1 mg/L, Lead 0.007 mg/L, Mercury 0.0008 mg/L, Arsenic 0.007 mg/L.

Result: Model Output: 52.4% Drinkability Score, Risk Status: Moderate, Warnings: 1 (Turbidity above 5.0 NTU), Recommendations: Coagulation/flocculation and rapid sand filtration.

3. Severe Industrial Effluent pH: 5.8 Turbidity 16.5 NTU Temp: 31.0°C DO 3.1 mg/l BOD 8.8 mg/l Lead 0.024 mg/l Mercury 0.0085 mg/l Arsenic 0.022 mg/l

Outcome: Model Result: 14.1% Drinkability Score, Risk Status: Critical, Warnings: 6 (pH violation, Turbidity, DO, BOD, Lead, Mercury, Arsenic violations), Recommendations: immediate reverse osmosis, calcite neutralization and GAC filtration.

![]()*Figure 4.4: Interactive "What-If" Water Treatment Simulation Workflow and Live Telemetry Feedback*
### **4.7.2. "What-If" Simulator Verification**
After validation, test showed that when the operators manipulated sliders on the Industrial Effluent (Figure 4.4) test sample to imply the neutralization of pH, clarification of turbidity, and the removal of heavy metals by reverse osmosis, the re-calculated Drinkability Score increased from 14.1% to 96.4%, thus validating the simulator as an effective treatment planning tool.

# **5. CONCLUSION AND FUTURE WORK**
## **5.1. Summary of Project Achievements**
In this graduation thesis, Aqua Sense AI, an intelligent water quality prediction and early warning of water pollution platform was introduced by designing, implementing, and verifying. The project is the SENG491 Senior Capstone Project of QS-HKU, and it successfully addressed the inherent problems of time lag and decision support in conventional water monitoring as follows:

1. Certified Dataset & Leakage-Free Preprocessing: Cleaned and structured 1,000 certified water quality records across eight physical and chemical parameters. Implemented a strict 80/20 stratified partitioning protocol prior to applying SMOTE (k=4) strictly on the training fold, eliminating data leakage and ensuring authentic generalization on the held-out test set (N=200).

2. Here are the top three models I built, ranked by their test accuracy and f1 scores.1. The Champion model in this effort was XGBoost, which had 97.50% test accuracy, a 0.9738 Weighted F1-Score, a 0.6065 Macro F1-Score, and a 75.00% ability to detect moderate contamination (compared to 68.75% for Random Forest).

3. Substituted the crude binary Classification with a more mathematically-reasoned, continuous Drinkability Percentage (0.00% - 100.00%) based on the multi-class calibrated prediction probabilities.

4. Automated environmental advisory engine; European and US recommended water quality guideline value conversion: Integrated various official WHO and US EPA drinking water quality standard values into a decision-support rule engine, which automatically produces specific chemical and physical treatment protocols when parameter violations are detected.

5. Developed a resilient web application with a Node.js/Express REST API backed, an asynchronous Python child-process ML bridge (~8ms infer latency), persistent MongoDB data store, a sleek React 18 SPA dashboard with Recharts visual analytics, batch ingest of JSON data, and a dynamic "What-If" "treatment-simulation" interface.

## **5.2. Environmental and Public Health Impact**
Aqua Sense AI – For People & the Planet provide benefits:

• Shortens diagnostic response time from 24-72 hours to less than 50 milliseconds, allowing water utility operators to cut off contaminated river intakes or municipal distribution lines prior to contaminated water passing to a citizen's household.

• An interactive "What-If" simulator allows water treatment plant operators to visualize treatment results in a virtual world before over-dosing chemical coagulants and disinfectants.

• At a fraction of the cost of proprietary software, resource-poor municipal water agencies and rural health clinics can support more sophisticated early-warning surveillance through flexible JSON and CSV batch imports.

## **5.3. Project Limitations**
Although the relatively high accuracy of prediction and response time of the Aqua Sense AI system is noted, the limitations of technical constraints and data are stated below:

1. Offline Stationary Dataset: The existing model was trained on a limited sample of a curated dataset of 1,000 certified records. It is highly representative but does not yet incorporate temporal seasonality, heavy events or multi-year climate variations.

2. Laboratory Parameters BOD and heavy metals are only usable in the field using testing kits and instrumentation in a laboratory, not an inexpensive, continual in situ immersion probe.

3. There are no interactive spatial GIS map layers of the locations for sampling, flow direction and dispersion of plume in MongoDB, despite the fact that the sampling locations are entered as text identifier.

## **5.4. Future Work and Research Directions**
Based on the premises outlined in this graduation thesis, the following technical goals will be pursued to extend the work:

1. IoT Hardware In-Situ Integration: Connect the system to low-cost microcontroller sensor stations built around ESP32 chipsets located on a number of distribution reservoirs and river basins to provide continuous telemetry streams over MQTT or Web Sockets.

2. Geospatial GIS Mapbox/Leaflet GIS mapping onto the React dashboard can be used to display the location of the hydrological monitoring stations on a geographic map and to forecast the direction and time of the arrival of the contamination plume of the structure.

3. Online Continuous Retraining (MLOps): Deploy an automated MLOps pipeline such as MLflow or Docker that will rebalance retraining of the model for whenever new validated field records are available.

4. Edge AI Embedded Deployment Quantize the champion XGBoost model into C/C++ byte-arrays for direct deployment onto edge microcontrollers, which will allow remote solar-powered sensor buoys to autonomously activate physical shutoff valves.

# **REFERENCES**
[1] F. Ding, W. Zhang, S. Cao, S. Hao, L. Chen, X. Xie, W. Li, and M. Jiang, "Optimization of water quality index models using machine learning approaches," *Water Research* (Elsevier), vol. 243, art. no. 120337, 2023. DOI: [10.1016/j.watres.2023.120337.](https://doi.org/10.1016/j.watres.2023.120337.)

[2] T. Chen and C. Guestrin, "XGBoost: A Scalable Tree Boosting System," in *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, San Francisco, CA, USA, 2016, pp. 785–794. DOI: [10.1145/2939672.2939785.](https://doi.org/10.1145/2939672.2939785.)

[3] N. V. Chawla, K. W. Bowyer, L. O. Hall, and W. P. Kegelmeyer, "SMOTE: Synthetic Minority Over-sampling Technique," *Journal of Artificial Intelligence Research*, vol. 16, pp. 321–357, 2002. DOI: [10.1613/jair.953.](https://doi.org/10.1613/jair.953.)

[4] L. Breiman, "Random Forests," *Machine Learning*, vol. 45, no. 1, pp. 5–32, 2001. DOI: [10.1023/A:1010933404324.](https://doi.org/10.1023/A:1010933404324.)

[5] World Health Organization (WHO), *Guidelines for Drinking-water Quality: Fourth Edition Incorporating the First and Second Addenda*, Geneva, Switzerland: World Health Organization, 2022. ISBN: 978-92-4-004506-4.

[6] International Organization for Standardization (ISO), *ISO 5667-1:2020: Water quality — Sampling — Part 1: Guidance on the design of sampling programmes and sampling techniques*, Geneva, Switzerland: ISO, 2020.

[7] S. Tyagi, B. Sharma, P. Singh, and R. Dobhal, "Water Quality Assessment in Terms of Water Quality Index," *American Journal of Water Resources*, vol. 1, no. 3, pp. 34–38, 2013. DOI: [10.12691/ajwr-1-3-3.](https://doi.org/10.12691/ajwr-1-3-3.)

[8] M. Hameed, S. S. Sharqi, Z. M. Yaseen, H. A. Afan, A. Hussain, and A. Elshafie, "Application of artificial intelligence models for the prediction of water quality index: A case study of Perak River, Malaysia," *Journal of Hydrology* (Elsevier), vol. 544, pp. 118–125, 2017. DOI: [10.1016/j.jhydrol.2016.11.031.](https://doi.org/10.1016/j.jhydrol.2016.11.031.)

[9] T. H. H. Aldhyani, M. Al-Adhaileh, and H. Yuan, "Water Quality Prediction Using Artificial Intelligence Algorithms," *Applied Bionics and Biomechanics*, vol. 2020, art. no. 6659314, 2020. DOI: [10.1155/2020/6659314.](https://doi.org/10.1155/2020/6659314.)

[10] W. C. Leong, A. Bahadori, and J. Zhang, "Prediction of water quality index (WQI) using support vector machine and artificial neural network," *Environmental Science and Pollution Research*, vol. 26, pp. 10245–10257, 2019. DOI: [10.1007/s11356-019-04423-7.](https://doi.org/10.1007/s11356-019-04423-7.)

[11] D. T. Bui, N. D. Hoang, and F. Martinez-Alvarez, "A novel hybrid approach based on a swarm intelligence-optimized extreme gradient boosting machine for river water quality assessment," *Environmental Modelling & Software* (Elsevier), vol. 132, art. no. 104801, 2020. DOI: [10.1016/j.envsoft.2020.104801.](https://doi.org/10.1016/j.envsoft.2020.104801.)

[12] P. Liu, J. Wang, A. K. Sangaiah, Y. Xie, and X. Yin, "Analysis and prediction of water quality using LSTM deep neural networks in IoT environmental monitoring," *Computer Communications* (Elsevier), vol. 145, pp. 165–172, 2019. DOI: [10.1016/j.comcom.2019.06.012.](https://doi.org/10.1016/j.comcom.2019.06.012.)

[13] S. Kaufman, S. Rosset, C. Perlich, and O. Stitelman, "Leakage in data mining: Formulation, detection, and avoidance," *ACM Transactions on Knowledge Discovery from Data (TKDD)*, vol. 6, no. 4, pp. 1–21, 2012. DOI: [10.1145/2382577.2382579.](https://doi.org/10.1145/2382577.2382579.)

[14] R. M. Brown, N. I. McClelland, R. A. Deininger, and R. G. Tozer, "A Water Quality Index - Do We Dare?," *Water & Sewage Works*, vol. 117, no. 10, pp. 339–343, 1970.

[15] R. K. Horton, "An index number system for rating water quality," *Journal of Water Pollution Control Federation*, vol. 37, no. 3, pp. 300–306, 1965.

[16] United States Environmental Protection Agency (US EPA), *2018 Edition of the Drinking Water Standards and Health Advisories Tables*, Washington, D.C., USA: Office of Water, EPA 822-F-18-001, 2018.

[17] U. Ahmed, R. Mumtaz, H. Anwar, A. A. Shah, and R. Irfan, "Efficient water quality prediction using supervised machine learning," *Water* (MDPI), vol. 11, no. 11, art. no. 2210, 2019. DOI: [10.3390/w11112210.](https://doi.org/10.3390/w11112210.)

[18] H. He and E. A. Garcia, "Learning from imbalanced data," *IEEE Transactions on Knowledge and Data Engineering*, vol. 21, no. 9, pp. 1263–1284, 2009. DOI: [10.1109/TKDE.2008.239.](https://doi.org/10.1109/TKDE.2008.239.)

[19] S. M. Lundberg and S. I. Lee, "A unified approach to interpreting model predictions," in *Advances in Neural Information Processing Systems (NeurIPS 2017)*, Long Beach, CA, USA, vol. 30, 2017, pp. 4765–4774.

[20] M. Zhu, J. Wang, X. Yang, Y. Zhang, L. Zhang, H. Ren, B. Wu, and L. Ye, "A review of the application of machine learning in water quality evaluation," *Science of The Total Environment* (Elsevier), vol. 833, art. no. 155214, 2022. DOI: [10.1016/j.scitotenv.2022.155214.](https://doi.org/10.1016/j.scitotenv.2022.155214.)

[21] P. Geurts, D. Ernst, and L. Wehenkel, "Extremely randomized trees," *Machine Learning*, vol. 63, no. 1, pp. 3–42, 2006. DOI: [10.1007/s10994-006-6226-1.](https://doi.org/10.1007/s10994-006-6226-1.)

[22] F. Pedregosa, G. Varoquaux, A. Gramfort, V. Michel, B. Thirion, O. Grisel, M. Blondel, et al., "Scikit-learn: Machine Learning in Python," *Journal of Machine Learning Research*, vol. 12, pp. 2825–2830, 2011.

[23] A. Fernandez, S. Garcia, F. Herrera, and N. V. Chawla, "SMOTE for Learning from Imbalanced Data: Progress and Challenges, Marking the 15-year Anniversary," *Journal of Artificial Intelligence Research*, vol. 61, pp. 863–905, 2018. DOI: [10.1613/jair.1.11192.](https://doi.org/10.1613/jair.1.11192.)

[24] T. Rajaee, H. Ebrahimi, and V. Nourani, "A review of the artificial intelligence methods in water quality modeling," *Journal of Hydrology* (Elsevier), vol. 568, pp. 728–749, 2019. DOI: [10.1016/j.jhydrol.2018.10.046.](https://doi.org/10.1016/j.jhydrol.2018.10.046.)

[25] H. I. Fawaz, G. Forestier, J. Weber, L. Idoumghar, and P. A. Muller, "Deep learning for time series classification: a review," *Data Mining and Knowledge Discovery*, vol. 33, no. 4, pp. 917–963, 2019. DOI: [10.1007/s10618-019-00619-1.](https://doi.org/10.1007/s10618-019-00619-1.)

[26] R. P. Schwarzenbach, T. Egli, T. B. Hofstetter, U. von Gunten, and B. Wehrli, "Global water pollution and human health," *Annual Review of Environment and Resources*, vol. 35, pp. 109–136, 2010. DOI: [10.1146/annurev-environ-100809-125342.](https://doi.org/10.1146/annurev-environ-100809-125342.)

[27] G. Tchobanoglous, F. L. Burton, and H. D. Stensel, *Wastewater Engineering: Treatment and Reuse*, 4th ed., New York, NY, USA: McGraw-Hill Education, 2003.

[28] American Public Health Association (APHA), *Standard Methods for the Examination of Water and Wastewater*, 23rd ed., Washington, D.C., USA: APHA, AWWA, WEF, 2017.

[29] World Health Organization (WHO), *Chemical safety of drinking-water: Assessing priorities for risk management*, Geneva, Switzerland: World Health Organization, 2017.

[30] International Organization for Standardization (ISO), *ISO 5667-3:2018: Water quality — Sampling — Part 3: Preservation and handling of water samples*, Geneva, Switzerland: ISO, 2018.

# **APPENDICES**
## **APPENDIX A: REST API ENDPOINTS SPECIFICATION & JSON SCHEMAS**
### **A.1. Single Prediction Endpoint**
•  URL Route: `POST /api/predict`

•  Access Level: Public / Authenticated

•  Content-Type: `application/json`

•  Request Body Schema:

`{`

`  "location": "Reservoir Basin #3",`

`  "ph": 7.4,`

`  "turbidity": 2.1,`

`  "temperature": 19.5,`

`  "do": 7.8,`

`  "bod": 2.2,`

`  "lead": 0.004,`

`  "mercury": 0.0004,`

`  "arsenic": 0.004`

`}`

•  Response Body Schema (HTTP 200 OK):

`{`

`  "success": true,`

`  "data": {`

`    "_id": "6741a9bc4ef812034928d11a",`

`    "location": "Reservoir Basin #3",`

`    "ph": 7.4,`

`    "turbidity": 2.1,`

`    "temperature": 19.5,`

`    "do": 7.8,`

`    "bod": 2.2,`

`    "lead": 0.004,`

`    "mercury": 0.0004,`

`    "arsenic": 0.004,`

`    "drinkabilityScore": 96.5,`

`    "predictedClass": 0,`

`    "riskStatus": "Safe",`

`    "classProbabilities": {`

`      "class0_clean": 0.93,`

`      "class1_moderate": 0.07,`

`      "class2_polluted": 0.00`

`    },`

`    "warnings": [],`

`    "recommendations": [`

`      "Water meets all World Health Organization (WHO) and EPA potable standards. Safe for direct distribution."`

`    ],`

`    "timestamp": "2026-11-22T14:30:00.000Z"`

`  }`

`}`
### **A.2. Historical Records Query Endpoint**
•  URL Route: `GET /api/history`

•  Query Parameters: `page` (integer, default 1), `limit` (integer, default 20), `status` (string: Safe | Moderate | Critical), `location` (string)

•  Response Format: Paginated JSON array of `WaterRecord` documents with metadata and calculated risk indicators.
### **A.3. Analytics Summary Endpoint**
•  URL Route: `GET /api/analytics/summary`

•  Response Body Schema (HTTP 200 OK):

`{`

`  "success": true,`

`  "data": {`

`    "totalTests": 1420,`

`    "averageDrinkability": 74.82,`

`    "safeCount": 985,`

`    "moderateCount": 310,`

`    "criticalCount": 125,`

`    "latestRecord": { ... }`

`  }`

`}`

## **APPENDIX B: WATER SAFETY THRESHOLDS & ADVISORY RULE MAPPINGS**
*Table B.1: Complete Parameter Thresholds, Physiological Hazards & Remediation Protocol Mappings.*

| **Chemical Parameter** | **Safe Standard (WHO / EPA)** | **Critical Hazard Level** | **Physiological & Ecological Hazard** | **Prescribed Engineering Remediation Protocol** |
| :---: | :---: | :---: | :---: | :---: |
| pH Level | 6.5 – 8.5 | < 5.5 or > 9.5 | Acidic: pipe corrosion & lead leaching; Alkaline: scaling & low chlorination | Calcite (CaCO₃) / corosex media filter or soda ash (Na₂CO₃) injection for acidity; dilute citric/mineral acid for alkalinity. |
| Turbidity | ≤ 5.0 NTU | > 10.0 NTU | Suspended clay and organics shield microbial pathogens from chlorination | Chemical coagulation via Alum (Al₂(SO₄)₃) or PAC followed by flocculation and multimedia sand/anthracite filtration. |
| Temperature | 15.0 – 25.0 °C | > 30.0 °C | Accelerates bacterial proliferation, biofilm growth, and thermal deoxygenation | Deep-well cooling, covered storage reservoirs, or multi-stage cascade aeration. |
| Dissolved Oxygen | ≥ 5.0 mg/L | < 3.0 mg/L | Anaerobic decomposition, foul hydrogen sulfide (H₂S) odors, fish suffocation | Diffused bubble aeration, mechanical surface aerators, or cascade step-aerators. |
| Biochemical Oxygen Demand | ≤ 5.0 mg/L | > 10.0 mg/L | Indicates severe raw sewage, food waste, or animal slurry contamination | Biological trickling filters, membrane bioreactors (MBR), or advanced oxidation (UV + H₂O₂ / Ozone). |
| Lead (Pb) | ≤ 0.010 mg/L | > 0.015 mg/L | Acute neurotoxicity, irreversible cognitive damage in infants, renal dysfunction | High-rejection thin-film composite Reverse Osmosis (RO) or lead-selective cation exchange resin cartridges. |
| Mercury (Hg) | ≤ 0.006 mg/L | > 0.010 mg/L | Severe central nervous system toxicity, sensory ataxia, teratogenic birth defects | Virgin granular activated carbon (GAC) adsorption columns coupled with dual-pass Reverse Osmosis membranes. |
| Arsenic (As) | ≤ 0.010 mg/L | > 0.050 mg/L | Severe carcinogen; hyperkeratosis, peripheral vascular gangrene, organ tumors | Activated alumina (Al₂O₃) adsorption beds or ferric chloride (FeCl₃) coagulation-precipitation. |
