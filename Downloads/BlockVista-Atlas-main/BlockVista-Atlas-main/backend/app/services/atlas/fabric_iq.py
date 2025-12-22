from pydantic import BaseModel
from typing import Literal, List

class MarketRegime(BaseModel):
    volatility_state: Literal['Low', 'Normal', 'High', 'Extreme']
    liquidity_condition: Literal['Abundant', 'Neutral', 'Tight', 'Stress']
    interest_rate_outlook: Literal['Rising', 'Stable', 'Falling']
    primary_trend: Literal['Bullish', 'Neutral', 'Bearish']

class FabricIQService:
    def get_current_regime(self) -> MarketRegime:
        """
        Snapshots the current market fabric.
        Currently mocked to a 'Risk-Off / Tight Liquidity' scenario for demo.
        """
        return MarketRegime(
            volatility_state='High',
            liquidity_condition='Tight',
            interest_rate_outlook='Rising',
            primary_trend='Neutral'
        )

    def get_crowded_trades(self) -> List[str]:
        return ["SmallCap Momentum", "PSU Banks"]
