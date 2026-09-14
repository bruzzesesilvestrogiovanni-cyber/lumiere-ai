"""
Chat API Router
Uses NVIDIA NIM free tier for LLM chat
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import User
from ..auth import current_user
from ..services.nvidia_api import nvidia_api

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None  # Optional model override
    max_tokens: Optional[int] = 1024
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    content: str
    model: str


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user: User = Depends(current_user)
):
    """
    Chat with AI assistant (NVIDIA LLM - FREE)

    Available models:
    - llama-3.2-11b (default)
    - llama-3.2-90b
    - mistral-large
    - gemma-3-12b
    """
    try:
        # Convert messages to dict format
        messages = [{"role": m.role, "content": m.content} for m in request.messages]

        # Add system prompt for creative assistant
        system_message = {
            "role": "system",
            "content": """You are a creative AI assistant for LUMIERE AI, a platform for generating images and videos with AI.

Your role is to:
- Help users brainstorm creative ideas for their AI generations
- Suggest improvements to their prompts for better results
- Answer questions about AI image/video generation
- Provide tips on composition, style, lighting, and other creative aspects

Be helpful, creative, and encouraging. Keep responses concise but informative."""
        }
        messages.insert(0, system_message)

        # Call NVIDIA API
        result = await nvidia_api.chat(
            messages=messages,
            model=request.model,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
        )

        return ChatResponse(
            content=result["content"],
            model=result["model"],
        )

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.get("/models")
async def get_models(user: User = Depends(current_user)):
    """Get available chat models"""
    return {
        "models": nvidia_api.get_available_models(),
        "default": "llama-3.2-11b",
    }
