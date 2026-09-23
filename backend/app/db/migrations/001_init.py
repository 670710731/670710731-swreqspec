"""Initial database schema migration."""

from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    """Create booking tables for CON-TECH-01, DOM-PDPA-01, and IF-HIS-01."""
    Base.metadata.create_all(engine)
