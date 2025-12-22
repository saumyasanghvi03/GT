from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.models import RiskLevelEnum, SectorEnum, VerdictLevelEnum

class ComplianceService:
    def __init__(self):
        pass

    def _get_risk_score(self, risk_level: str) -> int:
        mapping = {
            RiskLevelEnum.CONSERVATIVE: 1,
            RiskLevelEnum.MODERATE: 2,
            RiskLevelEnum.AGGRESSIVE: 3
        }
        return mapping.get(risk_level, 2)

    def evaluate_portfolio(self, portfolio: Dict[str, Any], investor_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate portfolio against investor profile and governance rules.
        """
        reasons = []
        score = 100
        verdict = VerdictLevelEnum.GREEN

        # Rule 1: Risk Profile Mismatch
        inv_risk = investor_profile.get("risk_profile", RiskLevelEnum.MODERATE)
        port_risk_score = portfolio.get("risk_score", 2)  # 1=Low, 2=Med, 3=High
        inv_risk_score = self._get_risk_score(inv_risk)

        if port_risk_score > inv_risk_score:
            verdict = VerdictLevelEnum.RED
            score -= 40
            reasons.append({
                "code": "RISK_MISMATCH",
                "severity": "HIGH",
                "description": f"Portfolio risk ({port_risk_score}) exceeds investor profile ({inv_risk})."
            })
        elif port_risk_score < inv_risk_score - 1:
             verdict = VerdictLevelEnum.AMBER
             score -= 10
             reasons.append({
                "code": "RISK_UNDERUTILIZED",
                "severity": "LOW",
                "description": "Portfolio is significantly more conservative than investor profile."
            })

        # Rule 2: Sector Concentration
        # Assuming portfolio has 'sector_allocation' dict {sector: weight_percent}
        sector_allocations = portfolio.get("sector_allocation", {})
        for sector, weight in sector_allocations.items():
            if weight > 30:
                verdict = VerdictLevelEnum.AMBER if verdict == VerdictLevelEnum.GREEN else verdict
                score -= 15
                reasons.append({
                    "code": "SECTOR_CONCENTRATION",
                    "severity": "MEDIUM",
                    "description": f"High concentration in {sector} sector ({weight}% > 30% limit)."
                })

        # Rule 3: Horizon Mismatch (Stub Logic)
        inv_horizon = investor_profile.get("investment_horizon_years", 3)
        port_duration = portfolio.get("avg_duration_years", 1)  # Default short duration
        
        # If investor wants 5+ years but portfolio is debt/liquid (duration < 1) -> Warning
        if inv_horizon > 5 and port_duration < 1:
             score -= 10
             reasons.append({
                "code": "HORIZON_DRAG",
                "severity": "LOW",
                "description": "Long-term investor holds excessive short-duration assets."
             })

        return {
            "verdict": verdict,
            "confidence_score": 0.95,  # Static confidence for deterministic rules
            "compliance_score": max(0, score),
            "timestamp": datetime.utcnow().isoformat(),
            "reasons": reasons
        }
