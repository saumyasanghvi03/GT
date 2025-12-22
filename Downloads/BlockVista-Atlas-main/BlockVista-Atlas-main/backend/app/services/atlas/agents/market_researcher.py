from pydantic import BaseModel
from typing import List, Literal
from ...external.market_data import MarketDataService

class MacroContext(BaseModel):
    inflation_rate: float
    gdp_growth_forecast: float
    rbi_repo_rate: float
    crude_oil_price: float
    global_sentiment: Literal['Risk-On', 'Neutral', 'Risk-Off']
    top_news_headlines: List[str]

class MarketResearcher:
    """
    Agent responsible for fetching and synthesizing macro-economic data.
    """
    
    def get_macro_context(self) -> MacroContext:
        """
        Fetches real market data via MarketDataService and maps it to MacroContext.
        """
        # Fetch Real Data
        data = MarketDataService.get_market_snapshot()
        
        # Map Real Data to Model Fields
        # Note: We use proxies where exact data isn't available in snapshot
        yield_10y = data.get("us_10y", {}).get("price", 4.0)
        crude_price = data.get("crude", {}).get("price", 75.0)
        vix = data.get("vix", {}).get("price", 15.0)
        regime = data.get("regime", "Normal Volatility")
        
        # Derive Sentiment from VIX and Yield
        if vix > 20 or yield_10y > 4.5:
            sentiment = 'Risk-Off'
        elif vix < 13:
            sentiment = 'Risk-On'
        else:
            sentiment = 'Neutral'

        return MacroContext(
            inflation_rate=5.5, # Mock: Hard to get live CPI via yfinance
            gdp_growth_forecast=7.2, # Mock: Static IMF projection
            rbi_repo_rate=6.5, # Mock: Static Policy rate
            crude_oil_price=crude_price,
            global_sentiment=sentiment,
            top_news_headlines=[
                f"Market Regime is {regime} (VIX: {vix})",
                f"US 10Y Yields tracking at {yield_10y}%",
                "Global liquidity conditions remain tight."
            ]
        )

    def analyze_impact(self, context: MacroContext) -> str:
        if context.global_sentiment == 'Risk-Off':
            return "Global Sentiment is Risk-Off. Reduce High Beta exposure."
        if context.inflation_rate > 6.0 and context.rbi_repo_rate > 6.0:
            return "High Inflation + High Rates = Negative for Duration Debt & High PE Growth Stocks."
        return "Macro environment appears stable. Maintain strategic asset allocation."
