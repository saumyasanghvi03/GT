#!/usr/bin/env python3
"""
Data ingestion CLI for BlockVista Atlas

Usage:
    python ingest.py --source synthetic  # Generate and load synthetic data
    python ingest.py --source amfi --file path/to/file.csv  # Load AMFI data
"""

import argparse
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.models import Fund, Scheme, Holding, Investor, Transaction
from scripts.generate_synthetic_data import SyntheticDataGenerator
import json


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized")


def load_synthetic_data(db: Session):
    """Generate and load synthetic data"""
    print("Generating synthetic data...")
    
    generator = SyntheticDataGenerator(seed=42)
    
    # Create sample funds and schemes
    print("Creating funds and schemes...")
    funds_data = [
        {'fund_code': 'FUND001', 'fund_name': 'BluChip Equity Fund', 'amc_name': 'HDFC AMC'},
        {'fund_code': 'FUND002', 'fund_name': 'Growth Opportunities Fund', 'amc_name': 'ICICI AMC'},
        {'fund_code': 'FUND003', 'fund_name': 'Value Discovery Fund', 'amc_name': 'Axis AMC'},
    ]
    
    funds = []
    for fund_data in funds_data:
        fund = Fund(**fund_data)
        db.add(fund)
        funds.append(fund)
    
    db.commit()
    
    schemes_data = [
        {'fund_id': funds[0].id, 'scheme_code': 'SCH001', 'scheme_name': 'BluChip Equity Direct Growth', 'scheme_type': 'equity', 'category': 'Large Cap', 'nav': 52.34, 'aum': 15000000000},
        {'fund_id': funds[0].id, 'scheme_code': 'SCH002', 'scheme_name': 'BluChip Equity Regular Growth', 'scheme_type': 'equity', 'category': 'Large Cap', 'nav': 48.21, 'aum': 8000000000},
        {'fund_id': funds[1].id, 'scheme_code': 'SCH003', 'scheme_name': 'Growth Opportunities Direct', 'scheme_type': 'equity', 'category': 'Mid Cap', 'nav': 65.78, 'aum': 5000000000},
        {'fund_id': funds[2].id, 'scheme_code': 'SCH004', 'scheme_name': 'Value Discovery Direct', 'scheme_type': 'equity', 'category': 'Multi Cap', 'nav': 44.92, 'aum': 3500000000},
        {'fund_id': funds[2].id, 'scheme_code': 'SCH005', 'scheme_name': 'Value Discovery Regular', 'scheme_type': 'equity', 'category': 'Multi Cap', 'nav': 42.15, 'aum': 2000000000},
    ]
    
    schemes = []
    for scheme_data in schemes_data:
        scheme = Scheme(**scheme_data)
        db.add(scheme)
        schemes.append(scheme)
    
    db.commit()
    print(f"Created {len(funds)} funds and {len(schemes)} schemes")
    
    # Generate and load investors
    print("Generating investors...")
    investors_data = generator.generate_investors(100)
    investors = []
    for inv_data in investors_data:
        investor = Investor(**inv_data)
        db.add(investor)
        investors.append(investor)
    
    db.commit()
    print(f"Created {len(investors)} investors")
    
    # Generate holdings
    print("Generating holdings...")
    all_holdings = []
    for scheme in schemes:
        holdings_data = generator.generate_sample_holdings(scheme.id)
        for holding_data in holdings_data:
            holding = Holding(**holding_data)
            db.add(holding)
            all_holdings.append(holding)
    
    db.commit()
    print(f"Created {len(all_holdings)} holdings")
    
    # Generate transactions
    print("Generating transactions...")
    investor_ids = [inv.id for inv in investors]
    scheme_ids = [sch.id for sch in schemes]
    
    sip_txns = generator.generate_sip_transactions(investor_ids, scheme_ids, months=24)
    lumpsum_txns = generator.generate_lumpsum_transactions(investor_ids, scheme_ids, count=50)
    redemptions = generator.generate_redemptions(investor_ids, scheme_ids, count=30)
    
    all_transactions = sip_txns + lumpsum_txns + redemptions
    
    for txn_data in all_transactions:
        transaction = Transaction(**txn_data)
        db.add(transaction)
    
    db.commit()
    print(f"Created {len(all_transactions)} transactions")
    
    # Save to JSON files for reference
    from pathlib import Path
    
    # Find project root
    current = Path(__file__).resolve().parent.parent
    while current != current.parent:
        if (current / 'docker-compose.yml').exists():
            data_dir = str(current / 'data' / 'processed')
            break
        current = current.parent
    else:
        data_dir = '../../data/processed'
    
    generator.save_to_json(investors_data, 'synthetic_investors.json', data_dir)
    generator.save_to_json(all_transactions, 'synthetic_transactions.json', data_dir)
    
    print("\n✓ Synthetic data loaded successfully!")
    print(f"  - {len(funds)} Funds")
    print(f"  - {len(schemes)} Schemes")
    print(f"  - {len(investors)} Investors")
    print(f"  - {len(all_holdings)} Holdings")
    print(f"  - {len(all_transactions)} Transactions")


def load_amfi_data(db: Session, filepath: str):
    """Load data from AMFI file"""
    print(f"Loading AMFI data from {filepath}...")
    # TODO: Implement AMFI file parser
    print("AMFI data loading not yet implemented")
    print("This would parse AMFI CSV/Excel files and populate the database")


def main():
    parser = argparse.ArgumentParser(description='BlockVista Atlas Data Ingestion CLI')
    parser.add_argument('--source', choices=['synthetic', 'amfi'], required=True,
                        help='Data source to ingest')
    parser.add_argument('--file', type=str, help='File path for AMFI data')
    parser.add_argument('--init-db', action='store_true', help='Initialize database tables')
    
    args = parser.parse_args()
    
    # Initialize database if requested
    if args.init_db:
        init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        if args.source == 'synthetic':
            load_synthetic_data(db)
        elif args.source == 'amfi':
            if not args.file:
                print("Error: --file is required for AMFI data source")
                sys.exit(1)
            load_amfi_data(db, args.file)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
