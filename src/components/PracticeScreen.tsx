import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectType, Difficulty, Question, QuizResult, UserProfile } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface PracticeScreenProps {
  user: UserProfile;
  initialTopicTitle?: string;
  initialSubject?: SubjectType;
  onSaveQuizResult: (result: QuizResult) => void;
  onAskAIAboutTopic: (topicTitle: string) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  user,
  initialTopicTitle,
  initialSubject = 'maths',
  onSaveQuizResult,
  onAskAIAboutTopic
}) => {
  const [subject, setSubject] = useState<SubjectType>(initialSubject);
  const [topicTitle, setTopicTitle] = useState(initialTopicTitle || 'Calculus Derivatives');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setUserAnswers({});

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: topicTitle,
          difficulty,
          questionCount,
          language: user.language
        })
      });
      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions(getFallbackQuestions(subject, topicTitle));
      }
      setQuizStartTime(Date.now());
    } catch {
      setQuestions(getFallbackQuestions(subject, topicTitle));
      setQuizStartTime(Date.now());
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: selectedOption }));
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      // Finish Quiz
      const totalTime = Math.round((Date.now() - quizStartTime) / 1000);
      setElapsedSeconds(totalTime);

      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === Number(q.correctAnswer)) {
          correctCount++;
        }
      });

      setFinalScore(correctCount);
      setQuizFinished(true);

      const accuracy = Math.round((correctCount / questions.length) * 100);

      if (accuracy >= 80) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      onSaveQuizResult({
        id: `qr-${Date.now()}`,
        quizId: `quiz-${Date.now()}`,
        subject,
        topicTitle,
        score: correctCount,
        totalQuestions: questions.length,
        accuracy,
        timeSpentSeconds: totalTime,
        date: new Date().toISOString(),
        weakPoints: accuracy < 70 ? [topicTitle] : []
      });
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-1 pb-24 space-y-5 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Quiz Config Setup Form */}
      {questions.length === 0 && !isGenerating && (
        <div className="p-6 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] rounded-2xl shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
                AI Quiz Generator
              </h2>
              <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] font-medium">
                Generate personalized practice tests tailored to your learning goals
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1.5">
                Select Subject
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSubject('maths')}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                    subject === 'maths'
                      ? 'bg-[#3B3028] text-[#FCFAF5] dark:bg-[#C99A7B] dark:text-[#211C18] border-[#3B3028]'
                      : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                  }`}
                >
                  📐 Mathematics
                </button>
                <button
                  type="button"
                  onClick={() => setSubject('physics')}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                    subject === 'physics'
                      ? 'bg-[#B9785F] text-[#FCFAF5] border-[#B9785F]'
                      : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                  }`}
                >
                  ⚛ Physics
                </button>
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1.5">
                Topic Title
              </label>
              <input
                type="text"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="e.g. Newton's Laws, Trigonometric Identities, Calculus..."
                className="w-full text-xs font-medium p-3 rounded-2xl border border-[#D8C3A5] dark:border-[#423730] bg-[#FCFAF5] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] focus:ring-2 focus:ring-[#3B3028]"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1.5">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 text-xs font-bold capitalize rounded-2xl border transition-all ${
                      difficulty === d
                        ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] border-[#3B3028]'
                        : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] dark:text-[#F5EBDD] mb-1.5">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2 text-xs font-bold rounded-2xl border transition-all ${
                      questionCount === count
                        ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] border-[#3B3028]'
                        : 'bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] border-[#E8DCC8] dark:border-[#423730]'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full py-3.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] text-sm font-black rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98 hover:bg-[#29231F]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Generate Quiz Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="p-8 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] text-center space-y-3 shadow-xs">
          <Sparkles className="w-8 h-8 text-[#B9785F] animate-spin mx-auto" />
          <h3 className="text-base font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
            Generating Personal AI Quiz...
          </h3>
          <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] max-w-sm mx-auto font-medium">
            Structuring questions, options, and explanations for {topicTitle}...
          </p>
        </div>
      )}

      {/* Active Question Runner */}
      {questions.length > 0 && !quizFinished && currentQ && (
        <div className="p-6 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-xs space-y-5 animate-fadeIn">
          {/* Quiz Top Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#75685C] dark:text-[#BFB2A4]">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="capitalize text-[#B9785F] dark:text-[#C99A7B] font-extrabold">{difficulty} • {subject}</span>
            </div>
            <div className="w-full bg-[#E8DCC8]/50 dark:bg-[#211C18] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B3028] dark:bg-[#C99A7B] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]">
            <h3 className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD] leading-relaxed">
              <KaTeXRenderer content={currentQ.question} />
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === Number(currentQ.correctAnswer);

              let optionStyle = 'bg-[#FCFAF5] dark:bg-[#302822] border-[#E8DCC8] dark:border-[#423730] text-[#3B3028] dark:text-[#F5EBDD] hover:border-[#D8C3A5]';
              if (showAnswer) {
                if (isCorrect) optionStyle = 'bg-[#87917A] text-[#FCFAF5] border-[#87917A] font-bold';
                else if (isSelected) optionStyle = 'bg-[#B9785F] text-[#FCFAF5] border-[#B9785F]';
              } else if (isSelected) {
                optionStyle = 'bg-[#3B3028] text-[#FCFAF5] border-[#3B3028] font-bold shadow-xs';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!showAnswer) setSelectedOption(idx);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between font-medium ${optionStyle}`}
                >
                  <span className="flex-1"><KaTeXRenderer content={opt} /></span>
                  {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 ml-2 shrink-0" />}
                  {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-2 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback Box */}
          {showAnswer && (
            <div className="p-4 rounded-2xl bg-[#E8DCC8]/60 dark:bg-[#211C18] border border-[#D8C3A5] dark:border-[#423730] space-y-1 text-xs">
              <span className="font-extrabold text-[#3B3028] dark:text-[#F5EBDD] block">
                {selectedOption === Number(currentQ.correctAnswer) ? '✅ Correct Answer!' : '❌ Incorrect'}
              </span>
              <p className="text-[#75685C] dark:text-[#BFB2A4] leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            {!showAnswer ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="w-full py-3 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] disabled:opacity-40 text-xs font-bold rounded-2xl shadow-xs"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] text-xs font-bold rounded-2xl shadow-xs"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'View Quiz Summary'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Finished Summary Report */}
      {quizFinished && (
        <div className="p-6 rounded-[24px] bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] shadow-md space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-[#3B3028] dark:text-[#F5EBDD]">
              Quiz Completed!
            </h2>
            <p className="text-xs text-[#75685C] dark:text-[#BFB2A4] font-semibold">
              Topic: {topicTitle}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]">
              <span className="text-[10px] font-bold text-[#75685C] uppercase">Score</span>
              <p className="text-lg font-black text-[#3B3028] dark:text-[#F5EBDD]">
                {finalScore} / {questions.length}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]">
              <span className="text-[10px] font-bold text-[#75685C] uppercase">Accuracy</span>
              <p className="text-lg font-black text-[#87917A]">
                {Math.round((finalScore / questions.length) * 100)}%
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]">
              <span className="text-[10px] font-bold text-[#75685C] uppercase">Time Taken</span>
              <p className="text-lg font-black text-[#B9785F]">
                {elapsedSeconds}s
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F2E8] dark:bg-[#211C18] border border-[#E8DCC8] dark:border-[#423730]">
              <span className="text-[10px] font-bold text-[#75685C] uppercase">Wrong Qs</span>
              <p className="text-lg font-black text-[#B9785F]">
                {questions.length - finalScore}
              </p>
            </div>
          </div>

          {/* Recommended Practice Weak Areas */}
          {finalScore / questions.length < 0.8 && (
            <div className="p-4 rounded-2xl bg-[#B9785F]/10 border border-[#B9785F]/30 space-y-2">
              <h4 className="text-xs font-bold text-[#B9785F] dark:text-[#C99A7B] flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                <span>AI Recommendation: Practice Weak Areas</span>
              </h4>
              <p className="text-xs text-[#3B3028] dark:text-[#F5EBDD] leading-relaxed font-medium">
                Your accuracy in {topicTitle} is {Math.round((finalScore / questions.length) * 100)}%. Review topic formulas before re-taking hard questions.
              </p>
              <button
                onClick={() => onAskAIAboutTopic(`Please explain the core concepts of ${topicTitle} in detail.`)}
                className="text-xs font-bold text-[#B9785F] dark:text-[#C99A7B] underline"
              >
                Review {topicTitle} with AI Tutor →
              </button>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setQuestions([])}
              className="flex-1 py-3 bg-[#E8DCC8] dark:bg-[#211C18] hover:bg-[#D8C3A5] text-[#3B3028] dark:text-[#F5EBDD] text-xs font-bold rounded-2xl"
            >
              Configure New Quiz
            </button>
            <button
              onClick={handleStartQuiz}
              className="flex-1 py-3 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] text-xs font-bold rounded-2xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getFallbackQuestions(subject: SubjectType, topic: string): Question[] {
  if (subject === 'physics') {
    return [
      {
        id: 'fq1',
        question: 'What is the net force acting on an object traveling at constant velocity?',
        type: 'mcq',
        options: ['Equal to its weight', 'Zero', 'Infinite', 'Proportional to speed'],
        correctAnswer: 1,
        explanation: 'By Newton\'s First Law, constant velocity means zero acceleration, so F_net = ma = 0.'
      },
      {
        id: 'fq2',
        question: 'A car of mass 1000 kg accelerates at 3 m/s². What net force is applied?',
        type: 'mcq',
        options: ['1000 N', '2000 N', '3000 N', '300 N'],
        correctAnswer: 2,
        explanation: 'F = ma = 1000 × 3 = 3000 N.'
      }
    ];
  }
  return [
    {
      id: 'fq3',
      question: 'What is the derivative of f(x) = 3x² + 5x - 2 with respect to x?',
      type: 'mcq',
      options: ['6x + 5', '3x + 5', '6x', '6x - 2'],
      correctAnswer: 0,
      explanation: 'By power rule: d/dx(3x²) = 6x, d/dx(5x) = 5, d/dx(-2) = 0. Total = 6x + 5.'
    },
    {
      id: 'fq4',
      question: 'What is the value of sin²(30°) + cos²(30°)?',
      type: 'mcq',
      options: ['0', '0.5', '1', '2'],
      correctAnswer: 2,
      explanation: 'By Pythagorean Identity: sin²θ + cos²θ = 1 for any angle θ.'
    }
  ];
}
