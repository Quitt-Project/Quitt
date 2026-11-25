from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select

from app.database import SessionDependency
from app.dependencies import CurrentUserDependency
from app.models import Entry, User
from app.schemas.entry import EntryCreate, EntryResponse, EntryUpdate

router = APIRouter(
    prefix="/entries",
    tags=["entries"],
)


def get_own_entry_or_404(
    session: Session,
    entry_id: int,
    current_user: User,
) -> Entry:
    entry = session.exec(
        select(Entry).where(
            Entry.id == entry_id,
            Entry.user_id == current_user.id,
        )
    ).first()

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found",
        )

    return entry


@router.post(
    "",
    response_model=EntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_entry(
    entry_data: EntryCreate,
    session: SessionDependency,
    current_user: CurrentUserDependency,
):
    entry = Entry(
        user_id=current_user.id,  # ** entpackt Schlüssel und Werte zu benannten Argumenten
        **entry_data.model_dump(),  # (macht quasi kind = entry_data.kind, amount = entry_data.amount usw.)
    )  # z.B.  daten ={"kind"= receipt,} entry(**daten) -> entry (kind = receipt)

    session.add(entry)
    session.commit()
    session.refresh(entry)

    return entry


@router.get(
    "",
    response_model=list[EntryResponse],
)
def list_entries(
    session: SessionDependency,
    current_user: CurrentUserDependency,
):
    entries = session.exec(select(Entry).where(Entry.user_id == current_user.id)).all()

    return entries


@router.get(
    "/{entry_id}",
    response_model=EntryResponse,
)
def get_entry(
    entry_id: int,
    session: SessionDependency,
    current_user: CurrentUserDependency,
):
    return get_own_entry_or_404(
        session,
        entry_id,
        current_user,
    )


@router.patch(
    "/{entry_id}",
    response_model=EntryResponse,
)
def update_entry(
    entry_id: int,
    entry_data: EntryUpdate,
    session: SessionDependency,
    current_user: CurrentUserDependency,
):
    entry = get_own_entry_or_404(
        session,
        entry_id,
        current_user,
    )

    update_data = entry_data.model_dump(
        exclude_unset=True
    )  # exclude_unset=True gibt nur die vom Client tatsächlich mitgeschickten Felder aus

    for field, value in update_data.items():
        setattr(entry, field, value)

    session.add(entry)
    session.commit()
    session.refresh(entry)

    return entry


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_entry(
    entry_id: int,
    session: SessionDependency,
    current_user: CurrentUserDependency,
):
    entry = get_own_entry_or_404(
        session,
        entry_id,
        current_user,
    )

    session.delete(entry)
    session.commit()
