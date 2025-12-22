from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class DimScheme(Base):
    __tablename__ = "dim_scheme"

    scheme_code = Column(Integer, primary_key=True, index=True)
    amc_name = Column(String, index=True)
    scheme_name = Column(String, nullable=False)
    scheme_type = Column(String)  # Open Ended / Close Ended
    scheme_category = Column(String, index=True)  # Equity, Debt, etc.
    scheme_nav_name = Column(String) # Required for mapping sometimes
    launch_date = Column(Date, nullable=True)
    isin_growth = Column(String, nullable=True)

    # Relationships
    aum_history = relationship("FactAumMonthly", back_populates="scheme")
    transactions = relationship("SyntheticTransaction", back_populates="scheme")

class FactAumMonthly(Base):
    __tablename__ = "fact_aum_monthly"

    id = Column(Integer, primary_key=True, index=True)
    scheme_code = Column(Integer, ForeignKey("dim_scheme.scheme_code"), nullable=False, index=True)
    month_end_date = Column(Date, nullable=False, index=True)
    
    aum_cr = Column(Float, default=0.0)
    aaum_cr = Column(Float, default=0.0)
    net_inflow_cr = Column(Float, default=0.0)

    scheme = relationship("DimScheme", back_populates="aum_history")

    __table_args__ = (
        UniqueConstraint('scheme_code', 'month_end_date', name='uq_scheme_month_aum'),
    )

class SyntheticInvestorProfile(Base):
    __tablename__ = "synthetic_investor_profile"

    investor_id = Column(String, primary_key=True, index=True)
    risk_profile = Column(String) # Conservative, Moderate, Aggressive
    horizon_years = Column(Integer)
    liquidity_need = Column(String) # Low, Medium, High
    
    transactions = relationship("SyntheticTransaction", back_populates="investor")

class SyntheticTransaction(Base):
    __tablename__ = "synthetic_transactions"

    txn_id = Column(String, primary_key=True, index=True)
    investor_id = Column(String, ForeignKey("synthetic_investor_profile.investor_id"), nullable=False)
    scheme_code = Column(Integer, ForeignKey("dim_scheme.scheme_code"), nullable=False)
    txn_date = Column(Date, nullable=False)
    txn_type = Column(String) # SIP, Lumpsum, Redemption
    amount = Column(Float)
    
    scheme = relationship("DimScheme", back_populates="transactions")
    investor = relationship("SyntheticInvestorProfile", back_populates="transactions")

class FactAmcAumMonthly(Base):
    __tablename__ = "fact_amc_aum_monthly"

    id = Column(Integer, primary_key=True, index=True)
    month_end_date = Column(Date, nullable=False, index=True)
    amc_name = Column(String, nullable=False, index=True)
    
    aum_cr = Column(Float, default=0.0)
    aaum_cr = Column(Float, default=0.0)

    __table_args__ = (
        UniqueConstraint('amc_name', 'month_end_date', name='uq_amc_month_aum'),
    )

class FactCategoryAumMonthly(Base):
    __tablename__ = "fact_category_aum_monthly"

    id = Column(Integer, primary_key=True, index=True)
    month_end_date = Column(Date, nullable=False, index=True)
    category = Column(String, nullable=False, index=True) # Equity, Debt, Liquid, etc.
    
    aum_cr = Column(Float, default=0.0)
    folios_count = Column(Integer, default=0)

    __table_args__ = (
        UniqueConstraint('category', 'month_end_date', name='uq_category_month_aum'),
    )
