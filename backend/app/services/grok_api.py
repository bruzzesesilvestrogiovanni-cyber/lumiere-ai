"""
Grok/xAI API Integration for Video and Image Generation
API Docs: https://docs.x.ai/developers/model-capabilities/images/generation

Image Models:
- grok-imagine-image-2.0 (Aurora) - TOP quality for photorealistic images

Video Models:
- grok-imagine-video-1.5-preview - Video generation with audio
"""

import httpx
import asyncio
from typing import Optional
from ..config import settings


class GrokAPI:
    """Client for xAI Grok Imagine API (Video & Image)"""

    BASE_URL = "https://api.x.ai/v1"

    def __init__(self):
        self.api_key = settings.grok_api_key
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def generate_video(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        resolution: str = "720p",
        duration: int = 5,
        start_frame: Optional[str] = None,
    ) -> dict:
        """
        Generate video using Grok Imagine Video API

        Args:
            prompt: Text description of the video
            aspect_ratio: Video aspect ratio (1:1, 16:9, 9:16, etc.)
            resolution: Output resolution (480p, 720p, 1080p)
            duration: Video duration in seconds (max 15s)
            start_frame: Optional base64 encoded starting image

        Returns:
            dict with task_id for polling or video_url if completed
        """

        # Map resolution to API format
        resolution_map = {
            "480p": "480",
            "720p": "720",
            "1080p": "1080"
        }

        payload = {
            "model": "grok-imagine-video-1.5-preview",
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution_map.get(resolution, "720"),
            "duration": min(duration, 15),  # Grok max is 15s
            "include_audio": True,  # Grok includes audio for free
        }

        # Add starting frame if provided
        if start_frame:
            payload["image"] = start_frame

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/imagine/video/generate",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    async def get_video_status(self, task_id: str) -> dict:
        """
        Poll for video generation status

        Returns:
            dict with status (pending, processing, completed, failed)
            and video_url when completed
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.BASE_URL}/imagine/video/status/{task_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def wait_for_completion(
        self,
        task_id: str,
        max_wait: int = 300,
        poll_interval: int = 2
    ) -> dict:
        """
        Wait for video generation to complete

        Args:
            task_id: The generation task ID
            max_wait: Maximum seconds to wait
            poll_interval: Seconds between polls

        Returns:
            Final status dict with video_url
        """
        elapsed = 0
        while elapsed < max_wait:
            status = await self.get_video_status(task_id)

            if status.get("status") == "completed":
                return status
            elif status.get("status") == "failed":
                raise Exception(f"Video generation failed: {status.get('error')}")

            await asyncio.sleep(poll_interval)
            elapsed += poll_interval

        raise TimeoutError("Video generation timed out")

    # ============================================
    # IMAGE GENERATION (Aurora / grok-imagine-image-2.0)
    # ============================================

    async def generate_image(
        self,
        prompt: str,
        aspect_ratio: str = "1:1",
        quality: str = "medium",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> dict:
        """
        Generate image using Grok Aurora (grok-imagine-image-2.0)

        TOP quality for photorealistic images, skin textures, lighting.

        Args:
            prompt: Text description of the image
            aspect_ratio: Image aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4)
            quality: "low", "medium", or "auto" (default medium for best quality)
            negative_prompt: What to avoid in the image
            seed: Random seed for reproducibility

        Returns:
            dict with image_base64 or image_url
        """
        # Map aspect ratio to dimensions (up to 2K supported)
        dimensions = {
            "1:1": {"width": 1024, "height": 1024},
            "16:9": {"width": 1344, "height": 768},
            "9:16": {"width": 768, "height": 1344},
            "4:3": {"width": 1152, "height": 896},
            "3:4": {"width": 896, "height": 1152},
            "3:2": {"width": 1216, "height": 832},
            "2:3": {"width": 832, "height": 1216},
            "21:9": {"width": 1536, "height": 640},
        }

        dims = dimensions.get(aspect_ratio, dimensions["1:1"])

        payload = {
            "model": "grok-imagine-image-2.0",
            "prompt": prompt,
            "width": dims["width"],
            "height": dims["height"],
            "quality": quality,
            "response_format": "b64_json",  # Get base64 directly
        }

        if negative_prompt:
            payload["negative_prompt"] = negative_prompt

        if seed is not None:
            payload["seed"] = seed

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/images/generations",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()

            # Extract image from response
            image_data = result.get("data", [{}])[0]

            return {
                "image_base64": image_data.get("b64_json"),
                "image_url": image_data.get("url"),
                "revised_prompt": image_data.get("revised_prompt"),
                "seed": result.get("seed"),
                "api_used": "grok_aurora",
                "model": "grok-imagine-image-2.0",
            }


# Calculate credits for Grok video
def calculate_grok_credits(resolution: str, duration: int) -> int:
    """Calculate credits based on resolution and duration for Grok API"""

    pricing = {
        "480p": {5: 15, 10: 28, 15: 40},
        "720p": {5: 25, 10: 45, 15: 65},
        "1080p": {5: 40, 10: 75, 15: 100},
    }

    res_pricing = pricing.get(resolution, pricing["720p"])

    # Find closest duration
    for d in [5, 10, 15]:
        if duration <= d:
            return res_pricing[d]

    return res_pricing[15]
