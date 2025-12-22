from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM users WHERE name = 'Saumya'"))
    row = result.fetchone()
    if row:
        print(f"FOUND USER: {row}")
    else:
        print("USER NOT FOUND")
