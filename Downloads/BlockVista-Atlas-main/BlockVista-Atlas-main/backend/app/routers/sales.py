from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.distributor import DimDistributor, FactDistributorDaily

router = APIRouter(
    prefix="/api/v1/sales",
    tags=["sales"]
)

@router.get("/regions")
def get_regional_performance(db: Session = Depends(get_db)):
    """
    Get aggregated sales performance by Region.
    """
    results = db.query(
        DimDistributor.region,
        func.sum(FactDistributorDaily.aum_cr).label("total_aum"),
        func.sum(FactDistributorDaily.net_inflow_cr).label("total_inflow")
    ).join(FactDistributorDaily, DimDistributor.arn_code == FactDistributorDaily.arn_code)\
     .group_by(DimDistributor.region).all()
    
    return {
        "regions": [
            {
                "name": r.region,
                "aum": round(r.total_aum, 2),
                "inflow": round(r.total_inflow, 2)
            }
            for r in results
        ]
    }
