from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.services.behavior_service import BehaviorService

router = APIRouter()

def get_behavior_service():
    return BehaviorService()

@router.get("/investor/behavior")
def get_investor_behavior(
    scheme_id: int = 1, # Default scheming ID for now
    service: BehaviorService = Depends(get_behavior_service)
):
    """
    Get Investor Behavior Intelligence.
    Returns segmentation, SIP analytics, and churn risk indicators.
    """
    try:
        return service.analyze_investor_behavior(scheme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
