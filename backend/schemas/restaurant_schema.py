from pydantic import BaseModel


# ==========================
# Restaurant Card
# ==========================

class RestaurantResponse(BaseModel):
    id: str
    name: str
    image_url: str | None = None
    cuisine: str
    rating: float
    delivery_time: int
    delivery_fee: float


# ==========================
# Menu Item
# ==========================

class MenuItemResponse(BaseModel):
    id: str
    name: str
    description: str | None = None
    image_url: str | None = None
    price: float
    is_veg: bool
    is_available: bool


# ==========================
# Restaurant Detail
# ==========================

class RestaurantDetailResponse(BaseModel):
    id: str
    name: str
    address: str
    image_url: str | None = None
    cuisine: str
    rating: float
    delivery_time: int
    delivery_fee: float


# ==========================
# Restaurant Menu
# ==========================

class RestaurantMenuResponse(BaseModel):
    restaurant_id: str
    menu_items: list[MenuItemResponse]