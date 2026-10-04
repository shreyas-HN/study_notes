import React from 'react';
import { BookOpen, Layers, FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: 'subjects' | 'notes';
  onTabChange: (tab: 'subjects' | 'notes') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-zinc-900 tracking-tight">
            Study Notes
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onTabChange('subjects')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'subjects'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Subjects
          </button>
          <button
            type="button"
            onClick={() => onTabChange('notes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Notes
          </button>
        </nav>

        {/* Zone 3: Architecture Info */}
        <div className="hidden sm:flex items-center text-xs text-zinc-500 font-medium">
          <span>FastAPI + SQLite Ready</span>
        </div>
      </div>
    </header>
  );
};
