from typing import Dict, Any, List

class BehaviorService:
    def __init__(self):
        pass

    def analyze_investor_behavior(self, scheme_id: int) -> Dict[str, Any]:
        """
        Analyze investor behavior to detect AUM quality and leakage risks.
        Mock implementation.
        """
        
        # Mock Segmentation Data
        # In real system: Query transaction history table, group by investor_id, 
        # compute churn metrics, correlate redemptions with market dips.
        
        segments = [
            {"label": "Long-term Disciplined", "count": 450, "percentage": 45, "color": "green"},
            {"label": "Reactive (Panic Seller)", "count": 250, "percentage": 25, "color": "red"},
            {"label": "Return Chaser (Hot Money)", "count": 150, "percentage": 15, "color": "amber"},
            {"label": "Passive / Dormant", "count": 150, "percentage": 15, "color": "gray"},
        ]
        
        sip_analytics = {
            "total_sip_book": 12000000, # 1.2 Cr
            "active_sips": 5400,
            "sip_continuation_rate": 92.5, # %
            "churn_rate_annualized": 12.0, # %
            "avg_investor_tenure_months": 34
        }
        
        # Panic Risk Indicator
        # Simulated logic: High recent outflows correlation with market drop
        panic_risk = {
            "score": 65, # 0-100 (Higher is worse)
            "level": "Moderate",
            "trend": "Increasing",
            "description": "Recent volatility has triggered SIP stoppages in 'Reactive' cohort."
        }
        
        return {
            "scheme_id": scheme_id,
            "segments": segments,
            "sip_analytics": sip_analytics,
            "panic_risk": panic_risk,
            "actionables": [
                "Target 'Reactive' segment with 'Volatility is Opportunity' email campaign.",
                "Review exit loads for 'Return Chasers' (Hot Money)."
            ]
        }
