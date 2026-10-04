import React, { useState } from 'react';
import { Subject } from '../types';
import { Plus, Trash2, Layers } from 'lucide-react';

interface SubjectsPageProps {
  subjects: Subject[];
  onAddSubject: (name: string, code: string) => void;
  onDeleteSubject: (id: string | number) => void;
}

export const SubjectsPage: React.FC<SubjectsPageProps> = ({
  subjects,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Please provide both a subject name and a subject code.');
      return;
    }
    setError('');
    onAddSubject(name.trim(), code.trim());
    setName('');
    setCode('');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Subjects</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create and manage study subjects and course codes.
        </p>
      </div>

      {/* Add Subject Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-zinc-700" />
          Add New Subject
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-3">
            <label htmlFor="subject-name" className="block text-xs font-medium text-zinc-700 mb-1">
              Subject Name
            </label>
            <input
              id="subject-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Introduction to Computer Science"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="subject-code" className="block text-xs font-medium text-zinc-700 mb-1">
              Subject Code
            </label>
            <div className="flex gap-2">
              <input
                id="subject-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS 101"
                className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-shadow uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Subjects List */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">
            Subject List
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
          </span>
        </div>

        {subjects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-900">No subjects yet</h3>
            <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
              Add your first subject using the form above to start organizing your study notes.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 sm:px-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200 shrink-0">
                    {subject.code}
                  </span>
                  <div className="truncate">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {subject.name}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      ID: {subject.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteSubject(subject.id)}
                  aria-label={`Delete ${subject.name}`}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4 shrink-0"
                  title="Delete subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
