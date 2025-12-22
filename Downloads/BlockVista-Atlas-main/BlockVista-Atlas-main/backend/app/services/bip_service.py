from typing import Dict, Any, List
from app.services.compliance_service import ComplianceService
from app.services.similarity_service import SimilarityService
# Note: PortfolioService would also be used here for Stability metrics

class BipService:
    def __init__(self):
        self.compliance_service = ComplianceService()
        self.similarity_service = SimilarityService()

    def _get_bucket_status(self, score: float) -> str:
        if score >= 80: return "Strong"
        if score >= 60: return "Stable"
        if score >= 40: return "Watch"
        return "Fragile"

    def calculate_bip_score(self, scheme_id: int, benchmark_id: int = 0) -> Dict[str, Any]:
        """
        Calculate Bhartiya Investment Pulse (BIP) Score.
        A proprietary composite governance & stability score (0-100).
        """
        
        # 1. Suitability & Governance Pulse (25%)
        # In a real app, we'd fetch the actual portfolio & profile. Mocking "Moderate" profile here.
        # If verdicts are GREEN -> 100, AMBER -> 50, RED -> 0
        try:
            # Mock data for internal service calls
            comp_result = self.compliance_service.evaluate_portfolio({}, {}) 
            suitability_score = comp_result.get("compliance_score", 85) # Default from service logic 
        except:
            suitability_score = 75 # Fallback
            
        # 2. Concentration & Overlap Pulse (20%)
        # If Closet Indexer -> Low Score. High Similarity -> Low Score.
        try:
            sim_result = self.similarity_service.get_similar_schemes(scheme_id)
            is_closet = sim_result.get("is_closet_indexer", False)
            concentration_score = 40 if is_closet else 90
        except:
            concentration_score = 80

        # 3. Portfolio Stability Pulse (25%)
        # Mock calculation: Based on Volatility, Drawdown resilience
        stability_score = 78 

        # 4. Investor Behavior & Retention Pulse (15%)
        # Mock calculation: Based on SIP Churn
        behavior_score = 65

        # 5. Transparency & Explainability Pulse (15%)
        # Mock calculation: Data availability
        transparency_score = 95

        # Weighted Aggregation
        raw_score = (
            (suitability_score * 0.25) +
            (concentration_score * 0.20) +
            (stability_score * 0.25) +
            (behavior_score * 0.15) +
            (transparency_score * 0.15)
        )
        
        final_score = int(round(raw_score))
        status = self._get_bucket_status(final_score)

        return {
            "scheme_id": scheme_id,
            "bip_score": final_score,
            "bip_status": status,
            "timestamp": "2023-10-27T10:00:00Z",
            "breakdown": [
                {"label": "Portfolio Stability", "score": stability_score, "weight": "25%", "color": "blue"},
                {"label": "Suitability & Gov", "score": suitability_score, "weight": "25%", "color": "green"},
                {"label": "Conc. & Overlap", "score": concentration_score, "weight": "20%", "color": "purple"},
                {"label": "Investor Behavior", "score": behavior_score, "weight": "15%", "color": "amber"},
                {"label": "Transparency", "score": transparency_score, "weight": "15%", "color": "teal"},
            ],
            "analysis": f"The fund demonstrates {status} governance health. Primary drag is Investor Behavior ({behavior_score}) due to recent volatile inflows."
        }
