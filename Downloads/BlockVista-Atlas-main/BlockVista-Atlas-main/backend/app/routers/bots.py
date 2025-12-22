from fastapi import APIRouter, Depends, Query
from typing import List
from app.services.bot_service import BotService, ActionCard

router = APIRouter()

@router.get("/actions", response_model=List[ActionCard])
async def get_bot_actions(mode: str = Query(..., description="The user mode (AMC, Wealth, Advisor, Institutional)")):
    """
    Fetch Algo Bot actions tailored to the specific user mode.
    """
    return BotService.get_actions_for_mode(mode)
