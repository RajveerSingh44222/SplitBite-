router = APIRouter(
    tags=["Orders"]
)


@router.post("/events/{event_id}/payments")
def pay_for_event(
    event_id: str,
    request: EventPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Host pays for the entire event.
    """
    pass


@router.get("/events/{event_id}/status")
def get_event_status(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the event and payment status.

    Example:
    {
        "status": "...",
        "payment_status": "..."
    }
    """
    pass