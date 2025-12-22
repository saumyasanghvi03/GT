from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM sessions WHERE id = '2FSJ764YS'"))
    row = result.fetchone()
    if row:
        print(f"FOUND SESSION: {row}")
    else:
        print("SESSION NOT FOUND")
