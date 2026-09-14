from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(
    title="CyberQuant-AI™ API",
    description="AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend (localhost, 127.0.0.1, Vite dev port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "platform": "CyberQuant-AI™",
        "status": "online",
        "description": "AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform",
        "version": "1.0.0",
        "endpoints": {
            "overview": "/api/overview",
            "assets": "/api/assets",
            "vulnerabilities": "/api/vulnerabilities",
            "controls": "/api/controls",
            "telemetry": "/api/telemetry",
            "simulate": "/api/simulate",
            "optimize": "/api/optimize",
            "what_if": "/api/scenarios/what-if",
            "compliance": "/api/compliance",
            "copilot": "/api/copilot/query",
            "board_report": "/api/report/data",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "cyberquant-ai-backend"}
