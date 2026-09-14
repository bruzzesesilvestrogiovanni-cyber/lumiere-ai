"""
Smart Video Generation Router
Automatically selects the best API based on user requirements

Priority (cost optimization):
1. NVIDIA Cosmos3 - FREE for videos ≤5s (no audio)
2. MiniMax H3 - Cheapest paid for videos 5-10s (€0.009-0.074/sec)
3. Grok - For videos 10-15s with audio (€0.074-0.129/sec)
4. BytePlus - For videos >15s or 21:9 cinema (€0.095-0.213/sec)
"""

from typing import Optional, Tuple
from .nvidia_api import NvidiaAPI
from .grok_api import GrokAPI
from .byteplus_api import BytePlusAPI
from .minimax_api import MiniMaxAPI


# Credit pricing table - ALIGNED WITH LUMINA (ai.byteplus.com/lumina)
# NVIDIA Cosmos3: FREE for ≤5s videos
# MiniMax: cheapest paid for videos 5-10s
# Grok: for videos 10-15s (includes audio)
# BytePlus: for videos >15s or 21:9 cinema format
CREDIT_PRICING = {
    "nvidia": {
        # Free tier - 480p only, charge minimal credits for value
        "480p": {4: 42, 5: 52},
    },
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


def calculate_nvidia_credits(resolution: str, duration: int) -> int:
    """Calculate credits for NVIDIA API (free tier - half price)"""
    # NVIDIA only supports up to 720p and 5 seconds
    res = "720p" if resolution == "1080p" else resolution
    pricing = CREDIT_PRICING["nvidia"].get(res, CREDIT_PRICING["nvidia"]["720p"])
    durations = sorted(pricing.keys())
    for d in durations:
        if duration <= d:
            return pricing[d]
    return pricing[durations[-1]]


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
    - If duration <= 5s AND resolution <= 720p AND no audio needed → Use NVIDIA (FREE)
    - If duration <= 10s AND aspect_ratio != 21:9 → Use MiniMax (cheapest paid)
    - If duration 10-15s AND aspect_ratio != 21:9 → Use Grok (includes audio)
    - If duration > 15s OR aspect_ratio == 21:9 → Use BytePlus (supports longer/cinema)
    """

    def __init__(self):
        self.nvidia = NvidiaAPI()
        self.minimax = MiniMaxAPI()
        self.grok = GrokAPI()
        self.byteplus = BytePlusAPI()

    def select_api(
        self,
        duration: int,
        aspect_ratio: str,
        resolution: str = "720p",
        prefer_audio: bool = False,
        prefer_free: bool = True,
    ) -> Tuple[str, bool]:
        """
        Select the best API based on requirements

        Args:
            duration: Video duration in seconds
            aspect_ratio: Video aspect ratio
            resolution: Video resolution
            prefer_audio: If True, prefer Grok for audio even if others are cheaper
            prefer_free: If True, prefer NVIDIA free tier when possible

        Returns:
            Tuple of (api_name, has_audio)
        """
        # NVIDIA Cosmos3 for short videos (FREE)
        # Conditions: ≤5s, 480p only, no 21:9, no audio needed
        if (prefer_free and
            duration <= 5 and
            resolution == "480p" and
            aspect_ratio != "21:9" and
            not prefer_audio):
            return ("nvidia", False)

        # BytePlus required for:
        # - Videos longer than 15 seconds
        # - Cinema 21:9 aspect ratio (not supported by others)
        if duration > 15 or aspect_ratio == "21:9":
            return ("byteplus", False)

        # If user wants audio, use Grok (up to 15s)
        if prefer_audio and duration <= 15:
            return ("grok", True)

        # MiniMax for short-medium videos (≤10s) - cheapest paid option
        if duration <= 10:
            return ("minimax", False)

        # Grok for 10-15s videos (includes audio)
        return ("grok", True)

    def calculate_credits(
        self,
        resolution: str,
        duration: int,
        aspect_ratio: str,
        prefer_audio: bool = False,
        prefer_free: bool = True,
    ) -> int:
        """
        Calculate credits based on which API will be used

        Returns:
            Number of credits required
        """
        api_name, _ = self.select_api(duration, aspect_ratio, resolution, prefer_audio, prefer_free)

        if api_name == "nvidia":
            return calculate_nvidia_credits(resolution, duration)
        elif api_name == "minimax":
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
        prefer_free: bool = True,
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
            prefer_free: If True, prefer NVIDIA free tier when possible

        Returns:
            dict with task_id, api_used, has_audio, credits
        """
        api_name, has_audio = self.select_api(duration, aspect_ratio, resolution, prefer_audio, prefer_free)
        credits = self.calculate_credits(resolution, duration, aspect_ratio, prefer_audio, prefer_free)

        # Try NVIDIA first (free tier)
        if api_name == "nvidia":
            try:
                result = await self.nvidia.generate_video(
                    prompt=prompt,
                    duration=duration,
                    aspect_ratio=aspect_ratio,
                    start_frame=start_frame,
                )
                return {
                    "task_id": result.get("task_id"),
                    "api_used": "nvidia",
                    "has_audio": False,
                    "credits": credits,
                    "status": result.get("status", "processing"),
                    "video_base64": result.get("video_base64"),
                }
            except Exception as e:
                # Fallback to MiniMax if NVIDIA fails
                print(f"NVIDIA video failed: {e}, falling back to MiniMax")
                api_name = "minimax"
                credits = calculate_minimax_credits(resolution, duration)

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
            api_name: Which API was used (nvidia, minimax, grok, or byteplus)

        Returns:
            Status dict with progress and video_url when complete
        """
        if api_name == "nvidia":
            return await self.nvidia.get_video_status(task_id)
        elif api_name == "minimax":
            return await self.minimax.get_video_status(task_id)
        elif api_name == "grok":
            return await self.grok.get_video_status(task_id)
        else:
            return await self.byteplus.get_video_status(task_id)


# Singleton instance
video_router = VideoRouter()
