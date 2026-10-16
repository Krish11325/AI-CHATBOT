import { GoogleGenAI, Type } from '@google/genai';
import { StructuredSolution } from '../types';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export const AI_TUTOR_SYSTEM_INSTRUCTION = `
You are StudyMate AI, a patient, highly knowledgeable personal tutor specializing in Mathematics and Physics for school, high school, and college/competitive exam students.

Key Directives:
1. Always act as an encouraging, step-by-step educational guide.
2. Structure numerical / problem-solving questions strictly into structured sections:
   - Given parameters
   - Formula needed
   - Calculation steps (Step 1, Step 2, Step 3...)
   - Final Answer (highlighted with exact units for Physics)
3. For conceptual questions:
   - Definition -> Simple Explanation -> Real-world Example -> Key Takeaway.
4. Always write mathematical equations using standard LaTeX formatting enclosed in dollar signs, e.g., $v = u + at$ or $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.
5. Preserve units in Physics calculations (e.g., m/s, kg, Joules, Newtons, Volts).
6. Language Support: If requested in Tamil, provide the explanations and steps in clear, standard Tamil while keeping equations, mathematical variables, and scientific symbols cleanly in LaTeX format.
7. Never invent fake values or incorrect formulas.
`;

export async function askAITutor(prompt: string, language: 'en' | 'ta' = 'en', topicContext?: string) {
  const ai = getGenAI();
  const langPrompt = language === 'ta' 
    ? 'Please respond in Tamil (தமிழ்) while maintaining LaTeX formatting for all mathematical equations and formulas.'
    : 'Respond in clear English.';

  const fullPrompt = `${topicContext ? `[Context Topic: ${topicContext}]\n` : ''}${prompt}\n\n${langPrompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: fullPrompt,
    config: {
      systemInstruction: AI_TUTOR_SYSTEM_INSTRUCTION,
      temperature: 0.2
    }
  });

  const text = response.text || 'I apologize, I could not generate an answer at this moment. Please try rephrasing your question.';
  
  // Try parsing structured parts from response text if present or construct them
  const structured = extractStructuredSolution(text);

  return {
    text,
    structuredSolution: structured
  };
}

export async function generateSocraticHint(prompt: string, currentHintLevel: number, studentResponse?: string, language: 'en' | 'ta' = 'en') {
  const ai = getGenAI();
  
  const hintInstruction = `
You are running in Socratic Hint Mode.
DO NOT provide the final numerical answer or full solution right away!
Your goal is to guide the student step-by-step to arrive at the solution themselves.

Current Level:
- Level 1: Give a small conceptual clue or ask what variable we need to solve for.
- Level 2: Suggest the relevant formula or relation without calculating.
- Level 3: Provide the first calculation setup step and ask the student to perform the arithmetic.
- Level 4: Reveal the full step-by-step solution.

Language: ${language === 'ta' ? 'Tamil' : 'English'}. Use LaTeX for formulas.
`;

  const inputMsg = studentResponse 
    ? `Original Question: "${prompt}"\nStudent's Answer/Attempt: "${studentResponse}"\nProvide the next guidance or hint (Level ${currentHintLevel}).`
    : `Question: "${prompt}"\nProvide Hint Level ${currentHintLevel}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: inputMsg,
    config: {
      systemInstruction: hintInstruction,
      temperature: 0.3
    }
  });

  return response.text || 'Think about the basic formula relating these physical quantities.';
}

export async function solveQuestionFromImage(base64Data: string, mimeType: string, language: 'en' | 'ta' = 'en') {
  const ai = getGenAI();

  const prompt = `
Analyze the uploaded image containing a Mathematics or Physics problem.
1. Transcribe the exact question text from the image accurately.
2. Identify the subject (Mathematics or Physics) and the topic.
3. Solve the problem step-by-step with Given, Formula, Calculation Steps, and Final Answer.
4. Output in JSON format.

Language: ${language === 'ta' ? 'Tamil' : 'English'}.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: base64Data
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedQuestion: { type: Type.STRING, description: 'Transcribed question text from image' },
          subject: { type: Type.STRING, description: 'Mathematics or Physics' },
          topic: { type: Type.STRING, description: 'Topic category' },
          given: { type: Type.ARRAY, items: { type: Type.STRING } },
          formula: { type: Type.STRING },
          calculationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          finalAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ['detectedQuestion', 'subject', 'topic', 'calculationSteps', 'finalAnswer']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch {
    return {
      detectedQuestion: 'Could not extract question text from image clearly.',
      subject: 'Mathematics / Physics',
      topic: 'Problem Solving',
      calculationSteps: ['Please ensure image is clear and well lit.'],
      finalAnswer: 'N/A'
    };
  }
}

export async function generateCustomQuiz(subject: 'maths' | 'physics', topic: string, difficulty: 'easy' | 'medium' | 'hard', questionCount: number = 5, language: 'en' | 'ta' = 'en') {
  const ai = getGenAI();

  const prompt = `
Generate a ${difficulty} difficulty quiz for ${subject.toUpperCase()} on topic: "${topic}".
Total questions: ${questionCount}.
Language: ${language === 'ta' ? 'Tamil' : 'English'}.

Include a mix of Multiple Choice questions with 4 options each, correct answer index (0-3), and detailed educational explanations with LaTeX formulas.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                type: { type: Type.STRING, description: 'mcq' },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: 'Index 0 to 3' },
                explanation: { type: Type.STRING },
                hint: { type: Type.STRING }
              },
              required: ['id', 'question', 'options', 'correctAnswer', 'explanation']
            }
          }
        },
        required: ['questions']
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data.questions || [];
  } catch {
    return [];
  }
}

function extractStructuredSolution(text: string): StructuredSolution | undefined {
  const givenMatch = text.match(/Given:?([\s\S]*?)(?=Formula:?|Step 1|Calculation:?|Final Answer:?|$)/i);
  const formulaMatch = text.match(/Formula:?([\s\S]*?)(?=Step 1|Calculation:?|Final Answer:?|$)/i);
  const finalMatch = text.match(/Final Answer:?([\s\S]*?)$/i);

  if (givenMatch || formulaMatch || finalMatch) {
    const givens = givenMatch 
      ? givenMatch[1].trim().split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
      : undefined;

    return {
      given: givens,
      formula: formulaMatch ? formulaMatch[1].trim() : undefined,
      finalAnswer: finalMatch ? finalMatch[1].trim() : undefined,
      explanationText: text
    };
  }

  return undefined;
}
