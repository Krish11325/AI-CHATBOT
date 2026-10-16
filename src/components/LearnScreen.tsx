import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  CheckCircle,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { SubjectType, Topic, UserProfile } from '../types';
import { MATHEMATICS_CATEGORIES } from '../data/mathematicsData';
import { PHYSICS_CATEGORIES } from '../data/physicsData';
import { KaTeXRenderer } from './KaTeXRenderer';

interface LearnScreenProps {
  user: UserProfile;
  initialSubject?: SubjectType;
  onAskAIAboutTopic: (topicTitle: string) => void;
  onStartQuizForTopic: (topicTitle: string, subject: SubjectType) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  user,
  initialSubject = 'maths',
  onAskAIAboutTopic,
  onStartQuizForTopic
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectType>(initialSubject);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicTab, setTopicTab] = useState<'overview' | 'examples' | 'formulas' | 'quiz'>('overview');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const categories = activeSubject === 'maths' ? MATHEMATICS_CATEGORIES : PHYSICS_CATEGORIES;

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setTopicTab('overview');
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Subject Toggle Bar */}
      {!selectedTopic && (
        <div className="flex p-1.5 bg-[#FCFAF5] dark:bg-[#302822] rounded-2xl border border-[#E8DCC8] dark:border-[#423730] shadow-xs">
          <button
            onClick={() => setActiveSubject('maths')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeSubject === 'maths'
                ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] shadow-xs'
                : 'text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]'
            }`}
          >
            <span>📐 Mathematics (11 Categories)</span>
          </button>
          <button
            onClick={() => setActiveSubject('physics')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeSubject === 'physics'
                ? 'bg-[#B9785F] text-[#FCFAF5] shadow-xs'
                : 'text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]'
            }`}
          >
            <span>⚛ Physics (16 Categories)</span>
          </button>
        </div>
      )}

      {/* Categories & Topics List View */}
      {!selectedTopic ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
              {activeSubject === 'maths' ? 'Mathematics Curriculum' : 'Physics Chapters'}
            </h3>
            <span className="text-xs text-[#75685C] dark:text-[#BFB2A4] font-semibold">
              Structured Study Material
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-[22px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#3B3028] dark:text-[#F5EBDD] flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B]">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span>{cat.title}</span>
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8DCC8]/60 dark:bg-[#211C18] text-[#75685C] dark:text-[#BFB2A4]">
                    {cat.topics.length} Topic
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {cat.topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className="p-3.5 rounded-xl bg-[#F7F2E8] dark:bg-[#211C18] hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] group-hover:text-[#B9785F]">
                            {topic.title}
                          </h5>
                          {topic.titleTa && user.language === 'ta' && (
                            <span className="text-[10px] text-[#B9785F] font-semibold">
                              ({topic.titleTa})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#75685C] dark:text-[#BFB2A4] line-clamp-1 font-medium">
                          {topic.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-extrabold text-[#B9785F] dark:text-[#C99A7B]">
                          {topic.progress}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#75685C] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Detailed Topic View Screen */
        <div className="space-y-4 animate-fadeIn">
          {/* Top Bar Back Button */}
          <div className="flex items-center justify-between bg-[#FCFAF5] dark:bg-[#302822] p-3 rounded-2xl border border-[#E8DCC8] dark:border-[#423730] shadow-xs">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center space-x-1.5 text-xs font-bold text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Curriculum</span>
            </button>

            <button
              onClick={() => onAskAIAboutTopic(selectedTopic.title)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-xs font-bold rounded-xl shadow-xs hover:bg-[#29231F] transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This Topic</span>
            </button>
          </div>

          {/* Topic Header Card */}
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#3B3028] via-[#29231F] to-[#3B3028] text-[#FCFAF5] shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E8DCC8]/20 text-[#E8DCC8] border border-[#E8DCC8]/30">
                {activeSubject === 'maths' ? '📐 Mathematics' : '⚛ Physics'}
              </span>
              <span className="text-xs font-extrabold text-[#C99A7B]">
                {selectedTopic.progress}% Progress
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#FCFAF5]">
              {selectedTopic.title}
            </h2>
            {selectedTopic.titleTa && (
              <p className="text-xs text-[#E8DCC8] font-semibold">
                {selectedTopic.titleTa}
              </p>
            )}
            <p className="text-xs text-[#E8DCC8]/80 leading-relaxed pt-1">
              {selectedTopic.overview}
            </p>
          </div>

          {/* Section Sub-Tabs */}
          <div className="flex border-b border-[#E8DCC8] dark:border-[#423730] text-xs font-bold">
            <button
              onClick={() => setTopicTab('overview')}
              className={`py-2.5 px-4 border-b-2 transition-all ${
                topicTab === 'overview'
                  ? 'border-[#3B3028] dark:border-[#C99A7B] text-[#3B3028] dark:text-[#C99A7B]'
                  : 'border-transparent text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Concepts & Explanation
            </button>
            <button
              onClick={() => setTopicTab('formulas')}
              className={`py-2.5 px-4 border-b-2 transition-all ${
                topicTab === 'formulas'
                  ? 'border-[#3B3028] dark:border-[#C99A7B] text-[#3B3028] dark:text-[#C99A7B]'
                  : 'border-transparent text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Formulas ({selectedTopic.importantFormulas.length})
            </button>
            <button
              onClick={() => setTopicTab('examples')}
              className={`py-2.5 px-4 border-b-2 transition-all ${
                topicTab === 'examples'
                  ? 'border-[#3B3028] dark:border-[#C99A7B] text-[#3B3028] dark:text-[#C99A7B]'
                  : 'border-transparent text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Worked Examples ({selectedTopic.workedExamples.length})
            </button>
            <button
              onClick={() => setTopicTab('quiz')}
              className={`py-2.5 px-4 border-b-2 transition-all ${
                topicTab === 'quiz'
                  ? 'border-[#3B3028] dark:border-[#C99A7B] text-[#3B3028] dark:text-[#C99A7B]'
                  : 'border-transparent text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Mini Quiz
            </button>
          </div>

          {/* Tab 1: Concepts & Explanation */}
          {topicTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-5 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B]">
                  Key Concepts
                </h4>
                <ul className="space-y-2">
                  {selectedTopic.keyConcepts.map((concept, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs font-medium text-[#3B3028] dark:text-[#F5EBDD]">
                      <CheckCircle className="w-4 h-4 text-[#87917A] flex-shrink-0 mt-0.5" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#B9785F] dark:text-[#C99A7B]">
                  Detailed Explanation
                </h4>
                <p className="text-xs text-[#3B3028] dark:text-[#F5EBDD] leading-relaxed font-medium">
                  {selectedTopic.detailedExplanation}
                </p>
              </div>

              {selectedTopic.commonMistakes && selectedTopic.commonMistakes.length > 0 && (
                <div className="p-5 rounded-[20px] bg-[#B9785F]/10 border border-[#B9785F]/30 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#B9785F] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Common Mistakes to Avoid</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#3B3028] dark:text-[#F5EBDD] list-disc list-inside font-medium">
                    {selectedTopic.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Important Formulas */}
          {topicTab === 'formulas' && (
            <div className="space-y-3">
              {selectedTopic.importantFormulas.map((f, idx) => (
                <div key={idx} className="p-4 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] space-y-2 shadow-xs">
                  <h5 className="text-xs font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                    {f.name}
                  </h5>
                  <div className="p-3 bg-[#E8DCC8]/40 dark:bg-[#211C18] rounded-xl border border-[#D8C3A5]/50 dark:border-[#423730] text-center">
                    <KaTeXRenderer content={`$$${f.latex}$$`} />
                  </div>
                  <p className="text-xs font-medium text-[#75685C] dark:text-[#BFB2A4]">
                    {f.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Worked Examples */}
          {topicTab === 'examples' && (
            <div className="space-y-4">
              {selectedTopic.workedExamples.map((ex, idx) => (
                <div key={idx} className="p-5 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] space-y-3 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8DCC8] text-[#3B3028] dark:bg-[#211C18] dark:text-[#C99A7B]">
                    Worked Example #{idx + 1}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                    {ex.problem}
                  </h4>

                  {ex.given && (
                    <div className="text-xs bg-[#F7F2E8] dark:bg-[#211C18] p-3 rounded-xl border border-[#E8DCC8] dark:border-[#423730]">
                      <span className="font-extrabold text-[#75685C] block mb-1">Given:</span>
                      {ex.given.map((g, gIdx) => (
                        <div key={gIdx}><KaTeXRenderer content={g} /></div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-extrabold text-[#75685C] block">Solution Steps:</span>
                    {ex.solutionSteps.map((s, sIdx) => (
                      <div key={sIdx} className="text-xs p-2.5 bg-[#F7F2E8] dark:bg-[#211C18] rounded-xl text-[#3B3028] dark:text-[#F5EBDD]">
                        <KaTeXRenderer content={s} />
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#B9785F]/10 border border-[#B9785F]/30">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B9785F] block">Final Answer:</span>
                    <div className="text-sm font-black text-[#3B3028] dark:text-[#F5EBDD]">
                      <KaTeXRenderer content={`$${ex.finalAnswer}$`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Mini Quiz */}
          {topicTab === 'quiz' && (
            <div className="p-5 rounded-[20px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                  Concept Check Quiz
                </h4>
                <button
                  onClick={() => onStartQuizForTopic(selectedTopic.title, activeSubject)}
                  className="px-3 py-1.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-xs font-bold rounded-xl shadow-xs hover:bg-[#29231F]"
                >
                  Generate Full AI Quiz →
                </button>
              </div>

              {selectedTopic.practiceQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-[#F7F2E8] dark:bg-[#211C18] space-y-3">
                  <p className="text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD]">
                    {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswerIndex === oIdx;
                      const isCorrect = oIdx === q.correctIndex;

                      let btnStyle = 'bg-[#FCFAF5] dark:bg-[#302822] border-[#E8DCC8] dark:border-[#423730] text-[#3B3028] dark:text-[#F5EBDD]';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-[#87917A] text-[#FCFAF5] border-[#87917A] font-bold';
                        else if (isSelected) btnStyle = 'bg-[#B9785F] text-[#FCFAF5] border-[#B9785F]';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#3B3028] text-[#FCFAF5] border-[#3B3028]';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (!quizSubmitted) setSelectedAnswerIndex(oIdx);
                          }}
                          className={`w-full text-left p-2.5 text-xs font-semibold rounded-xl border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={selectedAnswerIndex === null}
                      className="w-full py-2 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] disabled:opacity-40 text-xs font-bold rounded-xl"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#E8DCC8]/60 dark:bg-[#302822] border border-[#D8C3A5] dark:border-[#423730] text-xs space-y-1">
                      <span className="font-extrabold text-[#3B3028] dark:text-[#F5EBDD] block">
                        Explanation:
                      </span>
                      <p className="text-[#75685C] dark:text-[#BFB2A4] leading-relaxed font-medium">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
