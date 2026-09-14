# Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **CyberQuant-AI™** to cloud production:
- **Backend (FastAPI)** deployed on **Render** (Free Web Service)
- **Frontend (React + Vite)** deployed on **Vercel** (Free Hobby Tier)

---

## Step 1: Push Code to a GitHub Repository

1. Initialize Git in the project root:
   ```bash
   cd d:\cybersecurity
   git init
   git add .
   git commit -m "Initial commit of CyberQuant-AI platform"
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `cyberquant-ai`).
3. Link and push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/cyberquant-ai.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository (`cyberquant-ai`).
4. Configure the service settings:
   - **Name**: `cyberquant-ai-backend` (or any custom name)
   - **Region**: Oregon (US West) or Singapore / Frankfurt
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Advanced** → **Add Environment Variable**:
   - Key: `PYTHON_VERSION`
   - Value: `3.11.9`
6. Click **Create Web Service**.
7. Render will build and deploy your service. Once deployed, note down your Render service URL:
   ```
   https://cyberquant-ai-backend.onrender.com
   ```
   *(Verify by opening `https://cyberquant-ai-backend.onrender.com/health` in your browser. It will return `{"status":"healthy"}`).*

> [!NOTE]
> Render free tier services automatically spin down after 15 minutes of inactivity. When a new request arrives, it may take 30–50 seconds to cold-start.

---

## Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`cyberquant-ai`).
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE`
   - **Value**: `https://cyberquant-ai-backend.onrender.com/api`
     *(Replace with your actual Render service URL from Step 2, appending `/api` at the end)*.
6. Click **Deploy**.
7. In ~30 seconds, Vercel will provide your live production domain:
   ```
   https://cyberquant-ai.vercel.app
   ```

---

## Step 4: Verify Live Integration

1. Open your Vercel URL in your browser.
2. The dashboard will automatically fetch live data from your Render backend.
3. Test:
   - Run the **FAIR Monte Carlo** simulation.
   - Adjust the **Capital Optimizer** budget slider.
   - Test the **What-If Threat Simulator**.
   - Query the **AI Risk Copilot**.
   - Generate and print the **Board Audit Report**.
