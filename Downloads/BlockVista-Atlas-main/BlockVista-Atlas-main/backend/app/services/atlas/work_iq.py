from pydantic import BaseModel
from typing import List, Optional, Literal

class RiskProfile(BaseModel):
    risk_tolerance: Literal['Low', 'Moderate', 'High', 'Aggressive']
    forbidden_sectors: List[str] = []
    max_drawdown_tolerance: float = 0.15  # 15%
    horizon_years: int = 5

class UserContext(BaseModel):
    user_id: str
    role: Literal['AMC_FundManager', 'Wealth_RM', 'Advisor_IFA', 'Institutional_Trustee']
    aum_managed_cr: float
    risk_profile: RiskProfile
    focus_area: Optional[str] = None

class WorkIQService:
    def __init__(self):
        # In-memory mock store
        self._context_store = {}

    def get_context(self, user_id: str) -> UserContext:
        """
        Retrieves the Work IQ context for a user.
        If not found, returns a default AMC Fund Manager profile.
        """
        return self._context_store.get(user_id, UserContext(
            user_id=user_id,
            role='AMC_FundManager',
            aum_managed_cr=15000.0,
            risk_profile=RiskProfile(
                risk_tolerance='Moderate',
                forbidden_sectors=['Gambling', 'Tobacco']
            )
        ))

    def set_context(self, context: UserContext):
        self._context_store[context.user_id] = context
