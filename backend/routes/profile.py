router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

@router.get("")
def get_profile():
    pass


@router.patch("")
def update_profile():
    pass


@router.get("/aipreferences")
def get_ai_preferences():
    pass


@router.patch("/aipreferences")
def update_ai_preferences():
    pass