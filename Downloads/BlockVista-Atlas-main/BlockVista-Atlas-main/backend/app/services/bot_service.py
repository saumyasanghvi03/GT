from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ActionCard(BaseModel):
    id: str
    agent: str  # FundBot, InvestorBot, etc.
    type: str   # MandateDrift, Suitability, etc.
    title: str
    summary: str
    urgency: str # high, medium, low
    rationale: str
    suggested_action: str
    timestamp: datetime
    scope: Optional[dict] = None # Extra data (fund_id, etc.)

class BotService:
    @staticmethod
    def get_amc_actions() -> List[ActionCard]:
        # simulate FundBot
        fund_actions = [
            ActionCard(
                id="act_001",
                agent="FundBot",
                type="MandateDrift",
                title="Mandate Drift Alert — Growth Bluechip",
                summary="Holdings in mid-cap stocks have risen to 28% vs 10% limit.",
                urgency="high",
                rationale="Equity allocation exceeds permitted threshold defined in SID.",
                suggested_action="Review scheme allocation. Notify compliance.",
                timestamp=datetime.now(),
                scope={"fund_id": "FND_1021"}
            )
        ]
        
        # simulate ComplianceBot
        comp_actions = [
             ActionCard(
                id="act_002",
                agent="ComplianceBot",
                type="DisclosureCheck",
                title="SEBI Monthly Disclosure Pending",
                summary="3 Schemes have not yet published monthly factsheets.",
                urgency="medium",
                rationale="Reg 48(2) requires disclosure by 10th of month.",
                suggested_action="Trigger publishing workflow.",
                timestamp=datetime.now()
            )
        ]
        
        # Council Aggregation
        return BotService._council_review(fund_actions + comp_actions)

    @staticmethod
    def get_wealth_actions() -> List[ActionCard]:
        # simulate InvestorBot
        inv_actions = [
             ActionCard(
                id="act_w1",
                agent="InvestorBot",
                type="Suitability",
                title="Suitability Mismatch - Mehta Trust",
                summary="Portfolio Beta (1.4) exceeds Risk Profile (Conservative).",
                urgency="high",
                rationale="Client mandate specifies max Beta of 1.0.",
                suggested_action="Propose debt rebalancing.",
                timestamp=datetime.now()
            )
        ]
        return BotService._council_review(inv_actions)
        
    @staticmethod
    def get_advisor_actions() -> List[ActionCard]:
        # simulate PlannerBot
        plan_actions = [
             ActionCard(
                id="act_a1",
                agent="PlannerBot",
                type="SIP",
                title="SIP Failure - Rajesh Kumar",
                summary="₹15k SIP bounced due to insufficient funds.",
                urgency="high",
                rationale="3rd consecutive bounce risks account dormancy.",
                suggested_action="Call client to regularize.",
                timestamp=datetime.now()
            )
        ]
        return BotService._council_review(plan_actions)

    @staticmethod
    def get_institutional_actions() -> List[ActionCard]:
        inst_actions = [
             ActionCard(
                id="act_i1",
                agent="PulseBot",
                type="SystemicRisk",
                title="Systemic Drift - SmallCap Index",
                summary="Liquidity stress detected across 40% of small-cap schemes.",
                urgency="medium",
                rationale="Market depth has reduced by 15% in last 2 sessions.",
                suggested_action="Issue advisory to Trustees.",
                timestamp=datetime.now()
            )
        ]
        return BotService._council_review(inst_actions)

    @staticmethod
    def get_actions_for_mode(mode: str) -> List[ActionCard]:
        if mode == 'AMC':
            return BotService.get_amc_actions()
        elif mode == 'Wealth':
            return BotService.get_wealth_actions()
        elif mode == 'Advisor':
            return BotService.get_advisor_actions()
        elif mode == 'Institutional':
            return BotService.get_institutional_actions()
        return []

    @staticmethod
    def _council_review(actions: List[ActionCard]) -> List[ActionCard]:
        # CouncilBot "stamps" actions
        for action in actions:
            if action.urgency == 'high':
                action.summary = f"[Council Approved] {action.summary}"
            if action.agent == 'FundBot':
                action.rationale = f"Validated by CouncilBot against Policy 4.2. {action.rationale}"
        return actions
