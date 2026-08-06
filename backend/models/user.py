from datetime import datetime
from uuid import UUID

from sqlalchemy import ARRAY
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(Text, nullable=False)

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    avatar_url: Mapped[str | None] = mapped_column(
        Text
    )

    phone: Mapped[str | None] = mapped_column(
        Text
    )

    favorite_cuisines: Mapped[list[str]] = mapped_column(
        ARRAY(Text),
        default=list,
        nullable=False
    )

    member_since: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
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

    ai_preferences = relationship(
        "UserAIPreferences",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    cuisine_preferences = relationship(
        "UserCuisinePreference",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    hosted_events = relationship(
        "Event",
        back_populates="host"
    )

    event_participations = relationship(
        "EventParticipant",
        back_populates="user"
    )

    activities = relationship(
        "ActivityItem",
        back_populates="actor"
    )

    notifications = relationship(
        "Notification",
        back_populates="user"
    )

    payment_cards = relationship(
        "PaymentCard",
        back_populates="user"
    )

    payment_upi = relationship(
        "PaymentUPI",
        back_populates="user"
    )

    payment_wallets = relationship(
        "PaymentWallet",
        back_populates="user"
    )

    default_payment_method = relationship(
        "UserDefaultPaymentMethod",
        back_populates="user",
        uselist=False
    )

    sessions = relationship(
        "UserSession",
        back_populates="user"
    )

    push_tokens = relationship(
        "PushToken",
        back_populates="user"
    )

    savings = relationship(
        "UserSaving",
        back_populates="user"
    )

    payments = relationship(
        "EventPayment",
        back_populates="payer"
    )


class UserCuisinePreference(Base):
    __tablename__ = "user_cuisine_preferences"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )

    cuisine: Mapped[str] = mapped_column(
        Text,
        primary_key=True
    )

    rank: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="cuisine_preferences"
    )


class UserAIPreferences(Base):
    __tablename__ = "user_ai_preferences"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        primary_key=True
    )

    auto_order_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    veg_only: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="ai_preferences"
    )