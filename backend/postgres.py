# postgres.py
import os
import psycopg2
from contextlib import contextmanager

def _windows_host_ip():
    # works in WSL to get the Windows host's current IP
    try:
        with open("/etc/resolv.conf") as f:
            for line in f:
                if line.startswith("nameserver"):
                    return line.split()[1]
    except Exception:
        pass
    return "127.0.0.1"

DB_HOST = os.getenv("DB_HOST", _windows_host_ip())   # <-- auto-detect Windows host
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "postgres")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "67890")  # set or use env var

@contextmanager
def get_db():
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
        )
        cur = conn.cursor()
        # Ensure schema matches what your CRUD uses (created_at/updated_at)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            markdown TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """)
        yield cur
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if cur:
            cur.close()
        if conn:
            conn.commit()
            conn.close()
