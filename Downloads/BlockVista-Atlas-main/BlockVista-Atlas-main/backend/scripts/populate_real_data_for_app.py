import sys
import os
import random
from datetime import date, timedelta

# Add parent dir to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy import create_engine, func, desc
from sqlalchemy.orm import sessionmaker
from app.database import Base, engine as app_engine
from app.models.amfi import DimScheme, FactAumMonthly
from app.models.models import Fund, Scheme, Holding, SectorEnum, MarketCapEnum

# Use the same DB
SessionLocal = sessionmaker(bind=app_engine)

def populate_app_models():
    session = SessionLocal()
    print("Starting Real Data Population for App Models...")

    # Ensure tables exist
    print("Creating App Model tables if they don't exist...")
    # Import all models to ensure they are registered with Base
    from app.models.models import Fund, Scheme, Holding, Transaction, Investor
    Base.metadata.create_all(bind=app_engine)

    # 1. Clear existing App Data (Optional, but safe for dev)
    # session.query(Holding).delete()
    # session.query(Scheme).delete()
    # session.query(Fund).delete()
    # session.commit()

    # 2. Get Top 50 Schemes by AUM (Real Data)
    top_schemes_query = session.query(
        DimScheme, FactAumMonthly.aum_cr
    ).join(FactAumMonthly, DimScheme.scheme_code == FactAumMonthly.scheme_code)\
     .order_by(desc(FactAumMonthly.aum_cr))\
     .limit(50)
    
    top_schemes = top_schemes_query.all()
    print(f"Fetched {len(top_schemes)} real top schemes.")

    # Universe of Stocks (Realistic)
    large_cap_univ = [
        ("RELIANCE", "Reliance Industries", SectorEnum.ENERGY),
        ("HDFCBANK", "HDFC Bank", SectorEnum.FINANCIAL),
        ("ICICIBANK", "ICICI Bank", SectorEnum.FINANCIAL),
        ("INFY", "Infosys", SectorEnum.TECHNOLOGY),
        ("TCS", "TCS", SectorEnum.TECHNOLOGY),
        ("ITC", "ITC", SectorEnum.CONSUMER),
        ("LT", "Larsen & Toubro", SectorEnum.INDUSTRIAL),
        ("AXISBANK", "Axis Bank", SectorEnum.FINANCIAL),
        ("SBIN", "SBI", SectorEnum.FINANCIAL),
        ("BHARTIARTL", "Bharti Airtel", SectorEnum.TELECOM)
    ]

    mid_cap_univ = [
        ("TATACOMM", "Tata Communications", SectorEnum.TELECOM),
        ("VOLTAS", "Voltas", SectorEnum.CONSUMER),
        ("TVSMOTOR", "TVS Motor", SectorEnum.CONSUMER),
        ("FEDERALBNK", "Federal Bank", SectorEnum.FINANCIAL),
        ("MPHASIS", "Mphasis", SectorEnum.TECHNOLOGY)
    ]

    count = 0
    for dim_scheme, aum in top_schemes:
        # Create/Find Fund (AMC level logic proxy)
        amc_clean = dim_scheme.amc_name or "Unknown AMC"
        fund = session.query(Fund).filter_by(amc_name=amc_clean).first()
        if not fund:
            fund = Fund(
                fund_code=f"AMC_{abs(hash(amc_clean)) % 10000}",
                fund_name=amc_clean,
                amc_name=amc_clean
            )
            session.add(fund)
            session.flush() # get id

        # Create Scheme (App Model)
        # Check exist
        s_code_str = str(dim_scheme.scheme_code)
        app_scheme = session.query(Scheme).filter_by(scheme_code=s_code_str).first()
        
        if not app_scheme:
            app_scheme = Scheme(
                fund_id=fund.id,
                scheme_code=s_code_str,
                scheme_name=dim_scheme.scheme_name,
                scheme_type=dim_scheme.scheme_type or "Growth",
                category=dim_scheme.scheme_category or "Equity",
                nav=100.0, # Dummy NAV
                aum=aum
            )
            session.add(app_scheme)
            session.flush()

        # Generate Holdings
        # If Logic: Heavy overlap for same category
        univ = large_cap_univ
        if "Mid" in (dim_scheme.scheme_category or ""):
            univ = large_cap_univ[:3] + mid_cap_univ
        elif "Small" in (dim_scheme.scheme_category or ""):
            univ = mid_cap_univ
        
        # Pick 15 random stocks from universe
        picks = random.sample(univ * 3, k=15) # duplications allow simple weighting logic if needed, but sample implies unique?
        # Actually random.sample needs unique population if k > len. 
        # Let's just user univ as base
        picks = random.choices(univ, k=15)
        
        # Unique them
        seen_stocks = {}
        
        total_val = aum * 10000000 # cr to actual? no just scaling
        if not total_val or total_val == 0: total_val = 100000.0

        for symbol, name, sector in picks:
            if symbol in seen_stocks: continue
            seen_stocks[symbol] = True
            
            w = random.uniform(2.0, 8.0)
            
            holding = Holding(
                scheme_id=app_scheme.id,
                stock_symbol=symbol,
                stock_name=name,
                quantity=1000,
                value=(total_val * w / 100.0),
                weight=w,
                sector=sector,
                market_cap=MarketCapEnum.LARGE if symbol in [x[0] for x in large_cap_univ] else MarketCapEnum.MID,
                as_of_date=date.today()
            )
            session.add(holding)
        
        count += 1

    session.commit()
    print(f"Successfully bridged {count} schemes to App Models with Holdings.")

if __name__ == "__main__":
    try:
        populate_app_models()
    except Exception as e:
        import traceback
        with open("traceback.txt", "w") as f:
            traceback.print_exc(file=f)
        print(f"FAILED: {e}")
