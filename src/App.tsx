import React, { useState, useEffect } from 'react';
import { StorageRepository } from './data/storage';
import { UserProfile, Note, QuizResult, StudyGoal, SubjectType } from './types';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './components/HomeScreen';
import { AITutorScreen } from './components/AITutorScreen';
import { ImageSolverModal } from './components/ImageSolverModal';
import { LearnScreen } from './components/LearnScreen';
import { FormulaLibraryScreen } from './components/FormulaLibraryScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { NotesScreen } from './components/NotesScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { PlannerScreen } from './components/PlannerScreen';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthFlowContainer } from './components/auth/AuthFlowContainer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthService, AuthUser } from './services/authService';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const active = AuthService.getCurrentUser();
    return !!active && active.hasCompletedPersonalization;
  });

  const [user, setUser] = useState<UserProfile>(StorageRepository.getUserProfile());
  const [notes, setNotes] = useState<Note[]>(StorageRepository.getNotes());
  const [bookmarks, setBookmarks] = useState<string[]>(StorageRepository.getBookmarks());
  const [quizResults, setQuizResults] = useState<QuizResult[]>(StorageRepository.getQuizResults());
  const [goals, setGoals] = useState<StudyGoal[]>(StorageRepository.getGoals());

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('maths');
  const [selectedSubView, setSelectedSubView] = useState<'none' | 'formulas' | 'notes' | 'progress' | 'planner'>('none');

  // Modals state
  const [showOnboarding, setShowOnboarding] = useState(!user.hasOnboarded);
  const [showImageSolver, setShowImageSolver] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Cross-component state transfer
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');
  const [practiceTopicTitle, setPracticeTopicTitle] = useState<string>('');

  // Sync dark mode class on html tag
  useEffect(() => {
    if (user.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.darkMode]);

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = AuthService.subscribeAuthState((authUser) => {
      if (authUser && authUser.hasCompletedPersonalization) {
        setIsAuthenticated(true);
        setUser((prev) => ({
          ...prev,
          name: authUser.name,
          avatar: authUser.avatar || prev.avatar,
          learningLevel: (authUser.educationLevel as any) || prev.learningLevel
        }));
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auth Handler
  const handleAuthenticated = (authUser: AuthUser) => {
    const updatedUser = StorageRepository.saveUserProfile({
      name: authUser.name,
      avatar: authUser.avatar || user.avatar,
      learningLevel: (authUser.educationLevel as any) || user.learningLevel
    });
    setUser(updatedUser);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
  };

  // Handler for Profile Update
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const newProfile = StorageRepository.saveUserProfile(updated);
    setUser(newProfile);
  };

  // Onboarding Complete
  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    handleUpdateProfile({
      ...data,
      hasOnboarded: true
    });
    setShowOnboarding(false);
  };

  // Bookmark toggle
  const handleToggleBookmark = (formulaId: string) => {
    const updated = StorageRepository.toggleBookmark(formulaId);
    setBookmarks(updated);
  };

  // Notes
  const handleAddNote = (note: Partial<Note>) => {
    const newNote = StorageRepository.saveNote(note);
    setNotes((prev) => [newNote, ...prev.filter(n => n.id !== newNote.id)]);
  };

  const handleUpdateNote = (note: Note) => {
    const updated = StorageRepository.saveNote(note);
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const handleDeleteNote = (noteId: string) => {
    StorageRepository.deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Quiz Results
  const handleSaveQuizResult = (result: QuizResult) => {
    StorageRepository.saveQuizResult(result);
    setQuizResults(StorageRepository.getQuizResults());
    handleUpdateProfile({
      questionsSolved: user.questionsSolved + result.totalQuestions
    });
  };

  // Goals
  const handleAddGoal = (goal: Partial<StudyGoal>) => {
    const newGoal = StorageRepository.saveGoal(goal);
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleToggleGoal = (goalId: string) => {
    const updated = StorageRepository.toggleGoal(goalId);
    setGoals(updated);
  };

  const handleDeleteGoal = (goalId: string) => {
    StorageRepository.deleteGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  // Reset
  const handleClearData = () => {
    StorageRepository.clearAllData();
    setUser(StorageRepository.getUserProfile());
    setNotes([]);
    setBookmarks([]);
    setQuizResults([]);
    setGoals([]);
  };

  // Navigation Trigger Helpers
  const handleQuickAskAI = (question?: string) => {
    if (question) setAiInitialQuestion(question);
    setActiveTab('aitutor');
    setSelectedSubView('none');
  };

  const handleOpenSubject = (subject: SubjectType) => {
    setActiveSubject(subject);
    setActiveTab('learn');
    setSelectedSubView('none');
  };

  const handleStartQuizForTopic = (topicTitle: string, subject: SubjectType) => {
    setPracticeTopicTitle(topicTitle);
    setActiveSubject(subject);
    setActiveTab('practice');
    setSelectedSubView('none');
  };

  if (!isAuthenticated) {
    return (
      <>
        <OfflineIndicator />
        <AuthFlowContainer onAuthenticated={handleAuthenticated} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Header Bar */}
      <Header
        user={user}
        onOpenSearch={() => setShowSearch(true)}
        onOpenNotifications={() => alert('Notifications: Daily study target active! Keep up your streak.')}
        onToggleDarkMode={() => handleUpdateProfile({ darkMode: !user.darkMode })}
        onOpenProfile={() => {
          setActiveTab('profile');
          setSelectedSubView('none');
        }}
      />

      {/* Main Content Render Area */}
      <main className="py-2">
        {selectedSubView === 'formulas' && (
          <FormulaLibraryScreen
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onAskAIAboutFormula={(formulaTitle) => handleQuickAskAI(`Explain formula: ${formulaTitle}`)}
          />
        )}

        {selectedSubView === 'notes' && (
          <NotesScreen
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {selectedSubView === 'progress' && (
          <ProgressScreen
            user={user}
            quizResults={quizResults}
            onAskAIAboutTopic={(topicTitle) => handleQuickAskAI(`Please explain ${topicTitle}`)}
          />
        )}

        {selectedSubView === 'planner' && (
          <PlannerScreen
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {selectedSubView === 'none' && activeTab === 'home' && (
          <HomeScreen
            user={user}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setSelectedSubView('none');
            }}
            onOpenSubject={handleOpenSubject}
            onQuickAskAI={handleQuickAskAI}
            onOpenImageSolver={() => setShowImageSolver(true)}
            onOpenFormulas={() => setSelectedSubView('formulas')}
            onOpenNotes={() => setSelectedSubView('notes')}
            onOpenQuizGenerator={() => setActiveTab('practice')}
            onOpenPlanner={() => setSelectedSubView('planner')}
          />
        )}

        {selectedSubView === 'none' && activeTab === 'learn' && (
          <LearnScreen
            user={user}
            initialSubject={activeSubject}
            onAskAIAboutTopic={(topicTitle) => handleQuickAskAI(`Please teach me about ${topicTitle}`)}
            onStartQuizForTopic={handleStartQuizForTopic}
          />
        )}

        {selectedSubView === 'none' && activeTab === 'aitutor' && (
          <AITutorScreen
            user={user}
            initialQuestion={aiInitialQuestion}
            onSaveToNotes={handleAddNote}
            onOpenImageSolver={() => setShowImageSolver(true)}
          />
        )}

        {selectedSubView === 'none' && activeTab === 'practice' && (
          <PracticeScreen
            user={user}
            initialTopicTitle={practiceTopicTitle}
            initialSubject={activeSubject}
            onSaveQuizResult={handleSaveQuizResult}
            onAskAIAboutTopic={(topicTitle) => handleQuickAskAI(`Please explain ${topicTitle}`)}
          />
        )}

        {selectedSubView === 'none' && activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onClearData={handleClearData}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedSubView('none');
        }}
      />

      {/* Modals & Drawers */}
      {showOnboarding && (
        <OnboardingModal
          user={user}
          onComplete={handleOnboardingComplete}
        />
      )}

      {showImageSolver && (
        <ImageSolverModal
          user={user}
          onClose={() => setShowImageSolver(false)}
          onSaveToNotes={handleAddNote}
        />
      )}

      {showSearch && (
        <UniversalSearchModal
          notes={notes}
          onClose={() => setShowSearch(false)}
          onSelectTopic={(topicTitle) => {
            setActiveTab('learn');
            setSelectedSubView('none');
          }}
          onAskAI={handleQuickAskAI}
        />
      )}
    </div>
  );
}

export default App;
