router = APIRouter(
    tags=["Activity"]
)


@router.get("/events/{event_id}/activity")
def get_event_activity(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the activity feed for a single event.

    Examples:
    - Participant joined
    - Restaurant changed
    - Cart confirmed
    - Timer extended
    - AI auto-selected order
    - Participant left
    """
    pass


@router.get("/activity")
def get_live_activity(
    scope: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns activity across all active events
    the current user is participating in.

    Example:
    GET /activity?scope=live
    """
    pass