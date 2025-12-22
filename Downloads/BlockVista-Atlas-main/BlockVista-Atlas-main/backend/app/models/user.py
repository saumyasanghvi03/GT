from sqlalchemy import Column, Integer, String, DateTime
from ..database import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    role = Column(String)  # AMC, Wealth, Advisor, Institutional
    pin = Column(String, unique=True, index=True) # 6-digit hashed/plaintext (plaintext requested for simplicity "sql file")
    security_question = Column(String)
    security_answer = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    pin_updated_at = Column(DateTime, default=datetime.utcnow)

class SessionLog(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True) # Short ID like ZDLKZNZ02
    user_id = Column(String, index=True) # Storing user ID or Name
    ip_address = Column(String)
    login_time = Column(DateTime, default=datetime.utcnow)

