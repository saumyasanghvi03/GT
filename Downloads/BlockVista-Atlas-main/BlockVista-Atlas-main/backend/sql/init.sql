-- BlockVista Atlas Database Schema
-- Version: 0.1.0
-- PostgreSQL 15+

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS investors CASCADE;
DROP TABLE IF EXISTS schemes CASCADE;
DROP TABLE IF EXISTS funds CASCADE;
DROP TABLE IF EXISTS audit_traces CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS market_cap_enum CASCADE;
DROP TYPE IF EXISTS sector_enum CASCADE;
DROP TYPE IF EXISTS risk_level_enum CASCADE;
DROP TYPE IF EXISTS verdict_level_enum CASCADE;
DROP TYPE IF EXISTS investor_segment_enum CASCADE;

-- Create custom types
CREATE TYPE market_cap_enum AS ENUM ('large', 'mid', 'small', 'other');
CREATE TYPE sector_enum AS ENUM ('financial', 'technology', 'healthcare', 'consumer', 'industrial', 'energy', 'materials', 'utilities', 'real_estate', 'telecom', 'other');
CREATE TYPE risk_level_enum AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE verdict_level_enum AS ENUM ('green', 'amber', 'red');
CREATE TYPE investor_segment_enum AS ENUM ('long_term', 'reactive', 'return_chaser');

-- Funds table
CREATE TABLE funds (
    id SERIAL PRIMARY KEY,
    fund_code VARCHAR(50) UNIQUE NOT NULL,
    fund_name VARCHAR(200) NOT NULL,
    amc_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funds_code ON funds(fund_code);

-- Schemes table
CREATE TABLE schemes (
    id SERIAL PRIMARY KEY,
    fund_id INTEGER NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    scheme_code VARCHAR(50) UNIQUE NOT NULL,
    scheme_name VARCHAR(200) NOT NULL,
    scheme_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nav FLOAT,
    aum FLOAT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schemes_code ON schemes(scheme_code);
CREATE INDEX idx_schemes_fund_id ON schemes(fund_id);

-- Holdings table
CREATE TABLE holdings (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(50) NOT NULL,
    stock_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    value FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    sector sector_enum NOT NULL,
    market_cap market_cap_enum NOT NULL,
    as_of_date DATE NOT NULL
);

CREATE INDEX idx_holdings_scheme_id ON holdings(scheme_id);
CREATE INDEX idx_holdings_symbol ON holdings(stock_symbol);
CREATE INDEX idx_holdings_date ON holdings(as_of_date);

-- Investors table
CREATE TABLE investors (
    id SERIAL PRIMARY KEY,
    investor_code VARCHAR(50) UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
    risk_profile risk_level_enum NOT NULL,
    investment_horizon_years INTEGER NOT NULL CHECK (investment_horizon_years >= 1),
    segment investor_segment_enum,
    churn_probability FLOAT CHECK (churn_probability >= 0 AND churn_probability <= 1),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investors_code ON investors(investor_code);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
    scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL,
    amount FLOAT NOT NULL,
    units FLOAT NOT NULL,
    nav FLOAT NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_investor_id ON transactions(investor_id);
CREATE INDEX idx_transactions_scheme_id ON transactions(scheme_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

-- Audit traces table
CREATE TABLE audit_traces (
    id SERIAL PRIMARY KEY,
    operation_type VARCHAR(100) NOT NULL,
    inputs JSONB NOT NULL,
    assumptions JSONB NOT NULL,
    calculation_method VARCHAR(200) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_snapshot_date DATE NOT NULL
);

CREATE INDEX idx_audit_operation ON audit_traces(operation_type);
CREATE INDEX idx_audit_timestamp ON audit_traces(timestamp);
CREATE INDEX idx_audit_snapshot_date ON audit_traces(data_snapshot_date);

-- Add updated_at trigger for schemes table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schemes_updated_at
    BEFORE UPDATE ON schemes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE funds IS 'Mutual fund entities';
COMMENT ON TABLE schemes IS 'Fund scheme entities with NAV and AUM tracking';
COMMENT ON TABLE holdings IS 'Portfolio holdings with sector and market cap classification';
COMMENT ON TABLE investors IS 'Investor profiles with risk assessment';
COMMENT ON TABLE transactions IS 'Transaction history (SIP, lumpsum, redemption)';
COMMENT ON TABLE audit_traces IS 'Audit trail for all calculations and operations';
