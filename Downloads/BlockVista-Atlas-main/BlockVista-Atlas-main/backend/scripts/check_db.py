from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./blockvista.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

try:
    schemes = session.execute(text("SELECT COUNT(*) FROM dim_scheme")).scalar()
    aum = session.execute(text("SELECT COUNT(*) FROM fact_aum_monthly")).scalar()
    investors = session.execute(text("SELECT COUNT(*) FROM synthetic_investor_profile")).scalar()
    
    print(f"Schemes: {schemes}")
    print(f"AUM Records: {aum}")
    print(f"Investors: {investors}")
except Exception as e:
    print(f"Error: {e}")
session.close()
