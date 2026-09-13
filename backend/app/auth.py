from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .db import get_db
from .models import User
from .config import settings

oauth2 = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def hash_password(p): return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()
def verify_password(p, h): return bcrypt.checkpw(p.encode(), h.encode())

def create_token(user_id: int):
    payload = {"sub": str(user_id), "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")

def current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)) -> User:
    try:
        user_id = int(jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])["sub"])
    except (JWTError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token non valido")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Utente non trovato")
    return user
