from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, Generation
from ..schemas import GenIn, GenOut
from ..auth import current_user
from ..byteplus import generate_image, submit_video, get_video_task
from ..config import settings

router = APIRouter(prefix="/api/generations", tags=["generations"])

@router.post("", response_model=GenOut)
async def create_gen(body: GenIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    cost = settings.image_cost if body.kind == "image" else settings.video_cost_per_second * body.seconds
    if user.credits < cost:
        raise HTTPException(402, "Crediti insufficienti")
    user.credits -= cost
    gen = Generation(user_id=user.id, kind=body.kind, prompt=body.prompt, cost=cost, status="running")
    db.add(gen); db.commit(); db.refresh(gen)
    try:
        if body.kind == "image":
            gen.result_url = await generate_image(body.prompt)
            gen.status = "done"
        else:
            gen.task_id = await submit_video(body.prompt, body.image_url, body.seconds, body.ratio)
            gen.status = "pending"
    except Exception as e:
        user.credits += cost  # rimborso in caso di errore
        gen.status = "failed"
        db.commit()
        raise HTTPException(502, f"Errore API: {e}")
    db.commit(); db.refresh(gen)
    return gen

@router.get("", response_model=list[GenOut])
def list_gens(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(Generation).filter(Generation.user_id == user.id).order_by(Generation.id.desc()).all()

@router.get("/{gen_id}", response_model=GenOut)
async def get_gen(gen_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    gen = db.get(Generation, gen_id)
    if not gen or gen.user_id != user.id:
        raise HTTPException(404, "Non trovata")
    if gen.kind == "video" and gen.status == "pending" and gen.task_id:
        t = await get_video_task(gen.task_id)
        if t["status"] == "succeeded":
            gen.status, gen.result_url = "done", t["url"]
        elif t["status"] == "failed":
            gen.status = "failed"
            user.credits += gen.cost
        db.commit(); db.refresh(gen)
    return gen
