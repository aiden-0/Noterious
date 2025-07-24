import { Link, useNavigate } from "react-router-dom";
import NoteForm from "./NoteForm";
import { Button, Stack } from "react-bootstrap";

export default function NewNote(){
    const navigate = useNavigate();

    async function onSubmit(data: NoteData) {
        console.log("Saving note:", data);
        try{
            const response = await fetch("http://127.0.0.1:8000/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            
            if(!response.ok){
                throw new Error("failed to save note");
            }
            const result = await response.json();
            console.log("Note saved successfully:", result);
            navigate(`/${data["id"]}`); //nav to the notes page
        }  catch (error) {
        console.error("Error saving note:", error);
    }
        //when finish with onsubmit function and then want to navigate to somewhere

    }
    
    return(
        <>
            <Stack direction="horizontal" className="mb-4 justify-content-between">
                <h1 className="mb-4">New Note</h1>
                <Stack direction="horizontal" gap={2}>
                    <Button type="submit" form="note-form" variant="primary">Save to Database</Button>
                    <Link to="..">
                        <Button type="button" variant="outline-secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Stack>
            <NoteForm formId = "note-form" onSubmit={onSubmit}></NoteForm>
        </>
    )
}