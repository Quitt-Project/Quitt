import pytest
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.models import Entry, EntryPhoto, User


def create_entry_with_photos(session, photo_count: int) -> Entry:
    user = User(name="Test", email=f"test{photo_count}@example.com", password_hash="x")
    session.add(user)
    session.commit()

    entry = Entry(user_id=user.id, amount=1999)
    session.add(entry)
    session.commit()

    for i in range(photo_count):
        session.add(
            EntryPhoto(
                entry_id=entry.id,
                file_path=f"/data/photos/{entry.id}-{i}.jpg",
                content_type="image/jpeg",
            )
        )
    session.commit()
    return entry


def photos_of(session, entry_id: int) -> list[EntryPhoto]:
    return session.exec(select(EntryPhoto).where(EntryPhoto.entry_id == entry_id)).all()


def test_entry_can_have_several_photos(session):
    entry = create_entry_with_photos(session, 3)
    assert len(photos_of(session, entry.id)) == 3


def test_deleting_one_photo_keeps_the_others(session):
    entry = create_entry_with_photos(session, 3)
    session.delete(photos_of(session, entry.id)[0])
    session.commit()
    assert len(photos_of(session, entry.id)) == 2


def test_deleting_entry_deletes_only_its_photos(session):
    entry = create_entry_with_photos(session, 2)
    other_entry = create_entry_with_photos(session, 1)

    session.delete(entry)
    session.commit()
    session.expire_all()

    assert photos_of(session, entry.id) == []
    assert len(photos_of(session, other_entry.id)) == 1


def test_photo_needs_existing_entry(session):
    session.add(
        EntryPhoto(
            entry_id=9999, file_path="/data/photos/x.jpg", content_type="image/jpeg"
        )
    )
    with pytest.raises(IntegrityError):
        session.commit()
