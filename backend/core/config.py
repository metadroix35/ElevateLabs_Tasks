from pydantic_settings import BaseSettings
from typing import ClassVar

class Settings(BaseSettings):
    PROJECT_NAME: str = "FraudLens API"
    API_V1_STR: str = "/api/v1"
    
    # Risk weights
    WEIGHT_SUPERVISED: float = 0.70
    WEIGHT_ANOMALY: float = 0.30
    
    # Thresholds
    THRESHOLD_MEDIUM: float = 35.0
    THRESHOLD_HIGH: float = 65.0
    
    class Config:
        case_sensitive = True

settings = Settings()
