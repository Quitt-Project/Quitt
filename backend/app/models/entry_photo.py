from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


class EntryPhoto(SQLModel, table=True):
    __tablename__ = "entry_photos"

    id: int | None = Field(default=None, primary_key=True)
    entry_id: int = Field(foreign_key="entries.id", index=True, ondelete="CASCADE")
    file_path: str
    content_type: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
