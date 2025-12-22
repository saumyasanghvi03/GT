import os
import sys
import random
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import faker

# Add parent directory to path to allow importing app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.models.distributor import DimDistributor, FactDistributorDaily, DistributorCategory, Region, Base
from app.database import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
fake = faker.Faker('en_IN')

def init_db():
    print("Initializing Distributor tables...")
    Base.metadata.create_all(bind=engine)

def generate_distributors(n=100):
    session = SessionLocal()
    print(f"Generating {n} synthetic distributors...")
    
    cats = [DistributorCategory.NATIONAL_DISTRIBUTOR, DistributorCategory.IFA, DistributorCategory.BANK, DistributorCategory.FINTECH]
    weights = [0.1, 0.7, 0.1, 0.1]
    
    regions = [Region.NORTH, Region.SOUTH, Region.EAST, Region.WEST]
    states = {
        Region.NORTH: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh'],
        Region.SOUTH: ['Tamil Nadu', 'Karnataka', 'Telangana', 'Kerala'],
        Region.EAST: ['West Bengal', 'Odisha', 'Bihar', 'Assam'],
        Region.WEST: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa']
    }
    
    count = 0
    for i in range(n):
        arn = f"ARN-{random.randint(10000, 99999)}"
        # Check if exists
        if session.query(DimDistributor).filter_by(arn_code=arn).first():
            continue
            
        cat = random.choices(cats, weights=weights)[0]
        reg = random.choice(regions)
        state = random.choice(states[reg])
        city = fake.city()
        
        name = fake.company() if cat != DistributorCategory.IFA else fake.name()
        
        dist = DimDistributor(
            arn_code=arn,
            distributor_name=name,
            category=cat.value,
            region=reg.value,
            state=state,
            city=city,
            pincode=fake.postcode()
        )
        session.add(dist)
        count += 1
    
    session.commit()
    print(f"Created {count} distributors.")
    session.close()

def generate_sales_data(days=30):
    session = SessionLocal()
    print(f"Generating sales data for last {days} days...")
    
    distributors = session.query(DimDistributor).all()
    if not distributors:
        print("No distributors found!")
        return

    today = date.today()
    count = 0
    
    for day_offset in range(days):
        curr_date = today - timedelta(days=day_offset)
        
        # Randomly select active distributors for the day (e.g., 20% active)
        active_dist = random.sample(distributors, k=int(len(distributors) * 0.2))
        
        for d in active_dist:
            # Generate metrics
            # National distributors have higher volume
            scale = 10.0 if d.category == DistributorCategory.NATIONAL_DISTRIBUTOR.value else 1.0
            
            gross = round(random.uniform(0.1, 5.0) * scale, 2)
            redemption = round(random.uniform(0.0, gross * 0.8), 2)
            net = gross - redemption
            aum_change = net # simplified
            
            # Simple upsert logic check not needed for synthetic gen usually, but good practice
            fact = FactDistributorDaily(
                date=curr_date,
                arn_code=d.arn_code,
                scheme_code=None, # Overall stats
                aum_cr=round(random.uniform(10, 500) * scale, 2), # Random base AUM
                gross_sales_cr=gross,
                net_inflow_cr=net
            )
            session.add(fact)
            count += 1
            
    session.commit()
    print(f"Generated {count} daily sales records.")
    session.close()

if __name__ == "__main__":
    init_db()
    generate_distributors(200)
    generate_sales_data(90)
