import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure backend root and parent directories are in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.session import init_db
from db.seed_data import seed

from auth.router import router as auth_router
from invites.router import router as invites_router
from hr.router import router as hr_router
from feedback.router import router as feedback_router
from daily_drafts.router import router as daily_drafts_router
from evidence.router import router as evidence_router
from reviews.router import router as reviews_router

app = FastAPI(
    title="Verity API",
    description="Bias-Aware 360° Performance Review Intelligence System API",
    version="2.0.0"
)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(invites_router, prefix="/api")
app.include_router(hr_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")
app.include_router(daily_drafts_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(reviews_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    init_db()
    seed()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Verity Intelligence System v2"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
