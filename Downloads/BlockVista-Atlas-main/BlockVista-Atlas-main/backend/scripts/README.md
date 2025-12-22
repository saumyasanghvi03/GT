# BlockVista Atlas - Data Scripts

This directory contains data ingestion and generation scripts for the BlockVista Atlas system.

## Scripts

### `generate_synthetic_data.py`

Generates deterministic synthetic data for demonstration and testing purposes.

**Usage:**
```bash
python scripts/generate_synthetic_data.py
```

**Output:**
- `data/processed/synthetic_investors.json` - 100 investor profiles
- `data/processed/synthetic_sip_transactions.json` - Monthly SIP transactions
- `data/processed/synthetic_lumpsum_transactions.json` - One-time investments
- `data/processed/synthetic_redemptions.json` - Redemption events
- `data/processed/synthetic_holdings.json` - Portfolio holdings

**Determinism:**
Uses seed value of 42 for reproducibility. Same seed produces identical output.

### `ingest.py`

CLI tool for ingesting data into the database.

**Usage:**
```bash
# Initialize database and load synthetic data
python scripts/ingest.py --source synthetic --init-db

# Load only synthetic data (database must exist)
python scripts/ingest.py --source synthetic

# Load AMFI data from file (not yet implemented)
python scripts/ingest.py --source amfi --file path/to/amfi_data.csv
```

**Options:**
- `--source`: Data source (`synthetic` or `amfi`)
- `--file`: File path for AMFI data
- `--init-db`: Initialize database tables before loading

## Data Generation Details

### Investors
- 100 synthetic investor profiles
- Age range: 25-65 years
- Risk profiles: Conservative, Moderate, Aggressive
- Age-based risk profile distribution

### Transactions
- **SIP Transactions**: ~70% of investors have monthly SIPs
- **Lumpsum Transactions**: Random one-time investments
- **Redemptions**: Includes both regular and panic selling patterns

### Holdings
- 15-25 holdings per scheme
- Distributed across sectors (Financial, Technology, Consumer, etc.)
- Market cap classification (Large, Mid, Small)
- Real Indian stock symbols (RELIANCE, TCS, HDFC, etc.)

## Development

The synthetic data generator is designed to:
1. Be completely deterministic (same seed = same output)
2. Generate realistic patterns (age-based risk tolerance, panic redemptions)
3. Support easy extension for new data types
4. Maintain referential integrity with the database schema
