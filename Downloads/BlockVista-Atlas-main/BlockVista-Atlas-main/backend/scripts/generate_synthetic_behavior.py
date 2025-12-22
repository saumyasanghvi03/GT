import os
import sys
import random
import uuid
from datetime import datetime, timedelta
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.models.amfi import DimScheme, SyntheticInvestorProfile, SyntheticTransaction, Base

# MODIFY THIS URL TO MATCH YOUR APP CONFIG
DATABASE_URL = "sqlite:///./blockvista.db" 

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def generate_data(num_investors=500):
    session = SessionLocal()
    print(f"Generating {num_investors} synthetic investors...")

    # 1. Fetch available schemes to link transactions to
    schemes = session.query(DimScheme.scheme_code).all()
    scheme_codes = [s[0] for s in schemes]
    
    if not scheme_codes:
        print("No schemes found in DB! Please run ingest_amfi_data.py first.")
        return

    # 2. Risk Profiles & Behavior Distribution
    profiles = ['Conservative', 'Moderate', 'Aggressive']
    liquidity_needs = ['Low', 'Medium', 'High']
    txn_types = ['SIP', 'Lumpsum', 'Redemption']

    new_investors = []
    new_txns = []

    for _ in range(num_investors):
        # Create Investor
        inv_id = f"INV-{uuid.uuid4().hex[:8].upper()}"
        risk = random.choice(profiles)
        horizon = random.randint(1, 15)
        
        # Logic: High horizon usually means Low liquidity need
        liq = 'Low' if horizon > 5 else random.choice(liquidity_needs)
        
        investor = SyntheticInvestorProfile(
            investor_id=inv_id,
            risk_profile=risk,
            horizon_years=horizon,
            liquidity_need=liq
        )
        new_investors.append(investor)

        # Create Transactions for this investor (Last 24 months)
        num_txns = random.randint(5, 24)
        for _ in range(num_txns):
            # Random date in last 2 years
            days_ago = random.randint(0, 730)
            t_date = datetime.now() - timedelta(days=days_ago)
            
            # Transaction Logic
            t_type = random.choices(txn_types, weights=[0.7, 0.2, 0.1], k=1)[0] # Mostly SIP
            scheme = random.choice(scheme_codes)
            
            amount = 0
            if t_type == 'SIP':
                amount = random.choice([5000, 10000, 15000, 25000])
            elif t_type == 'Lumpsum':
                amount = random.randint(50000, 500000)
            else: # Redemption
                amount = -1 * random.randint(10000, 100000)

            txn = SyntheticTransaction(
                txn_id=f"TXN-{uuid.uuid4().hex[:10]}",
                investor_id=inv_id,
                scheme_code=scheme,
                txn_date=t_date.date(),
                txn_type=t_type,
                amount=amount
            )
            new_txns.append(txn)

    # Bulk Insert
    try:
        session.bulk_save_objects(new_investors)
        session.bulk_save_objects(new_txns)
        session.commit()
        print(f"Successfully created {len(new_investors)} investors and {len(new_txns)} transactions.")
    except Exception as e:
        print(f"Error generating data: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    # Ensure tables exist (redundant if main.py ran, but safe)
    Base.metadata.create_all(bind=engine)
    generate_data()
