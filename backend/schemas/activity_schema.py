from datetime import datetime

from pydantic import BaseModel


# ==========================
# Activity Item
# ==========================

class ActivityResponse(BaseModel):
    id: str
    type: str
    message: str
    created_at: datetime


# ==========================
# Event Activity
# ==========================

class EventActivityResponse(BaseModel):
    event_id: str
    activities: list[ActivityResponse]


# ==========================
# Live Activity Item
# ==========================

class LiveActivityResponse(BaseModel):
    event_id: str
    event_name: str
    activity: ActivityResponse