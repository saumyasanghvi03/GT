import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Version information
__version__ = "0.1.0"


from app.api.endpoints import portfolio, compliance, attribution, similarity, bip, behavior, audit
from app.models import amfi # Import to register models
from app.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BlockVista Atlas API",
    description="Non-Trading Mutual Fund Intelligence Terminal",
    version=__version__,
)


# Routers are already imported at the top, but we need to include them here.
app.include_router(portfolio.router, prefix="/api/v1", tags=["portfolio"])
app.include_router(compliance.router, prefix="/api/v1", tags=["compliance"])
app.include_router(attribution.router, prefix="/api/v1", tags=["attribution"])
app.include_router(similarity.router, prefix="/api/v1", tags=["similarity"])
app.include_router(bip.router, prefix="/api/v1", tags=["bip"])
app.include_router(behavior.router, prefix="/api/v1", tags=["behavior"])
app.include_router(audit.router, prefix="/api/v1", tags=["audit"])

# New Routers (Phase 11 & 12 & 14)
from app.routers import distributor, sales, amc_intelligence
from app.api.endpoints import atlas, integrations, auth
app.include_router(distributor.router)
app.include_router(sales.router)
app.include_router(amc_intelligence.router, prefix="/api/v1")
app.include_router(atlas.router, prefix="/api/v1/atlas", tags=["atlas"])
app.include_router(integrations.router, prefix="/api/v1/integrations", tags=["integrations"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

# Configure CORS - allow origins from environment variable
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for debugging "Failed to fetch"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "blockvista-atlas-api"
    }


@app.get("/version")
async def get_version():
    """Version endpoint"""
    return {
        "version": __version__,
        "service": "blockvista-atlas-api",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "BlockVista Atlas API",
        "version": __version__,
        "docs": "/docs"
    }
