import NewNote from "./components/NewNote";
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./components/Home";
import Layout from "./components/layout";

export type NoteData = {
  title: string
  markdown: string
  id: string 
}

export default function App() {
  // Sample notes data - replace with your actual notes state
  const notes: Array<{id: string, title: string, markdown: string, createdAt: string}> = [
    // Add your notes here or connect to your data source
  ];

  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      <Routes>
        <Route path="/" element={<Layout notes={notes} />}>
          <Route index element={<Home />} />
          <Route path="new" element={<NewNote />} />
          <Route path=":id" element={<h1>Show</h1>} />
          <Route path=":id/edit" element={<h1>Edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}