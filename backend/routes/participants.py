router = APIRouter(
    prefix="/events",
    tags=["Participants"]
)


@router.patch("/{event_id}/participants/me/restaurant")
def select_restaurant(
    event_id: str,
    request: UpdateRestaurantRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Select the restaurant the current participant
    wants to order from.

    Also moves the participant's status to 'browsing'.
    """
    pass


@router.put("/{event_id}/participants/me/cart")
def replace_cart(
    event_id: str,
    request: ReplaceCartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Replace the participant's entire cart.
    """
    pass


@router.post("/{event_id}/participants/me/order")
def confirm_order(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm the participant's own order.

    Does NOT place the final restaurant order.
    Only marks this participant as 'ordered'.
    """
    pass


@router.delete("/{event_id}/participants/me")
def leave_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Leave the event.
    """
    pass