from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from ...services.atlas.council import CouncilOrchestrator, AtlasReport
from ...services.atlas.work_iq import UserContext, WorkIQService

router = APIRouter()
council = CouncilOrchestrator()
work_iq = WorkIQService()

class InquiryRequest(BaseModel):
    query: str
    user_id: str
    mode: str  # AMC, Wealth, Advisor, Institutional

@router.post("/council/inquiry", response_model=AtlasReport)
async def ask_council(request: InquiryRequest):
    """
    Main entry point for the Atlas Council.
    Processes a user query through the governed multi-agent loop.
    """
    try:
        # Update context with current mode if needed (simplified)
        # In real app, we might check permissions for the mode here.
        
        report = await council.convene(request.user_id, request.query)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/context/{user_id}", response_model=UserContext)
async def get_user_context(user_id: str):
    """
    Debug endpoint to view the current Work IQ context for a user.
    """
    return work_iq.get_context(user_id)
