from enum import Enum


class EventStatus(str, Enum):
    DRAFT = "draft"
    COLLECTING = "collecting"
    REVIEWING = "reviewing"
    ORDERED = "ordered"
    DELIVERED = "delivered"
    COMPLETED = "completed"


class ParticipantStatus(str, Enum):
    INVITED = "invited"
    BROWSING = "browsing"
    ORDERED = "ordered"
    LEFT = "left"


class ActivityType(str, Enum):
    JOINED = "joined"
    LEFT = "left"
    RESTAURANT_SELECTED = "restaurant_selected"
    CART_UPDATED = "cart_updated"
    ORDER_CONFIRMED = "order_confirmed"
    DEADLINE_EXTENDED = "deadline_extended"
    AUTO_SELECTED = "auto_selected"
    ORDER_PLACED = "order_placed"


class NotificationKind(str, Enum):
    DEADLINE_REMINDER = "deadline_reminder"
    ADDED_TO_EVENT = "added_to_event"
    ORDER_PLACED = "order_placed"
    PAYMENT_SUCCESS = "payment_success"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


class PaymentMethodKind(str, Enum):
    CARD = "card"
    UPI = "upi"
    WALLET = "wallet"


class CardBrand(str, Enum):
    VISA = "visa"
    MASTERCARD = "mastercard"
    RUPAY = "rupay"
    AMEX = "amex"


class WalletProvider(str, Enum):
    PAYTM = "paytm"
    PHONEPE = "phonepe"
    AMAZONPAY = "amazonpay"


class Platform(str, Enum):
    ANDROID = "android"
    IOS = "ios"
    WEB = "web"