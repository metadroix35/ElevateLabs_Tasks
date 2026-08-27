import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os
import joblib

def generate_synthetic_data(n_samples=10000, n_features=30):
    print("Generating synthetic transaction data...")
    # Generate imbalanced dataset (99% normal, 1% fraud)
    X, y = make_classification(
        n_samples=n_samples, 
        n_features=n_features, 
        n_informative=10, 
        n_redundant=5, 
        n_repeated=0,
        n_classes=2, 
        weights=[0.99, 0.01], 
        flip_y=0.01, 
        random_state=42
    )
    
    feature_names = ['Time'] + [f'V{i}' for i in range(1, 29)] + ['Amount']
    df = pd.DataFrame(X, columns=feature_names)
    
    # Adjust some features to look more realistic
    df['Time'] = df['Time'] * 10000 + 50000
    df['Amount'] = np.abs(df['Amount'] * 100 + 50)
    
    df['Class'] = y
    return df

def preprocess_data(df, target_col='Class'):
    print("Preprocessing data...")
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Standardize the features
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)
    
    # Save the scaler for inference
    os.makedirs('backend/artifacts', exist_ok=True)
    joblib.dump(scaler, 'backend/artifacts/scaler.pkl')
    
    return X_train_scaled, X_test_scaled, y_train, y_test

if __name__ == "__main__":
    df = generate_synthetic_data()
    os.makedirs('backend/data', exist_ok=True)
    df.to_csv('backend/data/synthetic_transactions.csv', index=False)
    X_train, X_test, y_train, y_test = preprocess_data(df)
    print("Data pipeline completed. Data shape:", X_train.shape)
