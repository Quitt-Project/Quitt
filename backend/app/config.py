import os

APP_NAME = os.getenv("APP_NAME", "quitt API")
APP_ENV = os.getenv("APP_ENV", "development")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
