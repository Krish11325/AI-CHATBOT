import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Camera,
  Mic,
  MicOff,
  Lightbulb,
  Copy,
  Check,
  FilePlus
} from 'lucide-react';
import { ChatMessage, UserProfile, Note } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface AITutorScreenProps {
  user: UserProfile;
  initialQuestion?: string;
  onSaveToNotes: (note: Partial<Note>) => void;
  onOpenImageSolver: () => void;
}

export const AITutorScreen: React.FC<AITutorScreenProps> = ({
  user,
  initialQuestion,
  onSaveToNotes,
  onOpenImageSolver
}) => {
  const [activeMode, setActiveMode] = useState<'standard' | 'hint'>('standard');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState(initialQuestion || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = user.language === 'ta'
        ? 'வணக்கம்! நான் StudyMate AI. கணிதம் மற்றும் இயற்பியல் கேள்விகள் அல்லது படங்களை அனுப்பவும். நான் உங்களுக்கு படிப்படியாக விளக்க தயாராக உள்ளேன்.'
        : 'Hello! I am your StudyMate AI Tutor. Ask me any Maths or Physics question, upload a problem photo, or switch to Socratic Hint Mode for guided step-by-step learning!';

      setMessages([
        {
          id: 'm-welcome',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: user.language
        }
      ]);
    }
  }, [user.language]);

  // Handle initial preset question if passed
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion.trim());
    }
  }, [initialQuestion]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: user.language
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsGenerating(true);

    try {
      if (activeMode === 'hint') {
        const res = await fetch('/api/ai/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            currentHintLevel: 1,
            language: user.language
          })
        });
        const data = await res.json();

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.hintText || 'Think about the core formula relating velocity, distance, and time.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          currentHintLevel: 1,
          socraticHints: {
            hint1: data.hintText,
            hint2: 'Formula hint',
            hint3: 'Calculation setup hint',
            fullSolution: 'Full solution revealed.'
          }
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            language: user.language
          })
        });
        const data = await res.json();

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          structuredSolution: data.structuredSolution,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: user.language
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Failed to get response', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I apologize, I encountered a temporary connection issue. Please verify your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextHintLevel = async (msg: ChatMessage, targetLevel: number) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: msg.text,
          currentHintLevel: targetLevel,
          language: user.language
        })
      });
      const data = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                currentHintLevel: targetLevel,
                text: `${m.text}\n\n**Hint Level ${targetLevel}:**\n${data.hintText}`
              }
            : m
        )
      );
    } catch {
      // Fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = async (msg: ChatMessage, actionType: 'simpler' | 'example' | 'practice') => {
    let prompt = '';
    if (actionType === 'simpler') prompt = `Please explain this concept even simpler: ${msg.text.slice(0, 150)}`;
    if (actionType === 'example') prompt = `Give me another solved example for: ${msg.text.slice(0, 150)}`;
    if (actionType === 'practice') prompt = `Give me a practice problem to solve based on: ${msg.text.slice(0, 150)}`;

    handleSendMessage(prompt);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveNote = (msg: ChatMessage) => {
    onSaveToNotes({
      title: msg.text.slice(0, 40) + '...',
      content: msg.text,
      folder: msg.text.toLowerCase().includes('physics') ? 'Physics' : 'Mathematics',
      tags: ['AI Tutor Response']
    });
    setSavedNoteId(msg.id);
    setTimeout(() => setSavedNoteId(null), 2000);
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser environment. You can type or upload an image question!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = user.language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) setInputText(transcript);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto px-4 pt-1 pb-16 bg-[#F7F2E8] dark:bg-[#211C18]">
      {/* Mode Selector Header */}
      <div className="flex items-center justify-between p-1.5 mb-3 bg-[#FCFAF5] dark:bg-[#302822] rounded-2xl border border-[#E8DCC8] dark:border-[#423730] shadow-xs">
        <div className="flex space-x-1 w-full">
          <button
            onClick={() => setActiveMode('standard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'standard'
                ? 'bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] shadow-xs'
                : 'text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Solution Mode</span>
          </button>

          <button
            onClick={() => setActiveMode('hint')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'hint'
                ? 'bg-[#B9785F] text-[#FCFAF5] shadow-xs'
                : 'text-[#75685C] dark:text-[#BFB2A4] hover:text-[#3B3028] dark:hover:text-[#F5EBDD]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Socratic Hint Mode</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center space-x-2 text-[10px] font-semibold text-[#75685C] dark:text-[#BFB2A4] px-1">
                <span>{isUser ? 'You' : 'StudyMate AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-[20px] p-4 shadow-xs ${
                  isUser
                    ? 'bg-[#3B3028] text-[#FCFAF5] rounded-br-none'
                    : 'bg-[#FCFAF5] dark:bg-[#302822] border border-[#E8DCC8] dark:border-[#423730] text-[#29231F] dark:text-[#F5EBDD] rounded-bl-none'
                }`}
              >
                {/* Formatted LaTeX Math Content */}
                <KaTeXRenderer content={msg.text} />

                {/* Special Numerical Answer Result Card */}
                {msg.structuredSolution?.finalAnswer && !isUser && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#B9785F]/10 border border-[#B9785F]/30 dark:border-[#C99A7B]/40">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B9785F] dark:text-[#C99A7B] block mb-1">
                      🎯 Final Answer
                    </span>
                    <div className="text-sm font-extrabold text-[#3B3028] dark:text-[#F5EBDD]">
                      <KaTeXRenderer content={`$${msg.structuredSolution.finalAnswer}$`} />
                    </div>
                  </div>
                )}

                {/* Socratic Hint Controls */}
                {msg.socraticHints && !isUser && (
                  <div className="mt-4 pt-3 border-t border-[#E8DCC8] dark:border-[#423730] space-y-2">
                    <span className="text-[11px] font-bold text-[#B9785F] dark:text-[#C99A7B] flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Socratic Guidance Levels</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleNextHintLevel(msg, 2)}
                        disabled={(msg.currentHintLevel || 1) >= 2}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] disabled:opacity-40"
                      >
                        Hint 2: Formula
                      </button>
                      <button
                        onClick={() => handleNextHintLevel(msg, 3)}
                        disabled={(msg.currentHintLevel || 1) >= 3}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#E8DCC8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#C99A7B] border border-[#D8C3A5] dark:border-[#423730] disabled:opacity-40"
                      >
                        Hint 3: Calculation Setup
                      </button>
                      <button
                        onClick={() => handleNextHintLevel(msg, 4)}
                        disabled={(msg.currentHintLevel || 1) >= 4}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] disabled:opacity-40"
                      >
                        Show Full Solution
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar for AI responses */}
              {!isUser && (
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#75685C] dark:text-[#BFB2A4] pt-1">
                  <button
                    onClick={() => handleAction(msg, 'simpler')}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] transition-colors font-medium"
                  >
                    <span>💡 Explain Simpler</span>
                  </button>
                  <button
                    onClick={() => handleAction(msg, 'example')}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] transition-colors font-medium"
                  >
                    <span>📝 Another Example</span>
                  </button>
                  <button
                    onClick={() => handleAction(msg, 'practice')}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] transition-colors font-medium"
                  >
                    <span>🎯 Practice Similar</span>
                  </button>
                  <button
                    onClick={() => handleSaveNote(msg)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] transition-colors font-medium"
                  >
                    {savedNoteId === msg.id ? <Check className="w-3.5 h-3.5 text-[#87917A]" /> : <FilePlus className="w-3.5 h-3.5" />}
                    <span>{savedNoteId === msg.id ? 'Saved' : 'Save Note'}</span>
                  </button>
                  <button
                    onClick={() => handleCopyText(msg.text, msg.id)}
                    className="p-1.5 rounded-lg hover:bg-[#E8DCC8]/50 dark:hover:bg-[#302822] transition-colors"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#87917A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center space-x-2 text-[#3B3028] dark:text-[#C99A7B] p-3 bg-[#E8DCC8]/50 dark:bg-[#302822] border border-[#D8C3A5] dark:border-[#423730] rounded-2xl w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-[#B9785F]" />
            <span className="text-xs font-bold">StudyMate AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock */}
      <div className="sticky bottom-0 mt-2 bg-[#FCFAF5] dark:bg-[#302822] p-2.5 rounded-2xl border border-[#E8DCC8] dark:border-[#423730] shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={onOpenImageSolver}
            className="p-2.5 text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#211C18] rounded-xl transition-colors"
            title="Scan or upload problem image"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording
                ? 'bg-[#B9785F] text-[#FCFAF5] animate-pulse'
                : 'text-[#75685C] hover:text-[#3B3028] dark:hover:text-[#F5EBDD] hover:bg-[#E8DCC8]/60 dark:hover:bg-[#211C18]'
            }`}
            title="Voice input"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeMode === 'hint'
                ? 'Ask for a hint on a problem...'
                : user.language === 'ta'
                ? 'கணிதம் அல்லது இயற்பியல் கேள்வியை கேட்க...'
                : 'Type Maths or Physics problem...'
            }
            className="flex-1 text-xs bg-[#F7F2E8] dark:bg-[#211C18] text-[#3B3028] dark:text-[#F5EBDD] placeholder-[#75685C]/60 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B3028] dark:focus:ring-[#C99A7B]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="p-2.5 bg-[#3B3028] dark:bg-[#C99A7B] text-[#FCFAF5] dark:text-[#211C18] hover:bg-[#29231F] disabled:opacity-40 font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Send className="w-4 h-4 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
