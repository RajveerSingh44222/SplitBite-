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


@router.get("", response_model=EventListResponse)
def get_user_events(
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

@router.get("")
def get_events(
    scope: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns a lightweight list of events for the dashboard.

    Supported scopes:
    - upcoming
    - past
    """
    pass