import sys
try:
    import optimum
    print(f"Optimum version: {optimum.__version__}")
except ImportError:
    print("Optimum not installed")

try:
    from optimum.bettertransformer import BetterTransformer
    print("BetterTransformer imported successfully")
except ImportError as e:
    print(f"BetterTransformer import failed: {e}")
except Exception as e:
    print(f"Error: {e}")
