from datetime import datetime
from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    name: str
    email: EmailStr
    avatar: str | None = None
    phone: str | None = None
    member_since: datetime
    favorite_cuisines: list[str]


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    avatar: str | None = None
    phone: str | None = None
    favorite_cuisines: list[str] | None = None


class AIPreferencesResponse(BaseModel):
    auto_order_enabled: bool
    veg_only: bool


class UpdateAIPreferencesRequest(BaseModel):
    auto_order_enabled: bool | None = None
    veg_only: bool | None = None