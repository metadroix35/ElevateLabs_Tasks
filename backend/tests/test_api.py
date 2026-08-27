import pytest
from fastapi.testclient import TestClient
from backend.api.main import app
from backend.core.config import settings
import joblib

# Create a test client using the with block to trigger the lifespan events
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def get_sample_transaction():
    return {
        "Time": 50000.0,
        "V1": 0.1, "V2": 0.2, "V3": -0.1, "V4": 0.5, "V5": 0.1, 
        "V6": 0.1, "V7": 0.2, "V8": 0.1, "V9": 0.1, "V10": 0.0,
        "V11": 0.1, "V12": -0.2, "V13": 0.1, "V14": 0.3, "V15": 0.1,
        "V16": 0.1, "V17": 0.2, "V18": 0.1, "V19": 0.1, "V20": 0.0,
        "V21": 0.1, "V22": 0.2, "V23": -0.1, "V24": 0.5, "V25": 0.1, 
        "V26": 0.1, "V27": 0.2, "V28": 0.1, "Amount": 150.0
    }

def test_analyze_single_transaction(client):
    payload = get_sample_transaction()
    response = client.post(f"{settings.API_V1_STR}/analyze", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "risk_score" in data
    assert "risk_level" in data
    assert "fraud_probability" in data
    assert "anomaly_score" in data
    assert "contributing_factors" in data
    assert len(data["contributing_factors"]) == 3
    assert data["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

def test_analyze_batch_transactions(client):
    payload = [get_sample_transaction(), get_sample_transaction()]
    response = client.post(f"{settings.API_V1_STR}/analyze-batch", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_transactions"] == 2
    assert len(data["results"]) == 2
    assert "low_risk_count" in data
    assert "medium_risk_count" in data
    assert "high_risk_count" in data
    assert data["low_risk_count"] + data["medium_risk_count"] + data["high_risk_count"] == 2
