import React, { useState } from 'react';
import { Note, Subject } from '../types';
import { Plus, Edit3, Trash2, FileText, X, Check, AlertCircle } from 'lucide-react';

interface NotesPageProps {
  notes: Note[];
  subjects: Subject[];
  onAddNote: (subject_id: string | number, title: string, content: string) => void;
  onUpdateNote: (id: string | number, subject_id: string | number, title: string, content: string) => void;
  onDeleteNote: (id: string | number) => void;
  onNavigateToSubjects: () => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  notes,
  subjects,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNavigateToSubjects,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | number | null>(null);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState<string | number>('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const startCreateNote = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    setError('');
    setIsFormOpen(true);
  };

  const startEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setSubjectId(note.subject_id);
    setContent(note.content);
    setError('');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingNoteId(null);
    setTitle('');
    setSubjectId('');
    setContent('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a note title.');
      return;
    }

    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    if (!content.trim()) {
      setError('Please write some content for the note.');
      return;
    }

    setError('');

    if (editingNoteId !== null) {
      onUpdateNote(editingNoteId, subjectId, title.trim(), content.trim());
    } else {
      onAddNote(subjectId, title.trim(), content.trim());
    }

    handleCancel();
  };

  const getSubjectById = (id: string | number) => {
    return subjects.find((s) => String(s.id) === String(id));
  };

  const filteredNotes = selectedSubjectFilter === 'all'
    ? notes
    : notes.filter((n) => String(n.subject_id) === selectedSubjectFilter);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Notes</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create, view, and edit study notes organized by subject.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={startCreateNote}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        )}
      </div>

      {/* Warning if no subjects exist yet */}
      {subjects.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">No subjects available</p>
            <p className="text-amber-800 mt-0.5">
              Before creating notes, you should create at least one subject to categorize them.
            </p>
            <button
              type="button"
              onClick={onNavigateToSubjects}
              className="mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-950"
            >
              Go to Subjects page &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Note Creation / Editing Form */}
      {isFormOpen && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              {editingNoteId !== null ? 'Edit Note' : 'Create New Note'}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="note-title" className="block text-xs font-medium text-zinc-700 mb-1">
                  Title
                </label>
                <input
                  id="note-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Asymptotic Complexity and Big-O Notation"
                  className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="note-subject" className="block text-xs font-medium text-zinc-700 mb-1">
                  Subject
                </label>
                <select
                  id="note-subject"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow"
                >
                  <option value="" disabled>Select a subject...</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.code} - {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="note-content" className="block text-xs font-medium text-zinc-700 mb-1">
                Content
              </label>
              <textarea
                id="note-content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your study notes here..."
                className="w-full px-3 py-2.5 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Notes List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900">Notes List</h2>
            <span className="text-xs text-zinc-500 font-mono">
              ({filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'})
            </span>
          </div>

          {subjects.length > 0 && notes.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="filter-subject" className="text-xs text-zinc-500 font-medium">
                Filter by:
              </label>
              <select
                id="filter-subject"
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} ({sub.name})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No notes yet</h3>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              Click &quot;New Note&quot; to write your first note and associate it with a subject.
            </p>
            {subjects.length > 0 && !isFormOpen && (
              <button
                type="button"
                onClick={startCreateNote}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create a Note
              </button>
            )}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-sm text-zinc-500 shadow-sm">
            No notes found for this subject filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredNotes.map((note) => {
              const subject = getSubjectById(note.subject_id);
              return (
                <div
                  key={note.id}
                  className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      {subject ? (
                        <div className="text-xs text-zinc-500 font-medium mb-1">
                          <span className="font-mono font-semibold text-zinc-700">{subject.code}</span>
                          <span className="mx-1.5 text-zinc-300">&middot;</span>
                          <span>{subject.name}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-400 mb-1">
                          Subject ID: {note.subject_id}
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-zinc-900">
                        {note.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditNote(note)}
                        aria-label={`Edit ${note.title}`}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note.id)}
                        aria-label={`Delete ${note.title}`}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed mt-3 pt-3 border-t border-zinc-100">
                    {note.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
