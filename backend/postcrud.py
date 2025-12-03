def create_note(cursor, id, title, markdown):
        cursor.execute("""
        INSERT INTO notes (id, title, markdown, created_at, updated_at)
        VALUES (%s, %s, %s, now(), now())
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            markdown = EXCLUDED.markdown,
            updated_at = now();
    """, (id, title, markdown))

def get_markdown(cursor, id):
    cursor.execute("SELECT markdown, title FROM notes WHERE id = %s;", (id,))
    result = cursor.fetchone() #fetches the query result
    return result if result else None

def update_noteSQL(cursor, id, title, markdown):
        cursor.execute("""
        UPDATE notes
           SET title = %s, markdown = %s, updated_at = now()
         WHERE id = %s;
    """, (title, markdown, id))

def list_notes(cursor, limit=30):
    cursor.execute("""
        SELECT id, title, markdown, created_at, updated_at
          FROM notes
      ORDER BY updated_at DESC
         LIMIT %s;
    """, (limit,))
    return cursor.fetchall()

def get_recent_notes(cursor, limit=10):
    """Fetch the most recent notes by updated_at timestamp"""
    cursor.execute("""
        SELECT id, title, updated_at 
        FROM notes 
        ORDER BY updated_at DESC 
        LIMIT %s
    """, (limit,))
    
    notes = []
    for row in cursor.fetchall():
        notes.append({
            "id": row[0],
            "title": row[1],
            "updated_at": row[2].isoformat() if row[2] else None
        })
    return notes