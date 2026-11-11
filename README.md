# quitt

quitt is a mobile app for Azubis. It collects receipts, trips and deadlines over the year so you have everything ready for your tax return. It does not give tax advice.

## Requirements

- Git
- Docker Desktop
- Node.js (LTS)
- Expo Go on your phone

## Setup

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

`.env` contains the database settings (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`). The defaults from `.env.example` are fine for development. The backend gets its `DATABASE_URL` from `docker-compose.yml`.

## Database migrations

After you change a model in `backend/app/models/`:

```bash
docker compose run --rm backend alembic revision --autogenerate -m "describe the change"
docker compose run --rm backend alembic upgrade head
```

Check the new file in `backend/alembic/versions/` before you commit it.

## Common problems

- **password authentication failed**: you changed `.env` after the first start. Go back to the old values or reset the database with `docker compose down -v` (this deletes all local data).
- **Adminer: Connection refused**: choose PostgreSQL instead of MySQL.
- **VS Code can't find `fastapi`**: create a venv in `backend/` (`python3.12 -m venv .venv`, then `.venv/bin/pip install -r requirements.txt`) and select it as the Python interpreter.

## Working on the project

Branches, commits and pull requests: see [docs/git-workflow.md](docs/git-workflow.md).
