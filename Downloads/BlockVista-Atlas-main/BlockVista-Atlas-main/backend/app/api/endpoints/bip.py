from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.services.bip_service import BipService

router = APIRouter()

def get_bip_service():
    return BipService()

@router.get("/schemes/{scheme_id}/bip")
def get_bip_score(
    scheme_id: int,
    service: BipService = Depends(get_bip_service)
):
    """
    Get Bhartiya Investment Pulse (BIP™) Score.
    Returns composite governance score (0-100) and breakdown.
    """
    try:
        return service.calculate_bip_score(scheme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
