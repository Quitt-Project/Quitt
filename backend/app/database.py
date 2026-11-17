import os
from typing import Annotated, TypeAlias

from fastapi import Depends
from sqlmodel import Session, create_engine

database_url = os.environ.get("DATABASE_URL")

if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(database_url, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

SessionDependency: TypeAlias = Annotated[Session, Depends(get_session)]