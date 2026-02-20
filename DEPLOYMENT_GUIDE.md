# DiaPredict – Split-Service Deployment Architecture

To avoid Vercel's serverless size limits (~250MB), we are deploying the project in two parts:
1.  **Frontend (UI)**: Hosted on **Vercel** (Static site).
2.  **Backend (ML API)**: Hosted on **Render** (Docker/Python Web Service).

---

## 🚀 Part 1: Deploy Backend on Render (FREE)

1.  **Create a Render account**: Go to [render.com](https://render.com).
2.  **New Web Service**:
    *   Connect your GitHub repository.
    *   **Name**: `diapredict-api`
    *   **Environment**: `Python 3`
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --chdir backend main:app --bind 0.0.0.0:$PORT`
        *   *(Or simpler: `uvicorn --app-dir backend main:app --host 0.0.0.0 --port $PORT`)*
3.  **Wait for Build**: Render will install Pandas, Scikit-learn, etc. Since it's a dedicated web service, there is **no 250MB limit**.
4.  **Copy URL**: Once deployed, copy your backend URL (e.g., `https://diapredict-api.onrender.com`).

---

## 🎨 Part 2: Deploy Frontend on Vercel

1.  **Go to Vercel**: Import your repository.
2.  **Build Settings**:
    *   **Framework**: Vite
    *   **Root Directory**: `./`
    *   **Build Command**: `cd frontend && npm install && npm run build`
    *   **Output Directory**: `frontend/dist`
3.  **Environment Variables**:
    *   Add `VITE_API_URL`
    *   **Value**: Paste your Render URL (e.g., `https://diapredict-api.onrender.com`)
4.  **Deploy**: Vercel will build the frontend and it will now communicate with your Render backend.

---

## ✅ Why this works?
*   **Vercel** handles the fast global delivery of your React UI.
*   **Render** handles the heavy lifting of the ML model with `pandas` and `scikit-learn` without bundle size restrictions.
*   The **CORS** policy I added to `main.py` allows these two separate domains to talk to each other.
