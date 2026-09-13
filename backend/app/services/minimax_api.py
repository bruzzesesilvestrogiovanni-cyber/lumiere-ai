"""
MiniMax (Hailuo) API Integration for Video and Image Generation
API Docs: https://platform.minimax.chat/docs
"""

import httpx
import asyncio
from typing import Optional
from ..config import settings


class MiniMaxAPI:
    """Client for MiniMax Hailuo API (Video & Image)"""

    BASE_URL = "https://api.minimax.chat/v1"

    def __init__(self):
        self.api_key = settings.minimax_api_key
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    # ============================================
    # VIDEO GENERATION (Hailuo H3)
    # ============================================

    async def generate_video(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        resolution: str = "720p",
        duration: int = 5,
        start_frame: Optional[str] = None,
    ) -> dict:
        """
        Generate video using MiniMax Hailuo H3 API

        Args:
            prompt: Text description of the video
            aspect_ratio: Video aspect ratio (1:1, 16:9, 9:16, etc.)
            resolution: Output resolution (512p, 768p, 1080p, 2k)
            duration: Video duration in seconds (typically 5-10s)
            start_frame: Optional base64 encoded starting image

        Returns:
            dict with task_id for polling
        """
        # Map resolution to MiniMax format
        resolution_map = {
            "480p": "512",
            "512p": "512",
            "720p": "768",
            "768p": "768",
            "1080p": "1080",
            "2k": "2k"
        }

        payload = {
            "model": "hailuo-h3",
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution_map.get(resolution, "768"),
            "duration": min(duration, 10),  # H3 max is typically 10s per clip
        }

        # Add starting frame for image-to-video
        if start_frame:
            payload["image"] = start_frame
            payload["mode"] = "image_to_video"
        else:
            payload["mode"] = "text_to_video"

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/video/generate",
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
                f"{self.BASE_URL}/video/status/{task_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def wait_for_video_completion(
        self,
        task_id: str,
        max_wait: int = 300,
        poll_interval: int = 3
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
    # IMAGE GENERATION (image-01)
    # ============================================

    async def generate_image(
        self,
        prompt: str,
        aspect_ratio: str = "1:1",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
        num_images: int = 1,
    ) -> dict:
        """
        Generate image using MiniMax image-01 API

        Args:
            prompt: Text description of the image
            aspect_ratio: Image aspect ratio
            negative_prompt: What to avoid in the image
            seed: Random seed for reproducibility
            num_images: Number of images to generate

        Returns:
            dict with image_base64 or image_url
        """
        # Map aspect ratio to dimensions
        dimensions = {
            "1:1": {"width": 1024, "height": 1024},
            "16:9": {"width": 1344, "height": 768},
            "9:16": {"width": 768, "height": 1344},
            "4:3": {"width": 1152, "height": 896},
            "3:4": {"width": 896, "height": 1152},
            "3:2": {"width": 1216, "height": 832},
            "2:3": {"width": 832, "height": 1216},
        }

        dims = dimensions.get(aspect_ratio, dimensions["1:1"])

        payload = {
            "model": "image-01",
            "prompt": prompt,
            "width": dims["width"],
            "height": dims["height"],
            "num_images": num_images,
        }

        if negative_prompt:
            payload["negative_prompt"] = negative_prompt

        if seed is not None:
            payload["seed"] = seed

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/image/generate",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            result = response.json()

            return {
                "image_base64": result.get("images", [{}])[0].get("base64"),
                "image_url": result.get("images", [{}])[0].get("url"),
                "seed": result.get("seed"),
            }


# Singleton instance
minimax_api = MiniMaxAPI()
