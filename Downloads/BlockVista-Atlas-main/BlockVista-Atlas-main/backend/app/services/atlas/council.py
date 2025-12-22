from pydantic import BaseModel
from typing import List, Optional
from .work_iq import WorkIQService, UserContext
from .fabric_iq import FabricIQService, MarketRegime

class AtlasReport(BaseModel):
    query: str
    market_posture: str
    opportunity_themes: List[str]
    governance_flags: List[str]
    scenarios_considered: List[str]
    action_plan: str
    confidence_score: float

from .agents.market_researcher import MarketResearcher
from .agents.risk_officer import RiskOfficer
from .guardrails import GuardrailMiddleware, SafetyViolationException

class CouncilOrchestrator:
    def __init__(self):
        self.work_iq = WorkIQService()
        self.fabric_iq = FabricIQService()
        self.researcher = MarketResearcher()
        self.risk_officer = RiskOfficer()
        self.guardrails = GuardrailMiddleware()

    async def convene(self, user_id: str, query: str) -> AtlasReport:
        # 0. Input Safe-Guarding
        safe_query = self.guardrails.verify_input(query)

        # 1. Load Context & Market Data
        user_context = self.work_iq.get_context(user_id)
        market_regime = self.fabric_iq.get_current_regime()
        
        # 2. Agent Deliberation
        macro_ctx = self.researcher.get_macro_context()
        macro_impact = self.researcher.analyze_impact(macro_ctx)
        
        risk_flags = self.risk_officer.check_constraints(user_context)

        # 3. Synthesis (Logic Layer)
        posture = "Defensive / Risk-Off"
        if market_regime.volatility_state == 'Low':
            posture = "Constructive / Accumulate"
            
        themes = ["Quality Large Caps", "Short Duration Debt"]
        
        # Convert Risk Flags to Strings
        governance_notes = [f"{f.severity.upper()}: {f.message}" for f in risk_flags]

        # Add Macro Notes
        governance_notes.append(f"MACRO: {macro_impact}")

        # 4. Generate Action Plan
        raw_action_plan = (
            f"Based on the {macro_ctx.global_sentiment} global sentiment and your "
            f"{user_context.risk_profile.risk_tolerance} risk profile, the Council suggests "
            "reviewing current allocations. "
            "Consider rebalancing towards lower volatility instruments."
        )

        # 5. Output Safe-Guarding
        safe_action_plan = self.guardrails.verify_output(raw_action_plan)

        return AtlasReport(
            query=safe_query,
            market_posture=posture,
            opportunity_themes=themes,
            governance_flags=governance_notes,
            scenarios_considered=["Rates +50bps Shock", "Oil Price Spike"],
            action_plan=safe_action_plan,
            confidence_score=0.88
        )
