import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import joblib
import os
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, average_precision_score

def train_xgboost(X_train, y_train, X_test, y_test):
    print("Training XGBoost supervised model...")
    # Using scale_pos_weight for class imbalance
    scale_pos_weight = sum(y_train == 0) / sum(y_train == 1)
    
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    
    from sklearn.metrics import roc_curve
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    # Subsample for frontend performance if too many points, taking max 100 points
    step = max(1, len(fpr) // 100)
    roc_data = [{'fpr': float(f), 'tpr': float(t)} for f, t in zip(fpr[::step], tpr[::step])]
    if roc_data[-1]['fpr'] != 1.0 or roc_data[-1]['tpr'] != 1.0:
        roc_data.append({'fpr': 1.0, 'tpr': 1.0})
    
    metrics = {
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1': float(f1_score(y_test, y_pred)),
        'roc_auc': float(roc_auc_score(y_test, y_prob)),
        'pr_auc': float(average_precision_score(y_test, y_prob)),
        'roc_curve': roc_data
    }
    
    print("XGBoost Metrics:", metrics)
    
    os.makedirs('backend/artifacts', exist_ok=True)
    joblib.dump(model, 'backend/artifacts/xgb_model.pkl')
    joblib.dump(metrics, 'backend/artifacts/xgb_metrics.pkl')
    return model, metrics

def train_isolation_forest(X_train):
    print("Training Isolation Forest anomaly detection model...")
    # Train only on normal transactions or all data
    # Isolation forest doesn't strictly need labels, we train on X_train
    model = IsolationForest(
        n_estimators=100,
        contamination=0.01, # Expected anomaly rate
        random_state=42
    )
    
    model.fit(X_train)
    
    os.makedirs('backend/artifacts', exist_ok=True)
    joblib.dump(model, 'backend/artifacts/if_model.pkl')
    return model

if __name__ == "__main__":
    from backend.data.pipeline import generate_synthetic_data, preprocess_data
    
    df = generate_synthetic_data()
    X_train, X_test, y_train, y_test = preprocess_data(df)
    
    train_xgboost(X_train, y_train, X_test, y_test)
    train_isolation_forest(X_train)
    print("Model training completed and artifacts saved.")
