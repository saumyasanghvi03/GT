import sqlite3
try:
    conn = sqlite3.connect('blockvista.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, pin FROM users WHERE name='Saumya'")
    row = cursor.fetchone()
    print(f"FOUND: {row}" if row else "NOT_FOUND")
except Exception as e:
    print(f"ERROR: {e}")
finally:
    if 'conn' in locals(): conn.close()
