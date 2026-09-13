from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./studio.db"

    # JWT
    jwt_secret: str = "change-me-in-production"

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:5174"

    # Grok/xAI API (for video ≤15s)
    grok_api_key: str = ""

    # BytePlus ModelArk API (for video >15s or 21:9)
    byteplus_access_key: str = ""
    byteplus_secret_key: str = ""
    byteplus_api_key: str = ""
    byteplus_base_url: str = "https://api.byteplus.com/v1"

    # MiniMax API (Hailuo H3 - cheapest for video ≤10s)
    minimax_api_key: str = ""

    # Stripe (payments)
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # Redis (optional, for task queue)
    redis_url: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"


settings = Settings()
