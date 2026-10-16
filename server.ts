import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  askAITutor,
  generateSocraticHint,
  solveQuestionFromImage,
  generateCustomQuiz
} from './src/server/aiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Tutor Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { prompt, language, topicContext } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      const result = await askAITutor(prompt, language || 'en', topicContext);
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/ai/chat:', err);
      res.status(500).json({
        error: 'Failed to process AI response',
        details: err?.message || 'Unknown error'
      });
    }
  });

  // Socratic Hint Mode Endpoint
  app.post('/api/ai/hint', async (req, res) => {
    try {
      const { prompt, currentHintLevel, studentResponse, language } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      const hintText = await generateSocraticHint(
        prompt,
        currentHintLevel || 1,
        studentResponse,
        language || 'en'
      );
      res.json({ hintText });
    } catch (err: any) {
      console.error('Error in /api/ai/hint:', err);
      res.status(500).json({ error: 'Failed to generate hint', details: err?.message });
    }
  });

  // Image Question Solver Endpoint
  app.post('/api/ai/solve-image', async (req, res) => {
    try {
      const { base64Data, mimeType, language } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'Image data is required' });
      }
      const result = await solveQuestionFromImage(base64Data, mimeType || 'image/png', language || 'en');
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/ai/solve-image:', err);
      res.status(500).json({ error: 'Failed to analyze image question', details: err?.message });
    }
  });

  // AI Quiz Generator Endpoint
  app.post('/api/ai/generate-quiz', async (req, res) => {
    try {
      const { subject, topic, difficulty, questionCount, language } = req.body;
      const questions = await generateCustomQuiz(
        subject || 'maths',
        topic || 'General Problem Solving',
        difficulty || 'medium',
        questionCount || 5,
        language || 'en'
      );
      res.json({ questions });
    } catch (err: any) {
      console.error('Error in /api/ai/generate-quiz:', err);
      res.status(500).json({ error: 'Failed to generate quiz', details: err?.message });
    }
  });

  // Vite Middleware in Dev or Static serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
