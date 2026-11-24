from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


class EntryCreate(BaseModel):
    kind: Literal["receipt", "trip"] = "receipt"
    amount: int | None = Field(default=None, ge=0)
    entry_date: date = Field(default_factory=date.today)
    category: Literal[
        "uncategorized",
        "work_equipment",
        "literature",
        "training",
        "trips",
        "other",
    ] = "uncategorized"
    note: str | None = None
    distance_km: int | None = Field(default=None, ge=0)
    days: int | None = Field(default=None, ge=0)

class EntryUpdate(BaseModel):
    kind: Literal["receipt", "trip"] | None = None
    amount: int | None = Field(default=None, ge=0)
    entry_date: date | None = None
    category: Literal[
        "uncategorized",
        "work_equipment",
        "literature",
        "training",
        "trips",
        "other",
    ] | None = None
    note: str | None = None
    distance_km: int | None = Field(default=None, ge=0)
    days: int | None = Field(default=None, ge=0)

class EntryResponse(BaseModel):
    id: int
    kind: Literal["receipt", "trip"]
    amount: int | None
    entry_date: date
    category: Literal[
        "uncategorized",
        "work_equipment",
        "literature",
        "training",
        "trips",
        "other",
    ]
    note: str | None
    distance_km: int | None
    days: int | None
    created_at: datetime