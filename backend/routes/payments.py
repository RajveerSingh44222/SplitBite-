router = APIRouter(
    prefix="/profile/payments",
    tags=["Payments"]
)


@router.get("")
def get_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all saved payment methods.
    """
    pass


@router.post("/cards")
def add_card(
    request: AddCardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a new saved card.
    """
    pass


@router.post("/upi")
def add_upi(
    request: AddUPIRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a saved UPI ID.
    """
    pass


@router.post("/wallets")
def add_wallet(
    request: AddWalletRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a saved wallet.
    """
    pass


@router.delete("/{kind}/{payment_method_id}")
def delete_payment_method(
    kind: str,
    payment_method_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a saved payment method.

    kind:
    - card
    - upi
    - wallet
    """
    pass


@router.put("/default")
def set_default_payment_method(
    request: SetDefaultPaymentMethodRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Set the default payment method.
    """
    pass