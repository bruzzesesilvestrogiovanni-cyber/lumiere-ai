"""
Smart Image Generation Router

Priority (cost optimization):
1. Stability SD3 - Good quality (€0.03/img)
2. MiniMax image-01 - Cheapest (€0.018/img)
3. Grok Aurora - TOP quality for photorealistic images (€0.065/img)

Modelli disponibili:
- minimax: MiniMax image-01 (economico)
- seedream_*: Stability SD3 (buona qualita)
- grok_aurora: Grok Aurora (TOP qualita)
"""

from typing import Optional
from .stability_api import StabilityAPI
from .minimax_api import MiniMaxAPI
from .grok_api import GrokAPI


# Pricing table for image generation
IMAGE_MODEL_PRICING = {
    "minimax": 3,                # MiniMax image-01 - cheapest (€0.018/img)
    "seedream_5_lite": 4,        # Seedream 5.0 Lite (via Stability) - DEFAULT
    "seedream_4.5": 4,           # Seedream 4.5 (via Stability)
    "seedream_5_pro": 9,         # Seedream 5.0 Pro (via Stability)
    "nano_banana_pro": 12,       # Nano Banana Pro (via Stability)
    "nano_banana_2": 24,         # Nano Banana 2 (via Stability)
    "grok_aurora": 30,           # Grok Aurora - TOP quality (€0.065/img)
}

# Default pricing (Seedream 5.0 Lite)
DEFAULT_IMAGE_CREDITS = 4


class ImageRouter:
    """
    Router for image generation
    Pricing based on AI model

    Routing:
    - minimax -> MiniMax API (cheapest)
    - grok_aurora -> Grok API (TOP quality)
    - others -> Stability API (good quality)
    """

    def __init__(self):
        self.stability = StabilityAPI()
        self.minimax = MiniMaxAPI()
        self.grok = GrokAPI()

    def calculate_credits(self, model: str = "seedream_5_lite") -> int:
        """
        Calculate credits based on AI model

        Returns:
            Number of credits required
        """
        credits = IMAGE_MODEL_PRICING.get(model, DEFAULT_IMAGE_CREDITS)
        return int(credits) if credits == int(credits) else int(credits) + 1

    def get_model_pricing(self) -> dict:
        """Return all model pricing for display"""
        return IMAGE_MODEL_PRICING

    async def generate_image(
        self,
        prompt: str,
        model: str = "seedream_5_lite",
        aspect_ratio: str = "1:1",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> dict:
        """
        Generate image

        Args:
            prompt: Text description of the image
            model: AI model to use
            aspect_ratio: Image aspect ratio
            negative_prompt: What to avoid
            seed: Random seed

        Returns:
            dict with image_base64, api_used, credits, model
        """
        credits = self.calculate_credits(model)

        # Use Grok Aurora for "grok_aurora" model (TOP quality)
        if model == "grok_aurora":
            result = await self.grok.generate_image(
                prompt=prompt,
                aspect_ratio=aspect_ratio,
                quality="medium",
                negative_prompt=negative_prompt,
                seed=seed,
            )
            return {
                "image_base64": result.get("image_base64"),
                "image_url": result.get("image_url"),
                "api_used": "grok_aurora",
                "model": model,
                "credits": credits,
                "seed": result.get("seed"),
                "revised_prompt": result.get("revised_prompt"),
            }

        # Use MiniMax for "minimax" model (cheapest)
        if model == "minimax":
            result = await self.minimax.generate_image(
                prompt=prompt,
                aspect_ratio=aspect_ratio,
                negative_prompt=negative_prompt,
                seed=seed,
            )
            return {
                "image_base64": result.get("image_base64"),
                "image_url": result.get("image_url"),
                "api_used": "minimax",
                "model": model,
                "credits": credits,
                "seed": result.get("seed"),
            }

        # Use Stability for all other models
        result = await self.stability.generate_image(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
            negative_prompt=negative_prompt,
            seed=seed,
        )

        return {
            "image_base64": result.get("image_base64"),
            "api_used": "stability",
            "model": model,
            "credits": credits,
            "seed": result.get("seed"),
        }


# Singleton instance
image_router = ImageRouter()
