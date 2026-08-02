import os
import urllib.parse
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.engine.url import make_url

DB_FILE = os.environ.get("VERITY_DB_FILE", "verity.db").strip()

# Default fallback database
DATABASE_URL = "sqlite:///verity.db"
connect_args = {"check_same_thread": False}

if DB_FILE and (DB_FILE.startswith("postgresql://") or DB_FILE.startswith("postgres://")):
    try:
        db_url_str = DB_FILE
        if db_url_str.startswith("postgres://"):
            db_url_str = "postgresql://" + db_url_str[11:]

        # Safely extract and URL-encode password if special characters are present
        scheme_idx = db_url_str.find("://")
        last_at_idx = db_url_str.rfind("@")
        
        if scheme_idx != -1 and last_at_idx != -1 and last_at_idx > scheme_idx:
            scheme = db_url_str[:scheme_idx + 3]
            auth_part = db_url_str[scheme_idx + 3:last_at_idx]
            host_db_part = db_url_str[last_at_idx + 1:]
            
            if ":" in auth_part:
                user, raw_pwd = auth_part.split(":", 1)
                # Unquote any existing partial quotes and re-encode safely
                quoted_pwd = urllib.parse.quote(urllib.parse.unquote(raw_pwd), safe="")
                db_url_str = f"{scheme}{user}:{quoted_pwd}@{host_db_part}"

        # Validate with SQLAlchemy make_url and check for driver
        import importlib.util
        has_psycopg = importlib.util.find_spec("psycopg2") or importlib.util.find_spec("psycopg")
        if not has_psycopg:
            raise ImportError("psycopg2 or psycopg driver not installed in Python environment")

        make_url(db_url_str)
        DATABASE_URL = db_url_str
        connect_args = {}
        print("[Database] Successfully parsed PostgreSQL database URL.")
    except Exception as err:
        print(f"[Database Warning] Error using PostgreSQL ({err}). Falling back to SQLite.")
        DATABASE_URL = "sqlite:///verity.db"
        connect_args = {"check_same_thread": False}
elif DB_FILE and DB_FILE != "verity.db":
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
