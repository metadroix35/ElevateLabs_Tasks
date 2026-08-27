# FraudLens

FraudLens is an Explainable Hybrid Machine Learning System for Transaction Risk Assessment. It combines the power of supervised classification (XGBoost) with unsupervised anomaly detection (Isolation Forest) to evaluate the risk of financial transactions.

It is designed as a decision-support tool that prioritizes transactions for review, providing robust explainability rather than claiming to autonomously determine whether a transaction is fraudulent.

## Features

- **Hybrid ML Architecture:** Blends XGBoost and Isolation Forest models.
- **Single Transaction Analysis:** Real-time form for analyzing a single transaction.
- **Batch CSV Analysis:** Bulk-process thousands of transactions to extract high-risk anomalies.
- **Explainability:** Identifies top contributing factors (features) leading to the risk score.
- **Model Insights Dashboard:** Visually track precision, recall, F1, and AUC metrics.

## Tech Stack

- **Backend:** Python 3.11, FastAPI, Scikit-learn, XGBoost
- **Frontend:** React, TypeScript, Vite, Recharts, Lucide-React
- **Deployment:** Docker, Docker Compose, Nginx

## Running with Docker (Recommended)

The easiest way to run the entire stack is using Docker Compose.

1. Clone the repository and navigate to the root directory.
2. Ensure you have Docker and Docker Compose installed.
3. Run the following command:

```bash
docker-compose up --build
```

- The **Frontend** will be available at `http://localhost:80`
- The **Backend API** will be available at `http://localhost:8000`
- **Interactive API Docs** available at `http://localhost:8000/docs`

## Running Locally for Development

If you prefer to run the applications locally without Docker:

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install fastapi uvicorn pandas numpy scikit-learn xgboost joblib pydantic pydantic-settings

# (Optional) Retrain models and generate artifacts
python -m backend.models.train

# Start FastAPI server
uvicorn backend.api.main:app --reload
```

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal window)
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Navigate to `http://localhost:5173` to use the application.
