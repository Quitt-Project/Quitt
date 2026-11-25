def test_me_success(client):
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

    access_token = login_response.json()["access_token"]

    response = client.get(
        "/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == user_id
    assert data["name"] == "Illia"
    assert data["email"] == "illia@example.com"


def test_me_invalid_token(client):
    response = client.get(
        "/me",
        headers={"Authorization": "Bearer das-ist-kein-gueltiger-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid or expired token"}
