from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TransactionInput(BaseModel):
    # Defining a schema based on typical anonymized PCA fraud datasets
    Time: float = Field(..., ge=0, description="Time cannot be negative")
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float = Field(..., ge=0, description="Amount cannot be negative")

class FactorContribution(BaseModel):
    feature: str
    contribution: float
    direction: str

class RiskAssessment(BaseModel):
    risk_score: float
    risk_level: str
    fraud_probability: float
    anomaly_score: float
    contributing_factors: List[FactorContribution]

class BatchRiskAssessment(BaseModel):
    total_transactions: int
    low_risk_count: int
    medium_risk_count: int
    high_risk_count: int
    results: List[Dict[str, Any]]
