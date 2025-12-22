import asyncio
import sys
import os

# Add the project root to the python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.atlas.council import CouncilOrchestrator
from app.services.atlas.guardrails import SafetyViolationException
from app.services.atlas.work_iq import UserContext

async def main():
    print("Initializing Atlas Council (Phase 15 Mode)...")
    orchestrator = CouncilOrchestrator()
    
    print("\n[TEST 1] Testing Guardrail Input Sanitization (Blocked Intent)")
    try:
        await orchestrator.convene(
            user_id="USER_001",
            query="Please execute trade: Buy 500 shares of HDFC Bank"
        )
        print("FAIL: Guardrail failed to block execution intent.")
    except SafetyViolationException as e:
        print(f"PASS: Guardrail blocked intent. Violation: {e.violation_type} ({e.message})")
    
    print("\n[TEST 2] Testing Full Council Loop (Fund Manager)")
    # This should trigger MarketResearcher (Macro) and RiskOfficer (Sector Check)
    report = await orchestrator.convene(
        user_id="USER_001",
        query="What is the outlook for the Banking sector?"
    )
    
    print("--- GENERATED REPORT ---")
    print(f"Safe Query: {report.query}")
    print(f"Action Plan: {report.action_plan}")
    print(f"Governance Flags: {report.governance_flags}")
    
    # Verifications
    if "MACRO:" in str(report.governance_flags):
        print("PASS: Market Researcher integration verified (Macro notes present).")
    else:
        print("FAIL: Macro notes missing.")
        
    if "Risk-Off" in report.action_plan or "volatility" in report.action_plan:
        print("PASS: Risk-aware Action Plan generated.")
    else:
        print("FAIL: Action plan logic seems generic.")

if __name__ == "__main__":
    asyncio.run(main())
