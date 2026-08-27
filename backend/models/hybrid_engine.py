from backend.core.config import settings

def calculate_hybrid_risk_score(fraud_prob: float, anomaly_score: float) -> float:
    """
    fraud_prob: 0.0 to 1.0
    anomaly_score: -1.0 (anomaly) to 1.0 (normal) -> normalized to 0.0 to 1.0
    """
    # Normalize anomaly score from [-1, 1] to [1, 0] where 1 is highly anomalous
    # Original IF: -1 is outlier, 1 is inlier.
    # We want 1.0 to mean maximum anomaly risk.
    normalized_anomaly = (1 - anomaly_score) / 2.0
    
    # Calculate risk score (0-100)
    risk_score = (settings.WEIGHT_SUPERVISED * fraud_prob) + (settings.WEIGHT_ANOMALY * normalized_anomaly)
    risk_score = risk_score * 100.0
    
    return min(max(risk_score, 0.0), 100.0)

def determine_risk_level(risk_score: float) -> str:
    if risk_score >= settings.THRESHOLD_HIGH:
        return "High"
    elif risk_score >= settings.THRESHOLD_MEDIUM:
        return "Medium"
    else:
        return "Low"
