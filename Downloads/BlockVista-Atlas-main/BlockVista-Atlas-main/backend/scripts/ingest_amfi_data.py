import os
import sys
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path to allow importing app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.models.amfi import DimScheme, FactAumMonthly, FactAmcAumMonthly, FactCategoryAumMonthly, Base

# MODIFY THIS URL TO MATCH YOUR APP CONFIG
DATABASE_URL = "sqlite:///./blockvista.db" 

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'processed')

def init_db():
    print("Initializing Database tables...")
    Base.metadata.create_all(bind=engine)

def ingest_dim_scheme():
    print("Ingesting DimScheme from CSV...")
    session = SessionLocal()
    
    # Find the CSV file
    csv_file = None
    for f in os.listdir(DATA_DIR):
        if f.startswith("SchemeData") and f.endswith(".csv"):
            csv_file = os.path.join(DATA_DIR, f)
            break
            
    if not csv_file:
        print("No SchemeData CSV found!")
        return

    print(f"Reading {csv_file}...")
    try:
        df = pd.read_csv(csv_file, low_memory=False) # Full load
        print(f"Columns found: {df.columns.tolist()}")
        
        count = 0
        debug_limit = 5
        for i, row in df.iterrows():
            if i < debug_limit:
                pass

            # Robust mapping
            code = row.get('Code')
            scheme_code_int = 0
            
            # Handle potential string/float codes
            try:
                if pd.isna(code): continue
                scheme_code_int = int(float(code)) # handle '100037.0' or 100037
            except:
                continue

            scheme = DimScheme(
                scheme_code=scheme_code_int,
                amc_name=row.get('AMC', 'Unknown AMC'), # Often 'Mutual Fund Name' or 'AMC'
                scheme_name=row.get('Scheme Name', 'Unknown Scheme'),
                scheme_type=row.get('Scheme Type', 'Open Ended'),
                scheme_category=row.get('Scheme Category', 'Equity'),
                launch_date=None,
                isin_growth=row.get('ISIN Div Payout/ ISIN Growth', None)
            )
            
            # Safe Date Parsing
            raw_date = row.get('Launch Date')
            if raw_date and not pd.isna(raw_date):
                try:
                    dt = pd.to_datetime(raw_date, errors='coerce', dayfirst=True)
                    if not pd.isna(dt):
                        scheme.launch_date = dt.date()
                except:
                    pass

            # Upsert logic (simple merge)
            existing = session.query(DimScheme).filter_by(scheme_code=scheme.scheme_code).first()
            if not existing:
                session.add(scheme)
                count += 1
        
        print("Committing to DB...")
        session.commit()
        print(f"Successfully ingested {count} new schemes.")

    except Exception as e:
        print(f"Error ingesting schemes: {e}")
        session.rollback()
    finally:
        session.close()

