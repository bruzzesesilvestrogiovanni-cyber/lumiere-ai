from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import RegisterIn, TokenOut
from ..auth import hash_password, verify_password, create_token, current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenOut)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email gia registrata")
    u = User(email=body.email, hashed_password=hash_password(body.password))
    db.add(u); db.commit(); db.refresh(u)
    return TokenOut(access_token=create_token(u.id))

@router.post("/login", response_model=TokenOut)
def login(body: RegisterIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == body.email).first()
    if not u or not verify_password(body.password, u.hashed_password):
        raise HTTPException(401, "Credenziali non valide")
    return TokenOut(access_token=create_token(u.id))

@router.get("/me")
def me(user: User = Depends(current_user)):
    return {"id": user.id, "email": user.email, "credits": user.credits, "plan": user.plan}
