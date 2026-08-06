from pydantic import BaseModel


# ==========================
# Event Payment
# ==========================

class EventPaymentRequest(BaseModel):
    payment_method_id: str


# ==========================
# Event Payment Response
# ==========================

class EventPaymentResponse(BaseModel):
    payment_id: str
    payment_status: str


# ==========================
# Event Status
# ==========================

class EventStatusResponse(BaseModel):
    status: str
    payment_status: str


# ==========================
# Participant Order Item
# ==========================

class ParticipantOrderItemResponse(BaseModel):
    item_name: str
    quantity: int
    unit_price: float
    total_price: float


# ==========================
# Participant Order Summary
# ==========================

class ParticipantOrderSummaryResponse(BaseModel):
    participant_id: str
    participant_name: str
    subtotal: float
    items: list[ParticipantOrderItemResponse]


# ==========================
# Restaurant Total
# ==========================

class RestaurantTotalResponse(BaseModel):
    restaurant_name: str
    total: float


# ==========================
# Order Summary
# ==========================

class OrderSummaryResponse(BaseModel):
    event_id: str
    grand_total: float
    participants: list[ParticipantOrderSummaryResponse]
    restaurant_totals: list[RestaurantTotalResponse]