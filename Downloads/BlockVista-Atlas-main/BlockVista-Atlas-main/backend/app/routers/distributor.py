from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from ..database import get_db
from ..models.distributor import DimDistributor, FactDistributorDaily, DistributorCategory

router = APIRouter(
    prefix="/api/v1/distributors",
    tags=["distributors"]
)

@router.get("/top")
def get_top_distributors(
    limit: int = 10,
    metric: str = 'aum', # 'aum', 'inflow', 'gross'
    db: Session = Depends(get_db)
):
    """
    Get top distributors based on AUM or Flows.
    Aggregates daily data for the latest available month/period.
    """
    # For simplicity, let's sum up all time for now, or last 30 days
    # Real app would query date ranges.
    
    q = db.query(
        DimDistributor.arn_code,
        DimDistributor.distributor_name,
        DimDistributor.category,
        DimDistributor.region,
        func.sum(FactDistributorDaily.aum_cr).label("total_aum"),
        func.sum(FactDistributorDaily.net_inflow_cr).label("total_inflow"),
        func.sum(FactDistributorDaily.gross_sales_cr).label("total_sales")
    ).join(FactDistributorDaily, DimDistributor.arn_code == FactDistributorDaily.arn_code)\
     .group_by(DimDistributor.arn_code)
    
    if metric == 'inflow':
        q = q.order_by(desc("total_inflow"))
    elif metric == 'gross':
        q = q.order_by(desc("total_sales"))
    else:
        q = q.order_by(desc("total_aum"))
        
    results = q.limit(limit).all()
    
    return [
        {
            "arn": r.arn_code,
            "name": r.distributor_name,
            "category": r.category,
            "region": r.region,
            "aum": round(r.total_aum, 2),
            "inflow": round(r.total_inflow, 2),
            "sales": round(r.total_sales, 2)
        }
        for r in results
    ]

@router.get("/{arn}")
def get_distributor_details(arn: str, db: Session = Depends(get_db)):
    dist = db.query(DimDistributor).filter(DimDistributor.arn_code == arn).first()
    if not dist:
        raise HTTPException(status_code=404, detail="Distributor not found")
        
    # Get recent performance (last 30 entries)
    history = db.query(FactDistributorDaily)\
        .filter(FactDistributorDaily.arn_code == arn)\
        .order_by(FactDistributorDaily.date.desc())\
        .limit(30)\
        .all()
        
    total_aum = sum(h.aum_cr for h in history) / (len(history) or 1) # simple avg for AUM
    total_inflow = sum(h.net_inflow_cr for h in history)
    
    return {
        "profile": {
            "arn": dist.arn_code,
            "name": dist.distributor_name,
            "category": dist.category,
            "region": dist.region,
            "city": dist.city
        },
        "metrics": {
            "current_aum": round(total_aum, 2),
            "net_flow_30d": round(total_inflow, 2)
        }
    }
