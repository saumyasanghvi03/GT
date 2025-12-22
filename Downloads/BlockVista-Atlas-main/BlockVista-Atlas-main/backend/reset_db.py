from app.database import engine, Base
from app.models.user import User
from sqlalchemy import text

print("Dropping tables...")
# Safe drop using raw SQL first to handle potential metadata locks
with engine.connect() as conn:
    try:
        conn.execute(text("DROP TABLE IF EXISTS users"))
        conn.execute(text("DROP TABLE IF EXISTS sessions"))
        conn.commit()
    except Exception as e:
        print(e)

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables refeshed.")
