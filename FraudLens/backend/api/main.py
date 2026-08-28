import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from backend.schemas.transaction import TransactionInput, RiskAssessment, FactorContribution, BatchRiskAssessment
from backend.core.config import settings

# Global variables for models
models = {}

async def lifespan(app: FastAPI):
    # Load models on startup
    try:
        models['xgb'] = joblib.load('backend/artifacts/xgb_model.pkl')
        models['if_model'] = joblib.load('backend/artifacts/if_model.pkl')
        models['scaler'] = joblib.load('backend/artifacts/scaler.pkl')
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")
    yield
    # Cleanup on shutdown
    models.clear()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_transaction(transaction: TransactionInput) -> RiskAssessment:
    if 'xgb' not in models or 'if_model' not in models or 'scaler' not in models:
        raise HTTPException(status_code=503, detail="Models not loaded")

    # Convert to DataFrame for scaler (which expects feature names)
    transaction_dict = transaction.model_dump()
    df = pd.DataFrame([transaction_dict])
    
    # Scale features
    df_scaled = pd.DataFrame(models['scaler'].transform(df), columns=df.columns)
    
    # 1. Supervised Model (XGBoost) - Probability of fraud
    xgb_prob = models['xgb'].predict_proba(df_scaled)[0, 1] * 100
    
    # 2. Unsupervised Model (Isolation Forest) - Anomaly score
    # decision_function gives lower scores to anomalies. 
    # Let's normalize it to a 0-100 anomaly score where higher is more anomalous.
    if_score_raw = models['if_model'].decision_function(df_scaled)[0]
    # Simple mapping: typically between -0.5 and 0.5. Let's make it 0 to 100.
    # If it's < 0 it's an anomaly.
    anomaly_score = max(0, min(100, (0.5 - if_score_raw) * 100))
    
    # Calculate blended risk score
    risk_score = (
        (xgb_prob * settings.WEIGHT_SUPERVISED) + 
        (anomaly_score * settings.WEIGHT_ANOMALY)
    )
    
    # Determine Risk Level
    if risk_score >= settings.THRESHOLD_HIGH:
        risk_level = "HIGH"
    elif risk_score >= settings.THRESHOLD_MEDIUM:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    # Get feature contributions (for Explainability)
    # Using XGBoost feature importances as a proxy for this simple example
    # In a real app, we might use SHAP values here.
    importances = models['xgb'].feature_importances_
    
    top_features = []
    # Sort indices by importance
    sorted_idx = np.argsort(importances)[::-1][:3]
    for idx in sorted_idx:
        feat_name = df.columns[idx]
        top_features.append(FactorContribution(
            feature=feat_name,
            contribution=float(importances[idx] * 100),
            direction="INCREASE" # Simplified
        ))
        
    return RiskAssessment(
        risk_score=float(risk_score),
        risk_level=risk_level,
        fraud_probability=float(xgb_prob),
        anomaly_score=float(anomaly_score),
        contributing_factors=top_features
    )

@app.post(f"{settings.API_V1_STR}/analyze", response_model=RiskAssessment)
async def analyze_single_transaction(transaction: TransactionInput):
    """
    Analyze a single transaction for fraud risk.
    """
    try:
        return analyze_transaction(transaction)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post(f"{settings.API_V1_STR}/analyze-batch", response_model=BatchRiskAssessment)
async def analyze_batch_transactions(transactions: List[TransactionInput]):
    """
    Analyze a batch of transactions.
    """
    try:
        if not transactions:
            return BatchRiskAssessment(total_transactions=0, low_risk_count=0, medium_risk_count=0, high_risk_count=0, results=[])

        if 'xgb' not in models or 'if_model' not in models or 'scaler' not in models:
            raise HTTPException(status_code=503, detail="Models not loaded")

        # Vectorized processing
        tx_dicts = [txn.model_dump() for txn in transactions]
        df = pd.DataFrame(tx_dicts)
        
        df_scaled = pd.DataFrame(models['scaler'].transform(df), columns=df.columns)
        
        xgb_probs = models['xgb'].predict_proba(df_scaled)[:, 1] * 100
        if_scores_raw = models['if_model'].decision_function(df_scaled)
        
        importances = models['xgb'].feature_importances_
        sorted_idx = np.argsort(importances)[::-1][:3]
        top_features = [
            FactorContribution(feature=df.columns[idx], contribution=float(importances[idx] * 100), direction="INCREASE")
            for idx in sorted_idx
        ]

        results = []
        counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}

        for i, txn_dict in enumerate(tx_dicts):
            xgb_prob = float(xgb_probs[i])
            iso_raw = float(if_scores_raw[i])
            anomaly_score = max(0, min(100, (0.5 - iso_raw) * 100))
            
            risk_score = (xgb_prob * settings.WEIGHT_SUPERVISED) + (anomaly_score * settings.WEIGHT_ANOMALY)
            
            if risk_score >= settings.THRESHOLD_HIGH:
                risk_level = "HIGH"
            elif risk_score >= settings.THRESHOLD_MEDIUM:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
                
            counts[risk_level] += 1
            
            assessment = RiskAssessment(
                risk_score=float(risk_score),
                risk_level=risk_level,
                fraud_probability=xgb_prob,
                anomaly_score=anomaly_score,
                contributing_factors=top_features
            )
            
            results.append({
                "transaction": txn_dict,
                "assessment": assessment.model_dump()
            })
            
        return BatchRiskAssessment(
            total_transactions=len(transactions),
            low_risk_count=counts["LOW"],
            medium_risk_count=counts["MEDIUM"],
            high_risk_count=counts["HIGH"],
            results=results
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(f"{settings.API_V1_STR}/model/metrics")
async def get_model_metrics():
    """
    Get evaluation metrics for the supervised model.
    """
    try:
        metrics = joblib.load('backend/artifacts/xgb_metrics.pkl')
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics not available: {e}")
