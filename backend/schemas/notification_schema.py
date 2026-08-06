from datetime import datetime

from pydantic import BaseModel


# ==========================
# Notification
# ==========================

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    is_read: bool
    created_at: datetime


# ==========================
# Mark Notification Read
# ==========================

class MarkNotificationReadResponse(BaseModel):
    message: str