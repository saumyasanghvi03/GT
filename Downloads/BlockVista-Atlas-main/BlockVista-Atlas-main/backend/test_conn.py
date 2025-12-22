import requests
import sys

try:
    print("Checking /health...")
    r = requests.get("http://localhost:8000/health")
    print(r.status_code, r.text)
    
    # Check if auth router is responding (even 404/405/422 is good sign it's reachable)
    print("Checking /api/v1/auth/recovery-lookup (should be 422 for missing body/query)...")
    r2 = requests.post("http://localhost:8000/api/v1/auth/recovery-lookup?name=foo")
    print(r2.status_code, r2.text)

except Exception as e:
    print(f"FAILED: {e}")
