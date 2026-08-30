# ElevateLabs Internship Tasks & FraudLens Project

A comprehensive portfolio of machine learning and data science work completed during the ElevateLabs internship program. This repository contains 6 structured learning tasks progressing through fundamental ML concepts, culminating in **FraudLens**—a production-ready explainable AI system for credit card fraud detection.

---

## 📋 Repository Structure

### **Internship Tasks (Tasks 1-6)**

The internship curriculum is organized into 6 progressive tasks, each building upon the previous one:

#### **Task 1: Data Cleaning & Preprocessing** 📊
`Day_1/Task_1_Data_Cleaning_Preprocessing/`
- **Focus:** Foundational data science practices
- **Topics Covered:**
  - Handling missing values and data quality issues
  - Feature engineering and transformation
  - Data normalization and standardization
  - Outlier detection and removal
- **Outcome:** Clean, preprocessed datasets ready for analysis

#### **Task 2: Exploratory Data Analysis (EDA)** 📈
`EDA_Task2_Submission/`
- **Focus:** Deep dive into data exploration
- **Topics Covered:**
  - Statistical analysis and descriptive statistics
  - Data visualization (distributions, correlations, trends)
  - Pattern recognition and anomaly identification
  - Business insights extraction
- **Outcome:** Data-driven insights and visualization reports

#### **Task 3: Linear Regression** 📉
`Task3_Linear_Regression/`
- **Focus:** Understanding linear relationships
- **Topics Covered:**
  - Simple and multiple linear regression
  - Residual analysis and model diagnostics
  - R² and evaluation metrics
  - Real-world prediction tasks
- **Outcome:** Predictive models for continuous variables

#### **Task 4: Logistic Regression** ✅
`Task4_Logistic_Regression/`
- **Focus:** Binary classification fundamentals
- **Topics Covered:**
  - Logistic regression theory and implementation
  - Classification metrics (Precision, Recall, F1, AUC-ROC)
  - Threshold optimization
  - Imbalanced dataset handling
- **Outcome:** Binary classification models with robust evaluation

#### **Task 5: Decision Trees & Random Forests** 🌲
`Task5_DecisionTree_RandomForest/`
- **Focus:** Ensemble methods and tree-based models
- **Topics Covered:**
  - Decision tree construction and pruning
  - Random Forest architecture
  - Feature importance analysis
  - Hyperparameter tuning
- **Outcome:** High-performance ensemble models

#### **Task 6: Advanced Topics** 🚀
`Task -6/`
- **Focus:** Specialized ML techniques
- **Topics Covered:**
  - Advanced model combinations
  - Cross-validation strategies
  - Production considerations
  - Model deployment preparation
- **Outcome:** Production-ready ML systems

---

## 🎯 FraudLens: Capstone Project

**FraudLens** is the capstone project combining all learned concepts into a complete, deployable machine learning system.

### **Project Overview**

FraudLens is an **Explainable Hybrid Machine Learning System for Transaction Risk Assessment**. It combines supervised classification (XGBoost) with unsupervised anomaly detection (Isolation Forest) to provide explainable fraud risk scores for credit card transactions.

**Live Demo:** https://fraudlens-jet.vercel.app/

### **Key Features**

✨ **Hybrid ML Architecture**
- Ensemble approach combining XGBoost and Isolation Forest
- Dual-signal detection for robust fraud identification
- Complementary supervised + unsupervised learning paradigm

🔍 **Single Transaction Analysis**
- Real-time web form for analyzing individual transactions
- Instant risk scoring with explainability
- Interactive feature importance visualization

📦 **Batch Processing**
- Bulk-process thousands of transactions via CSV upload
- Extract high-risk anomalies for investigation
- Scalable transaction pipeline

💡 **Explainability**
- Top contributing features ranked by impact
- SHAP-style feature importance analysis
- Transparent risk score decomposition
- User-friendly explanations for business teams

📊 **Model Insights Dashboard**
- Real-time performance metrics (Precision, Recall, F1, AUC)
- Model comparison visualization
- Training history and model versioning
- Interactive charts and reports

### **Tech Stack**

**Backend:**
- Python 3.11
- FastAPI (modern async API framework)
- Scikit-learn (machine learning)
- XGBoost (gradient boosting)
- Pandas & NumPy (data processing)
- Pydantic (data validation)

**Frontend:**
- React 18 + TypeScript
- Vite (lightning-fast build tool)
- Recharts (interactive visualizations)
- Lucide-React (modern icons)
- Tailwind CSS (styling)

**Deployment:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Multi-container orchestration
- Production-ready configuration

### **Architecture**

