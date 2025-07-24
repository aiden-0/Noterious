import { useRef, type FormEvent } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { type NoteData } from "../App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void,
    formId? : string
    initialId?: string;
    initialTitle?: string;
    initialMarkdown?: string;
}

export default function NoteForm({onSubmit, formId, initialId, initialTitle="", initialMarkdown=""}: NoteFormProps){
    // store either the provided id or create a new one for creating new note case
    const idRef = useRef(initialId ?? uuidV4());
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    
    //when submit is pressed this function is then called to extract data from the form fields, then it calls the onSubmit function
    //in NewNote.tsx,
    function handleSubmit(e: FormEvent){
        e.preventDefault()
        
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            id: idRef.current,
        })
    }

    return <Form id={formId} onSubmit={handleSubmit}>
        <Stack gap = {4}>
            <Row>
                <Col>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control ref = {titleRef} required defaultValue={initialTitle}></Form.Control>
                </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as = "textarea" ref = {markdownRef} rows = {25} defaultValue = {initialMarkdown}></Form.Control>
                </Form.Group>
        </Stack>
    </Form>
}