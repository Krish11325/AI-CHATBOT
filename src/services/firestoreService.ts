import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export interface FirestoreUserProfile {
  name: string;
  email: string;
  profileImage?: string;
  educationLevel?: string;
  preferredLanguage?: string;
  dailyStudyGoal?: number;
  selectedSubjects?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

export interface FirestoreStudyProgress {
  topicId: string;
  subject: string;
  chapter: string;
  topic: string;
  progressPercentage: number;
  questionsSolved: number;
  correctAnswers: number;
  lastStudiedAt: string;
}

export interface FirestoreQuizResult {
  quizId: string;
  subject: string;
  topic: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
}

export interface FirestoreNote {
  noteId: string;
  title: string;
  content: string;
  subject: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreBookmark {
  bookmarkId: string;
  type: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
}

export interface FirestoreConversation {
  conversationId: string;
  title: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreMessage {
  messageId: string;
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export class FirestoreService {
  // --- USER PROFILE ---
  static async createUserProfile(uid: string, profile: FirestoreUserProfile): Promise<void> {
    const path = `users/${uid}`;
    try {
      await setDoc(doc(db, path), {
        ...profile,
        createdAt: profile.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getUserProfile(uid: string): Promise<FirestoreUserProfile | null> {
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(db, path));
      if (snap.exists()) {
        return snap.data() as FirestoreUserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  }

  static async updateUserProfile(uid: string, updates: Partial<FirestoreUserProfile>): Promise<void> {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, path), {
        ...updates,
        lastLoginAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  // --- STUDY PROGRESS ---
  static async saveStudyProgress(uid: string, progress: FirestoreStudyProgress): Promise<void> {
    const path = `users/${uid}/studyProgress/${progress.topicId}`;
    try {
      await setDoc(doc(db, path), {
        ...progress,
        lastStudiedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getStudyProgressList(uid: string): Promise<FirestoreStudyProgress[]> {
    const path = `users/${uid}/studyProgress`;
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ ...d.data(), topicId: d.id } as FirestoreStudyProgress));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  // --- QUIZ RESULTS ---
  static async saveQuizResult(uid: string, result: FirestoreQuizResult): Promise<void> {
    const path = `users/${uid}/quizResults/${result.quizId}`;
    try {
      await setDoc(doc(db, path), {
        ...result,
        completedAt: result.completedAt || new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getQuizResults(uid: string): Promise<FirestoreQuizResult[]> {
    const path = `users/${uid}/quizResults`;
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ ...d.data(), quizId: d.id } as FirestoreQuizResult));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  // --- NOTES ---
  static async saveNote(uid: string, note: FirestoreNote): Promise<void> {
    const path = `users/${uid}/notes/${note.noteId}`;
    try {
      await setDoc(doc(db, path), {
        ...note,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getNotes(uid: string): Promise<FirestoreNote[]> {
    const path = `users/${uid}/notes`;
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ ...d.data(), noteId: d.id } as FirestoreNote));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  static async deleteNote(uid: string, noteId: string): Promise<void> {
    const path = `users/${uid}/notes/${noteId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  // --- BOOKMARKS ---
  static async saveBookmark(uid: string, bookmark: FirestoreBookmark): Promise<void> {
    const path = `users/${uid}/bookmarks/${bookmark.bookmarkId}`;
    try {
      await setDoc(doc(db, path), bookmark, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getBookmarks(uid: string): Promise<FirestoreBookmark[]> {
    const path = `users/${uid}/bookmarks`;
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => ({ ...d.data(), bookmarkId: d.id } as FirestoreBookmark));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  static async deleteBookmark(uid: string, bookmarkId: string): Promise<void> {
    const path = `users/${uid}/bookmarks/${bookmarkId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  // --- CONVERSATIONS & MESSAGES ---
  static async saveConversation(uid: string, conv: FirestoreConversation): Promise<void> {
    const path = `users/${uid}/conversations/${conv.conversationId}`;
    try {
      await setDoc(doc(db, path), {
        ...conv,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async saveMessage(uid: string, conversationId: string, message: FirestoreMessage): Promise<void> {
    const path = `users/${uid}/conversations/${conversationId}/messages/${message.messageId}`;
    try {
      await setDoc(doc(db, path), message);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async getMessages(uid: string, conversationId: string): Promise<FirestoreMessage[]> {
    const path = `users/${uid}/conversations/${conversationId}/messages`;
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs
        .map((d) => ({ ...d.data(), messageId: d.id } as FirestoreMessage))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
}
