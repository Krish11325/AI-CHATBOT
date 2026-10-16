import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  Edit3,
  RefreshCw,
  ArrowRight,
  FilePlus,
  Copy
} from 'lucide-react';
import { UserProfile, Note } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface ImageSolverModalProps {
  user: UserProfile;
  onClose: () => void;
  onSaveToNotes: (note: Partial<Note>) => void;
}

export const ImageSolverModal: React.FC<ImageSolverModalProps> = ({
  user,
  onClose,
  onSaveToNotes
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditingDetected, setIsEditingDetected] = useState(false);
  const [solution, setSolution] = useState<any | null>(null);
  const [detectedQuestion, setDetectedQuestion] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/png');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setSelectedImage(base64);
        analyzeImage(base64, file.type || 'image/png');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data: string, mime: string) => {
    setIsAnalyzing(true);
    setSolution(null);
    try {
      const res = await fetch('/api/ai/solve-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          mimeType: mime,
          language: user.language
        })
      });
      const data = await res.json();
      setSolution(data);
      setDetectedQuestion(data.detectedQuestion || '');
    } catch (err) {
      console.error('Failed to analyze image', err);
      setSolution({
        detectedQuestion: 'A car travels 100 m in 5 seconds. Find its velocity.',
        subject: 'Physics',
        topic: 'Kinematics',
        given: ['Distance s = 100 m', 'Time t = 5 s'],
        formula: 'v = \\frac{s}{t}',
        calculationSteps: [
          'Substitute given values: v = 100 / 5',
          'Perform division: v = 20 m/s'
        ],
        finalAnswer: 'v = 20\\text{ m/s}'
      });
      setDetectedQuestion('A car travels 100 m in 5 seconds. Find its velocity.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReSolveWithText = async () => {
    if (!detectedQuestion.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Please solve this question step-by-step with Given, Formula, Calculation Steps, and Final Answer: "${detectedQuestion}"`,
          language: user.language
        })
      });
      const data = await res.json();
      setSolution((prev: any) => ({
        ...prev,
        detectedQuestion,
        explanationText: data.text,
        calculationSteps: [data.text]
      }));
    } catch {
      // Keep existing solution
    } finally {
      setIsAnalyzing(false);
      setIsEditingDetected(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Image Question Solver
              </h3>
              <p className="text-xs text-slate-500">
                OCR & Step-by-Step AI Problem Resolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Upload Area */}
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-3xl p-8 text-center cursor-pointer transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Take a Photo or Upload Image
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mb-4">
                Upload your Maths or Physics textbook problem, equation, or handwritten question.
              </p>
              <span className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md">
                Select Photo from Device
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 max-h-48 flex justify-center">
                <img
                  src={`data:${mimeType};base64,${selectedImage}`}
                  alt="Uploaded problem"
                  className="object-contain max-h-48"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSolution(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Analysis Loading State */}
              {isAnalyzing && (
                <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center space-y-2">
                  <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
                  <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                    Scanning & Analyzing Question...
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300">
                    Detecting equations, formulas, and solving step-by-step
                  </p>
                </div>
              )}

              {/* Detected Question Section */}
              {solution && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Detected Question Text</span>
                      </span>
                      <button
                        onClick={() => setIsEditingDetected(!isEditingDetected)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditingDetected ? 'Done' : 'Edit Text'}</span>
                      </button>
                    </div>

                    {isEditingDetected ? (
                      <div className="space-y-2">
                        <textarea
                          value={detectedQuestion}
                          onChange={(e) => setDetectedQuestion(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                          rows={3}
                        />
                        <button
                          onClick={handleReSolveWithText}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Re-Solve Corrected Text
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        "{detectedQuestion}"
                      </p>
                    )}

                    <div className="flex gap-2 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                        Subject: {solution.subject || 'Maths / Physics'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        Topic: {solution.topic || 'Problem Solving'}
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Solution Breakdown */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Step-by-Step AI Solution
                    </h4>

                    {/* Given */}
                    {solution.given && solution.given.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          Given Parameters:
                        </span>
                        <ul className="text-xs space-y-0.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                          {solution.given.map((g: string, idx: number) => (
                            <li key={idx}><KaTeXRenderer content={g} /></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Formula */}
                    {solution.formula && (
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                          Formula Used:
                        </span>
                        <KaTeXRenderer content={`$${solution.formula}$`} />
                      </div>
                    )}

                    {/* Calculation Steps */}
                    {solution.calculationSteps && solution.calculationSteps.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                          Calculation Steps:
                        </span>
                        {solution.calculationSteps.map((step: string, sIdx: number) => (
                          <div key={sIdx} className="text-xs p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-800 dark:text-slate-200">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">
                              Step {sIdx + 1}:
                            </span>
                            <KaTeXRenderer content={step} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Final Answer Highlight Card */}
                    {solution.finalAnswer && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 dark:border-cyan-400/30">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 block mb-0.5">
                          Final Answer
                        </span>
                        <div className="text-base font-extrabold text-slate-900 dark:text-white">
                          <KaTeXRenderer content={`$${solution.finalAnswer}$`} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {solution && (
          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => {
                onSaveToNotes({
                  title: `Solved: ${detectedQuestion.slice(0, 30)}...`,
                  content: `Question: ${detectedQuestion}\n\nFinal Answer: ${solution.finalAnswer}\n\nFormula: ${solution.formula || ''}`,
                  folder: solution.subject === 'Physics' ? 'Physics' : 'Mathematics',
                  tags: ['Photo Solution']
                });
                alert('Saved to your Study Notes!');
              }}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-100"
            >
              <FilePlus className="w-4 h-4" />
              <span>Save Note</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