def ingest_fact_aum():
    print("Ingesting FactAumMonthly from Excel (Brute Force)...")
    session = SessionLocal()
    
    # Find all Excel files
    xls_files = [f for f in os.listdir(DATA_DIR) if f.startswith("am") and (f.endswith(".xls") or f.endswith(".xlsx"))]
    
    for xls in xls_files:
        path = os.path.join(DATA_DIR, xls)
        print(f"Processing {xls}...")
        
        try:
            # Parse Date logic
            month_str = xls[2:5] # oct
            year_str = xls[5:9]  # 2025
            date_str = f"01-{month_str}-{year_str}"
            report_date = datetime.strptime(date_str, "%d-%b-%Y").date()
            print(f"Report Date: {report_date}")

            # Read Excel - Get all sheets
            try:
                xls_file = pd.ExcelFile(path)
                sheet_names = xls_file.sheet_names
                print(f"Found sheets: {sheet_names}")
                
                # Combine all sheets or iterate
                dfs = []
                for sheet in sheet_names:
                    try:
                        d = pd.read_excel(path, header=None, sheet_name=sheet)
                        d['sheet_name'] = sheet
                        dfs.append(d)
                    except:
                        pass
                
                if not dfs:
                    print(f"No readable data in {xls}")
                    continue
                    
                df = pd.concat(dfs, ignore_index=True)
                print(f"Total rows across all sheets: {len(df)}")
            except Exception as e:
                print(f"Error reading excel {xls}: {e}")
                continue
            
            count = 0
            processed_codes = set()

            # Identify valid rows
            for i, row in df.iterrows():
                # Logic: Find a cell that is a Scheme Code (6 digit int > 100000)
                s_code = None
                code_col_idx = -1
                
                # Scan row for code
                for idx, val in enumerate(row.values):
                    try:
                        v_str = str(val).strip()
                        # Float handling
                        v_float = float(v_str) if v_str.replace('.', '', 1).isdigit() else 0.0
                        
                        # Widened range check: 100000 to 999999
                        if v_float >= 100000 and v_float <= 999999 and int(v_float) == v_float and len(str(int(v_float))) == 6:
                            s_code = int(v_float)
                            code_col_idx = idx
                            break
                    except:
                        pass
                
                if not s_code:
                    continue
                
                # Deduplication logic
                if s_code in processed_codes:
                    continue
                processed_codes.add(s_code)

                # Found a code! Now look for AUM numbers to the right
                # Usually: Code, Name, ... , AAUM, AUM (last columns)
                # We collect all valid numbers to the right of code
                right_vals = []
                for val in row.values[code_col_idx+1:]:
                    try:
                        if pd.isna(val) or str(val).strip() == '': continue
                        # Clean number string '1,234.56'
                        v_str = str(val).replace(',', '')
                        # Check if matches number pattern
                        # AUM can be large float
                        float(v_str) # test conversion
                        right_vals.append(float(v_str))
                    except:
                        pass
                
                # Heuristic: 
                # If >= 2 numbers: Last is AUM, Second Last is AAUM
                # If 1 number: Assume AUM
                aum = 0.0
                aaum = 0.0
                
                if len(right_vals) >= 2:
                    aum = right_vals[-1]
                    aaum = right_vals[-2]
                elif len(right_vals) == 1:
                    aum = right_vals[0]
                
                # Create/Update Fact
                # Check exist (Upsert)
                exists = session.query(FactAumMonthly).filter_by(scheme_code=s_code, month_end_date=report_date).first()
                if exists:
                    exists.aum_cr = aum
                    exists.aaum_cr = aaum
                else:
                    fact = FactAumMonthly(
                        scheme_code=s_code,
                        month_end_date=report_date,
                        aum_cr=aum,
                        aaum_cr=aaum
                    )
                    session.add(fact)
                count += 1
            
            session.commit()
            print(f"Successfully processed {count} records for {report_date}")

            # INGESTION: FactAmcAumMonthly & FactCategoryAumMonthly
            print("Aggregating AMC and Category stats from ingested details...")
            
            from sqlalchemy import func
            from app.models.amfi import FactAmcAumMonthly, FactCategoryAumMonthly, DimScheme

            # Aggregation: AMC
            amc_aggs = session.query(
                DimScheme.amc_name, 
                func.sum(FactAumMonthly.aum_cr).label('total_aum'),
                func.sum(FactAumMonthly.aaum_cr).label('total_aaum')
            ).join(FactAumMonthly, DimScheme.scheme_code == FactAumMonthly.scheme_code)\
             .filter(FactAumMonthly.month_end_date == report_date)\
             .group_by(DimScheme.amc_name).all()
            
            for amc_name, total_aum, total_aaum in amc_aggs:
                if not amc_name: continue
                
                # Update/Insert FactAmcAumMonthly
                exist_amc = session.query(FactAmcAumMonthly).filter_by(amc_name=amc_name, month_end_date=report_date).first()
                if exist_amc:
                    exist_amc.aum_cr = total_aum
                    exist_amc.aaum_cr = total_aaum
                else:
                    session.add(FactAmcAumMonthly(
                        month_end_date=report_date,
                        amc_name=amc_name,
                        aum_cr=total_aum,
                        aaum_cr=total_aaum
                    ))
            
            # Aggregation: Category
            cat_aggs = session.query(
                DimScheme.scheme_category, 
                func.sum(FactAumMonthly.aum_cr).label('total_aum'),
                func.count(DimScheme.scheme_code).label('scheme_count')
            ).join(FactAumMonthly, DimScheme.scheme_code == FactAumMonthly.scheme_code)\
             .filter(FactAumMonthly.month_end_date == report_date)\
             .group_by(DimScheme.scheme_category).all()

            for cat, total_aum, count_schemes in cat_aggs:
                if not cat: continue
                
                # Update/Insert FactCategoryAumMonthly
                exist_cat = session.query(FactCategoryAumMonthly).filter_by(category=cat, month_end_date=report_date).first()
                if exist_cat:
                    exist_cat.aum_cr = total_aum
                    exist_cat.folios_count = count_schemes
                else:
                    session.add(FactCategoryAumMonthly(
                        month_end_date=report_date,
                        category=cat,
                        aum_cr=total_aum,
                        folios_count=count_schemes
                    ))
            
            session.commit()
            print(f"Aggregated {len(amc_aggs)} AMCs and {len(cat_aggs)} Categories for {report_date}")

        except Exception as e:
            print(f"Failed to process {xls}: {e}")
            session.rollback()
            
    session.close()

if __name__ == "__main__":
    init_db()
    ingest_dim_scheme() 
    ingest_fact_aum()
