"""
NVIDIA NIM API Integration
Free tier for LLM chat using NVIDIA Build platform

Available Models:
- meta/llama-3.2-11b-vision-instruct (default - works with free tier)
- meta/llama-3.2-90b-vision-instruct
- mistralai/mistral-large-2-instruct
- google/gemma-3-12b-it
"""

import httpx
import os
from typing import List, Optional


class NvidiaAPI:
    """
    NVIDIA NIM API for LLM chat
    Free tier: ~40 requests/minute per model

    Base URL: https://integrate.api.nvidia.com/v1
    """

    BASE_URL = "https://integrate.api.nvidia.com/v1"

    # Available chat models (verified working with free tier)
    CHAT_MODELS = {
        "llama-3.2-11b": "meta/llama-3.2-11b-vision-instruct",
        "llama-3.2-90b": "meta/llama-3.2-90b-vision-instruct",
        "mistral-large": "mistralai/mistral-large-2-instruct",
        "gemma-3-12b": "google/gemma-3-12b-it",
    }

    DEFAULT_MODEL = "meta/llama-3.2-11b-vision-instruct"

    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")

    async def chat(
        self,
        messages: List[dict],
        model: str = None,
        max_tokens: int = 1024,
        temperature: float = 0.7,
        stream: bool = False,
    ) -> dict:
        """
        Chat with NVIDIA LLM

        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (default: llama-3.2-11b)
            max_tokens: Maximum tokens in response
            temperature: Response randomness (0-1)
            stream: Whether to stream response

        Returns:
            dict with response content
        """
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY not configured")

        # Get model ID
        model_id = self.CHAT_MODELS.get(model, self.DEFAULT_MODEL)
        if model and model not in self.CHAT_MODELS:
            model_id = model  # Allow direct model ID

        payload = {
            "model": model_id,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": stream,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=60.0,
            )

            if response.status_code != 200:
                error_detail = response.text
                raise Exception(f"NVIDIA API error: {response.status_code} - {error_detail}")

            result = response.json()

            # Extract response content
            content = ""
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0].get("message", {}).get("content", "")

            return {
                "content": content,
                "model": model_id,
                "usage": result.get("usage", {}),
            }

    def get_available_models(self) -> dict:
        """Return available chat models"""
        return self.CHAT_MODELS


# Singleton instance
nvidia_api = NvidiaAPI()
