from fastapi.testclient import TestClient


def create_user_and_login(client: TestClient, name: str, email: str) -> str:
    password = "sicheresPasswort123"

    register_response = client.post(
        "/register",
        json={
            "name": name,
            "email": email,
            "password": password,
        },
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/login",
        json={
            "email": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    return login_response.json()["access_token"]

def test_create_entry(client):
    access_token = create_user_and_login(client, "Illia", "illia@example.com")

    response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
            "note": "USB-C Adapter",
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["id"] is not None
    assert data["kind"] == "receipt"
    assert data["amount"] == 1999
    assert data["category"] == "work_equipment"
    assert data["note"] == "USB-C Adapter"

    assert "user_id" not in data
    assert "photo_path" not in data

def test_create_entry_without_token(client):
    response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
    )

    assert response.status_code == 401

def test_list_entries_only_returns_own_entries(client):
    illia_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    andreas_token = create_user_and_login(
        client,
        "Andreas",
        "andreas@example.com",
    )

    illia_entry = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
            "note": "Illias Entry",
        },
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert illia_entry.status_code == 201

    andreas_entry = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 2999,
            "category": "literature",
            "note": "Andreas Entry",
        },
        headers={
            "Authorization": f"Bearer {andreas_token}"
        },
    )

    assert andreas_entry.status_code == 201

    response = client.get(
        "/entries",
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert response.status_code == 200

    entries = response.json()

    assert len(entries) == 1
    assert entries[0]["amount"] == 1999
    assert entries[0]["note"] == "Illias Entry"

def test_get_own_entry(client: TestClient):
    access_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = client.get(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert response.status_code == 200
    assert response.json()["id"] == entry_id
    assert response.json()["amount"] == 1999

def test_get_other_users_entry_returns_404(client: TestClient):
    illia_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    andreas_token = create_user_and_login(
        client,
        "Andreas",
        "andreas@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = client.get(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {andreas_token}"
        },
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Entry not found"
    }

def test_update_own_entry(client: TestClient):
    access_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
            "note": "Alte Notiz",
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = client.patch(
        f"/entries/{entry_id}",
        json={
            "amount": 2499,
            "note": "Neue Notiz",
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["amount"] == 2499
    assert data["note"] == "Neue Notiz"
    assert data["category"] == "work_equipment"

def test_update_other_users_entry_returns_404(client: TestClient):
    illia_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    andreas_token = create_user_and_login(
        client,
        "Andreas",
        "andreas@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = client.patch(
        f"/entries/{entry_id}",
        json={
            "amount": 999999,
        },
        headers={
            "Authorization": f"Bearer {andreas_token}"
        },
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Entry not found"
    }

def test_delete_own_entry(client: TestClient):
    access_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
    )

    assert get_response.status_code == 404

def test_delete_other_users_entry_returns_404(client: TestClient):
    illia_token = create_user_and_login(
        client,
        "Illia",
        "illia@example.com",
    )

    andreas_token = create_user_and_login(
        client,
        "Andreas",
        "andreas@example.com",
    )

    create_response = client.post(
        "/entries",
        json={
            "kind": "receipt",
            "amount": 1999,
            "category": "work_equipment",
        },
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {andreas_token}"
        },
    )

    assert delete_response.status_code == 404

    get_response = client.get(
        f"/entries/{entry_id}",
        headers={
            "Authorization": f"Bearer {illia_token}"
        },
    )

    assert get_response.status_code == 200