def create_note(cursor, id, title, markdown):
    cursor.execute("INSERT INTO notes VALUES (%s, %s, %s)", (id, title, markdown))

def get_markdown(cursor, id):


# def update_note():
#     #update logic here

# def get_note():
#     #get note logic