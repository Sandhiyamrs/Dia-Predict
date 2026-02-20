# DiaPredict – AI Diabetes Risk Predictor

A professional MedTech web application that uses Machine Learning to predict diabetes risk based on patient health parameters.

## Features

- **Machine Learning**: Evaluation of Logistic Regression and Random Forest models (auto-selects best).
- **API**: FastAPI backend with `POST /predict` endpoint.
- **Frontend**: Modern React.js UI with medical-grade design.
- **Visualization**: Interactive Feature Importance chart.
- **Real-time**: Instant predictions with probability scores.

## Project Structure

```
/backend
  main.py          # FastAPI application
  train.py         # ML Training script
  model.pkl        # Trained model (generated)
  requirements.txt # Python dependencies

/frontend
  src/             # React source code
  index.html       # Entry point
  package.json     # Node dependencies

/data
  diabetes.csv     # Dataset (auto-downloaded)
```

## Setup & Running Locally

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Backend

 Navigate to the project root:
 ```bash
 cd backend
 pip install -r requirements.txt
 python train.py  # Trains the model
 python main.py   # Starts API at http://localhost:8000
 ```

### 2. Frontend

 Open a new terminal in project root:
 ```bash
 cd frontend
 npm install
 npm run dev      # Starts UI at http://localhost:5173
 ```

## Deployment

### Backend (Render/Railway)
- Root directory: `./backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)
- Root directory: `./frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- **Important**: Update the API URL in `frontend/src/components/PredictionForm.jsx` to point to your deployed backend URL.

## API Usage

**POST** `/predict`

Payload:
```json
{
  "Pregnancies": 6,
  "Glucose": 148,
  "BloodPressure": 72,
  "SkinThickness": 35,
  "Insulin": 0,
  "BMI": 33.6,
  "DiabetesPedigreeFunction": 0.627,
  "Age": 50
}
```

Response:
```json
{
  "prediction": 1,
  "probability": 0.72,
  "risk_level": "High",
  "feature_importance": { ... }
}
```
