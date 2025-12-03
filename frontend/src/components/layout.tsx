import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SimpleSidebar from './Sidebar';
import { Container } from 'react-bootstrap';

interface Note {
  id: string;
  title: string;
  updated_at: string;
}

const Layout: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentNotes();
  }, []);

  const fetchRecentNotes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/notes", {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, padding: 0, backgroundColor: '#f8f9fa' }}>
      <SimpleSidebar notes={notes} appTitle="NoteoriousAI" loading={loading} />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Container fluid className="p-4" style={{ maxWidth: 'none' }}>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;