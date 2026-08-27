from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from backend.schemas.transaction import TransactionInput, RiskAssessment, BatchRiskAssessment
from backend.models.predict import predict_transaction, predict_batch, get_metrics

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": get_metrics() is not None}

@router.get("/model/metrics")
def model_metrics():
    metrics = get_metrics()
    if not metrics:
        raise HTTPException(status_code=503, detail="Model metrics not available.")
    return {"metrics": metrics}

@router.post("/predict", response_model=RiskAssessment)
def predict_single(transaction: TransactionInput):
    try:
        tx_data = transaction.model_dump()
        result = predict_transaction(tx_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/batch", response_model=BatchRiskAssessment)
async def predict_batch_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV is allowed.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Verify required columns
        required_cols = list(TransactionInput.model_fields.keys())
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
            
        # Ensure only required cols are used
        df = df[required_cols]
        
        result = predict_batch(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
