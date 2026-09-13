"""
Stability AI API Integration
Used for FREE TIER image generation (cheapest option: ~$0.003/image)
"""

import httpx
import os
import base64
from typing import Optional


class StabilityAPI:
    """
    Stability AI API for image generation
    Used exclusively for free tier users

    Pricing: ~$0.003 per image (SDXL)
    Limits: 512x512 for free tier
    """

    BASE_URL = "https://api.stability.ai/v2beta"

    def __init__(self):
        self.api_key = os.getenv("STABILITY_API_KEY")

    async def generate_image(
        self,
        prompt: str,
        aspect_ratio: str = "1:1",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> dict:
        """
        Generate image using Stability AI SDXL (cheapest model)

        For free tier:
        - Max resolution: 512x512
        - Watermark will be added after generation

        Args:
            prompt: Text description of the image
            aspect_ratio: Image aspect ratio (1:1, 16:9, 9:16, etc.)
            negative_prompt: What to avoid in the image
            seed: Random seed for reproducibility

        Returns:
            dict with image_base64, seed, finish_reason
        """
        if not self.api_key:
            raise ValueError("STABILITY_API_KEY not configured")

        # Map aspect ratios to dimensions (512 max for free tier)
        dimensions = self._get_dimensions(aspect_ratio)

        payload = {
            "prompt": prompt,
            "output_format": "png",
            "aspect_ratio": aspect_ratio,
        }

        if negative_prompt:
            payload["negative_prompt"] = negative_prompt
        if seed:
            payload["seed"] = seed

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/stable-image/generate/sd3",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Accept": "application/json",
                },
                data=payload,
                timeout=60.0,
            )

            if response.status_code != 200:
                error_detail = response.json() if response.content else {}
                raise Exception(f"Stability API error: {response.status_code} - {error_detail}")

            result = response.json()

            return {
                "image_base64": result.get("image"),
                "seed": result.get("seed"),
                "finish_reason": result.get("finish_reason"),
                "api_used": "stability",
            }

    def _get_dimensions(self, aspect_ratio: str) -> tuple:
        """Get image dimensions for aspect ratio (max 512px for free tier)"""
        ratios = {
            "1:1": (512, 512),
            "16:9": (512, 288),
            "9:16": (288, 512),
            "4:3": (512, 384),
            "3:4": (384, 512),
            "3:2": (512, 341),
            "2:3": (341, 512),
        }
        return ratios.get(aspect_ratio, (512, 512))


# Cost calculation for free tier
def calculate_stability_credits() -> int:
    """
    Free tier images don't cost user credits
    But we track for daily limits
    Returns: 0 (free tier doesn't deduct credits)
    """
    return 0


# Singleton instance
stability_api = StabilityAPI()
