from pydantic import BaseModel, Field


# ==========================
# Restaurant Selection
# ==========================

class UpdateRestaurantRequest(BaseModel):
    restaurant_id: str


# ==========================
# Cart Item
# ==========================

class CartItemRequest(BaseModel):
    menu_item_id: str
    quantity: int = Field(gt=0)


# ==========================
# Replace Cart
# ==========================

class ReplaceCartRequest(BaseModel):
    items: list[CartItemRequest]


# ==========================
# Participant Cart
# ==========================

class ParticipantCartResponse(BaseModel):
    menu_item_id: str
    item_name: str
    quantity: int
    unit_price: float
    total_price: float


# ==========================
# Order Confirmation
# ==========================

class ConfirmOrderResponse(BaseModel):
    message: str