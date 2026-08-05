router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("", response_model=EventResponse)
def create_event(
    request: CreateEventRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass


@router.get("")
def get_events(
    scope: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass


@router.post("/join", response_model=JoinEventResponse)
def join_event(
    request: JoinEventRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass


@router.delete("/{event_id}/participants/{user_id}")
def remove_participant(
    event_id: str,
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Host removes a participant from the event.
    """
    pass


@router.patch("/{event_id}/deadline")
def extend_deadline(
    event_id: str,
    request: ExtendDeadlineRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Extend the event ordering deadline.
    """
    pass


@router.post("/{event_id}/auto-select")
def auto_select_orders(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Auto-select orders for participants
    who missed the deadline.
    """
    pass


@router.post("/{event_id}/place-order")
def place_group_order(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Finalize and place the combined
    order for the entire event.
    """
    pass