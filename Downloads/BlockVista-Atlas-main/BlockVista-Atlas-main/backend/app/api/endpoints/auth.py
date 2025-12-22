from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, SessionLog
from pydantic import BaseModel
import uuid
import random
import string
from datetime import datetime
from typing import Optional

router = APIRouter()

ADMIN_PIN = "020303"

class LoginRequest(BaseModel):
    pin: str

class RegisterRequest(BaseModel):
    name: str
    role: str
    security_question: str
    security_answer: str

class ResetRequest(BaseModel):
    name: str
    security_answer: str

class UserResponse(BaseModel):
    name: str
    role: str
    isAdmin: bool = False
    sessionId: Optional[str] = None

def generate_session_id() -> str:
    """Generate a random 9-character alphanumeric session ID like ZDLKZNZ02"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=9))

def generate_unique_pin(db: Session) -> str:
    while True:
        pin = str(random.randint(100000, 999999))
        if pin == ADMIN_PIN:
            continue
        exists = db.query(User).filter(User.pin == pin).first()
        if not exists:
            return pin

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Generate Session ID for log (even if failed? No, only success)
    
    # 1. Check Admin
    if req.pin == ADMIN_PIN:
        session_id = generate_session_id()
        log = SessionLog(id=session_id, user_id="admin", ip_address="192.168.0.1")
        db.add(log)
        db.commit()
        return {"name": "Administrator", "role": "AMC", "isAdmin": True, "sessionId": session_id}
    
    # 2. Check User
    user = db.query(User).filter(User.pin == req.pin).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Access Code")
    
    # 3. Check Expiry (90 days)
    if user.pin_updated_at:
        delta = datetime.utcnow() - user.pin_updated_at
        if delta.days > 90:
            raise HTTPException(status_code=403, detail="PIN Expired. Please reset.")

    # Log User Session
    session_id = generate_session_id()
    log = SessionLog(id=session_id, user_id=user.id, ip_address="192.168.0.1")
    db.add(log)
    db.commit()
    
    return {"name": user.name, "role": user.role, "isAdmin": False, "sessionId": session_id}

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    try:
        new_pin = generate_unique_pin(db)
        
        new_user = User(
            name=req.name,
            role=req.role,
            pin=new_pin,
            security_question=req.security_question,
            security_answer=req.security_answer.lower().strip(),
            pin_updated_at=datetime.utcnow()
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {"pin": new_pin, "name": new_user.name}
    except Exception as e:
        print(f"Registration Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recovery-lookup")
def recovery_lookup(name: str, db: Session = Depends(get_db)):
    users = db.query(User).all()
    target = next((u for u in users if u.name.lower() == name.lower().strip()), None)
    
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"question": target.security_question}

@router.post("/reset-pin")
def reset_pin(req: ResetRequest, db: Session = Depends(get_db)):
    users = db.query(User).all()
    target = next((u for u in users if u.name.lower() == req.name.lower().strip()), None)
    
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target.security_answer != req.security_answer.lower().strip():
        raise HTTPException(status_code=401, detail="Incorrect Security Answer")
        
    # Reset PIN
    new_pin = generate_unique_pin(db)
    target.pin = new_pin
    target.pin_updated_at = datetime.utcnow()
    db.commit()
    
    return {"pin": new_pin}
