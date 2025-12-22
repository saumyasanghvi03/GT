import re
from fastapi import HTTPException

class SafetyViolationException(Exception):
    def __init__(self, message: str, violation_type: str):
        self.message = message
        self.violation_type = violation_type
        super().__init__(self.message)

class GuardrailMiddleware:
    """
    The Safety Compiler for Atlas.
    Intercepts all inputs and outputs to enforce policy.
    """
    
    BANNED_VERBS = [
        r"\bbuy\b", r"\bsell\b", r"\bshort\b", r"\blong\b", 
        r"\btarget price\b", r"\bstop loss\b", r"\bexecute\b"
    ]

    REQUIRED_DISCLAIMERS = [
        "Not Investment Advice",
        "Governed Intelligence"
    ]

    def verify_input(self, query: str) -> str:
        """
        Sanitizes input query.
        """
        # 1. PII Check (Mock) - Remove email-like patterns
        sanitized = re.sub(r'[\w\.-]+@[\w\.-]+', '[EMAIL_REDACTED]', query)
        
        # 2. Intent Check - Reject direct execution requests
        if "execute trade" in sanitized.lower():
             raise SafetyViolationException(
                "Atlas is a non-trading terminal. Execution requests are blocked.",
                "Blocked_Intent_Execution"
            )
            
        return sanitized

    def verify_output(self, report_text: str) -> str:
        """
        Validates the generated report text before showing to user.
        """
        lower_text = report_text.lower()

        # 1. Check for Banned Verbs (Trading Advice)
        for pattern in self.BANNED_VERBS:
            if re.search(pattern, lower_text):
                raise SafetyViolationException(
                    f"Output contained banned trading verb matching '{pattern}'.",
                    "Policy_Violation_TradingAdvice"
                )

        # 2. Check for Required Disclaimers (can be appended if missing, but better to enforce agent generation)
        # For this version, we will Append if missing to ensure safety.
        final_text = report_text
        if "not investment advice" not in lower_text:
            final_text += "\n\n[DISCLAIMER: This report is Governed Intelligence, Not Investment Advice.]"
            
        return final_text
