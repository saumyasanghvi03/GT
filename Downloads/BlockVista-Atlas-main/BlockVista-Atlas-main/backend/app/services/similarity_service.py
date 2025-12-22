import numpy as np
from typing import List, Dict, Any, Tuple

class SimilarityService:
    def __init__(self):
        pass

    def _calculate_cosine_similarity(self, vec_a: Dict[str, float], vec_b: Dict[str, float]) -> float:
        """
        Calculate cosine similarity between two holding vectors.
        Vectors are dicts of {security_id: weight}.
        """
        # Get union of all securities
        all_keys = set(vec_a.keys()) | set(vec_b.keys())
        
        # Create ordered vectors
        v1 = np.array([vec_a.get(k, 0.0) for k in all_keys])
        v2 = np.array([vec_b.get(k, 0.0) for k in all_keys])
        
        if np.all(v1 == 0) or np.all(v2 == 0):
            return 0.0
            
        dot_product = np.dot(v1, v2)
        norm_a = np.linalg.norm(v1)
        norm_b = np.linalg.norm(v2)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
            
        return float(dot_product / (norm_a * norm_b))

    def get_similar_schemes(self, scheme_id: int) -> Dict[str, Any]:
        """
        Find schemes with high overlap to the target scheme.
        Mock implementation returning computed similarity.
        """
        # Mock Holdings Data (Target Scheme)
        target_holdings = {"HDFC": 9.0, "RELIANCE": 8.0, "INFY": 6.0, "ICICI": 5.0, "TCS": 4.0}
        
        # Mock Peers
        peers = [
            {"id": 101, "name": "BlueChip Peer A", "holdings": {"HDFC": 8.5, "RELIANCE": 7.5, "INFY": 6.5, "ICICI": 5.0, "TCS": 4.0}}, # Very Similar
            {"id": 102, "name": "Growth Fund B", "holdings": {"HDFC": 2.0, "RELIANCE": 8.0, "BAJFINANCE": 5.0, "AXIS": 4.0}},           # Moderate
            {"id": 103, "name": "SmallCap Fund C", "holdings": {"SUZLON": 5.0, "IDEA": 4.0, "JPPOWER": 3.0}},                            # Different
            {"id": 999, "name": "Nifty 50 Benchmark", "holdings": {"HDFC": 13.0, "RELIANCE": 10.0, "INFY": 7.0, "ICICI": 6.0, "TCS": 4.5}} # Benchmark
        ]

        similarity_results = []
        benchmark_similarity = 0.0

        for peer in peers:
            sim_score = self._calculate_cosine_similarity(target_holdings, peer["holdings"])
            
            if peer["id"] == 999:
                benchmark_similarity = sim_score
                continue

            similarity_results.append({
                "peer_id": peer["id"],
                "peer_name": peer["name"],
                "similarity_score": round(sim_score, 4),
                "overlap_percentage": round(sim_score * 100, 1), # Cosine sim relates to overlap
                "is_cannibalizing": sim_score > 0.90
            })

        # Sort by similarity desc
        similarity_results.sort(key=lambda x: x["similarity_score"], reverse=True)

        return {
            "target_scheme_id": scheme_id,
            "benchmark_similarity": round(benchmark_similarity, 4),
            "is_closet_indexer": benchmark_similarity > 0.95,
            "peers": similarity_results
        }
