import duckdb
import pandas as pd
from sqlalchemy.orm import Session
from app.models.models import Scheme, Holding
import os

class PortfolioService:
    def __init__(self, db: Session):
        self.db = db
        self.duck_conn = duckdb.connect(database=':memory:')

    def _load_holdings_to_duckdb(self, scheme_id: int):
        """
        Load holdings for a specific scheme into DuckDB for analysis.
        In a real prod env, this would read from Parquet files.
        Here we fetch from Postgres and register as a DuckDB view.
        """
        holdings_query = self.db.query(
            Holding.stock_symbol,
            Holding.stock_name,
            Holding.sector,
            Holding.weight,
            Holding.value
        ).filter(Holding.scheme_id == scheme_id)
        
        # Convert to Pandas DataFrame
        df = pd.read_sql(holdings_query.statement, self.db.bind)
        
        # Register with DuckDB
        self.duck_conn.register('current_holdings', df)

    def calculate_sector_exposure(self, scheme_id: int):
        """
        Calculate sector exposure using DuckDB
        """
        self._load_holdings_to_duckdb(scheme_id)
        
        query = """
            SELECT 
                sector,
                SUM(weight) as total_weight,
                SUM(value) as total_value
            FROM current_holdings
            GROUP BY sector
            ORDER BY total_weight DESC
        """
        
        return self.duck_conn.execute(query).df().to_dict(orient='records')

    def calculate_concentration_metrics(self, scheme_id: int):
        """
        Calculate HHI and Top-N concentration metrics
        """
        self._load_holdings_to_duckdb(scheme_id)
        
        query = """
            SELECT
                SUM(weight * weight) as hhi,
                SUM(CASE WHEN rank <= 5 THEN weight ELSE 0 END) as top_5_concentration,
                SUM(CASE WHEN rank <= 10 THEN weight ELSE 0 END) as top_10_concentration
            FROM (
                SELECT 
                    weight,
                    RANK() OVER (ORDER BY weight DESC) as rank
                FROM current_holdings
            )
        """
        
        return self.duck_conn.execute(query).df().to_dict(orient='records')[0]

    def check_overlap(self, scheme_id_a: int, scheme_id_b: int):
        """
        Calculate overlap between two schemes
        """
        # Load both
        q_a = self.db.query(Holding.stock_symbol, Holding.weight).filter(Holding.scheme_id == scheme_id_a)
        df_a = pd.read_sql(q_a.statement, self.db.bind)
        self.duck_conn.register('scheme_a', df_a)
        
        q_b = self.db.query(Holding.stock_symbol, Holding.weight).filter(Holding.scheme_id == scheme_id_b)
        df_b = pd.read_sql(q_b.statement, self.db.bind)
        self.duck_conn.register('scheme_b', df_b)
        
        query = """
            SELECT
                a.stock_symbol,
                LEAST(a.weight, b.weight) as overlap_weight
            FROM scheme_a a
            JOIN scheme_b b ON a.stock_symbol = b.stock_symbol
        """
        
        overlap_df = self.duck_conn.execute(query).df()
        total_overlap = overlap_df['overlap_weight'].sum()
        
        return {
            "overlap_percentage": float(total_overlap),
            "common_securities_count": len(overlap_df)
        }
