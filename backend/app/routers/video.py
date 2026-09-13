"""
Video Generation API Router
Smart routing between Grok and BytePlus APIs
Credit-based system - watermarks for Trial/Free users only
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import User, Generation
from ..auth import current_user
from ..services.video_router import video_router

router = APIRouter(prefix="/api/generate", tags=["generation"])


class VideoGenerateRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "16:9"
    resolution: str = "720p"
    duration: int = 5
    start_frame: Optional[str] = None


class VideoGenerateResponse(BaseModel):
    task_id: str
    api_used: str
    has_audio: bool
    credits: int
    status: str
    has_watermark: bool = False


class VideoStatusResponse(BaseModel):
    task_id: str
    status: str
    progress: Optional[int] = None
    video_url: Optional[str] = None
    error: Optional[str] = None
    has_watermark: bool = False


# In-memory task storage (use Redis in production)
_tasks = {}


@router.post("/video", response_model=VideoGenerateResponse)
async def generate_video(
    request: VideoGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    """
    Start video generation with automatic API selection

    - Duration ≤ 15s + not 21:9 → Grok (cheaper, includes audio)
    - Duration > 15s OR 21:9 → BytePlus (longer videos, cinema)

    If insufficient credits, returns 402 with upgrade_required flag
    """

    # Calculate credits required
    credits_needed = video_router.calculate_credits(
        request.resolution,
        request.duration,
        request.aspect_ratio
    )

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
        # Generate video (API selected automatically)
        result = await video_router.generate_video(
            prompt=request.prompt,
            aspect_ratio=request.aspect_ratio,
            resolution=request.resolution,
            duration=request.duration,
            start_frame=request.start_frame,
        )

        # Deduct credits
        user.credits -= credits_needed
        db.commit()

        # Store task info for status polling
        _tasks[result["task_id"]] = {
            "api_used": result["api_used"],
            "user_id": user.id,
            "credits": credits_needed,
            "has_watermark": user.has_watermark,
        }

        # Save generation record
        gen = Generation(
            user_id=user.id,
            kind="video",
            prompt=request.prompt,
            params={
                "aspect_ratio": request.aspect_ratio,
                "resolution": request.resolution,
                "duration": request.duration,
            },
            status="processing",
            task_id=result["task_id"],
            cost=credits_needed,
            api_used=result["api_used"],
        )
        db.add(gen)
        db.commit()

        return VideoGenerateResponse(
            task_id=result["task_id"],
            api_used=result["api_used"],
            has_audio=result["has_audio"],
            credits=result["credits"],
            status=result["status"],
            has_watermark=user.has_watermark,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/video/status/{task_id}", response_model=VideoStatusResponse)
async def get_video_status(
    task_id: str,
    user: User = Depends(current_user)
):
    """Get video generation status"""

    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify user owns this task
    if task["user_id"] != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    try:
        status = await video_router.get_status(task_id, task["api_used"])

        return VideoStatusResponse(
            task_id=task_id,
            status=status.get("status", "processing"),
            progress=status.get("progress"),
            video_url=status.get("video_url"),
            error=status.get("error"),
            has_watermark=task.get("has_watermark", False),
        )

    except Exception as e:
        return VideoStatusResponse(
            task_id=task_id,
            status="failed",
            error=str(e),
            has_watermark=task.get("has_watermark", False),
        )


@router.get("/video/credits")
async def calculate_video_credits(
    resolution: str = "720p",
    duration: int = 5,
    aspect_ratio: str = "16:9",
    user: User = Depends(current_user)
):
    """
    Calculate credits for video generation without generating

    Returns credits needed and whether user can afford it
    """
    credits = video_router.calculate_credits(resolution, duration, aspect_ratio)

    # Determine which API will be used
    api_name, has_audio = video_router.select_api(duration, aspect_ratio)

    can_afford = user.credits >= credits

    return {
        "credits": credits,
        "user_credits": user.credits,
        "can_afford": can_afford,
        "upgrade_required": not can_afford,
        "api_type": "optimized" if api_name == "grok" else "premium",
        "has_audio": has_audio,
    }
