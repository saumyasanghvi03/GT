"""
Synthetic data generator for BlockVista Atlas

Generates deterministic synthetic data for demonstration purposes:
- Investors with varying risk profiles
- SIP transactions
- Redemption events
- Sample fund holdings
"""

import random
from datetime import datetime, timedelta, date
from typing import List, Dict, Any
import json


class SyntheticDataGenerator:
    """Generate synthetic data deterministically using seed"""
    
    def __init__(self, seed: int = 42):
        """Initialize generator with seed for reproducibility"""
        self.seed = seed
        random.seed(seed)
        
    def generate_investors(self, count: int = 100) -> List[Dict[str, Any]]:
        """Generate synthetic investor profiles"""
        investors = []
        risk_levels = ['conservative', 'moderate', 'aggressive']
        
        for i in range(count):
            age = random.randint(25, 65)
            
            # Age-based risk profile bias
            if age < 35:
                risk_weights = [0.2, 0.3, 0.5]  # Young prefer aggressive
            elif age < 50:
                risk_weights = [0.3, 0.5, 0.2]  # Mid-age prefer moderate
            else:
                risk_weights = [0.6, 0.3, 0.1]  # Older prefer conservative
            
            risk_profile = random.choices(risk_levels, weights=risk_weights)[0]
            
            # Investment horizon based on age and risk
            if risk_profile == 'aggressive':
                horizon = random.randint(7, 15)
            elif risk_profile == 'moderate':
                horizon = random.randint(5, 10)
            else:
                horizon = random.randint(3, 7)
            
            investors.append({
                'investor_code': f'INV{i+1:05d}',
                'age': age,
                'risk_profile': risk_profile,
                'investment_horizon_years': horizon,
                'segment': None,  # Will be computed later
                'churn_probability': None  # Will be computed later
            })
        
        return investors
    
    def generate_sip_transactions(
        self,
        investor_ids: List[int],
        scheme_ids: List[int],
        months: int = 24
    ) -> List[Dict[str, Any]]:
        """Generate synthetic SIP transactions"""
        transactions = []
        base_date = date.today() - timedelta(days=months * 30)
        
        for investor_id in investor_ids:
            # Not all investors have SIPs
            if random.random() < 0.7:  # 70% have SIPs
                scheme_id = random.choice(scheme_ids)
                sip_amount = random.choice([1000, 2000, 5000, 10000])
                
                # Generate monthly SIPs
                sip_months = random.randint(6, months)
                
                for month in range(sip_months):
                    transaction_date = base_date + timedelta(days=month * 30)
                    
                    # Random SIP dropout (5% chance each month after 6 months)
                    if month > 6 and random.random() < 0.05:
                        break
                    
                    # Simulate NAV fluctuation
                    nav = 50 + random.uniform(-5, 15)
                    units = sip_amount / nav
                    
                    transactions.append({
                        'investor_id': investor_id,
                        'scheme_id': scheme_id,
                        'transaction_type': 'SIP',
                        'amount': sip_amount,
                        'units': round(units, 4),
                        'nav': round(nav, 2),
                        'transaction_date': transaction_date
                    })
        
        return transactions
    
    def generate_lumpsum_transactions(
        self,
        investor_ids: List[int],
        scheme_ids: List[int],
        count: int = 50
    ) -> List[Dict[str, Any]]:
        """Generate synthetic lumpsum transactions"""
        transactions = []
        base_date = date.today() - timedelta(days=365)
        
        for _ in range(count):
            investor_id = random.choice(investor_ids)
            scheme_id = random.choice(scheme_ids)
            
            # Lumpsum amounts vary widely
            amount = random.choice([25000, 50000, 100000, 250000, 500000])
            
            # Random date in past year
            days_ago = random.randint(0, 365)
            transaction_date = base_date + timedelta(days=days_ago)
            
            nav = 50 + random.uniform(-5, 15)
            units = amount / nav
            
            transactions.append({
                'investor_id': investor_id,
                'scheme_id': scheme_id,
                'transaction_type': 'lumpsum',
                'amount': amount,
                'units': round(units, 4),
                'nav': round(nav, 2),
                'transaction_date': transaction_date
            })
        
        return transactions
    
    def generate_redemptions(
        self,
        investor_ids: List[int],
        scheme_ids: List[int],
        count: int = 30
    ) -> List[Dict[str, Any]]:
        """Generate synthetic redemption events"""
        transactions = []
        base_date = date.today() - timedelta(days=180)
        
        # Simulate panic redemptions during market drops
        for _ in range(count):
            investor_id = random.choice(investor_ids)
            scheme_id = random.choice(scheme_ids)
            
            # Redemptions are negative amounts
            units = random.uniform(100, 1000)
            nav = 45 + random.uniform(-5, 10)  # Lower NAV during panic
            amount = units * nav
            
            # Cluster some redemptions (panic selling)
            if random.random() < 0.3:
                # Panic period
                days_ago = random.randint(30, 60)
            else:
                # Regular redemption
                days_ago = random.randint(0, 180)
            
            transaction_date = base_date + timedelta(days=days_ago)
            
            transactions.append({
                'investor_id': investor_id,
                'scheme_id': scheme_id,
                'transaction_type': 'redemption',
                'amount': -round(amount, 2),
                'units': -round(units, 4),
                'nav': round(nav, 2),
                'transaction_date': transaction_date
            })
        
        return transactions
    
    def generate_sample_holdings(self, scheme_id: int) -> List[Dict[str, Any]]:
        """Generate sample holdings for a scheme"""
        holdings = []
        
        # Sample stocks across sectors
        stocks = [
            {'symbol': 'RELIANCE', 'name': 'Reliance Industries Ltd', 'sector': 'energy', 'cap': 'large'},
            {'symbol': 'TCS', 'name': 'Tata Consultancy Services', 'sector': 'technology', 'cap': 'large'},
            {'symbol': 'HDFCBANK', 'name': 'HDFC Bank Ltd', 'sector': 'financial', 'cap': 'large'},
            {'symbol': 'INFY', 'name': 'Infosys Ltd', 'sector': 'technology', 'cap': 'large'},
            {'symbol': 'ICICIBANK', 'name': 'ICICI Bank Ltd', 'sector': 'financial', 'cap': 'large'},
            {'symbol': 'HINDUNILVR', 'name': 'Hindustan Unilever Ltd', 'sector': 'consumer', 'cap': 'large'},
            {'symbol': 'ITC', 'name': 'ITC Ltd', 'sector': 'consumer', 'cap': 'large'},
            {'symbol': 'BHARTIARTL', 'name': 'Bharti Airtel Ltd', 'sector': 'telecom', 'cap': 'large'},
            {'symbol': 'KOTAKBANK', 'name': 'Kotak Mahindra Bank', 'sector': 'financial', 'cap': 'large'},
            {'symbol': 'LT', 'name': 'Larsen & Toubro Ltd', 'sector': 'industrial', 'cap': 'large'},
            {'symbol': 'ASIANPAINT', 'name': 'Asian Paints Ltd', 'sector': 'materials', 'cap': 'mid'},
            {'symbol': 'MARUTI', 'name': 'Maruti Suzuki India', 'sector': 'consumer', 'cap': 'large'},
            {'symbol': 'TITAN', 'name': 'Titan Company Ltd', 'sector': 'consumer', 'cap': 'mid'},
            {'symbol': 'BAJFINANCE', 'name': 'Bajaj Finance Ltd', 'sector': 'financial', 'cap': 'large'},
            {'symbol': 'WIPRO', 'name': 'Wipro Ltd', 'sector': 'technology', 'cap': 'large'},
        ]
        
        # Select random subset (typically 20-30 stocks)
        num_holdings = random.randint(15, 25)
        selected_stocks = random.sample(stocks, min(num_holdings, len(stocks)))
        
        # Generate weights that sum to ~100%
        weights = [random.uniform(1, 10) for _ in selected_stocks]
        total_weight = sum(weights)
        weights = [(w / total_weight) * 100 for w in weights]
        
        for stock, weight in zip(selected_stocks, weights):
            # Simulate portfolio values
            portfolio_value = 100000000  # 10 Cr portfolio
            value = portfolio_value * (weight / 100)
            price_per_share = random.uniform(100, 3000)
            quantity = int(value / price_per_share)
            
            holdings.append({
                'scheme_id': scheme_id,
                'stock_symbol': stock['symbol'],
                'stock_name': stock['name'],
                'quantity': quantity,
                'value': round(value, 2),
                'weight': round(weight, 2),
                'sector': stock['sector'],
                'market_cap': stock['cap'],
                'as_of_date': date.today() - timedelta(days=30)
            })
        
        return holdings
    
    def save_to_json(self, data: Any, filename: str, directory: str = None):
        """Save data to JSON file"""
        import os
        from pathlib import Path
        
        # Use environment variable or default to data/processed relative to project root
        if directory is None:
            # Try to find project root by looking for docker-compose.yml
            current = Path(__file__).resolve().parent
            while current != current.parent:
                if (current / 'docker-compose.yml').exists():
                    directory = str(current / 'data' / 'processed')
                    break
                current = current.parent
            else:
                # Fallback to relative path
                directory = './data/processed'
        
        os.makedirs(directory, exist_ok=True)
        filepath = os.path.join(directory, filename)
        
        # Convert dates to strings
        def date_converter(obj):
            if isinstance(obj, (date, datetime)):
                return obj.isoformat()
            raise TypeError(f"Type {type(obj)} not serializable")
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=date_converter)
        
        print(f"Saved {len(data) if isinstance(data, list) else 1} records to {filepath}")


