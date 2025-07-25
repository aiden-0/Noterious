import uvicorn
import json
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .postgres import get_db
from .postcrud import create_note, get_markdown, update_noteSQL
from .pineDB import upsertNote, updateVector

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#incoming SAVED note data
#this validates that the incoming data is correct types 
class Note(BaseModel): 
    id: str
    title: str
    markdown: str

#visiting the url is always a GET, so setting a route to POST, it sends a GET when visiting URL but there is no GET handler so returns "method not allowed"
#logic for saving notes to DB here
@app.post("/notes")
async def save_noteToDB(note: Note):
    print(f"Received note: {note}")
    upsertNote(note.id, note.title, note.markdown)
    with get_db() as cursor:
        create_note(cursor, note.id, note.title, note.markdown)
    return {"message": "Saved note successfull"}

#method to get specific note for displaying
@app.get("/notes/{id}")
async def get_note(id: str):
    with get_db() as cursor:
        title_markdown = get_markdown(cursor, id)
        return {"title" : title_markdown[1],
                "markdown" : title_markdown[0]}
    return {"message": "ERROR NOTE NOT FOUND"}

#method to update a specific note in DB
@app.put("/notes/{id}")
async def update_note(note: Note):
    updateVector(note.id, note.title, note.markdown)
    with get_db() as cursor:
        update_noteSQL(cursor, note.id, note.title, note.markdown)
    return {"message": "update note sucess"}




