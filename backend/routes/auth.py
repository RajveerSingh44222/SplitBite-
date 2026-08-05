router=APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup")
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        id=str(uuid4()),
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password)
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "Account created successfully"
    }