from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from ..models import User
from ..auth import current_user
from ..db import SessionLocal

router = APIRouter(prefix="/api/credits", tags=["credits"])

# Definizione piani con crediti
PLANS = {
    "trial": {"credits": 85, "days": 3, "price": 2.49, "one_time": True, "model_restriction": "grok_aurora"},
    "basic": {"credits": 900, "days": 30, "price": 24.99, "one_time": False},
    "standard": {"credits": 2100, "days": 30, "price": 59.99, "one_time": False},
    "advanced": {"credits": 4400, "days": 30, "price": 124.99, "one_time": False},
    "ultra": {"credits": 10500, "days": 30, "price": 299.99, "one_time": False},
}


class PurchaseRequest(BaseModel):
    plan: str


@router.get("")
def balance(user: User = Depends(current_user)):
    return {
        "credits": user.credits,
        "plan": user.plan,
        "trial_used": bool(user.trial_used),
        "plan_expires_at": user.plan_expires_at.isoformat() if user.plan_expires_at else None
    }


@router.post("/purchase")
def purchase_plan(request: PurchaseRequest, user: User = Depends(current_user)):
    """
    Acquista un piano. Il Trial puo essere acquistato solo una volta.
    In produzione questo endpoint sara chiamato dal webhook Stripe dopo il pagamento.
    """
    plan_id = request.plan.lower()

    # Verifica che il piano esista
    if plan_id not in PLANS:
        raise HTTPException(status_code=400, detail="Piano non valido")

    plan = PLANS[plan_id]

    # BLOCCO TRIAL: se l'utente ha gia usato il Trial, non puo riacquistarlo
    if plan_id == "trial":
        if user.trial_used:
            raise HTTPException(
                status_code=403,
                detail="Hai gia utilizzato il piano Trial. Scegli uno dei piani mensili."
            )

    # Aggiorna l'utente nel database
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.id == user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="Utente non trovato")

        # Assegna crediti e piano
        db_user.credits += plan["credits"]
        db_user.plan = plan_id
        db_user.plan_expires_at = datetime.utcnow() + timedelta(days=plan["days"])

        # Se e' il Trial, marca come usato
        if plan_id == "trial":
            db_user.trial_used = 1

        db.commit()

        return {
            "success": True,
            "message": f"Piano {plan_id} attivato con successo!",
            "credits": db_user.credits,
            "plan": db_user.plan,
            "trial_used": bool(db_user.trial_used),
            "plan_expires_at": db_user.plan_expires_at.isoformat()
        }
    finally:
        db.close()


@router.get("/plans")
def get_plans(user: User = Depends(current_user)):
    """
    Ritorna i piani disponibili per l'utente.
    Nasconde il Trial se gia usato.
    """
    available_plans = {}
    for plan_id, plan_data in PLANS.items():
        # Nascondi Trial se gia usato
        if plan_id == "trial" and user.trial_used:
            continue
        available_plans[plan_id] = plan_data

    return {
        "plans": available_plans,
        "trial_available": not bool(user.trial_used)
    }


# TODO: POST /webhook -> webhook Stripe per conferma pagamento reale
