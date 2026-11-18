from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import SessionDependency
from app.models import User
from app.security import decode_access_token

bearer_scheme = HTTPBearer()

CredentialsDependency = Annotated[
    HTTPAuthorizationCredentials,
    Depends(bearer_scheme),
]


def get_current_user(
    session: SessionDependency,
    credentials: CredentialsDependency,
) -> User:
    try:
        user_id = decode_access_token(credentials.credentials)
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = session.get(User, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return user