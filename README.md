# quitt

**Dein Steuer-Sammelordner für die Ausbildung.** A mobile app for Azubis that collects Belege (receipts), Fahrten (trips) and Fristen (deadlines) throughout the year, so everything is ready for the Steuererklärung.

> quitt only helps with collecting and organising. It is not tax advice.

This README explains how to get the project running on your computer. More background is in [`docs/`](docs/), for example the [project overview](docs/overview_en.md), the [decisions](docs/decisions_en.md) and the [Git workflow](docs/git-workflow.md).

## Project structure

| Folder | What is inside |
|---|---|
| `backend/` | API in Python (FastAPI, SQLModel, Alembic) |
| `mobile/` | App in TypeScript (React Native, Expo, Expo Router) |
| `docs/` | Project documentation, mockups, pitch |
| `docker-compose.yml` | Starts database, backend and Adminer |

## Prerequisites

Install these once:

| Tool | Why | Check with |
|---|---|---|
| [Git](https://git-scm.com/) | Get the code | `git --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs database and backend | `docker --version` |
| [Node.js](https://nodejs.org/) (LTS) | Runs the Expo development server | `node --version` |
| [Expo Go](https://expo.dev/go) on your phone | Opens the app on iOS or Android | – |

Python does **not** need to be installed for running the project, because the backend runs in Docker. See [Editor setup](#editor-setup-optional) if you want autocomplete in VS Code.

## Quick start

### 1. Get the code

```bash
git clone https://github.com/Quitt-Project/Quitt.git
cd Quitt
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

The default values work for local development. You do not have to change anything. See [Environment variables](#environment-variables).

### 3. Start the backend

Docker Desktop must be running.

```bash
docker compose up -d
```

This starts the database, the backend and Adminer. The backend applies all database migrations automatically on start (`alembic upgrade head`), so the tables are always up to date.

The first start takes a few minutes because Docker downloads and builds the images.

Check that it works: open http://localhost:8000/health in the browser. You should see `{"status": "ok"}`.

### 4. Start the mobile app

The app does not run in Docker. In a second terminal:

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the iPhone camera or with Expo Go on Android. Phone and computer must be in the same Wi-Fi. More details: [`mobile/README.md`](mobile/README.md).

## Services

| Service | URL | What for |
|---|---|---|
| API | http://localhost:8000 | Backend |
| API docs | http://localhost:8000/docs | Try out all endpoints in the browser |
| Adminer | http://localhost:8080 | Look into the database |
| PostgreSQL | `localhost:5432` | Database |

**Adminer login:**

| Field | Value |
|---|---|
| System | **PostgreSQL** (not MySQL, which is the default) |
| Server | `db` |
| Username | `quitt` |
| Password | `quitt` |
| Database | `quitt` |

## Environment variables

Stored in `.env` in the project root. The `.env` file is never committed, only `.env.example` is.

| Variable | Default | Meaning |
|---|---|---|
| `POSTGRES_USER` | `quitt` | Database user |
| `POSTGRES_PASSWORD` | `quitt` | Password of the database user |
| `POSTGRES_DB` | `quitt` | Name of the database |

`docker-compose.yml` builds `DATABASE_URL` for the backend from these values:

```
postgresql+psycopg://quitt:quitt@db:5432/quitt
```

`db` is the name of the database service. It only works inside Docker.

> **Important:** PostgreSQL reads these values only on the very first start, when the database is created. If you change them later, the database still uses the old values. See [Troubleshooting](#troubleshooting).

## Everyday commands

Run them in the project root.

| What | Command |
|---|---|
| Start everything | `docker compose up -d` |
| Stop everything | `docker compose down` |
| Show backend logs | `docker compose logs -f backend` |
| Rebuild after changing `backend/requirements.txt` | `docker compose up -d --build` |
| Run backend tests | `docker compose run --rm backend pytest` |
| Show running containers | `docker compose ps` |

Code changes in `backend/` are picked up automatically, without a restart.

## Database migrations

We change the database only through [Alembic](https://alembic.sqlalchemy.org/) migrations. Never create tables by hand.

After you change or add a model in `backend/app/models/`:

1. Create a migration:

   ```bash
   docker compose run --rm backend alembic revision --autogenerate -m "short description"
   ```

2. Read the new file in `backend/alembic/versions/` and check that it does what you expect.
3. Apply it:

   ```bash
   docker compose run --rm backend alembic upgrade head
   ```

4. Check that models and database match:

   ```bash
   docker compose run --rm backend alembic check
   ```

   Expected: `No new upgrade operations detected.`

New models must be imported in `backend/app/models/__init__.py`, otherwise Alembic does not see them.

## Code quality

Run before you open a pull request:

| Part | Command | Where |
|---|---|---|
| Backend | `ruff check .` (fix automatically: `ruff check --fix .`) | `backend/`, with `ruff` installed in your `.venv` |
| Mobile | `npm run lint` and `npm run format` | `mobile/` |

The CI runs `ruff check` for the backend on every pull request.

## Editor setup (optional)

The backend runs in Docker, so VS Code does not know the Python packages. Without a local environment it shows `Import "fastapi" could not be resolved`. To fix that, create a virtual environment once:

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt ruff
```

Then select `backend/.venv` as the Python interpreter in VS Code (`Cmd + Shift + P` → "Python: Select Interpreter"). The `.venv` folder is ignored by Git and Docker.

When `requirements.txt` changes, run `pip install -r requirements.txt` again.

## Troubleshooting

**`password authentication failed for user ...`**
The values in `.env` were changed after the database was created. Either set them back to the old values (`cp .env.example .env`), or delete the database and start fresh:

```bash
docker compose down -v
docker compose up -d
```

`-v` deletes the database volume, so **all local data is lost**.

**Adminer shows "Connection refused"**
Set "System" to **PostgreSQL**. Adminer selects MySQL by default.

**`failed to resolve source metadata` or a timeout while building**
Docker Hub or the network was too slow. Run the command again.

**`port is already allocated`**
Another program uses port 8000, 8080 or 5432, for example a local PostgreSQL. Stop that program, or stop old containers with `docker compose down`.

**The app on the phone cannot connect**
Phone and computer must be in the same Wi-Fi. If the network blocks it, use `npx expo start --tunnel`.

**`ModuleNotFoundError` in the backend after pulling new code**
Someone added a package. Rebuild with `docker compose up -d --build`.

## Contributing

Every change goes through a branch and a pull request. Branch names, commit messages and the review process are described in [`docs/git-workflow.md`](docs/git-workflow.md).
