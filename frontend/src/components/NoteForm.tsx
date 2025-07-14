import { useRef, type FormEvent } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { type NoteData } from "../App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void,
    formId? : string
}

export default function NoteForm({onSubmit, formId}: NoteFormProps){
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    
    //when submit is pressed this function is then called to extract data from the form fields, then it calls the onSubmit function
    //in NewNote.tsx,
    function handleSubmit(e: FormEvent){
        e.preventDefault()
        
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            id: uuidV4(),
        })
    }

    return <Form id={formId} onSubmit={handleSubmit}>
        <Stack gap = {4}>
            <Row>
                <Col>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control ref = {titleRef} required></Form.Control>
                </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as = "textarea" ref = {markdownRef} rows = {30}></Form.Control>
                </Form.Group>
        </Stack>
    </Form>
}