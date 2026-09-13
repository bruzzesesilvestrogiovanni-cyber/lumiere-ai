"""
Smart Video Generation Router
Automatically selects the best API based on user requirements

Priority (cost optimization):
1. MiniMax H3 - Cheapest for videos ≤10s (€0.009-0.074/sec)
2. Grok - For videos 10-15s with audio (€0.074-0.129/sec)
3. BytePlus - For videos >15s or 21:9 cinema (€0.095-0.213/sec)
"""

from typing import Optional, Tuple
from .grok_api import GrokAPI
from .byteplus_api import BytePlusAPI
from .minimax_api import MiniMaxAPI


# Credit pricing table - ALIGNED WITH LUMINA (ai.byteplus.com/lumina)
# MiniMax: cheapest for videos ≤10s
# Grok: for videos 10-15s (includes audio)
# BytePlus: for videos >15s or 21:9 cinema format
# Base: 480p=21 cred/sec, 720p=46 cred/sec, 1080p=75 cred/sec (scontato)
CREDIT_PRICING = {
    "minimax": {
        "480p": {4: 84, 5: 105, 10: 210},
        "720p": {4: 184, 5: 230, 10: 460},
        "1080p": {4: 300, 5: 375, 10: 752},
    },
    "grok": {
        "480p": {4: 84, 5: 105, 10: 210, 15: 315},
        "720p": {4: 184, 5: 230, 10: 460, 15: 690},
        "1080p": {4: 300, 5: 375, 10: 752, 15: 1128},
    },
    "byteplus": {
        "480p": {4: 84, 5: 105, 10: 210, 15: 315, 20: 420, 25: 525, 30: 630},
        "720p": {4: 184, 5: 230, 10: 460, 15: 690, 20: 920, 25: 1150, 30: 1380},
        "1080p": {4: 300, 5: 375, 10: 752, 15: 1128, 20: 1504, 25: 1880, 30: 2257},
    }
}


def calculate_minimax_credits(resolution: str, duration: int) -> int:
    """Calculate credits for MiniMax API"""
    pricing = CREDIT_PRICING["minimax"].get(resolution, CREDIT_PRICING["minimax"]["720p"])
    durations = sorted(pricing.keys())
    for d in durations:
        if duration <= d:
            return pricing[d]
    return pricing[durations[-1]]


def calculate_grok_credits(resolution: str, duration: int) -> int:
    """Calculate credits for Grok API"""
    pricing = CREDIT_PRICING["grok"].get(resolution, CREDIT_PRICING["grok"]["720p"])
    durations = sorted(pricing.keys())
    for d in durations:
        if duration <= d:
            return pricing[d]
    return pricing[durations[-1]]


def calculate_byteplus_credits(resolution: str, duration: int) -> int:
    """Calculate credits for BytePlus API"""
    pricing = CREDIT_PRICING["byteplus"].get(resolution, CREDIT_PRICING["byteplus"]["720p"])
    durations = sorted(pricing.keys())
    for d in durations:
        if duration <= d:
            return pricing[d]
    return pricing[durations[-1]]


class VideoRouter:
    """
    Smart router that selects the optimal API for video generation

    Decision logic (cost optimized):
    - If duration <= 10s AND aspect_ratio != 21:9 → Use MiniMax (cheapest)
    - If duration 10-15s AND aspect_ratio != 21:9 → Use Grok (includes audio)
    - If duration > 15s OR aspect_ratio == 21:9 → Use BytePlus (supports longer/cinema)
    """

    def __init__(self):
        self.minimax = MiniMaxAPI()
        self.grok = GrokAPI()
        self.byteplus = BytePlusAPI()

    def select_api(
        self,
        duration: int,
        aspect_ratio: str,
        prefer_audio: bool = False
    ) -> Tuple[str, bool]:
        """
        Select the best API based on requirements

        Args:
            duration: Video duration in seconds
            aspect_ratio: Video aspect ratio
            prefer_audio: If True, prefer Grok for audio even if MiniMax is cheaper

        Returns:
            Tuple of (api_name, has_audio)
        """
        # BytePlus required for:
        # - Videos longer than 15 seconds
        # - Cinema 21:9 aspect ratio (not supported by others)
        if duration > 15 or aspect_ratio == "21:9":
            return ("byteplus", False)

        # If user wants audio, use Grok (up to 15s)
        if prefer_audio and duration <= 15:
            return ("grok", True)

        # MiniMax for short videos (≤10s) - cheapest option
        if duration <= 10:
            return ("minimax", False)

        # Grok for 10-15s videos (includes audio)
        return ("grok", True)

    def calculate_credits(
        self,
        resolution: str,
        duration: int,
        aspect_ratio: str,
        prefer_audio: bool = False
    ) -> int:
        """
        Calculate credits based on which API will be used

        Returns:
            Number of credits required
        """
        api_name, _ = self.select_api(duration, aspect_ratio, prefer_audio)

        if api_name == "minimax":
            return calculate_minimax_credits(resolution, duration)
        elif api_name == "grok":
            return calculate_grok_credits(resolution, duration)
        else:
            return calculate_byteplus_credits(resolution, duration)

    async def generate_video(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        resolution: str = "720p",
        duration: int = 5,
        start_frame: Optional[str] = None,
        prefer_audio: bool = False,
    ) -> dict:
        """
        Generate video using the optimal API

        Args:
            prompt: Text description of the video
            aspect_ratio: Video aspect ratio
            resolution: Output resolution
            duration: Video duration in seconds
            start_frame: Optional starting image (base64)
            prefer_audio: If True, prefer Grok for audio support

        Returns:
            dict with task_id, api_used, has_audio, credits
        """
        api_name, has_audio = self.select_api(duration, aspect_ratio, prefer_audio)
        credits = self.calculate_credits(resolution, duration, aspect_ratio, prefer_audio)

        if api_name == "minimax":
            result = await self.minimax.generate_video(
                prompt=prompt,
                aspect_ratio=aspect_ratio,
                resolution=resolution,
                duration=duration,
                start_frame=start_frame,
            )
        elif api_name == "grok":
            result = await self.grok.generate_video(
                prompt=prompt,
                aspect_ratio=aspect_ratio,
                resolution=resolution,
                duration=duration,
                start_frame=start_frame,
            )
        else:
            result = await self.byteplus.generate_video(
                prompt=prompt,
                aspect_ratio=aspect_ratio,
                resolution=resolution,
                duration=duration,
                start_frame=start_frame,
            )

        return {
            "task_id": result.get("task_id") or result.get("id"),
            "api_used": api_name,
            "has_audio": has_audio,
            "credits": credits,
            "status": "processing"
        }

    async def get_status(self, task_id: str, api_name: str) -> dict:
        """
        Get video generation status

        Args:
            task_id: The generation task ID
            api_name: Which API was used (minimax, grok, or byteplus)

        Returns:
            Status dict with progress and video_url when complete
        """
        if api_name == "minimax":
            return await self.minimax.get_video_status(task_id)
        elif api_name == "grok":
            return await self.grok.get_video_status(task_id)
        else:
            return await self.byteplus.get_video_status(task_id)


# Singleton instance
video_router = VideoRouter()
