def test_register_success(client):
    response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Illia"
    assert data["email"] == "illia@example.com"
    assert "id" in data
    assert "password" not in data
    assert "password_hash" not in data


def test_register_duplicate_email(client):
    user_data = {
        "name": "Illia",
        "email": "duplicate@example.com",
        "password": "sicheresPasswort123",
    }

    first_response = client.post("/register", json=user_data)
    second_response = client.post("/register", json=user_data)

    assert first_response.status_code == 201
    assert second_response.status_code == 409
    assert second_response.json() == {"detail": "Email already registered"}


def test_register_invalid_email(client):
    response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "keine-email",
            "password": "sicheresPasswort123",
        },
    )

    assert response.status_code == 422


def test_register_password_too_short(client):
    response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "illia@example.com",
            "password": "1234567",
        },
    )

    assert response.status_code == 422


def test_register_normalizes_email(client):
    response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "ILLIA@Example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "illia@example.com"


def test_register_rejects_duplicate_email_with_different_case(client):
    first_response = client.post(
        "/register",
        json={
            "name": "Illia",
            "email": "Illia@example.com",
            "password": "sicheresPasswort123",
        },
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/register",
        json={
            "name": "Illia 2",
            "email": "illia@example.com",
            "password": "anderesPasswort123",
        },
    )

    assert second_response.status_code == 409
