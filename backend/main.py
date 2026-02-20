from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import pandas as pd
from pydantic import BaseModel
import os

app = FastAPI(title="DiaPredict AI - Diabetes Prediction System")

# Enable CORS for frontend (Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None
    print(f"Warning: Model not found at {MODEL_PATH}. Prediction endpoint will fail.")

class PatientData(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "DiaPredict AI Backend is running. Send POST to /predict"
    }

@app.post("/predict")
def predict_diabetes(data: PatientData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model file missing from server.")
    
    # Feature columns matching training data
    features = [
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
    ]
    
    # Prepare input data as DataFrame (Render handles larger bundles, so we can use Pandas)
    input_df = pd.DataFrame([[
        data.Pregnancies, data.Glucose, data.BloodPressure, data.SkinThickness,
        data.Insulin, data.BMI, data.DiabetesPedigreeFunction, data.Age
    ]], columns=features)
    
    # Predict
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]
    
    # Feature Importance Logic
    importance = {}
    if hasattr(model, "feature_importances_"):
        importance = dict(zip(features, model.feature_importances_.tolist()))
    elif hasattr(model, "coef_"):
        importance = dict(zip(features, model.coef_[0].tolist()))
    
    # Risk Level
    risk_level = "High Risk" if probability >= 0.5 else "Low Risk"
    
    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "risk_level": risk_level,
        "feature_importance": importance
    }

if __name__ == "__main__":
    import uvicorn
    # Use environment variable for port (required by Render/Railway)
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
