import jwt
import pytest

from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_hash_password():
    password = "meinSicheresPasswort123"

    hashed_password = hash_password(password)

    assert hashed_password != password

def test_verify_password():
    password = "meinSicheresPasswort123"
    hashed_password = hash_password(password)

    assert verify_password(password, hashed_password) is True
    assert verify_password("falschesPasswort", hashed_password) is False

def test_access_token():
    user_id = 42

    token = create_access_token(user_id)
    decoded_user_id = decode_access_token(token)

    assert decoded_user_id == user_id

def test_invalid_access_token():
    token = create_access_token(42)

    manipulated_token = token + "abc"

    with pytest.raises(jwt.InvalidTokenError):
        decode_access_token(manipulated_token)