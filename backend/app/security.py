from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.config import JWT_ALGORITHM, JWT_EXPIRE_MINUTES, JWT_SECRET

password_hash = PasswordHash.recommended()

DUMMY_PASSWORD_HASH = password_hash.hash(
    "dummy-password-used-only-for-timing-protection"
)


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(user_id: int) -> str:
    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET environment variable is not set")

    expires_at = datetime.now(UTC) + timedelta(minutes=JWT_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> int:
    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET environment variable is not set")

    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM],
    )

    user_id = payload.get("sub")

    if user_id is None:
        raise ValueError("Token does not contain a user ID")

    return int(user_id)
