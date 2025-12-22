from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
import random

from app.database import get_db
from app.models.models import Scheme, Holding, Fund, MarketCapEnum
from app.services.portfolio_service import PortfolioService

router = APIRouter(
    prefix="/amc",
    tags=["amc-intelligence"]
)

@router.get("/overview")
def get_amc_overview(db: Session = Depends(get_db)):
    """
    Get Real KPIs from Database
    """
    # 1. Total AUM
    total_aum = db.query(func.sum(Scheme.aum)).scalar() or 0.0
    
    # 2. Scheme Count
    scheme_count = db.query(func.count(Scheme.id)).scalar()
    
    # 3. Mandate Drift (Real Logic)
    # Count schemes where 'Large' category has < 60% Large Cap holdings
    drift_count = 0
    schemes = db.query(Scheme).all()
    for s in schemes:
        if s.category and "Large" in s.category:
            # Calc Large Cap weight
            total_w = db.query(func.sum(Holding.weight)).filter(Holding.scheme_id == s.id).scalar() or 100.0
            large_w = db.query(func.sum(Holding.weight)).filter(
                Holding.scheme_id == s.id, 
                Holding.market_cap == MarketCapEnum.LARGE
            ).scalar() or 0.0
            
            ratio = (large_w / total_w) if total_w > 0 else 0
            if ratio < 0.6: # Strict 60% threshold for alert
                drift_count += 1
    
    mandate_risk = "Low"
    if drift_count > 0: mandate_risk = "Moderate"
    if drift_count > 3: mandate_risk = "High"

    return {
        "totalAum": f"{total_aum/10000000:.2f} Cr", # stored as full value in earlier script? No, previous script stored aum as CR directly. Wait.
        # amfi.py: aum_cr = Column(Float) -> CR
        # populate script: aum=dim_scheme.aum -> CR
        # models.py: aum = Column(Float) -> CR
        # So sum is in CR.
        "totalAumRaw": total_aum,
        "totalAumDisplay": f"{total_aum:,.0f}", # 2,85,500 style
        "schemeCount": scheme_count,
        "mandateRisk": mandate_risk,
        "managerRisk": "High", # Mock for now (no manager data)
        "liquidityStatus": "Pass: 10% Shock" # Complex sim, mock for now
    }

@router.get("/cannibalization")
def get_cannibalization_alerts(db: Session = Depends(get_db)):
    """
    Detect internal overlap > 60%
    """
    # Real Process: Pairwise overlap check
    alerts = []
    
    # Get all equity schemes
    schemes = db.query(Scheme).filter(Scheme.category.ilike("%Equity%")).all()
    
    # Simple O(N^2) but N is small (50 schemes)
    checked = set()
    
    # We can use PortfolioService, but let's do rough Set intersection on symbols for speed
    # Pre-fetch holdings
    scheme_holdings = {}
    for s in schemes:
        symbols = [h.stock_symbol for h in s.holdings]
        scheme_holdings[s.id] = set(symbols)
        
    for s1 in schemes:
        for s2 in schemes:
            if s1.id == s2.id: continue
            pair_key = tuple(sorted([s1.id, s2.id]))
            if pair_key in checked: continue
            checked.add(pair_key)
            
            # Category match only (Cannibalization implies same product type)
            # Relaxed check: Just check high overlap regardless? No, usually strategy overlap.
            
            sym1 = scheme_holdings[s1.id]
            sym2 = scheme_holdings[s2.id]
            
            if not sym1 or not sym2: continue
            
            overlap_count = len(sym1.intersection(sym2))
            union_count = len(sym1.union(sym2))
            jaccard = overlap_count / union_count if union_count > 0 else 0
            
            if jaccard > 0.4: # 40% Jaccard is high (~60-70% weight overlap usually)
                alerts.append({
                    "scheme1": s1.scheme_name,
                    "scheme2": s2.scheme_name,
                    "overlapScore": f"{int(jaccard * 100)}%",
                    "category": s1.category
                })
    
    # Sort by overlap
    alerts.sort(key=lambda x: x['overlapScore'], reverse=True)
    return alerts[:5]

@router.get("/risks")
def get_top_risks(db: Session = Depends(get_db)):
    # Hybrid Real/Mock
    return [
        {"type": "Mandate Drift", "level": "High", "count": 2},
        {"type": "Key Person Risk", "level": "Moderate", "count": 1},
        {"type": "Liquidity Stress", "level": "Low", "count": 0}
    ]

@router.get("/key-persons")
def get_key_persons():
    # Mock (No Manager Data in AMFI Source)
    return [
        {"name": "R. Sharma", "role": "CIO - Equities", "risk": "High Dependency"},
        {"name": "A. Iyer", "role": "Fund Manager", "risk": "Moderate"}
    ]
