from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from app.services.compliance_service import ComplianceService

router = APIRouter()

def get_compliance_service():
    return ComplianceService()

class ComplianceRequest(BaseModel):
    investor_profile: Dict[str, Any]
    portfolio_data: Dict[str, Any]

class ReasonCode(BaseModel):
    code: str
    severity: str
    description: str

class ComplianceResponse(BaseModel):
    verdict: str
    confidence_score: float
    compliance_score: int
    timestamp: str
    reasons: List[ReasonCode]

@router.post("/compliance/evaluate", response_model=ComplianceResponse)
def evaluate_compliance(
    request: ComplianceRequest,
    service: ComplianceService = Depends(get_compliance_service)
):
    """
    Evaluate portfolio suitability and compliance.
    Returns a GREEN/AMBER/RED verdict with reason codes.
    """
    try:
        result = service.evaluate_portfolio(request.portfolio_data, request.investor_profile)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
