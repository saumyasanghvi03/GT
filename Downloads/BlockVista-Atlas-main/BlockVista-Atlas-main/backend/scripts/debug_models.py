import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import Base, engine
try:
    print("Importing models...")
    from app.models.amfi import DimScheme
    from app.models.models import Scheme
    print("Models imported.")
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error: {e}")
