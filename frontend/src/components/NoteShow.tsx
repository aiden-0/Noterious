import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "react-bootstrap";
import NoteForm from "./NoteForm";
import { type NoteData } from "../App";


export default function NoteShow() {
  //get data, pass it into noteform, make changes to update changes button logic
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/notes/${id}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        //save note so can be in use later in the component
        setNote({
          id: id!,
          title: json.title,
          markdown: json.markdown
        });
        setLoading(false);
      } catch (error) {
        console.error("error fetching note:", error);
        setLoading(false);
      }
    }
    if (id) {
      fetchNote();
    }
  }, [id]) //will rerun if id changes

  //   if(loading){
  //     return <div>LOADING</div>
  //   }
  if (!note) {
    return <div>note doesnt exist</div>
  }

  async function handleUpdate(data: NoteData) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log("Note updated successfully");
        setNote(data);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }







  return (
    <>
      <h1 className="mb-4">{note.title}</h1>
      <NoteForm
        key={note.id}
        formId="note-form"
        onSubmit={handleUpdate}
        initialId={note.id}
        initialTitle={note.title}
        initialMarkdown={note.markdown}
      />
      <Button className="mt-3" type="submit" form="note-form" variant="primary">Update Note</Button>
    </>
  );
}