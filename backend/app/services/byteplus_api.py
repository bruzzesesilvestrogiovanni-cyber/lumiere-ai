"""
BytePlus ModelArk API Integration for Video Generation (Seedance)
API Docs: https://www.byteplus.com/en/docs/modelark
"""

import httpx
import asyncio
import hashlib
import hmac
import time
from datetime import datetime
from typing import Optional
from ..config import settings


class BytePlusAPI:
    """Client for BytePlus ModelArk API (Seedance video generation)"""

    BASE_URL = "https://api.byteplus.com/modelark/v1"

    def __init__(self):
        self.access_key = settings.byteplus_access_key
        self.secret_key = settings.byteplus_secret_key

    def _sign_request(self, method: str, path: str, body: str = "") -> dict:
        """Generate authentication signature for BytePlus API"""
        timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        date = timestamp[:8]

        # Create string to sign
        string_to_sign = f"{method}\n{path}\n\nhost:api.byteplus.com\n\nhost\n"

        if body:
            body_hash = hashlib.sha256(body.encode()).hexdigest()
        else:
            body_hash = hashlib.sha256(b"").hexdigest()

        string_to_sign += body_hash

        # Create signing key
        k_date = hmac.new(
            f"BYTEPLUS{self.secret_key}".encode(),
            date.encode(),
            hashlib.sha256
        ).digest()

        k_signing = hmac.new(
            k_date,
            b"modelark",
            hashlib.sha256
        ).digest()

        # Sign the request
        signature = hmac.new(
            k_signing,
            string_to_sign.encode(),
            hashlib.sha256
        ).hexdigest()

        return {
            "X-Date": timestamp,
            "Authorization": f"BYTEPLUS-HMAC-SHA256 Credential={self.access_key}/{date}/modelark, SignedHeaders=host, Signature={signature}",
            "Content-Type": "application/json"
        }

    async def generate_video(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        resolution: str = "720p",
        duration: int = 5,
        start_frame: Optional[str] = None,
        model: str = "seedance-2.5"
    ) -> dict:
        """
        Generate video using BytePlus Seedance API

        Args:
            prompt: Text description of the video
            aspect_ratio: Video aspect ratio
            resolution: Output resolution (480p, 720p, 1080p)
            duration: Video duration in seconds (max 30s)
            start_frame: Optional base64 encoded starting image
            model: Seedance model version

        Returns:
            dict with task_id for polling
        """

        # Map resolution to API format
        resolution_map = {
            "480p": 480,
            "720p": 720,
            "1080p": 1080
        }

        # Map aspect ratio to dimensions
        aspect_dimensions = {
            "adaptive": {"width": 1280, "height": 720},
            "1:1": {"width": 720, "height": 720},
            "3:4": {"width": 540, "height": 720},
            "4:3": {"width": 960, "height": 720},
            "9:16": {"width": 405, "height": 720},
            "16:9": {"width": 1280, "height": 720},
            "21:9": {"width": 1680, "height": 720},
        }

        dims = aspect_dimensions.get(aspect_ratio, aspect_dimensions["16:9"])

        # Scale dimensions based on resolution
        res_value = resolution_map.get(resolution, 720)
        scale = res_value / 720.0
        width = int(dims["width"] * scale)
        height = int(dims["height"] * scale)

        payload = {
            "model": model,
            "prompt": prompt,
            "width": width,
            "height": height,
            "duration": min(duration, 30),  # BytePlus max is 30s
            "fps": 24,
        }

        # Add starting frame if provided
        if start_frame:
            payload["reference_image"] = start_frame

        import json
        body = json.dumps(payload)
        path = "/video/generate"
        headers = self._sign_request("POST", path, body)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.BASE_URL}{path}",
                headers=headers,
                content=body
            )
            response.raise_for_status()
            return response.json()

    async def get_video_status(self, task_id: str) -> dict:
        """
        Poll for video generation status

        Returns:
            dict with status and video_url when completed
        """
        path = f"/video/status/{task_id}"
        headers = self._sign_request("GET", path)

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.BASE_URL}{path}",
                headers=headers
            )
            response.raise_for_status()
            return response.json()

    async def wait_for_completion(
        self,
        task_id: str,
        max_wait: int = 600,  # Longer for BytePlus (up to 30s videos)
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


# Calculate credits for BytePlus video
def calculate_byteplus_credits(resolution: str, duration: int) -> int:
    """Calculate credits based on resolution and duration for BytePlus API"""

    pricing = {
        "480p": {5: 20, 10: 38, 15: 55, 20: 75, 25: 95, 30: 120},
        "720p": {5: 35, 10: 65, 15: 95, 20: 130, 25: 165, 30: 200},
        "1080p": {5: 55, 10: 100, 15: 150, 20: 200, 25: 280, 30: 350},
    }

    res_pricing = pricing.get(resolution, pricing["720p"])

    # Find closest duration
    for d in [5, 10, 15, 20, 25, 30]:
        if duration <= d:
            return res_pricing[d]

    return res_pricing[30]
