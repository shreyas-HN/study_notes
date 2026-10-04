import { Subject, Note } from './types';

/**
 * FastAPI Backend Integration Service
 * 
 * When the Python FastAPI + SQLite backend is running, set API_BASE_URL to point
 * to the backend server (e.g., http://localhost:8000 or /api).
 * 
 * Expected FastAPI Endpoints:
 * - GET    /api/subjects      -> list[Subject]
 * - POST   /api/subjects      -> Subject
 * - DELETE /api/subjects/{id} -> { "ok": true }
 * - GET    /api/notes         -> list[Note]
 * - POST   /api/notes         -> Note
 * - PUT    /api/notes/{id}    -> Note
 * - DELETE /api/notes/{id}    -> { "ok": true }
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await fetch(`${API_BASE_URL}/subjects`);
    if (!res.ok) throw new Error(`Failed to fetch subjects: ${res.statusText}`);
    return res.json();
  },

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create subject: ${res.statusText}`);
    return res.json();
  },

  async deleteSubject(id: string | number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete subject: ${res.statusText}`);
  },

  // Notes
  async getNotes(): Promise<Note[]> {
    const res = await fetch(`${API_BASE_URL}/notes`);
    if (!res.ok) throw new Error(`Failed to fetch notes: ${res.statusText}`);
    return res.json();
  },

  async createNote(data: Omit<Note, 'id'>): Promise<Note> {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create note: ${res.statusText}`);
    return res.json();
  },

  async updateNote(id: string | number, data: Partial<Omit<Note, 'id'>>): Promise<Note> {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update note: ${res.statusText}`);
    return res.json();
  },

  async deleteNote(id: string | number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete note: ${res.statusText}`);
  },
};
