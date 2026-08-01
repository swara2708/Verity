import os
import urllib.parse
from sqlmodel import SQLModel, create_engine, Session

DB_FILE = os.environ.get("VERITY_DB_FILE", "verity.db")

if DB_FILE.startswith("postgresql://") or DB_FILE.startswith("postgres://"):
    # Fix password encoding for PostgreSQL URLs if special characters are present
    if "@" in DB_FILE and ":" in DB_FILE.split("@")[0]:
        user_pass, host_part = DB_FILE.split("@", 1)
        parts = user_pass.rsplit(":", 1)
        if len(parts) == 2:
            prefix, raw_pwd = parts[0], parts[1]
            unquoted_pwd = urllib.parse.unquote(raw_pwd)
            quoted_pwd = urllib.parse.quote_plus(unquoted_pwd)
            DATABASE_URL = f"{prefix}:{quoted_pwd}@{host_part}"
        else:
            DATABASE_URL = DB_FILE
    else:
        DATABASE_URL = DB_FILE
    connect_args = {}
else:
    DATABASE_URL = f"sqlite:///{DB_FILE}"
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
