from pydantic import BaseModel
from typing import List, Optional
from ..work_iq import UserContext, RiskProfile

class RiskFlag(BaseModel):
    severity: str # 'Critical', 'Warning', 'Info'
    message: str
    category: str # 'Concentration', 'Liquidity', 'Suitability'

class RiskOfficer:
    def check_constraints(self, context: UserContext) -> List[RiskFlag]:
        """
        Evaluates the user's current context against their Risk DNA.
        """
        flags = []
        profile = context.risk_profile
        
        # 1. Horizon Mismatch Check (Mock Logic)
        if profile.horizon_years < 3 and profile.risk_tolerance == 'Aggressive':
            flags.append(RiskFlag(
                severity='Critical',
                message="Horizon Mismatch: Aggressive profile requires > 3 years horizon.",
                category='Suitability'
            ))

        # 2. Sector Checks
        # Mocking a portfolio scan finding a forbidden sector
        found_sectors = ['Technology', 'Finance', 'Gambling'] # 'Gambling' is forbidden in mock
        
        for sector in found_sectors:
            if sector in profile.forbidden_sectors:
                flags.append(RiskFlag(
                    severity='Critical',
                    message=f"Mandate Violation: Portfolio contains forbidden sector '{sector}'",
                    category='Compliance'
                ))

        return flags

    def assess_proposal(self, proposal_type: str, user_role: str) -> Optional[RiskFlag]:
        """
        Checks if a proposed action is valid for the user's role.
        """
        if user_role == 'Advisor_IFA' and proposal_type == 'Alternative Investment Fund':
             return RiskFlag(
                severity='Warning',
                message="License Check: Ensure Category II AIF distribution license is active.",
                category='Regulatory'
            )
        return None
