import pandas as pd
import numpy as np
import pickle
import os
import requests
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer

# Configuration
DATA_URL = "https://raw.githubusercontent.com/npradaschnor/Pima-Indians-Diabetes-Dataset/master/diabetes.csv"

# Calculate absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
DATA_PATH = os.path.join(DATA_DIR, "diabetes.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

def download_data():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    
    if not os.path.exists(DATA_PATH):
        print(f"Downloading data from {DATA_URL}...")
        response = requests.get(DATA_URL)
        if response.status_code == 200:
            with open(DATA_PATH, "wb") as f:
                f.write(response.content)
            print("Download complete.")
        else:
            print(f"Failed to download data. Status code: {response.status_code}")
            return
    else:
        print("Data already exists.")

def train_model():
    if not os.path.exists(DATA_PATH):
        print("Data file not found. Cannot train model.")
        return

    # Load dataset
    df = pd.read_csv(DATA_PATH)

    
    # Handle missing values (0s in these columns are actually missing values)
    zero_columns = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    imputer = SimpleImputer(missing_values=0, strategy='median')
    df[zero_columns] = imputer.fit_transform(df[zero_columns])

    # Split features and target
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize models
    lr_model = LogisticRegression(max_iter=1000)
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)

    # Train models
    lr_model.fit(X_train, y_train)
    rf_model.fit(X_train, y_train)

    # Evaluate models
    lr_acc = accuracy_score(y_test, lr_model.predict(X_test))
    rf_acc = accuracy_score(y_test, rf_model.predict(X_test))

    print(f"Logistic Regression Accuracy: {lr_acc:.4f}")
    print(f"Random Forest Accuracy: {rf_acc:.4f}")

    # Select best model
    if rf_acc >= lr_acc:
        best_model = rf_model
        model_name = "Random Forest"
    else:
        best_model = lr_model
        model_name = "Logistic Regression"

    print(f"Selected Model: {model_name}")

    # Save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(best_model, f)
    
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    download_data()
    train_model()
