import os
from typing import Annotated, TypeAlias

from fastapi import Depends
from sqlmodel import Session, create_engine

from app.config import APP_ENV

database_url = os.environ.get("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL environment variable is not set")

engine = create_engine(database_url, echo=APP_ENV == "development")


def get_session():
    with Session(engine) as session:
        yield session


SessionDependency: TypeAlias = Annotated[Session, Depends(get_session)]
