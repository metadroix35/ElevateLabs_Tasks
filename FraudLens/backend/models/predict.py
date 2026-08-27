import joblib
import pandas as pd
import numpy as np
import os
from backend.models.hybrid_engine import calculate_hybrid_risk_score, determine_risk_level
from backend.models.explain import get_shap_explanations

# Global model variables
_xgb_model = None
_if_model = None
_scaler = None
_metrics = None

def load_models():
    global _xgb_model, _if_model, _scaler, _metrics
    try:
        _xgb_model = joblib.load('backend/artifacts/xgb_model.pkl')
        _if_model = joblib.load('backend/artifacts/if_model.pkl')
        _scaler = joblib.load('backend/artifacts/scaler.pkl')
        _metrics = joblib.load('backend/artifacts/xgb_metrics.pkl')
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")

def get_metrics():
    return _metrics

def predict_transaction(tx_data: dict):
    if not _xgb_model or not _if_model or not _scaler:
        raise ValueError("Models are not loaded.")
        
    df = pd.DataFrame([tx_data])
    feature_names = df.columns.tolist()
    
    # Scale features
    df_scaled = pd.DataFrame(_scaler.transform(df), columns=feature_names)
    
    # Supervised prediction
    fraud_prob = float(_xgb_model.predict_proba(df_scaled)[:, 1][0])
    
    # Anomaly detection (-1 for outliers, 1 for inliers)
    anomaly_score_raw = float(_if_model.decision_function(df_scaled)[0])
    
    # Calculate Risk Score
    risk_score = calculate_hybrid_risk_score(fraud_prob, anomaly_score_raw)
    risk_level = determine_risk_level(risk_score)
    
    # Explainability
    factors = get_shap_explanations(_xgb_model, df_scaled, feature_names)
    
    # Convert anomaly raw score to a normalized 0-1 probability-like metric for the frontend display
    normalized_anomaly = (1 - anomaly_score_raw) / 2.0
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "fraud_probability": fraud_prob,
        "anomaly_score": normalized_anomaly,
        "contributing_factors": factors
    }

def predict_batch(df: pd.DataFrame):
    if not _xgb_model or not _if_model or not _scaler:
        raise ValueError("Models are not loaded.")
        
    feature_names = df.columns.tolist()
    
    # Keep original ordering/index
    df_scaled = pd.DataFrame(_scaler.transform(df), columns=feature_names)
    
    fraud_probs = _xgb_model.predict_proba(df_scaled)[:, 1]
    anomaly_scores_raw = _if_model.decision_function(df_scaled)
    
    results = []
    
    low_count = 0
    med_count = 0
    high_count = 0
    
    for i in range(len(df)):
        risk_score = calculate_hybrid_risk_score(fraud_probs[i], anomaly_scores_raw[i])
        risk_level = determine_risk_level(risk_score)
        
        # Don't run SHAP for every row in batch to save time unless requested,
        # but PRD requires we just return risk summaries and processed results.
        normalized_anomaly = (1 - anomaly_scores_raw[i]) / 2.0
        
        if risk_level == "High":
            high_count += 1
        elif risk_level == "Medium":
            med_count += 1
        else:
            low_count += 1
            
        results.append({
            "index": i,
            "risk_score": float(risk_score),
            "risk_level": risk_level,
            "fraud_probability": float(fraud_probs[i]),
            "anomaly_score": float(normalized_anomaly)
        })
        
    return {
        "total_transactions": len(df),
        "low_risk_count": low_count,
        "medium_risk_count": med_count,
        "high_risk_count": high_count,
        "results": results
    }
