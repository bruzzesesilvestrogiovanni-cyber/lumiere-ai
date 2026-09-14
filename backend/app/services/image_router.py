"""
Smart Image Generation Router

Priority (using NVIDIA NIM free tier):
1. NVIDIA FLUX.1-dev - Best quality (FREE)
2. NVIDIA FLUX.1-schnell - Fast generation (FREE)
3. NVIDIA SD3.5 Large - Alternative (FREE)

Fallback (paid APIs - if NVIDIA fails):
4. Stability SD3 - Good quality (€0.03/img)
5. MiniMax image-01 - Cheapest (€0.018/img)
6. Grok Aurora - TOP quality (€0.065/img)

Modelli disponibili:
- flux_dev: NVIDIA FLUX.1-dev (TOP quality - FREE)
- flux_schnell: NVIDIA FLUX.1-schnell (fast - FREE)
- sd35: NVIDIA SD3.5 Large (FREE)
- minimax: MiniMax image-01 (paid fallback)
- grok_aurora: Grok Aurora (paid - premium)
"""

from typing import Optional
from .nvidia_api import NvidiaAPI
from .stability_api import StabilityAPI
from .minimax_api import MiniMaxAPI
from .grok_api import GrokAPI


# Pricing table for image generation (credits)
IMAGE_MODEL_PRICING = {
    # NVIDIA FREE tier (no real cost, but we charge credits for value)
    "flux_dev": 4,           # FLUX.1-dev - Best quality (FREE API)
    "flux_schnell": 2,       # FLUX.1-schnell - Fast (FREE API)
    "sd35": 3,               # SD3.5 Large (FREE API)
    # Legacy models (paid APIs - fallback)
    "minimax": 3,            # MiniMax image-01 (€0.018/img)
    "seedream_5_lite": 4,    # Seedream via Stability
    "seedream_4.5": 4,       # Seedream via Stability
    "seedream_5_pro": 9,     # Seedream via Stability
    "grok_aurora": 30,       # Grok Aurora - TOP (€0.065/img)
}

# Default model (NVIDIA FLUX.1-dev - best quality, free)
DEFAULT_MODEL = "flux_dev"
DEFAULT_IMAGE_CREDITS = 4


class ImageRouter:
    """
    Router for image generation
    Primary: NVIDIA NIM (free tier)
    Fallback: Paid APIs (Stability, MiniMax, Grok)
    """

    def __init__(self):
        self.nvidia = NvidiaAPI()
        self.stability = StabilityAPI()
        self.minimax = MiniMaxAPI()
        self.grok = GrokAPI()

    def calculate_credits(self, model: str = DEFAULT_MODEL) -> int:
        """Calculate credits based on AI model"""
        credits = IMAGE_MODEL_PRICING.get(model, DEFAULT_IMAGE_CREDITS)
        return int(credits) if credits == int(credits) else int(credits) + 1

    def get_model_pricing(self) -> dict:
        """Return all model pricing for display"""
        return IMAGE_MODEL_PRICING

    async def generate_image(
        self,
        prompt: str,
        model: str = DEFAULT_MODEL,
        aspect_ratio: str = "1:1",
        negative_prompt: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> dict:
        """
        Generate image with automatic API selection

        Primary: NVIDIA NIM (free)
        Fallback: Paid APIs if NVIDIA fails

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

        # NVIDIA models (FREE - primary choice)
        if model in ["flux_dev", "flux_schnell", "sd35"]:
            try:
                result = await self.nvidia.generate_image(
                    prompt=prompt,
                    model=model,
                    aspect_ratio=aspect_ratio,
                    negative_prompt=negative_prompt,
                    seed=seed,
                )
                return {
                    "image_base64": result.get("image_base64"),
                    "api_used": "nvidia",
                    "model": model,
                    "credits": credits,
                    "seed": result.get("seed"),
                }
            except Exception as e:
                # If NVIDIA fails, fallback to Stability
                print(f"NVIDIA API failed: {e}, falling back to Stability")
                result = await self.stability.generate_image(
                    prompt=prompt,
                    aspect_ratio=aspect_ratio,
                    negative_prompt=negative_prompt,
                    seed=seed,
                )
                return {
                    "image_base64": result.get("image_base64"),
                    "api_used": "stability_fallback",
                    "model": model,
                    "credits": credits,
                    "seed": result.get("seed"),
                }

        # Grok Aurora (paid - premium quality)
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

        # MiniMax (paid - cheapest fallback)
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

        # Seedream/Stability models (paid)
        if model.startswith("seedream_") or model.startswith("nano_banana"):
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

        # Default: Use NVIDIA FLUX.1-dev
        try:
            result = await self.nvidia.generate_image(
                prompt=prompt,
                model="flux_dev",
                aspect_ratio=aspect_ratio,
                negative_prompt=negative_prompt,
                seed=seed,
            )
            return {
                "image_base64": result.get("image_base64"),
                "api_used": "nvidia",
                "model": "flux_dev",
                "credits": credits,
                "seed": result.get("seed"),
            }
        except Exception:
            # Final fallback to Stability
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
