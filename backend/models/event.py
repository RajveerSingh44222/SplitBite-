from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID

from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import Enum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Time
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from database.base import Base
from models.enums import EventStatus


class Event(Base):
    __tablename__ = "events"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    address: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    latitude: Mapped[Decimal | None] = mapped_column(
        Numeric
    )

    longitude: Mapped[Decimal | None] = mapped_column(
        Numeric
    )

    event_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    event_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    budget_per_person: Mapped[Decimal] = mapped_column(
        Numeric,
        nullable=False
    )

    host_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    invite_code: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    invite_expiry_mins: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    deadline_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    status: Mapped[EventStatus] = mapped_column(
        Enum(EventStatus),
        default=EventStatus.DRAFT,
        nullable=False
    )

    cover_gradient_from: Mapped[str] = mapped_column(
        String,
        default="#F0552B",
        nullable=False
    )

    cover_gradient_to: Mapped[str] = mapped_column(
        String,
        default="#D8A13C",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships

    host = relationship(
        "User",
        back_populates="hosted_events"
    )

    participants = relationship(
        "EventParticipant",
        back_populates="event",
        cascade="all, delete-orphan"
    )

    suggested_restaurants = relationship(
        "EventSuggestedRestaurant",
        back_populates="event",
        cascade="all, delete-orphan"
    )

    activities = relationship(
        "ActivityItem",
        back_populates="event",
        cascade="all, delete-orphan"
    )

    notifications = relationship(
        "Notification",
        back_populates="event"
    )

    payment = relationship(
        "EventPayment",
        back_populates="event",
        uselist=False
    )

    savings = relationship(
        "UserSaving",
        back_populates="event"
    )


class EventSuggestedRestaurant(Base):
    __tablename__ = "event_suggested_restaurants"

    event_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("events.id"),
        primary_key=True
    )

    restaurant_id: Mapped[str] = mapped_column(
        Text,
        primary_key=True
    )

    rank: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    event = relationship(
        "Event",
        back_populates="suggested_restaurants"
    )