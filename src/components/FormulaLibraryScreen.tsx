import React, { useState } from 'react';
import { Search, Bookmark, BookmarkCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { SubjectType, Formula } from '../types';
import { FORMULA_LIBRARY } from '../data/formulasData';
import { KaTeXRenderer } from './KaTeXRenderer';

interface FormulaLibraryScreenProps {
  bookmarks: string[];
  onToggleBookmark: (formulaId: string) => void;
  onAskAIAboutFormula: (formulaTitle: string) => void;
}

export const FormulaLibraryScreen: React.FC<FormulaLibraryScreenProps> = ({
  bookmarks,
  onToggleBookmark,
  onAskAIAboutFormula
}) => {
  const [activeTab, setActiveTab] = useState<SubjectType>('maths');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const filteredFormulas = FORMULA_LIBRARY.filter((f) => {
    const matchesSubject = f.subjectId === activeTab;
    const matchesQuery =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.whenToUse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBookmark = showBookmarksOnly ? bookmarks.includes(f.id) : true;

    return matchesSubject && matchesQuery && matchesBookmark;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5">
      {/* Search & Filter Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Formula Library
          </h2>
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
              showBookmarksOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas (e.g., Newton, Quadratic, Ohm, Lens)..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-2xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-300/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('maths')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'maths'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            📐 Mathematics
          </button>
          <button
            onClick={() => setActiveTab('physics')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'physics'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ⚛ Physics
          </button>
        </div>
      </div>

      {/* Formulas List */}
      <div className="space-y-4">
        {filteredFormulas.length === 0 ? (
          <div className="text-center py-12 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-500">
              No formulas found matching your search criteria.
            </p>
          </div>
        ) : (
          filteredFormulas.map((formula) => {
            const isBookmarked = bookmarks.includes(formula.id);

            return (
              <div
                key={formula.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Title & Bookmark Button */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                      {formula.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {formula.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAskAIAboutFormula(formula.title)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
                      title="Ask AI about this formula"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleBookmark(formula.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark formula'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Rendered Equation Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
                  <KaTeXRenderer content={`$$${formula.latex}$$`} />
                </div>

                {/* Variables Breakdown */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Variables & SI Units:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formula.variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {v.name} ({v.symbol}):
                        </span>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          {v.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* When to Use */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    When to use this formula:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {formula.whenToUse}
                  </p>
                </div>

                {/* Example Problem */}
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Example Problem & Application:</span>
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {formula.exampleProblem}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
