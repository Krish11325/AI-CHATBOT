import { auth } from './firebase';
import { FirestoreService } from './firestoreService';

export interface AISolution {
  topicTitle: string;
  subject: 'maths' | 'physics';
  explanationSteps: { stepNumber: number; title: string; content: string }[];
  finalAnswer: string;
  conceptSummary: string;
  keyFormulas?: string[];
}

export class AIService {
  /**
   * Ask AI Tutor a question, receive structured response, and persist conversation to Firestore
   */
  static async askAITutor(
    prompt: string,
    language: 'en' | 'ta' = 'en',
    topicContext?: string,
    conversationId?: string,
    imageUrl?: string
  ): Promise<{ solution: AISolution; conversationId: string }> {
    const uid = auth.currentUser?.uid;

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, topicContext })
    });

    if (!response.ok) {
      throw new Error('AI Tutor server endpoint error');
    }

    const data = await response.json();
    const solution: AISolution = data.solution || data;

    // Persist to Firestore if user is authenticated
    const activeConvId = conversationId || `conv_${Date.now()}`;

    if (uid) {
      try {
        // Save/Update Conversation Metadata
        await FirestoreService.saveConversation(uid, {
          conversationId: activeConvId,
          title: solution.topicTitle || prompt.slice(0, 40) + '...',
          subject: solution.subject || 'maths',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Save User Message
        const userMsgId = `msg_user_${Date.now()}`;
        await FirestoreService.saveMessage(uid, activeConvId, {
          messageId: userMsgId,
          role: 'user',
          content: prompt,
          imageUrl: imageUrl || undefined,
          createdAt: new Date().toISOString()
        });

        // Save AI Model Message
        const aiMsgId = `msg_ai_${Date.now()}`;
        await FirestoreService.saveMessage(uid, activeConvId, {
          messageId: aiMsgId,
          role: 'model',
          content: JSON.stringify(solution),
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Firestore conversation persistence fallback:', err);
      }
    }

    return { solution, conversationId: activeConvId };
  }

  /**
   * Generate Socratic Hint
   */
  static async generateSocraticHint(
    prompt: string,
    currentHintLevel: number,
    studentResponse?: string,
    language: 'en' | 'ta' = 'en'
  ): Promise<string> {
    const response = await fetch('/api/ai/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, currentHintLevel, studentResponse, language })
    });

    if (!response.ok) {
      throw new Error('Socratic Hint endpoint error');
    }

    const data = await response.json();
    return data.hintText;
  }

  /**
   * Solve Question from Image Upload
   */
  static async solveQuestionFromImage(
    base64Data: string,
    mimeType: string = 'image/png',
    language: 'en' | 'ta' = 'en',
    imageUrl?: string
  ): Promise<AISolution> {
    const uid = auth.currentUser?.uid;

    const response = await fetch('/api/ai/solve-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data, mimeType, language })
    });

    if (!response.ok) {
      throw new Error('Image question solver endpoint error');
    }

    const data = await response.json();
    const solution: AISolution = data.solution || data;

    if (uid) {
      try {
        const convId = `img_conv_${Date.now()}`;
        await FirestoreService.saveConversation(uid, {
          conversationId: convId,
          title: `Photo Problem: ${solution.topicTitle || 'Maths/Physics Problem'}`,
          subject: solution.subject || 'maths',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await FirestoreService.saveMessage(uid, convId, {
          messageId: `msg_user_${Date.now()}`,
          role: 'user',
          content: 'Solved uploaded question image',
          imageUrl: imageUrl || undefined,
          createdAt: new Date().toISOString()
        });

        await FirestoreService.saveMessage(uid, convId, {
          messageId: `msg_ai_${Date.now()}`,
          role: 'model',
          content: JSON.stringify(solution),
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Image question conversation persistence fallback:', err);
      }
    }

    return solution;
  }

  /**
   * AI Custom Quiz Generator
   */
  static async generateCustomQuiz(
    subject: string,
    topic: string,
    difficulty: string,
    questionCount: number = 5,
    language: 'en' | 'ta' = 'en'
  ) {
    const response = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, difficulty, questionCount, language })
    });

    if (!response.ok) {
      throw new Error('AI Quiz Generator endpoint error');
    }

    const data = await response.json();
    return data.questions;
  }
}