if __name__ == "__main__":
    generator = SyntheticDataGenerator(seed=42)
    
    # Generate investors
    investors = generator.generate_investors(100)
    generator.save_to_json(investors, 'synthetic_investors.json')
    
    # Simulate investor IDs
    investor_ids = list(range(1, 101))
    scheme_ids = list(range(1, 6))  # Assume 5 schemes
    
    # Generate transactions
    sip_txns = generator.generate_sip_transactions(investor_ids, scheme_ids, months=24)
    generator.save_to_json(sip_txns, 'synthetic_sip_transactions.json')
    
    lumpsum_txns = generator.generate_lumpsum_transactions(investor_ids, scheme_ids, count=50)
    generator.save_to_json(lumpsum_txns, 'synthetic_lumpsum_transactions.json')
    
    redemptions = generator.generate_redemptions(investor_ids, scheme_ids, count=30)
    generator.save_to_json(redemptions, 'synthetic_redemptions.json')
    
    # Generate sample holdings for each scheme
    all_holdings = []
    for scheme_id in scheme_ids:
        holdings = generator.generate_sample_holdings(scheme_id)
        all_holdings.extend(holdings)
    
    generator.save_to_json(all_holdings, 'synthetic_holdings.json')
    
    print("\nSynthetic data generation complete!")
    print(f"- Investors: {len(investors)}")
    print(f"- SIP Transactions: {len(sip_txns)}")
    print(f"- Lumpsum Transactions: {len(lumpsum_txns)}")
    print(f"- Redemptions: {len(redemptions)}")
    print(f"- Holdings: {len(all_holdings)}")
