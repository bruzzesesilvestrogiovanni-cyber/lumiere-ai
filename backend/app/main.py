from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .models import User, Generation  # noqa
from .routers import auth, generations, credits, video, image
from .config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LUMIERE AI API")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(","),
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(generations.router)
app.include_router(credits.router)
app.include_router(video.router)
app.include_router(image.router)

@app.get("/api/health")
def health(): return {"ok": True}
