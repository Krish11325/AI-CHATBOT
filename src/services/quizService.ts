import { auth } from './firebase';
import { FirestoreService, FirestoreQuizResult } from './firestoreService';
import { ProgressService } from './progressService';

export class QuizService {
  /**
   * Save quiz completion result to Firestore and update study progress
   */
  static async submitQuizResult(data: {
    subject: string;
    topic: string;
    difficulty: string;
    totalQuestions: number;
    correctAnswers: number;
  }): Promise<FirestoreQuizResult> {
    const uid = auth.currentUser?.uid;
    const score = Math.round((data.correctAnswers / (data.totalQuestions || 1)) * 100);
    const quizId = `quiz_${Date.now()}`;

    const quizResult: FirestoreQuizResult = {
      quizId,
      subject: data.subject,
      topic: data.topic,
      difficulty: data.difficulty,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
      score,
      completedAt: new Date().toISOString()
    };

    if (uid) {
      try {
        // Save to users/{uid}/quizResults/{quizId}
        await FirestoreService.saveQuizResult(uid, quizResult);

        // Calculate and update studyProgress/{topicId}
        const topicId = `${data.subject.toLowerCase()}_${data.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        await ProgressService.recordTopicActivity(uid, {
          topicId,
          subject: data.subject,
          chapter: 'Practice Chapter',
          topic: data.topic,
          questionsSolved: data.totalQuestions,
          correctAnswers: data.correctAnswers,
          progressPercentage: score
        });
      } catch (err) {
        console.warn('Firestore quiz submission fallback:', err);
      }
    }

    return quizResult;
  }

  /**
   * Fetch historical quiz results
   */
  static async getQuizHistory(): Promise<FirestoreQuizResult[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    return await FirestoreService.getQuizResults(uid);
  }
}
