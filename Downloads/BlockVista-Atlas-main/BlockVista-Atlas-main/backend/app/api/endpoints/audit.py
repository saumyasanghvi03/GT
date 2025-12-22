from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.services.audit_service import AuditService

router = APIRouter()

def get_audit_service():
    return AuditService()

@router.get("/audit/traces")
def get_audit_traces(
    limit: int = 50,
    service: AuditService = Depends(get_audit_service)
):
    """
    Get Audit & Decision Traces.
    Returns lineage of automated decisions for explainability.
    """
    try:
        return service.get_recent_traces()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
