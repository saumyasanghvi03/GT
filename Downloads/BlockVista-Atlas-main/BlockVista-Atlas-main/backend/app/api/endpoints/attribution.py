from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.services.attribution_service import AttributionService

router = APIRouter()

def get_attribution_service():
    return AttributionService()

@router.get("/schemes/{scheme_id}/attribution")
def get_scheme_attribution(
    scheme_id: int,
    benchmark_id: int = 0,
    service: AttributionService = Depends(get_attribution_service)
):
    """
    Get Brinson-Fachler performance attribution.
    Decomposes active return into Allocation and Selection effects.
    """
    try:
        return service.get_attribution(scheme_id, benchmark_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
