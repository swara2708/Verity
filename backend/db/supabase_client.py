import os
from typing import Optional

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", os.environ.get("SUPABASE_KEY", ""))

supabase_client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client: Optional[Client] = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("[Supabase] Connected to hosted Supabase database.")
    except Exception as e:
        print(f"[Supabase] Could not initialize Supabase SDK ({e}). Fallback to SQL engine.")
else:
    print("[Supabase] SUPABASE_URL / SUPABASE_KEY not provided. Operating with local SQL engine.")

def get_supabase():
    return supabase_client
