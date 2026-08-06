from datetime import datetime

from pydantic import BaseModel, Field


# ==========================
# Create Event
# ==========================

class CreateEventRequest(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    budget_per_person: float = Field(gt=0)
    delivery_address: str = Field(min_length=5, max_length=255)
    ordering_deadline: datetime


# ==========================
# Join Event
# ==========================

class JoinEventRequest(BaseModel):
    invite_code: str


# ==========================
# Update Deadline
# ==========================

class ExtendDeadlineRequest(BaseModel):
    ordering_deadline: datetime


# ==========================
# Dashboard Event Card
# ==========================

class EventCardResponse(BaseModel):
    id: str
    name: str
    delivery_address: str
    ordering_deadline: datetime
    status: str
    participant_count: int
    ordered_count: int
    cover_gradient: str
    grand_total: float | None = None


# ==========================
# Participant
# ==========================

class ParticipantResponse(BaseModel):
    id: str
    name: str
    avatar: str | None = None
    is_host: bool
    status: str


# ==========================
# Event Details
# ==========================

class EventResponse(BaseModel):
    id: str
    name: str
    budget_per_person: float
    delivery_address: str
    ordering_deadline: datetime
    invite_code: str
    status: str
    participants: list[ParticipantResponse]


# ==========================
# Event Status
# ==========================

class EventStatusResponse(BaseModel):
    status: str
    payment_status: str