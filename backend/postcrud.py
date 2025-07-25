def create_note(cursor, id, title, markdown):
    cursor.execute("INSERT INTO notes VALUES (%s, %s, %s)", (id, title, markdown))

def get_markdown(cursor, id):
    cursor.execute("SELECT markdown, title FROM notes WHERE id = %s;", (id,))
    result = cursor.fetchone() #fetches the query result
    return result if result else None

def update_noteSQL(cursor, id, title, markdown):
    cursor.execute("UPDATE notes SET title = %s, markdown = %s WHERE id = %s;", (title, markdown, id))

# def get_note(cursor, id):
#     cursor.execute("SELECT")
    