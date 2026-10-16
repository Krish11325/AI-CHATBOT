import React, { useState } from 'react';
import { Search, X, BookOpen, Bookmark, FileText, Bot, ArrowRight, ChevronRight } from 'lucide-react';
import { FORMULA_LIBRARY } from '../data/formulasData';
import { MATHEMATICS_CATEGORIES } from '../data/mathematicsData';
import { PHYSICS_CATEGORIES } from '../data/physicsData';
import { Note } from '../types';

interface UniversalSearchModalProps {
  notes: Note[];
  onClose: () => void;
  onSelectTopic: (topicTitle: string) => void;
  onAskAI: (query: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  notes,
  onClose,
  onSelectTopic,
  onAskAI
}) => {
  const [query, setQuery] = useState('');

  const allTopics = [
    ...MATHEMATICS_CATEGORIES.flatMap((c) => c.topics),
    ...PHYSICS_CATEGORIES.flatMap((c) => c.topics)
  ];

  const matchedTopics = query.trim()
    ? allTopics.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedFormulas = query.trim()
    ? FORMULA_LIBRARY.filter(
        (f) =>
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedNotes = query.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, formulas, notes & AI..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Type a term (e.g. "Newton", "Calculus", "Lens", "Derivative") to search across all study materials.
            </div>
          ) : (
            <>
              {/* Ask AI Shortcut */}
              <button
                onClick={() => {
                  onAskAI(query);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-left flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <Bot className="w-4 h-4" />
                  <span>Ask AI Tutor: "{query}"</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Topics Results */}
              {matchedTopics.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Curriculum Topics ({matchedTopics.length})
                  </span>
                  {matchedTopics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic.title);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {topic.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Formulas Results */}
              {matchedFormulas.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Formulas ({matchedFormulas.length})
                  </span>
                  {matchedFormulas.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        onAskAI(`Explain formula: ${f.title}`);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Bookmark className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {f.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600">{f.latex}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Results */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Saved Notes ({matchedNotes.length})
                  </span>
                  {matchedNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {n.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
