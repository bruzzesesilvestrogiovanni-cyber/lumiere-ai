"""
Image Generation API Router
Credit-based system - watermarks for Trial/Free users only
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import User, Generation
from ..auth import current_user
from ..services.image_router import image_router
from ..services.watermark import apply_watermark

router = APIRouter(prefix="/api/generate", tags=["generation"])


class ImageGenerateRequest(BaseModel):
    prompt: str
    model: str = "seedream_5_pro"  # AI model to use
    aspect_ratio: str = "1:1"
    negative_prompt: Optional[str] = None
    seed: Optional[int] = None


class ImageGenerateResponse(BaseModel):
    image_base64: str
    api_used: str
    model: str
    credits: int
    seed: Optional[int] = None
    has_watermark: bool = False


@router.post("/image", response_model=ImageGenerateResponse)
async def generate_image(
    request: ImageGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    """
    Generate image with selected AI model

    Models and credits (aligned with Lumina):
    - seedream_5_lite: 4 credits
    - seedream_4.5: 4 credits
    - seedream_5_pro: 9 credits (default)
    - nano_banana_pro: 12 credits
    - nano_banana_2: 24 credits
    - gpt_image_2: 30 credits

    If insufficient credits, returns 402 with upgrade_required flag
    """

    # Calculate credits required based on model
    credits_needed = image_router.calculate_credits(request.model)

    # Check user has enough credits
    if user.credits < credits_needed:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "insufficient_credits",
                "message": "Crediti insufficienti",
                "required": credits_needed,
                "available": user.credits,
                "upgrade_required": True,
            }
        )

    try:
        # Generate image
        result = await image_router.generate_image(
            prompt=request.prompt,
            model=request.model,
            aspect_ratio=request.aspect_ratio,
            negative_prompt=request.negative_prompt,
            seed=request.seed,
        )

        # Deduct credits
        user.credits -= credits_needed
        db.commit()

        # Save generation record
        gen = Generation(
            user_id=user.id,
            kind="image",
            prompt=request.prompt,
            params={
                "model": request.model,
                "aspect_ratio": request.aspect_ratio,
                "negative_prompt": request.negative_prompt,
                "seed": result.get("seed"),
            },
            status="completed",
            cost=credits_needed,
            api_used=result["api_used"],
        )
        db.add(gen)
        db.commit()

        # Apply watermark for free/trial users
        image_base64 = result["image_base64"]
        has_watermark = user.has_watermark

        if has_watermark and image_base64:
            try:
                image_base64 = apply_watermark(image_base64, style="corner")
            except Exception:
                pass  # If watermark fails, return original image

        return ImageGenerateResponse(
            image_base64=image_base64,
            api_used=result["api_used"],
            model=result["model"],
            credits=result["credits"],
            seed=result.get("seed"),
            has_watermark=has_watermark,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/image/credits")
async def calculate_image_credits(
    model: str = "seedream_5_pro",
    user: User = Depends(current_user)
):
    """
    Calculate credits for image generation without generating

    Models and credits (aligned with Lumina):
    - seedream_5_lite: 4 credits (3.5 rounded up)
    - seedream_4.5: 4 credits
    - seedream_5_pro: 9 credits (default)
    - nano_banana_pro: 12 credits
    - nano_banana_2: 24 credits
    - gpt_image_2: 30 credits

    Returns credits needed and whether user can afford it
    """
    credits = image_router.calculate_credits(model)
    can_afford = user.credits >= credits

    return {
        "credits": credits,
        "model": model,
        "user_credits": user.credits,
        "can_afford": can_afford,
        "upgrade_required": not can_afford,
    }
