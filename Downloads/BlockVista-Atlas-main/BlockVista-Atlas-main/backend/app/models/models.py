"""
SQLAlchemy ORM models for BlockVista Atlas

These models define the database schema and relationships.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base


# ==================== Enums ====================

class MarketCapEnum(str, enum.Enum):
    """Market capitalization category"""
    LARGE = "large"
    MID = "mid"
    SMALL = "small"
    OTHER = "other"


class SectorEnum(str, enum.Enum):
    """Sector classification"""
    FINANCIAL = "financial"
    TECHNOLOGY = "technology"
    HEALTHCARE = "healthcare"
    CONSUMER = "consumer"
    INDUSTRIAL = "industrial"
    ENERGY = "energy"
    MATERIALS = "materials"
    UTILITIES = "utilities"
    REAL_ESTATE = "real_estate"
    TELECOM = "telecom"
    OTHER = "other"


class RiskLevelEnum(str, enum.Enum):
    """Risk tolerance levels"""
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class VerdictLevelEnum(str, enum.Enum):
    """Suitability verdict levels"""
    GREEN = "green"
    AMBER = "amber"
    RED = "red"


class InvestorSegmentEnum(str, enum.Enum):
    """Investor behavior segments"""
    LONG_TERM = "long_term"
    REACTIVE = "reactive"
    RETURN_CHASER = "return_chaser"


# ==================== Models ====================

class Fund(Base):
    """Mutual fund entity"""
    __tablename__ = "funds"

    id = Column(Integer, primary_key=True, index=True)
    fund_code = Column(String(50), unique=True, index=True, nullable=False)
    fund_name = Column(String(200), nullable=False)
    amc_name = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    schemes = relationship("Scheme", back_populates="fund")


class Scheme(Base):
    """Fund scheme entity"""
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    fund_id = Column(Integer, ForeignKey("funds.id"), nullable=False)
    scheme_code = Column(String(50), unique=True, index=True, nullable=False)
    scheme_name = Column(String(200), nullable=False)
    scheme_type = Column(String(50), nullable=False)  # equity, debt, hybrid
    category = Column(String(100), nullable=False)
    nav = Column(Float, nullable=True)
    aum = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    fund = relationship("Fund", back_populates="schemes")
    holdings = relationship("Holding", back_populates="scheme")
    transactions = relationship("Transaction", back_populates="scheme")


class Holding(Base):
    """Portfolio holding entity"""
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    stock_symbol = Column(String(50), nullable=False, index=True)
    stock_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    value = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    sector = Column(SQLEnum(SectorEnum), nullable=False)
    market_cap = Column(SQLEnum(MarketCapEnum), nullable=False)
    as_of_date = Column(Date, nullable=False, index=True)

    # Relationships
    scheme = relationship("Scheme", back_populates="holdings")


class Investor(Base):
    """Investor entity"""
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True, index=True)
    investor_code = Column(String(50), unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=False)
    risk_profile = Column(SQLEnum(RiskLevelEnum), nullable=False)
    investment_horizon_years = Column(Integer, nullable=False)
    segment = Column(SQLEnum(InvestorSegmentEnum), nullable=True)
    churn_probability = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    transactions = relationship("Transaction", back_populates="investor")


class Transaction(Base):
    """Transaction entity"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey("investors.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # SIP, lumpsum, redemption
    amount = Column(Float, nullable=False)
    units = Column(Float, nullable=False)
    nav = Column(Float, nullable=False)
    transaction_date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    investor = relationship("Investor", back_populates="transactions")
    scheme = relationship("Scheme", back_populates="transactions")


class AuditTraceModel(Base):
    """Audit trail for calculations"""
    __tablename__ = "audit_traces"

    id = Column(Integer, primary_key=True, index=True)
    operation_type = Column(String(100), nullable=False, index=True)
    inputs = Column(JSON, nullable=False)
    assumptions = Column(JSON, nullable=False)
    calculation_method = Column(String(200), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    data_snapshot_date = Column(Date, nullable=False, index=True)
