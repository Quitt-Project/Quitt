import os

APP_NAME = os.getenv("APP_NAME", "quitt API")
APP_ENV = os.getenv("APP_ENV", "development")

JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET must be set and contain at least 32 characters"
    )

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
