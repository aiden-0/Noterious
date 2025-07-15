def create_note(cursor, id, title, markdown):
    cursor.execute("INSERT INTO notes VALUES (%s, %s, %s)", (id, title, markdown))

def get_markdown(cursor, id):
    cursor.execute("SELECT markdown FROM notes WHERE id = %s;", (id,))
    result = cursor.fetchone() #fetches the query result
    return result[0] if result else None
# def update_note():
#     #update logic here

# def get_note():
#     #get note logic