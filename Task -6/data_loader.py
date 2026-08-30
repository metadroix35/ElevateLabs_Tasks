import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os

def get_or_create_dataset(filename="iris.csv"):
    if not os.path.exists(filename):
        iris = load_iris(as_frame=True)
        df = iris.frame
        df.to_csv(filename, index=False)
        print(f"Dataset saved to {filename}")
    
    df = pd.read_csv(filename)
    X = df.drop(columns=["target"])
    y = df["target"]
    return X, y

def prepare_data(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    return X_train, X_test, y_train, y_test
