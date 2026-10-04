/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Subject, Note } from './types';
import { Navigation } from './components/Navigation';
import { SubjectsPage } from './components/SubjectsPage';
import { NotesPage } from './components/NotesPage';

const API_URL = 'https://study-notes-kkjj.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'notes'>('subjects');

  // Subjects now come from FastAPI + SQLite
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Notes are still local for now.
  // We will connect them to FastAPI next.
  const [notes, setNotes] = useState<Note[]>([]);

  // Load subjects from FastAPI when the app starts
  useEffect(() => {
  fetch(`${API_URL}/subjects`)
    .then((response) => response.json())
    .then((data) => {
      setSubjects(data);
    })
    .catch((error) => {
      console.error('Error fetching subjects:', error);
    });

  fetch(`${API_URL}/notes`)
    .then((response) => response.json())
    .then((data) => {
      setNotes(data);
    })
    .catch((error) => {
      console.error('Error fetching notes:', error);
    });
}, []);

  // -------------------------
  // SUBJECT HANDLERS
  // -------------------------

  const handleAddSubject = async (name: string, code: string) => {
    try {
      const response = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          code,
        }),
      });

      if (!response.ok) {
        console.error('Failed to create subject');
        return;
      }

      const newSubject = await response.json();

      setSubjects((prev) => [...prev, newSubject]);
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const handleDeleteSubject = async (id: string | number) => {
    try {
      const response = await fetch(`${API_URL}/subjects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete subject');
        return;
      }

      setSubjects((prev) =>
        prev.filter((subject) => subject.id !== id)
      );

      // Remove notes belonging to this subject for now.
      // Later the database will handle this relationship properly.
      setNotes((prev) =>
        prev.filter((note) => note.subject_id !== id)
      );
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  // -------------------------
  // NOTE HANDLERS
  // -------------------------

  const handleAddNote = async (
  subject_id: string | number,
  title: string,
  content: string
) => {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject_id: Number(subject_id),
        title,
        content,
      }),
    });

    if (!response.ok) {
      console.error('Failed to create note');
      return;
    }

    const newNote = await response.json();

    setNotes((prev) => [newNote, ...prev]);
  } catch (error) {
    console.error('Error creating note:', error);
  }
};
  const handleUpdateNote = (
    id: string | number,
    subject_id: string | number,
    title: string,
    content: string
  ) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              subject_id,
              title,
              content,
            }
          : note
      )
    );
  };

  const handleDeleteNote = (id: string | number) => {
    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900">

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">

        {activeTab === 'subjects' ? (
          <SubjectsPage
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        ) : (
          <NotesPage
            notes={notes}
            subjects={subjects}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onNavigateToSubjects={() => setActiveTab('subjects')}
          />
        )}

      </main>

      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">

          <p>
            Study Notes &mdash; Simple, clean subject &amp; note management.
          </p>

          <p>
            Connected to FastAPI + SQLite
          </p>

        </div>
      </footer>

    </div>
  );
}
