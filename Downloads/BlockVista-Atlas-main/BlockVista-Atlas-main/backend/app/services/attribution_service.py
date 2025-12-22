from typing import List, Dict, Any
from app.models.models import SectorEnum

class AttributionService:
    def __init__(self):
        pass

    def get_attribution(self, scheme_id: int, benchmark_id: int = 0) -> Dict[str, Any]:
        """
        Calculate Brinson-Fachler attribution.
        In a real system, this would fetch historical holdings for both scheme and benchmark.
        Here we use mock data for demonstration.
        """
        
        # Mock Data Structure: Sector, PortWeight, BenchWeight, PortReturn, BenchReturn
        data = [
            {"sector": SectorEnum.FINANCIAL, "wp": 0.35, "wb": 0.30, "rp": 0.12, "rb": 0.10},
            {"sector": SectorEnum.TECHNOLOGY, "wp": 0.20, "wb": 0.15, "rp": 0.15, "rb": 0.18},
            {"sector": SectorEnum.CONSUMER, "wp": 0.15, "wb": 0.20, "rp": 0.08, "rb": 0.09},
            {"sector": SectorEnum.HEALTHCARE, "wp": 0.10, "wb": 0.10, "rp": 0.05, "rb": 0.05},
            {"sector": SectorEnum.ENERGY, "wp": 0.10, "wb": 0.15, "rp": 0.20, "rb": 0.12},
            {"sector": "Others", "wp": 0.10, "wb": 0.10, "rp": 0.02, "rb": 0.02},
        ]

        total_alloc_effect = 0
        total_select_effect = 0
        total_active_return = 0
        
        breakdown = []

        # Calculate Total Benchmark Return (Weighted)
        total_rb = sum(d["wb"] * d["rb"] for d in data)

        for row in data:
            sector = row["sector"]
            wp = row["wp"]
            wb = row["wb"]
            rp = row["rp"]
            rb = row["rb"]

            # Brinson-Fachler Math
            # Allocation: (Wp - Wb) * (Rb - TotalRb)
            alloc_effect = (wp - wb) * (rb - total_rb)
            
            # Selection: Wp * (Rp - Rb)
            select_effect = wp * (rp - rb)
            
            # Interaction: (Wp - Wb) * (Rp - Rb) -> Often combined into Selection in BF, 
            # but strictly it's interaction. We'll stick to 2-factor for simplicity/cleanness
            # or sum them. Let's do standard 2-factor where Selection includes Interaction if desired, 
            # OR typically BF is Allocation + Selection. 
            # Note: Standard BF defines Selection as Wb * (Rp - Rb) + Interaction.
            # Let's use the clean "Allocation + Selection" where Selection = Wp*(Rp-Rb) 
            # Wait, Wp*(Rp-Rb) includes interaction. That is valid.
            
            total_active = alloc_effect + select_effect
            
            total_alloc_effect += alloc_effect
            total_select_effect += select_effect
            total_active_return += total_active

            breakdown.append({
                "sector": sector,
                "weights": {"portfolio": wp, "benchmark": wb},
                "returns": {"portfolio": rp, "benchmark": rb},
                "effects": {
                    "allocation": round(alloc_effect * 100, 2), # In percentage points
                    "selection": round(select_effect * 100, 2),
                    "total": round(total_active * 100, 2)
                }
            })

        return {
            "scheme_id": scheme_id,
            "benchmark_id": benchmark_id,
            "total_active_return": round(total_active_return * 100, 2),
            "summary": {
                "allocation_effect": round(total_alloc_effect * 100, 2),
                "selection_effect": round(total_select_effect * 100, 2)
            },
            "breakdown": breakdown
        }
