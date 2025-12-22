from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.services.similarity_service import SimilarityService

router = APIRouter()

def get_similarity_service():
    return SimilarityService()

@router.get("/schemes/{scheme_id}/similar")
def get_scheme_similarity(
    scheme_id: int,
    service: SimilarityService = Depends(get_similarity_service)
):
    """
    Get checking for similar schemes (Product Intelligence).
    Returns similarity scores (Method: Cosine Similarity of Holdings).
    """
    try:
        return service.get_similar_schemes(scheme_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
