"""
Fal.ai API Integration for Video Generation (Seedance 2.5)
API Docs: https://fal.ai/models/bytedance/seedance-2.5
"""

import httpx
import asyncio
from typing import Optional
from ..config import settings


class FalAPI:
    """Client for Fal.ai API (Seedance video generation)"""

    BASE_URL = "https://queue.fal.run"

    def __init__(self):
        self.api_key = settings.fal_api_key

    def _headers(self) -> dict:
        """Generate authentication headers"""
        return {
            "Authorization": f"Key {self.api_key}",
            "Content-Type": "application/json"
        }

    async def generate_video(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        duration: int = 5,
        image_url: Optional[str] = None,
        model: str = "bytedance/seedance-2.5/image-to-video"
    ) -> dict:
        """
        Generate video using Fal.ai Seedance API

        Args:
            prompt: Text description of the video
            aspect_ratio: Video aspect ratio (16:9, 9:16, 1:1, etc.)
            duration: Video duration in seconds (max 10s for Seedance 2.5)
            image_url: Optional starting image URL for image-to-video
            model: Fal.ai model endpoint

        Returns:
            dict with request_id for polling
        """
        # Use text-to-video if no image provided
        if not image_url:
            model = "bytedance/seedance-2.5/text-to-video"

        payload = {
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "duration": min(duration, 10),  # Seedance 2.5 max is 10s
        }

        # Add image for image-to-video
        if image_url:
            payload["image_url"] = image_url

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/{model}",
                headers=self._headers(),
                json=payload
            )
            response.raise_for_status()
            data = response.json()

            return {
                "task_id": data.get("request_id"),
                "status": "processing",
                "status_url": data.get("status_url"),
                "response_url": data.get("response_url")
            }

    async def get_video_status(self, request_id: str, model: str = "bytedance/seedance-2.5/text-to-video") -> dict:
        """
        Poll for video generation status

        Returns:
            dict with status and video_url when completed
        """
        status_url = f"https://queue.fal.run/{model}/requests/{request_id}/status"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                status_url,
                headers=self._headers()
            )
            response.raise_for_status()
            data = response.json()

            status = data.get("status", "UNKNOWN")

            if status == "COMPLETED":
                # Get the result
                result_url = f"https://queue.fal.run/{model}/requests/{request_id}"
                result_response = await client.get(
                    result_url,
                    headers=self._headers()
                )
                result_response.raise_for_status()
                result = result_response.json()

                return {
                    "status": "completed",
                    "video_url": result.get("video", {}).get("url"),
                    "duration": result.get("video", {}).get("duration")
                }
            elif status == "FAILED":
                return {
                    "status": "failed",
                    "error": data.get("error", "Unknown error")
                }
            else:
                return {
                    "status": "processing",
                    "progress": data.get("progress", 0)
                }

    async def wait_for_completion(
        self,
        request_id: str,
        model: str = "bytedance/seedance-2.5/text-to-video",
        max_wait: int = 300,
        poll_interval: int = 3
    ) -> dict:
        """
        Wait for video generation to complete

        Args:
            request_id: The generation request ID
            model: The model used
            max_wait: Maximum seconds to wait
            poll_interval: Seconds between polls

        Returns:
            Final status dict with video_url
        """
        elapsed = 0
        while elapsed < max_wait:
            status = await self.get_video_status(request_id, model)

            if status.get("status") == "completed":
                return status
            elif status.get("status") == "failed":
                raise Exception(f"Video generation failed: {status.get('error')}")

            await asyncio.sleep(poll_interval)
            elapsed += poll_interval

        raise TimeoutError("Video generation timed out")


# Calculate credits for Fal.ai video
def calculate_fal_credits(duration: int, has_audio: bool = False) -> int:
    """Calculate credits based on duration for Fal.ai Seedance API"""

    # Base pricing: ~$0.17/second at 720p
    # We charge credits with margin
    base_credits_per_second = 15

    credits = duration * base_credits_per_second

    if has_audio:
        credits = int(credits * 1.2)  # 20% extra for audio

    return credits
