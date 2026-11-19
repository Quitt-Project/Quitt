from app.security import decode_access_token


def test_login_success(client):
    register_response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert register_response.status_code == 201

    user_id = register_response.json()["id"]

    login_response = client.post(
        "/login",
        json={
            "email": "illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert login_response.status_code == 200

    data = login_response.json()

    assert data["token_type"] == "bearer"
    assert "access_token" in data

    token_user_id = decode_access_token(data["access_token"])

    assert token_user_id == user_id

def test_login_wrong_password(client):
    register_response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert register_response.status_code == 201

    response = client.post(
        "/login",
        json={
            "email": "illia@example.com",
            "password": "falschesPasswort123",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid email or password"
    }

def test_login_unknown_email(client):
    response = client.post(
        "/login",
        json={
            "email": "unbekannt@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid email or password"
    }

def test_login_email_is_case_insensitive(client):
    register_response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/login",
        json={
            "email": "ILLIA@EXAMPLE.COM",
            "password": "sicheresPasswort123",
        },
    )

    assert login_response.status_code == 200