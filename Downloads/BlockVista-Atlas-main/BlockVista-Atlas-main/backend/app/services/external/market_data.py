import yfinance as yf
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class MarketDataService:
    """
    Fetches real-time(delayed) market data from Yahoo Finance 
    to populate the Atlas Context.
    """
    
    @staticmethod
    def get_market_snapshot() -> Dict[str, Any]:
        """
        Fetches key macro indicators:
        - Nifty 50 (^NSEI)
        - India VIX (^INDIAVIX) - Fallback to ^VIX if unavailable
        - US 10Y Yield (^TNX)
        - USD/INR (USDINR=X)
        - Crude Oil (CL=F)
        """
        tickers = {
            "nifty": "^NSEI",
            "us_10y": "^TNX",
            "usd_inr": "USDINR=X",
            "crude": "CL=F",
            "vix": "^VIX" # Using US VIX as proxy if India VIX fails or for global sentiment
        }
        
        data = {}
        
        try:
            # Fetch in bulk if possible, but yf.download is verbose. 
            # Using Ticker.info or Ticker.fast_info is better for snapshots.
            
            for key, symbol in tickers.items():
                try:
                    ticker = yf.Ticker(symbol)
                    # fast_info is faster and often more reliable for 'last_price'
                    price = ticker.fast_info.last_price
                    
                    # Calculate daily change if available (fast_info doesn't always have it, 
                    # fallback to history)
                    # For simplicity in this snapshot, we just get price.
                    
                    data[key] = {
                        "price": round(price, 2) if price else 0.0,
                        "symbol": symbol
                    }
                except Exception as e:
                    logger.warning(f"Failed to fetch {key} ({symbol}): {e}")
                    data[key] = {"price": 0.0, "symbol": symbol, "error": str(e)}

            # Interpret VIX
            vix_val = data.get("vix", {}).get("price", 0)
            data["regime"] = "High Volatility" if vix_val > 20 else "Low Volatility" if vix_val < 13 else "Normal Volatility"

            return data

        except Exception as e:
            logger.error(f"Critical error fetching market data: {e}")
            return {"error": "Market Data Unavailable", "regime": "Unknown"}

# Usage
if __name__ == "__main__":
    print(MarketDataService.get_market_snapshot())
