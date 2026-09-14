"""
NVIDIA NIM API Integration
Free tier for image and video generation using NVIDIA Build platform

Image Models:
- FLUX.1-dev: High quality image generation
- FLUX.1-schnell: Fast image generation
- Stable Diffusion 3.5: Good quality alternative

Video Models:
- Cosmos3-nano: Physics-aware video generation
"""

import httpx
import os
import base64
import uuid
from typing import Optional


class NvidiaAPI:
    """
    NVIDIA NIM API for image and video generation
    Free tier: ~40 requests/minute per model

    Base URL: https://ai.api.nvidia.com/v1
    """

    BASE_URL = "https://ai.api.nvidia.com/v1"

    # Available models
    IMAGE_MODELS = {
        "flux_dev": "black-forest-labs/flux.1-dev",
        "flux_schnell": "black-forest-labs/flux.1-schnell",
        "sd35_large": "stabilityai/stable-diffusion-3.5-large",
    }

    VIDEO_MODELS = {
        "cosmos3": "nvidia/cosmos-3-nano",
    }

    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")

    async def generate_image(
        self,
        prompt: str,
        model: str = "flux_dev",
        aspect_ratio: str = "1:1",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> dict:
        """
        Generate image using NVIDIA NIM (FLUX.1 or SD3.5)

        Args:
            prompt: Text description of the image
            model: Model to use (flux_dev, flux_schnell, sd35_large)
            aspect_ratio: Image aspect ratio
            negative_prompt: What to avoid
            seed: Random seed

        Returns:
            dict with image_base64, seed, model
        """
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY not configured")

        model_id = self.IMAGE_MODELS.get(model, self.IMAGE_MODELS["flux_dev"])

        # Get dimensions from aspect ratio
        width, height = self._get_dimensions(aspect_ratio)

        payload = {
            "prompt": prompt,
            "width": width,
            "height": height,
        }

        if negative_prompt:
            payload["negative_prompt"] = negative_prompt
        if seed:
            payload["seed"] = seed

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/genai/{model_id}",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=120.0,
            )

            if response.status_code != 200:
                error_detail = response.text
                raise Exception(f"NVIDIA API error: {response.status_code} - {error_detail}")

            result = response.json()

            # NVIDIA returns image in artifacts array
            image_data = None
            if "artifacts" in result and len(result["artifacts"]) > 0:
                image_data = result["artifacts"][0].get("base64")
            elif "image" in result:
                image_data = result["image"]
            elif "data" in result and len(result["data"]) > 0:
                image_data = result["data"][0].get("b64_json")

            return {
                "image_base64": image_data,
                "seed": result.get("seed", seed),
                "model": model,
                "api_used": "nvidia",
            }

    async def generate_video(
        self,
        prompt: str,
        duration: int = 5,
        aspect_ratio: str = "16:9",
        start_frame: Optional[str] = None,
    ) -> dict:
        """
        Generate video using NVIDIA Cosmos3

        Args:
            prompt: Text description of the video
            duration: Video duration in seconds
            aspect_ratio: Video aspect ratio
            start_frame: Optional base64 image for image-to-video

        Returns:
            dict with task_id, status
        """
        if not self.api_key:
            raise ValueError("NVIDIA_API_KEY not configured")

        model_id = self.VIDEO_MODELS["cosmos3"]

        payload = {
            "prompt": prompt,
            "num_frames": duration * 8,  # ~8 fps for Cosmos
        }

        if start_frame:
            payload["image"] = start_frame

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/genai/{model_id}",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=300.0,
            )

            if response.status_code != 200:
                error_detail = response.text
                raise Exception(f"NVIDIA API error: {response.status_code} - {error_detail}")

            result = response.json()

            # Generate task ID for tracking
            task_id = f"nvidia_{uuid.uuid4().hex[:12]}"

            # For sync response, video is directly in result
            video_data = None
            if "video" in result:
                video_data = result["video"]
            elif "artifacts" in result and len(result["artifacts"]) > 0:
                video_data = result["artifacts"][0].get("base64")

            return {
                "task_id": task_id,
                "status": "completed" if video_data else "processing",
                "video_base64": video_data,
                "api_used": "nvidia",
                "has_audio": False,  # Cosmos doesn't generate audio
            }

    async def get_video_status(self, task_id: str) -> dict:
        """
        Get video generation status
        For NVIDIA sync API, status is always completed or failed
        """
        return {
            "task_id": task_id,
            "status": "completed",
        }

    def _get_dimensions(self, aspect_ratio: str) -> tuple:
        """Get image dimensions for aspect ratio"""
        ratios = {
            "1:1": (1024, 1024),
            "16:9": (1344, 768),
            "9:16": (768, 1344),
            "4:3": (1152, 896),
            "3:4": (896, 1152),
            "3:2": (1216, 832),
            "2:3": (832, 1216),
            "21:9": (1536, 640),
        }
        return ratios.get(aspect_ratio, (1024, 1024))


# Singleton instance
nvidia_api = NvidiaAPI()
