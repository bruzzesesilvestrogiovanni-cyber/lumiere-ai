"""Client API BytePlus ModelArk: Seedream (immagini) e Seedance (video).

Seedance e asincrono: submit -> task_id -> polling fino a succeeded.
Endpoint/model id: vanno configurati nella console BytePlus ModelArk.
"""
import httpx
from .config import settings

HEADERS = {"Authorization": f"Bearer {settings.byteplus_api_key}", "Content-Type": "application/json"}

# TODO: verifica gli id modello esatti nella console ModelArk
SEEDREAM_MODEL = "seedream-4-5"   # generazione immagini
SEEDANCE_MODEL = "seedance-2-5"   # generazione video

async def generate_image(prompt: str, size: str = "1024x1024") -> str:
    """Ritorna l URL dell immagine generata."""
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(f"{settings.byteplus_base_url}/images/generations",
                         headers=HEADERS,
                         json={"model": SEEDREAM_MODEL, "prompt": prompt,
                               "size": size, "response_format": "url"})
        r.raise_for_status()
        return r.json()["data"][0]["url"]

async def submit_video(prompt: str, image_url: str | None = None,
                       seconds: int = 5, ratio: str = "16:9") -> str:
    """Sottomette un task video. Ritorna il task_id."""
    content = [{"type": "text", "text": prompt}]
    if image_url:
        content.append({"type": "image_url", "image_url": {"url": image_url}})
    payload = {"model": SEEDANCE_MODEL, "content": content,
               "duration": seconds, "aspect_ratio": ratio}
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(f"{settings.byteplus_base_url}/contents/generations/tasks",
                         headers=HEADERS, json=payload)
        r.raise_for_status()
        return r.json()["id"]

async def get_video_task(task_id: str) -> dict:
    """Stato task: {status: queued|running|succeeded|failed, url}."""
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.get(f"{settings.byteplus_base_url}/contents/generations/tasks/{task_id}",
                        headers=HEADERS)
        r.raise_for_status()
        d = r.json()
        url = None
        if d.get("status") == "succeeded":
            url = d.get("content", {}).get("video_url")
        return {"status": d.get("status"), "url": url}
