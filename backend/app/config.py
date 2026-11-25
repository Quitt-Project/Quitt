import os

APP_NAME = os.getenv("APP_NAME", "quitt API")
APP_ENV = os.getenv("APP_ENV", "development")

# Comma-separated list of origins allowed to call the API from a browser
# (e.g. the Expo web dev server). Native apps are not affected by CORS.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:8081").split(",")
    if origin.strip()
]

JWT_SECRET = os.getenv("JWT_SECRET")

if not JWT_SECRET or len(JWT_SECRET) < 32:
    raise RuntimeError(
        "JWT_SECRET must be set and contain at least 32 characters"
    )

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
