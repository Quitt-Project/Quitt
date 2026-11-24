from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.database import SessionDependency
from app.dependencies import CurrentUserDependency
from app.models import User
from app.schemas.user import UserLogin, UserRegister
from app.security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister, session: SessionDependency):
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
    }

@router.post("/login")
def login(user: UserLogin, session: SessionDependency):
    existing_user = session.exec(
        select(User).where(User.email == user.email)
    ).first()

    if existing_user is not None:
        password_hash_to_check = existing_user.password_hash
    else:
        password_hash_to_check = DUMMY_PASSWORD_HASH

    password_is_valid = verify_password(
        user.password,
        password_hash_to_check,
    )

    if existing_user is None or not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(existing_user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me")
def get_me(current_user: CurrentUserDependency):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }