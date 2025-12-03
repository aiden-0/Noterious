import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Plus, FileText } from 'lucide-react';
import './Sidebar.css';

interface Note {
  id: string;
  title: string;
  updated_at: string;
}

interface SidebarProps {
  notes?: Note[];
  appTitle?: string;
  loading?: boolean;
}

const SimpleSidebar: React.FC<SidebarProps> = ({
  notes = [],
  appTitle = 'NoteoriousAI',
  loading = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/new' && location.pathname === '/new') return true;
    if (path.startsWith('/note/') && location.pathname === path) return true;
    return false;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header with App Title and Toggle */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="d-flex align-items-center">
            <FileText className="text-primary me-2" size={24} />
            <h5 className="mb-0 fw-bold text-dark">{appTitle}</h5>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`btn btn-outline-secondary btn-sm sidebar-toggle ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-nav">
        {/* Home Button */}
        <button
          onClick={() => handleNavigation('/')}
          className={`sidebar-nav-btn ${isActive('/') ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
          title="All Notes"
        >
          <Home size={18} className={`nav-icon ${isActive('/') ? 'text-primary' : 'text-secondary'}`} />
          {!isCollapsed && <span className="nav-text">Home</span>}
        </button>

        {/* New Note Button */}
        <button
          onClick={() => handleNavigation('/new')}
          className={`sidebar-nav-btn ${isActive('/new') ? 'active new-note' : ''} ${isCollapsed ? 'collapsed' : ''}`}
          title="New Note"
        >
          <Plus size={18} className={`nav-icon ${isActive('/new') ? 'text-success' : 'text-secondary'}`} />
          {!isCollapsed && <span className="nav-text">New Note</span>}
        </button>
      </div>

      {/* Recent Notes Section */}
      {!isCollapsed && (
        <div className="sidebar-notes">
          <div className="notes-header">
            <h6 className="text-muted text-uppercase small fw-bold mb-3 px-3">
              Recent Notes
            </h6>
          </div>

          <div className="notes-list">
            {loading ? (
              <div className="text-center p-4 text-muted">
                <p className="small">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center p-4 text-muted">
                <FileText size={32} className="mb-2 opacity-50" />
                <p className="small mb-1">No notes yet</p>
                <p className="small">Create your first note!</p>
              </div>
            ) : (
              notes.map((note, index) => (
                <button
                  key={note.id || index}
                  onClick={() => handleNavigation(`/${note.id}`)}
                  className={`note-item ${isActive(`/${note.id}`) ? 'active' : ''}`}
                >
                  <div className="d-flex align-items-start">
                    <FileText size={14} className="text-muted mt-1 me-2 flex-shrink-0" />
                    <div className="flex-grow-1 text-start overflow-hidden">
                      <h6 className="note-title mb-1">
                        {note.title || 'Untitled Note'}
                      </h6>
                      <p className="note-date mb-0 text-muted small">
                        {note.updated_at ?
                          new Date(note.updated_at).toLocaleDateString()
                          : 'Recently'
                        }
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Collapsed Notes Indicator */}
      {isCollapsed && notes.length > 0 && (
        <div className="collapsed-indicator">
          <div className="bg-light rounded p-2 text-center">
            <FileText size={14} className="text-primary mb-1" />
            <div className="small fw-bold text-primary">{notes.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSidebar;