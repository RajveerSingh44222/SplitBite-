router = APIRouter(
    tags=["Restaurants"]
)


@router.get("/events/{event_id}/restaurants")
def get_event_restaurants(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get suggested restaurants for an event.
    """
    pass


@router.get("/restaurants/{restaurant_id}")
def get_restaurant(
    restaurant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get restaurant details.
    """
    pass


@router.get("/restaurants/{restaurant_id}/menu")
def get_restaurant_menu(
    restaurant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the menu for a restaurant.
    """
    pass