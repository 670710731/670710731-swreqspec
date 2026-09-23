"""Shared in-memory database fixtures for backend tests."""

from collections.abc import Iterator
from importlib import import_module

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.models import Base


initial_schema = import_module("app.db.migrations.001_init")


@pytest.fixture
def db_session() -> Iterator[Session]:
    """Provide an isolated SQLite schema for CON-TECH-01 model tests."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    initial_schema.upgrade(engine)
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = session_factory()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()
