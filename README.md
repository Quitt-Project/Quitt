# quitt

quitt is a mobile app for Azubis. It collects receipts, trips and deadlines over the year so you have everything ready for your tax return. It does not give tax advice.

## Requirements

- Git
- Docker Desktop
- Node.js (LTS)
- Expo Go on your phone

## Setup

Run all commands in the project folder (`Quitt`), unless a step says otherwise.

```bash
git clone https://github.com/Quitt-Project/Quitt.git
cd Quitt
cp .env.example .env
```

## Start the backend

```bash
docker compose up -d
```

This starts the database, the API and Adminer. Migrations run automatically when the backend starts.

- API: http://localhost:8000 (docs at `/docs`)
- Adminer: http://localhost:8080 (System: PostgreSQL, Server: `db`, user, password and database: `quitt`)

Stop everything with `docker compose down`. Logs: `docker compose logs -f backend`.

If someone changed `backend/requirements.txt`, rebuild with `docker compose up -d --build`.

## Start the app

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go. Phone and laptop need to be in the same Wi-Fi. More in [mobile/README.md](mobile/README.md).

## Environment variables

`.env` contains the database settings (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) and backend settings (`APP_NAME`, `APP_ENV`, `CORS_ORIGINS`, `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRE_MINUTES`).

`CORS_ORIGINS` contains the comma-separated origins allowed to call the API from a browser. The default allows Expo web on `http://localhost:8081`.

The defaults from `.env.example` are fine for development, except for `JWT_SECRET`. Replace `JWT_SECRET` with a random secret of at least 32 characters before starting the backend.

You can generate a JWT secret with one of the following commands:

macOS/Linux:

```bash
openssl rand -base64 32
```

Windows:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

The backend gets its `DATABASE_URL` and environment configuration from `docker-compose.yml`.

## Database migrations

After you change a model in `backend/app/models/`:

```bash
docker compose run --rm backend alembic revision --autogenerate -m "describe the change"
docker compose run --rm backend alembic upgrade head
```

Check the new file in `backend/alembic/versions/` before you commit it.

## Formatting the backend

Format the backend code before you commit. CI fails if it is unformatted:

```bash
cd backend
python -m ruff format .
```

## Accessibility

quitt is built to be accessible (decision no. 25). The requirements (contrast, screen reader labels, text size, tap targets) are in [docs/overview_en.md](docs/overview_en.md#accessibility). Every pull request with UI changes goes through the accessibility checklist in [docs/git-workflow.md](docs/git-workflow.md#accessibility-checklist).

## Working on the project

Branches, commits and pull requests: see [docs/git-workflow.md](docs/git-workflow.md).