```
FraudLens/
├── backend/                    # Python FastAPI backend
│   ├── api/                   # REST endpoints
│   ├── models/                # ML model training & inference
│   ├── core/                  # Business logic & utilities
│   ├── schemas/               # Pydantic data models
│   ├── data/                  # Dataset handling
│   ├── artifacts/             # Trained models & scalers
│   ├── tests/                 # Unit & integration tests
│   ├── main.py               # Application entry point
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend containerization
│
├── frontend/                  # React + TypeScript frontend
│   ├── src/                  # React components & logic
│   ├── public/               # Static assets
│   ├── package.json          # NPM dependencies
│   ├── vite.config.ts        # Build configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── Dockerfile            # Frontend containerization
│   └── README.md             # Frontend documentation
│
├── docker-compose.yml         # Multi-container orchestration
└── README.md                 # This file
```

### **Quick Start**

#### **Option 1: Docker (Recommended)**

```bash
# Clone repository
git clone https://github.com/metadroix35/ElevateLabs_Tasks.git
cd ElevateLabs_Tasks/FraudLens

# Run with Docker Compose
docker-compose up --build
```

**Access the application:**
- 🌐 Frontend: http://localhost:80
- 🔌 Backend API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

#### **Option 2: Local Development**

**Backend Setup:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain models
python -m backend.models.train

# Start API server
uvicorn backend.api.main:app --reload
```

**Frontend Setup (new terminal):**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Navigate to `http://localhost:5173` for the frontend.

### **ML Model Pipeline**

1. **Data Preprocessing**
   - Feature scaling and normalization
   - Handling missing values
   - Feature engineering

2. **Supervised Learning (XGBoost)**
   - Trained on labeled fraud/legitimate transactions
   - Binary classification
   - Produces probability scores

3. **Unsupervised Learning (Isolation Forest)**
   - Detects statistical anomalies
   - Identifies unusual transaction patterns
   - No label dependency required

4. **Hybrid Score Computation**
   - Combines both models' outputs
   - Weighted ensemble approach
   - Calibrated risk score (0-1)

5. **Explainability**
   - Feature importance extraction
   - Contribution analysis
   - Business-friendly explanations

### **API Endpoints**

**Single Transaction Prediction:**
```
POST /api/predict
{
  "amount": 150.00,
  "merchant_category": "grocery",
  "transaction_type": "online",
  ...
}
```

**Batch Processing:**
```
POST /api/batch_predict
(Multipart CSV file upload)
```

**Model Metrics:**
```
GET /api/model/metrics
```

**Feature Importance:**
```
GET /api/model/feature_importance
```

### **Testing**

Test the API with the provided payload:
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d @test_payload.json
```

---

## 📚 Learning Progression

```
Task 1: Data Cleaning
    ↓
Task 2: EDA & Insights
    ↓
Task 3: Linear Regression (Continuous Prediction)
    ↓
Task 4: Logistic Regression (Binary Classification)
    ↓
Task 5: Ensemble Methods (Advanced Classification)
    ↓
Task 6: Advanced Topics & Integration
    ↓
🎯 FraudLens Capstone: Production ML System
```

---

## 🎓 Skills Demonstrated

### **Machine Learning**
- Supervised & unsupervised learning
- Ensemble methods (XGBoost, Random Forest)
- Model evaluation & selection
- Hyperparameter tuning
- Feature engineering
- Anomaly detection

### **Data Science**
- Exploratory data analysis
- Statistical analysis
- Data cleaning & preprocessing
- Data visualization
- Business intelligence

### **Software Engineering**
- Full-stack development (Python + TypeScript/React)
- REST API design & implementation
- Docker containerization & orchestration
- Database design
- Code organization & best practices
- Testing & validation

### **ML Engineering**
- Model training pipelines
- Model versioning & artifacts
- API integration
- Production deployment
- Explainability & interpretability
- Scalable processing

---

## 📊 Performance Metrics

FraudLens models are evaluated on:
- **Precision:** Minimize false positives (incorrectly flagging legitimate transactions)
- **Recall:** Minimize false negatives (missing actual fraud)
- **F1-Score:** Balanced metric for imbalanced fraud datasets
- **AUC-ROC:** Model discrimination ability
- **Inference Speed:** Real-time transaction processing capability

---

## 🔒 Security & Privacy

- Input validation on all API endpoints
- Data sanitization for file uploads
- No storage of sensitive transaction details
- Secure model artifact management
- CORS protection in production

---

## 📝 Code Quality

- Type hints throughout codebase (Python & TypeScript)
- Comprehensive error handling
- Logging for debugging
- Modular architecture
- Clean code principles

---

## 🚀 Future Enhancements

- [ ] Real-time model retraining pipeline
- [ ] Advanced SHAP-based explainability
- [ ] Multi-class fraud categorization
- [ ] A/B testing framework
- [ ] Model monitoring & drift detection
- [ ] GraphQL API option
- [ ] Mobile app development
- [ ] Distributed processing (Spark)

---

## 📧 Contact & Resources

**Author:** [metadroix35](https://github.com/metadroix35)  
**Repository:** https://github.com/metadroix35/ElevateLabs_Tasks  
**Live Demo:** https://fraudlens-jet.vercel.app/

---

## 📄 License

This project is open source and available under the MIT License.

---

**Last Updated:** August 2026  
**Status:** Production Ready ✅
