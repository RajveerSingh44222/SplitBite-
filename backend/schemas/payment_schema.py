from pydantic import BaseModel, Field


# ==========================
# Saved Payment Method
# ==========================

class PaymentMethodResponse(BaseModel):
    id: str
    kind: str
    is_default: bool


# ==========================
# Card
# ==========================

class AddCardRequest(BaseModel):
    card_number: str = Field(min_length=16, max_length=19)
    card_holder_name: str
    expiry_month: int = Field(ge=1, le=12)
    expiry_year: int
    cvv: str = Field(min_length=3, max_length=4)


# ==========================
# UPI
# ==========================

class AddUPIRequest(BaseModel):
    upi_id: str


# ==========================
# Wallet
# ==========================

class AddWalletRequest(BaseModel):
    wallet_name: str


# ==========================
# Default Payment Method
# ==========================

class SetDefaultPaymentMethodRequest(BaseModel):
    payment_method_id: str


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
    status: str