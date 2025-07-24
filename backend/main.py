from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes.url_routes import router as url_router
from services.ml_service import PhishingDetector
import uvicorn

app = FastAPI(
    title="PhishGuard API",
    description="Advanced phishing detection API with ML-powered analysis",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(url_router, prefix="/api", tags=["URL Analysis"])

# Initialize ML model
phishing_detector = PhishingDetector()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        # TODO: Load trained model
        # phishing_detector.load_model("ml_model/phishing_model.joblib")
        print("PhishGuard API started successfully")
    except Exception as e:
        print(f"Error during startup: {e}")

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to PhishGuard API",
        "version": "2.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "ml_model": "operational",
            "database": "operational",
            "api": "operational"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 