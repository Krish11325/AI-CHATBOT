import {
  UserProfile,
  ChatConversation,
  Note,
  QuizResult,
  StudyGoal,
  Formula,
  DailyActivity
} from '../types';

const USER_PROFILE_KEY = 'studymate_user_profile';
const CONVERSATIONS_KEY = 'studymate_conversations';
const NOTES_KEY = 'studymate_notes';
const QUIZ_RESULTS_KEY = 'studymate_quiz_results';
const STUDY_GOALS_KEY = 'studymate_study_goals';
const BOOKMARKS_KEY = 'studymate_bookmarks';
const DAILY_ACTIVITY_KEY = 'studymate_daily_activity';

// Helper to generate default initial activity data around September 2026
const generateInitialDailyActivity = (): Record<string, DailyActivity> => {
  const map: Record<string, DailyActivity> = {};
  const today = new Date();
  
  // Highlighting past 30 days
  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Create realistic pattern: 5 day active streak up to today, rest day on day 6 ago, etc.
    if (i < 5) {
      map[dateStr] = {
        date: dateStr,
        minutesStudied: 35 + (i * 5) % 25,
        goalMet: true,
        quizzesCompleted: 1 + (i % 2),
        topicsCovered: i % 2 === 0 ? ['Calculus & Derivatives'] : ['Newton\'s Laws of Motion']
      };
    } else if (i === 5) {
      map[dateStr] = {
        date: dateStr,
        minutesStudied: 15,
        goalMet: false,
        quizzesCompleted: 0,
        topicsCovered: ['Quick Formula Review']
      };
    } else if (i === 11) {
      map[dateStr] = {
        date: dateStr,
        minutesStudied: 0,
        goalMet: false,
        quizzesCompleted: 0,
        topicsCovered: []
      };
    } else {
      map[dateStr] = {
        date: dateStr,
        minutesStudied: 30 + ((i * 7) % 30),
        goalMet: true,
        quizzesCompleted: 1,
        topicsCovered: ['Physics & Math Concepts']
      };
    }
  }
  return map;
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  learningLevel: 'High School (Class 11-12)',
  language: 'en',
  darkMode: false,
  streakDays: 5,
  totalStudyMinutes: 142,
  questionsSolved: 38,
  quizAccuracy: 78,
  notificationsEnabled: true,
  aiTone: 'patient',
  hasOnboarded: true
};

export const INITIAL_GOALS: StudyGoal[] = [
  { id: 'g1', title: 'Mathematics – Calculus Derivative practice', subject: 'maths', durationMinutes: 30, targetMinutes: 30, completed: true, date: new Date().toISOString().split('T')[0] },
  { id: 'g2', title: 'Physics – Newton\'s Laws Numerical Problems', subject: 'physics', durationMinutes: 30, targetMinutes: 30, completed: false, date: new Date().toISOString().split('T')[0] },
  { id: 'g3', title: 'Quiz – Trigonometric Identities (10 Qs)', subject: 'maths', durationMinutes: 15, targetMinutes: 15, completed: false, date: new Date().toISOString().split('T')[0] }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Chain Rule Differentiation Steps',
    content: 'When differentiating y = f(g(x)), dy/dx = f\'(g(x)) * g\'(x). Always identify the inner function u = g(x) first, differentiate outer with respect to u, then multiply by du/dx.',
    folder: 'Mathematics',
    tags: ['Calculus', 'Derivatives'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    latexSnippets: ['\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}']
  },
  {
    id: 'n2',
    title: 'Free-Body Diagram Checklist',
    content: '1. Draw object as a box or dot.\n2. Add Gravity vector downwards (mg).\n3. Add Normal force perpendicular to contact surface (N).\n4. Add Friction vector parallel opposing motion (f = μN).\n5. Add applied tension or pushes.',
    folder: 'Physics',
    tags: ['Newton Laws', 'Mechanics'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    latexSnippets: ['\\vec{F}_{net} = m\\vec{a}']
  }
];

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'qr1',
    quizId: 'q-calc-1',
    subject: 'maths',
    topicTitle: 'Calculus & Derivatives',
    score: 4,
    totalQuestions: 5,
    accuracy: 80,
    timeSpentSeconds: 180,
    date: new Date(Date.now() - 86400000).toISOString(),
    weakPoints: ['Quotient rule negative sign']
  },
  {
    id: 'qr2',
    quizId: 'q-trig-1',
    subject: 'maths',
    topicTitle: 'Trigonometry',
    score: 3,
    totalQuestions: 5,
    accuracy: 60,
    timeSpentSeconds: 210,
    date: new Date(Date.now() - 172800000).toISOString(),
    weakPoints: ['Trigonometric Identities substitution', 'Secant & Tangent relations']
  },
  {
    id: 'qr3',
    quizId: 'q-nlm-1',
    subject: 'physics',
    topicTitle: 'Newton\'s Laws',
    score: 5,
    totalQuestions: 5,
    accuracy: 100,
    timeSpentSeconds: 150,
    date: new Date(Date.now() - 259200000).toISOString(),
    weakPoints: []
  }
];

