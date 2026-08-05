router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the current user's notifications,
    ordered by newest first.
    """
    pass


@router.patch("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Marks a notification as read.
    """
    pass