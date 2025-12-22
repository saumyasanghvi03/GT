"""
Pydantic schemas for BlockVista Atlas

These schemas define the data structures and validation rules for the system.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class MarketCap(str, Enum):
    """Market capitalization category"""
    LARGE = "large"
    MID = "mid"
    SMALL = "small"
    OTHER = "other"


class Sector(str, Enum):
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


class RiskLevel(str, Enum):
    """Risk tolerance levels"""
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class VerdictLevel(str, Enum):
    """Suitability verdict levels"""
    GREEN = "green"
    AMBER = "amber"
    RED = "red"


class InvestorSegment(str, Enum):
    """Investor behavior segments"""
    LONG_TERM = "long_term"
    REACTIVE = "reactive"
    RETURN_CHASER = "return_chaser"


# ==================== Base Schemas ====================

class HoldingBase(BaseModel):
    """Base schema for a portfolio holding"""
    stock_symbol: str = Field(..., description="Stock ticker symbol")
    stock_name: str = Field(..., description="Full stock name")
    quantity: int = Field(..., ge=0, description="Number of shares held")
    value: float = Field(..., ge=0, description="Market value in INR")
    weight: float = Field(..., ge=0, le=100, description="Weight in portfolio (%)")
    sector: Sector = Field(..., description="Sector classification")
    market_cap: MarketCap = Field(..., description="Market cap category")


class HoldingCreate(HoldingBase):
    """Schema for creating a holding"""
    scheme_id: int


class Holding(HoldingBase):
    """Schema for a holding response"""
    id: int
    scheme_id: int
    as_of_date: date
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Fund & Scheme Schemas ====================

class FundBase(BaseModel):
    """Base schema for a mutual fund"""
    fund_code: str = Field(..., description="Unique fund identifier")
    fund_name: str = Field(..., description="Fund name")
    amc_name: str = Field(..., description="Asset Management Company name")


class FundCreate(FundBase):
    """Schema for creating a fund"""
    pass


class Fund(FundBase):
    """Schema for a fund response"""
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class SchemeBase(BaseModel):
    """Base schema for a fund scheme"""
    scheme_code: str = Field(..., description="Unique scheme identifier")
    scheme_name: str = Field(..., description="Scheme name")
    scheme_type: str = Field(..., description="Scheme type (equity, debt, hybrid)")
    category: str = Field(..., description="Scheme category")
    nav: Optional[float] = Field(None, ge=0, description="Current NAV")
    aum: Optional[float] = Field(None, ge=0, description="Assets under management")


class SchemeCreate(SchemeBase):
    """Schema for creating a scheme"""
    fund_id: int


class Scheme(SchemeBase):
    """Schema for a scheme response"""
    id: int
    fund_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Investor & Transaction Schemas ====================

class InvestorBase(BaseModel):
    """Base schema for an investor"""
    investor_code: str = Field(..., description="Unique investor identifier")
    age: int = Field(..., ge=18, le=100, description="Age")
    risk_profile: RiskLevel = Field(..., description="Risk tolerance level")
    investment_horizon_years: int = Field(..., ge=1, le=40, description="Investment horizon")


class InvestorCreate(InvestorBase):
    """Schema for creating an investor"""
    pass


class Investor(InvestorBase):
    """Schema for an investor response"""
    id: int
    segment: Optional[InvestorSegment] = None
    churn_probability: Optional[float] = Field(None, ge=0, le=1)
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TransactionBase(BaseModel):
    """Base schema for a transaction"""
    transaction_type: str = Field(..., description="SIP, lumpsum, or redemption")
    amount: float = Field(..., description="Transaction amount in INR")
    units: float = Field(..., description="Units allocated/redeemed")
    nav: float = Field(..., gt=0, description="NAV at transaction")
    transaction_date: date = Field(..., description="Transaction date")


class TransactionCreate(TransactionBase):
    """Schema for creating a transaction"""
    investor_id: int
    scheme_id: int


class Transaction(TransactionBase):
    """Schema for a transaction response"""
    id: int
    investor_id: int
    scheme_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Risk & Suitability Schemas ====================

class RiskProfile(BaseModel):
    """Risk profile assessment"""
    investor_id: int
    risk_level: RiskLevel
    max_equity_exposure: float = Field(..., ge=0, le=100, description="Max equity % recommended")
    max_single_stock_concentration: float = Field(..., ge=0, le=100)
    max_sector_concentration: float = Field(..., ge=0, le=100)
    min_investment_horizon_years: int = Field(..., ge=1)
    
    model_config = ConfigDict(from_attributes=True)


class SuitabilityVerdict(BaseModel):
    """Suitability assessment verdict"""
    investor_id: int
    scheme_id: int
    verdict: VerdictLevel
    reasons: List[str] = Field(..., description="List of reason codes")
    explanation: str = Field(..., description="Human-readable explanation")
    timestamp: datetime
    audit_trace_id: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Performance Attribution Schemas ====================

class AttributionBreakdown(BaseModel):
    """Performance attribution breakdown"""
    scheme_id: int
    period_start: date
    period_end: date
    total_return: float = Field(..., description="Total return (%)")
    market_beta: float = Field(..., description="Beta vs benchmark")
    allocation_effect: float = Field(..., description="Allocation effect (%)")
    selection_effect: float = Field(..., description="Selection effect (%)")
    r_squared: float = Field(..., ge=0, le=1, description="R-squared of regression")
    benchmark_return: float = Field(..., description="Benchmark return (%)")
    timestamp: datetime
    audit_trace_id: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Audit & Traceability Schemas ====================

class AuditTrace(BaseModel):
    """Audit trail for calculations"""
    id: int
    operation_type: str = Field(..., description="Type of operation")
    inputs: Dict[str, Any] = Field(..., description="Input parameters")
    assumptions: Dict[str, Any] = Field(..., description="Assumptions applied")
    calculation_method: str = Field(..., description="Methodology used")
    timestamp: datetime
    data_snapshot_date: date = Field(..., description="Date of input data")
    
    model_config = ConfigDict(from_attributes=True)


# ==================== Lookthrough Schemas ====================

class ExposureBreakdown(BaseModel):
    """Exposure breakdown for lookthrough"""
    scheme_id: int
    as_of_date: date
    stock_exposures: Dict[str, float] = Field(..., description="Stock symbol -> % exposure")
    sector_exposures: Dict[str, float] = Field(..., description="Sector -> % exposure")
    market_cap_exposures: Dict[str, float] = Field(..., description="Market cap -> % exposure")
    top_holdings: List[Holding]
    concentration_warnings: List[str] = Field(default_factory=list)
    
    model_config = ConfigDict(from_attributes=True)


class OverlapAnalysis(BaseModel):
    """Overlap analysis between schemes"""
    scheme_a_id: int
    scheme_b_id: int
    overlap_percentage: float = Field(..., ge=0, le=100)
    common_holdings: List[str] = Field(..., description="List of common stock symbols")
    as_of_date: date
    
    model_config = ConfigDict(from_attributes=True)
