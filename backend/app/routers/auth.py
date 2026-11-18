from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from app.database import SessionDependency
from app.dependencies import get_current_user
from app.models import User
from app.schemas.user import UserLogin, UserRegister
from app.security import (
    create_access_token,
    hash_password,
    verify_password,
)

CurrentUserDependency = Annotated[
    User,
    Depends(get_current_user),
]

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

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(user.password, existing_user.password_hash):
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