from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
from urllib.parse import urlencode
from ..db import get_db
from ..models import User
from ..schemas import RegisterIn, TokenOut
from ..auth import hash_password, verify_password, create_token, current_user
from ..config import settings

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
    return {"id": user.id, "email": user.email, "credits": user.credits, "plan": user.plan, "trial_used": user.trial_used}

# Google OAuth
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

@router.get("/google")
def google_login():
    """Redirect to Google OAuth consent screen"""
    if not settings.google_client_id:
        raise HTTPException(500, "Google OAuth not configured")

    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": f"{settings.frontend_url.replace('https://lumiere-ai.pages.dev', 'https://lumiere-ai-6t4u.onrender.com')}/api/auth/google/callback",
        "response_type": "code",
        "scope": "email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    # Fix: use backend URL for redirect
    params["redirect_uri"] = "https://lumiere-ai-6t4u.onrender.com/api/auth/google/callback"

    return RedirectResponse(f"{GOOGLE_AUTH_URL}?{urlencode(params)}")

@router.get("/google/callback")
async def google_callback(code: str = None, error: str = None, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    if error:
        return RedirectResponse(f"{settings.frontend_url}?error={error}")

    if not code:
        return RedirectResponse(f"{settings.frontend_url}?error=no_code")

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": "https://lumiere-ai-6t4u.onrender.com/api/auth/google/callback"
            }
        )

        if token_response.status_code != 200:
            return RedirectResponse(f"{settings.frontend_url}?error=token_exchange_failed")

        tokens = token_response.json()
        access_token = tokens.get("access_token")

        # Get user info from Google
        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )

        if userinfo_response.status_code != 200:
            return RedirectResponse(f"{settings.frontend_url}?error=userinfo_failed")

        userinfo = userinfo_response.json()
        email = userinfo.get("email")

        if not email:
            return RedirectResponse(f"{settings.frontend_url}?error=no_email")

    # Find or create user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Create new user (no password for OAuth users)
        user = User(email=email, hashed_password="GOOGLE_OAUTH")
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create JWT token
    jwt_token = create_token(user.id)

    # Redirect to frontend with token
    return RedirectResponse(f"{settings.frontend_url}?token={jwt_token}")
