import { auth } from './firebase';
import { FirestoreService, FirestoreStudyProgress } from './firestoreService';

export class ProgressService {
  /**
   * Record or update topic study progress
   */
  static async recordTopicActivity(
    uid: string,
    data: {
      topicId: string;
      subject: string;
      chapter: string;
      topic: string;
      questionsSolved: number;
      correctAnswers: number;
      progressPercentage?: number;
    }
  ): Promise<void> {
    try {
      const existing = await FirestoreService.getStudyProgressList(uid);
      const currentTopic = existing.find((p) => p.topicId === data.topicId);

      const totalSolved = (currentTopic?.questionsSolved || 0) + data.questionsSolved;
      const totalCorrect = (currentTopic?.correctAnswers || 0) + data.correctAnswers;
      const computedPercentage =
        data.progressPercentage !== undefined
          ? data.progressPercentage
          : Math.min(100, Math.round((totalCorrect / (totalSolved || 1)) * 100));

      const updatedProgress: FirestoreStudyProgress = {
        topicId: data.topicId,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        progressPercentage: computedPercentage,
        questionsSolved: totalSolved,
        correctAnswers: totalCorrect,
        lastStudiedAt: new Date().toISOString()
      };

      await FirestoreService.saveStudyProgress(uid, updatedProgress);
    } catch (err) {
      console.warn('Progress update error:', err);
    }
  }

  /**
   * Get all topic study progress records for the user
   */
  static async getUserProgress(): Promise<FirestoreStudyProgress[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    return await FirestoreService.getStudyProgressList(uid);
  }

  /**
   * Calculate aggregated subject progress percentages
   */
  static computeSubjectProgress(
    progressList: FirestoreStudyProgress[]
  ): { mathsProgress: number; physicsProgress: number } {
    const mathsTopics = progressList.filter((p) => p.subject.toLowerCase() === 'maths' || p.subject.toLowerCase() === 'mathematics');
    const physicsTopics = progressList.filter((p) => p.subject.toLowerCase() === 'physics');

    const mathsProgress =
      mathsTopics.length > 0
        ? Math.round(mathsTopics.reduce((acc, curr) => acc + curr.progressPercentage, 0) / mathsTopics.length)
        : 65; // Default initial metric

    const physicsProgress =
      physicsTopics.length > 0
        ? Math.round(physicsTopics.reduce((acc, curr) => acc + curr.progressPercentage, 0) / physicsTopics.length)
        : 80; // Default initial metric

    return { mathsProgress, physicsProgress };
  }
}