export class StorageRepository {
  static getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  static saveUserProfile(partial: Partial<UserProfile>): UserProfile {
    try {
      const current = this.getUserProfile();
      const updated: UserProfile = { ...current, ...partial };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save profile', e);
      return DEFAULT_USER_PROFILE;
    }
  }

  static getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveConversation(conversation: ChatConversation): void {
    try {
      const list = this.getConversations();
      const idx = list.findIndex(c => c.id === conversation.id);
      if (idx >= 0) {
        list[idx] = conversation;
      } else {
        list.unshift(conversation);
      }
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save conversation', e);
    }
  }

  static getNotes(): Note[] {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  }

  static saveNote(partialNote: Partial<Note>): Note {
    try {
      const list = this.getNotes();
      let savedNote: Note;
      if (partialNote.id) {
        const idx = list.findIndex(n => n.id === partialNote.id);
        savedNote = {
          ...list[idx],
          ...partialNote,
          updatedAt: new Date().toISOString()
        } as Note;
        if (idx >= 0) list[idx] = savedNote;
      } else {
        savedNote = {
          id: `note-${Date.now()}`,
          title: partialNote.title || 'Untitled Note',
          content: partialNote.content || '',
          folder: partialNote.folder || 'Mathematics',
          tags: partialNote.tags || [],
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        list.unshift(savedNote);
      }
      localStorage.setItem(NOTES_KEY, JSON.stringify(list));
      return savedNote;
    } catch {
      return {
        id: `note-${Date.now()}`,
        title: 'Untitled Note',
        content: '',
        folder: 'Mathematics',
        tags: [],
        updatedAt: new Date().toISOString()
      };
    }
  }

  static deleteNote(id: string): Note[] {
    try {
      const list = this.getNotes().filter(n => n.id !== id);
      localStorage.setItem(NOTES_KEY, JSON.stringify(list));
      return list;
    } catch {
      return [];
    }
  }

  static getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(QUIZ_RESULTS_KEY);
      return data ? JSON.parse(data) : INITIAL_QUIZ_RESULTS;
    } catch {
      return INITIAL_QUIZ_RESULTS;
    }
  }

  static saveQuizResult(result: QuizResult): QuizResult[] {
    return this.addQuizResult(result);
  }

  static addQuizResult(result: QuizResult): QuizResult[] {
    try {
      const list = this.getQuizResults();
      list.unshift(result);
      localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(list));
      
      // Update user stats
      const user = this.getUserProfile();
      user.questionsSolved += result.totalQuestions;
      const totalScore = list.reduce((acc, r) => acc + r.score, 0);
      const totalQs = list.reduce((acc, r) => acc + r.totalQuestions, 0);
      user.quizAccuracy = Math.round((totalScore / Math.max(1, totalQs)) * 100);
      this.saveUserProfile(user);

      return list;
    } catch {
      return [];
    }
  }

  static getGoals(): StudyGoal[] {
    return this.getStudyGoals();
  }

  static getStudyGoals(): StudyGoal[] {
    try {
      const data = localStorage.getItem(STUDY_GOALS_KEY);
      return data ? JSON.parse(data) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  }

  static saveGoal(partialGoal: Partial<StudyGoal>): StudyGoal {
    try {
      const list = this.getGoals();
      const newGoal: StudyGoal = {
        id: `g-${Date.now()}`,
        title: partialGoal.title || 'Study Session',
        subject: partialGoal.subject || 'maths',
        durationMinutes: partialGoal.durationMinutes || partialGoal.targetMinutes || 30,
        targetMinutes: partialGoal.targetMinutes || 30,
        completed: false,
        date: partialGoal.dueDate || new Date().toISOString().split('T')[0]
      };
      list.unshift(newGoal);
      localStorage.setItem(STUDY_GOALS_KEY, JSON.stringify(list));
      return newGoal;
    } catch {
      return {
        id: `g-${Date.now()}`,
        title: 'Study Session',
        subject: 'maths',
        durationMinutes: 30,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      };
    }
  }

  static toggleGoal(goalId: string): StudyGoal[] {
    try {
      const list = this.getGoals().map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
      localStorage.setItem(STUDY_GOALS_KEY, JSON.stringify(list));
      return list;
    } catch {
      return [];
    }
  }

  static deleteGoal(goalId: string): StudyGoal[] {
    try {
      const list = this.getGoals().filter(g => g.id !== goalId);
      localStorage.setItem(STUDY_GOALS_KEY, JSON.stringify(list));
      return list;
    } catch {
      return [];
    }
  }

  static getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : ['f-quadratic', 'f-newton2'];
    } catch {
      return ['f-quadratic', 'f-newton2'];
    }
  }

  static toggleBookmark(formulaId: string): string[] {
    try {
      const bookmarks = this.getBookmarks();
      const updated = bookmarks.includes(formulaId)
        ? bookmarks.filter(id => id !== formulaId)
        : [...bookmarks, formulaId];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }

  static getDailyActivity(): Record<string, DailyActivity> {
    try {
      const data = localStorage.getItem(DAILY_ACTIVITY_KEY);
      if (data) return JSON.parse(data);
      const initial = generateInitialDailyActivity();
      localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return generateInitialDailyActivity();
    }
  }

  static saveDailyActivity(activity: DailyActivity): Record<string, DailyActivity> {
    try {
      const all = this.getDailyActivity();
      all[activity.date] = activity;
      localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(all));
      return all;
    } catch {
      return {};
    }
  }

  static toggleDailyGoalMet(date: string): Record<string, DailyActivity> {
    try {
      const all = this.getDailyActivity();
      const current = all[date] || {
        date,
        minutesStudied: 0,
        goalMet: false,
        quizzesCompleted: 0,
        topicsCovered: []
      };

      const newGoalMet = !current.goalMet;
      all[date] = {
        ...current,
        goalMet: newGoalMet,
        minutesStudied: newGoalMet ? Math.max(current.minutesStudied, 35) : Math.min(current.minutesStudied, 15)
      };

      localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(all));

      // Calculate current streak dynamically from today backwards
      const today = new Date();
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        if (all[dStr] && all[dStr].goalMet) {
          streak++;
        } else {
          // If today isn't met yet, check from yesterday before breaking
          if (i === 0) continue;
          break;
        }
      }
      const user = this.getUserProfile();
      user.streakDays = streak;
      this.saveUserProfile(user);

      return all;
    } catch {
      return {};
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(USER_PROFILE_KEY);
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(QUIZ_RESULTS_KEY);
    localStorage.removeItem(STUDY_GOALS_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem(DAILY_ACTIVITY_KEY);
  }
}
