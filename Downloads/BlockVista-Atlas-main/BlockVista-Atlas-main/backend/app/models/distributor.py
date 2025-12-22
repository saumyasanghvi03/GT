from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .amfi import Base
import enum

class DistributorCategory(str, enum.Enum):
    NATIONAL_DISTRIBUTOR = "National Distributor"
    IFA = "IFA"
    BANK = "Bank"
    FINTECH = "Fintech"

class Region(str, enum.Enum):
    NORTH = "North"
    SOUTH = "South"
    EAST = "East"
    WEST = "West"

class DimDistributor(Base):
    __tablename__ = "dim_distributor"

    arn_code = Column(String, primary_key=True, index=True) # e.g., ARN-12345
    distributor_name = Column(String)
    category = Column(String) # Using String instead of Enum for SQLite simplicity, or mapped enum
    region = Column(String)
    state = Column(String)
    city = Column(String)
    pincode = Column(String)

class FactDistributorDaily(Base):
    __tablename__ = "fact_distributor_daily"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    arn_code = Column(String, ForeignKey("dim_distributor.arn_code"), index=True)
    
    # We could link to scheme, but for high-level dashboard, aggregate or use scheme_category
    # Let's keep it simple: Aggregate stats per ARN per day (or month)
    # If we want scheme level, we add scheme_code. Let's add scheme_code for detail.
    scheme_code = Column(Integer, ForeignKey("dim_scheme.scheme_code"), nullable=True)
    
    aum_cr = Column(Float, default=0.0)
    gross_sales_cr = Column(Float, default=0.0)
    net_inflow_cr = Column(Float, default=0.0)
    
    distributor = relationship("DimDistributor")
