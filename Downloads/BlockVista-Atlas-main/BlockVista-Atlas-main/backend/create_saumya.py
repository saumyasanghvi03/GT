from app.database import engine, get_db, SessionLocal
from app.models.user import User
from app.api.endpoints.auth import generate_unique_pin
from datetime import datetime

db = SessionLocal()
try:
    print("Creating user Saumya...")
    # Check existing
    existing = db.query(User).filter(User.name == "Saumya").first()
    if existing:
        print(f"User Saumya already exists. PIN: {existing.pin}")
    else:
        new_pin = generate_unique_pin(db)
        user = User(
            name="Saumya",
            role="Wealth",
            pin=new_pin,
            security_question="What city were you born in?",
            security_answer="mumbai", # lower case as per logic
            pin_updated_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        print(f"User Saumya created successfully. PIN: {new_pin}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
