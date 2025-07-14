import React from 'react';
import { Outlet } from 'react-router-dom';
import SimpleSidebar from './Sidebar';
import { Container } from 'react-bootstrap';

interface Note {
  id: string;
  title: string;
  markdown: string;
  createdAt: string;
}

interface LayoutProps {
  notes: Note[];
}

const Layout: React.FC<LayoutProps> = ({ notes }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, padding: 0, backgroundColor: '#f8f9fa' }}>
      <SimpleSidebar notes={notes} appTitle="NoteoriousAI" />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Container fluid className="p-4" style={{ maxWidth: 'none' }}>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;