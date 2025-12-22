from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from app.database import get_db
from app.services.portfolio_service import PortfolioService
from app.models.models import Scheme

router = APIRouter()

def get_portfolio_service(db: Session = Depends(get_db)):
    return PortfolioService(db)

class OverlapRequest(BaseModel):
    scheme_ids: List[int]

@router.get("/schemes/{scheme_id}/exposure", response_model=List[Dict[str, Any]])
def get_scheme_exposure(
    scheme_id: int,
    service: PortfolioService = Depends(get_portfolio_service)
):
    """
    Get sector exposure for a specific scheme
    """
    try:
        exposure = service.calculate_sector_exposure(scheme_id)
        return exposure
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/schemes/{scheme_id}/concentration")
def get_scheme_concentration(
    scheme_id: int,
    service: PortfolioService = Depends(get_portfolio_service)
):
    """
    Get concentration metrics (HHI, Top 10)
    """
    return service.calculate_concentration_metrics(scheme_id)

@router.post("/analysis/overlap")
def check_portfolio_overlap(
    request: OverlapRequest,
    service: PortfolioService = Depends(get_portfolio_service)
):
    """
    Calculate overlap between two schemes
    """
    if len(request.scheme_ids) != 2:
        raise HTTPException(status_code=400, detail="Currently only supports comparing exactly 2 schemes")
    
    return service.check_overlap(request.scheme_ids[0], request.scheme_ids[1])
@router.get("/schemes", response_model=List[Dict[str, Any]])
def list_schemes(db: Session = Depends(get_db)):
    """
    List all available schemes for dropdowns
    """
    schemes = db.query(Scheme).all()
    return [{"id": s.id, "scheme_code": s.scheme_code, "name": s.scheme_name, "category": s.category} for s in schemes]
