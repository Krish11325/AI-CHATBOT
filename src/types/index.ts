export type SubjectType = 'maths' | 'physics';
export type Language = 'en' | 'ta';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface UserProfile {
  name: string;
  avatar: string;
  learningLevel: 'School (Class 9-10)' | 'High School (Class 11-12)' | 'College / Engineering' | 'Competitive Exams (JEE/NEET)';
  language: Language;
  darkMode: boolean;
  streakDays: number;
  totalStudyMinutes: number;
  questionsSolved: number;
  quizAccuracy: number; // percentage
  notificationsEnabled: boolean;
  aiTone: 'patient' | 'concise' | 'rigorous';
  dailyGoalMinutes?: number;
  hasOnboarded?: boolean;
}

export interface Topic {
  id: string;
  subjectId: SubjectType;
  categoryId: string;
  title: string;
  titleTa?: string;
  description: string;
  progress: number; // 0-100
  overview: string;
  keyConcepts: string[];
  importantFormulas: {
    name: string;
    latex: string;
    explanation: string;
  }[];
  detailedExplanation: string;
  workedExamples: {
    problem: string;
    given: string[];
    formula: string;
    solutionSteps: string[];
    finalAnswer: string;
  }[];
  commonMistakes: string[];
  practiceQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface Category {
  id: string;
  subjectId: SubjectType;
  title: string;
  iconName: string;
  topics: Topic[];
}

export interface Formula {
  id: string;
  subjectId: SubjectType;
  title: string;
  category: string;
  latex: string;
  variables: { name: string; symbol: string; unit: string }[];
  whenToUse: string;
  exampleProblem: string;
  bookmarked?: boolean;
}

export interface StructuredSolution {
  given?: string[];
  formula?: string;
  calculationSteps?: string[];
  finalAnswer?: string;
  explanationText?: string;
  conceptSummary?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imageUri?: string;
  structuredSolution?: StructuredSolution;
  language?: Language;
  socraticHints?: {
    hint1: string;
    hint2: string;
    hint3: string;
    fullSolution: string;
  };
  currentHintLevel?: number; // 0: none, 1: hint1, 2: hint2, 3: hint3, 4: full
}

export interface ChatConversation {
  id: string;
  title: string;
  subject?: SubjectType;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'true_false' | 'numerical' | 'concept';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  subject: SubjectType;
  topicTitle: string;
  difficulty: Difficulty;
  questions: Question[];
  language: Language;
}

export interface QuizResult {
  id: string;
  quizId: string;
  subject: SubjectType;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
  date: string;
  weakPoints: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: 'Mathematics' | 'Physics' | 'AI Answers' | 'General';
  tags: string[];
  updatedAt: string;
  createdAt?: string;
  latexSnippets?: string[];
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: SubjectType;
  durationMinutes: number;
  targetMinutes?: number;
  completed: boolean;
  dueDate?: string;
  date: string;
}

export interface SearchResult {
  type: 'topic' | 'formula' | 'note' | 'conversation';
  id: string;
  title: string;
  subtitle: string;
  subject?: SubjectType;
  targetScreen: string;
  data?: any;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  goalMet: boolean;
  quizzesCompleted?: number;
  topicsCovered?: string[];
}
