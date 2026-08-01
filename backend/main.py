import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db.session import init_db
from backend.db.seed_data import seed

from backend.auth.router import router as auth_router
from backend.invites.router import router as invites_router
from backend.hr.router import router as hr_router
from backend.feedback.router import router as feedback_router
from backend.daily_drafts.router import router as daily_drafts_router
from backend.evidence.router import router as evidence_router
from backend.reviews.router import router as reviews_router

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
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
