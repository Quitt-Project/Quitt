from datetime import UTC, date, datetime

from sqlmodel import Field, SQLModel


class Entry(SQLModel, table=True):
    __tablename__ = "entries"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    kind: str = Field(default="receipt", index=True)
    amount: int | None = Field(default=None)
    entry_date: date = Field(default_factory=lambda: date.today())
    category: str = Field(default="uncategorized", index=True)
    note: str | None = Field(default=None)
    photo_path: str | None = Field(default=None)
    distance_km: int | None = Field(default=None)
    days: int | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
