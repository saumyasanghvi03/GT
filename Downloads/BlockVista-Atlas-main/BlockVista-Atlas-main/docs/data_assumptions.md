# Data Assumptions

## Overview

This document outlines the key assumptions and constraints of the BlockVista Atlas system regarding data sources, processing, and analysis.

---

## Data Sources

### Primary Source: AMFI Portfolio Disclosures

- **Format**: CSV/Excel files published monthly
- **Content**: Scheme-wise portfolio holdings
- **Frequency**: Monthly snapshots
- **Coverage**: All mutual fund schemes registered in India
- **Reliability**: Official regulatory disclosures

### Synthetic Data

For demonstration and testing purposes, the following data is **synthetically generated**:

1. **Investor Profiles**
   - Deterministically generated using seed values
   - Includes: age, risk tolerance, investment horizon
   - Distribution mirrors realistic demographic patterns

2. **Transactions (SIP/Lump-sum/Redemptions)**
   - Generated based on typical investor behavior patterns
   - Includes temporal patterns (monthly SIPs, quarterly reviews)
   - Redemption events tied to market volatility proxies

---

## Data Processing Assumptions

### Scheme Name Normalization

- Multiple scheme names may refer to the same fund
- Normalization rules:
  - Remove "Direct" and "Regular" plan suffixes
  - Standardize growth/dividend/IDCW plan naming
  - Handle AMC name variations

### Holding Categorization

**Sector Mapping:**
- Based on NSE/BSE sector classifications
- Default to "Other" for unclassified holdings
- Financial sector includes banks, NBFCs, insurance

**Market Cap Classification:**
- Large Cap: Top 100 companies by market capitalization
- Mid Cap: 101st to 250th companies
- Small Cap: Beyond 250th position
- Based on SEBI's market cap definitions

### Missing Data Handling

- **Missing prices**: Use last available NAV
- **Missing sectors**: Tag as "Unclassified"
- **Missing ratings**: Do not factor into risk calculations

---

## Temporal Assumptions

1. **Data Lag**: Portfolio holdings are T+30 to T+45 days delayed
2. **Historical Data**: Assumes access to 3+ years of historical data for attribution
3. **Volatility Calculation**: Uses 1-year rolling window
4. **Performance Windows**: 1Y, 3Y, 5Y standard periods

---

## Risk Profiling Assumptions

### Investor Risk Categories

- **Conservative**: Age 50+, low volatility tolerance
- **Moderate**: Age 30-50, balanced approach
- **Aggressive**: Age <30, high growth focus

### Suitability Logic

- Equity exposure limits based on age
- Maximum single-stock concentration: 10%
- Maximum sector concentration: 25%
- Horizon mismatch: <3 years for equity funds flagged

---

## Performance Attribution Assumptions

### Beta Calculation

- Uses benchmark index as market proxy
- 1-year daily returns for regression
- R-squared threshold of 0.7 for reliability

### Allocation vs. Selection

- Sector weights compared to benchmark
- Stock selection within sectors
- Assumes no timing effects (buy-and-hold)

---

## Compliance & Governance

### Regulatory Framework

- Based on SEBI (Mutual Funds) Regulations 1996
- RIA (Registered Investment Advisor) guidelines
- Concentration norms per SEBI circulars

### Audit Trail Requirements

All calculations must log:
- Input data snapshot (date + source)
- Calculation methodology
- Assumptions applied
- Timestamp of computation

---

## Known Limitations

1. **No Intraday Data**: Only end-of-day snapshots
2. **No Derivatives**: Does not account for F&O positions
3. **No Corporate Actions**: Stock splits, bonuses not auto-adjusted
4. **No Tax Implications**: Analysis is pre-tax
5. **No Currency Risk**: Assumes INR-only portfolios

---

## Data Quality Expectations

- **Completeness**: 95%+ of holdings must have sector/cap data
- **Accuracy**: Manual review of top 10 holdings per scheme
- **Timeliness**: Data refresh within 48 hours of AMFI publication
- **Consistency**: Cross-validation with AMC fact sheets

---

## Future Enhancements

Potential improvements to data handling:

- [ ] Real-time NAV integration
- [ ] Corporate action adjustments
- [ ] Multi-currency support
- [ ] Alternative asset classes (gold, debt funds)
- [ ] ESG scoring integration

---

**Last Updated**: 2024-01-01  
**Version**: 0.1.0
