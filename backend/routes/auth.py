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

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    access_token = create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_token(
    current_user: User = Depends(get_current_refresh_user)
):
    access_token = create_access_token(
        data={
            "user_id": str(current_user.id),
            "email": current_user.email
        }
    )

    refresh_token = create_refresh_token(
        data={
            "user_id": str(current_user.id)
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_refresh_user)
):
    delete_refresh_token(
        user_id=str(current_user.id)
    )

    return {
        "message": "Logged out successfully"
    }