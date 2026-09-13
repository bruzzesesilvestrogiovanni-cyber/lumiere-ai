from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    credits = Column(Integer, default=84)  # crediti di benvenuto (1 video 4s 480p O 21 immagini Lite)
    plan = Column(String, default="free")  # free | trial | basic | standard | advanced | ultra
    plan_expires_at = Column(DateTime, nullable=True)  # quando scade l'abbonamento
    trial_used = Column(Integer, default=0)  # 1 se già usato trial (one-time only)
    created_at = Column(DateTime, default=datetime.utcnow)
    generations = relationship("Generation", back_populates="user")

    @property
    def has_watermark(self) -> bool:
        """Only free users (not paid) have watermark on downloads"""
        return self.plan == "free"

    @property
    def is_subscription_active(self) -> bool:
        """Check if subscription is still active"""
        if self.plan == "free":
            return True  # free sempre attivo
        if self.plan_expires_at is None:
            return False
        return datetime.utcnow() < self.plan_expires_at


class Generation(Base):
    __tablename__ = "generations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    kind = Column(String)  # image | video
    prompt = Column(Text)
    params = Column(JSON, nullable=True)  # aspect_ratio, resolution, duration, api_used, etc.
    status = Column(String, default="pending")  # pending | processing | completed | failed
    task_id = Column(String, nullable=True)  # task ID from API
    result_url = Column(String, nullable=True)  # URL to generated content
    cost = Column(Integer, default=0)  # credits used
    api_used = Column(String, nullable=True)  # grok | byteplus
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    user = relationship("User", back_populates="generations")
