from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GenIn(BaseModel):
    kind: str                      # image | video
    prompt: str
    image_url: str | None = None   # image-to-video
    seconds: int = 5
    ratio: str = "16:9"

class GenOut(BaseModel):
    id: int
    kind: str
    status: str
    result_url: str | None
    cost: int
