import psycopg2
from contextlib import contextmanager

@contextmanager
def get_db():
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(
            host="localhost", 
            dbname="postgres", 
            user="postgres",
            password="67890", 
            port=5432
        )
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            markdown TEXT NOT NULL
        )
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