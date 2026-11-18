from fastapi import FastAPI

from app.config import APP_NAME
from app.routers.auth import router as auth_router


app = FastAPI(title=APP_NAME)

app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}

