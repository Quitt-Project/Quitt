from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

EntryKind = Literal["receipt", "trip"]

EntryCategory = Literal[
        "uncategorized",
        "work_equipment",
        "literature",
        "training",
        "trips",
        "other",
]

class EntryCreate(BaseModel):
    kind: EntryKind = "receipt"
    amount: int | None = Field(default=None, ge=0)
    entry_date: date = Field(default_factory=date.today)
    category: EntryCategory = "uncategorized"
    note: str | None = None
    distance_km: int | None = Field(default=None, ge=0)
    days: int | None = Field(default=None, ge=0)

class EntryUpdate(BaseModel):
    kind: EntryKind | None = None
    amount: int | None = Field(default=None, ge=0)
    entry_date: date | None = None
    category: EntryCategory | None = None
    note: str | None = None
    distance_km: int | None = Field(default=None, ge=0)
    days: int | None = Field(default=None, ge=0)

    @field_validator("kind", "entry_date", "category")
    @classmethod
    def not_null(cls, value):
        if value is None:
            raise ValueError("must not be null")
        return value

class EntryResponse(BaseModel):
    id: int
    kind: EntryKind
    amount: int | None
    entry_date: date
    category: EntryCategory
    note: str | None
    distance_km: int | None
    days: int | None
    created_at: datetime