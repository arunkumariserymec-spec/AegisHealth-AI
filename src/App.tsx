/**
 * AegisHealth AI (Smart Care. Better Lives.)
 * Main Application Component
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, SupportedLanguage, AssessmentResult, SavedAssessmentSession, ExtractedSymptom } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DisclaimerModal } from './components/DisclaimerModal';
import { SOSModal } from './components/SOSModal';
import { AuthModal } from './components/AuthModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ResumeSessionBanner } from './components/ResumeSessionBanner';
import { SaveSessionModal } from './components/SaveSessionModal';

import { HomeView } from './views/HomeView';
import { ChatSymptomCheckerView } from './views/ChatSymptomCheckerView';
import { BodyMapView } from './views/BodyMapView';
import { ResultsView } from './views/ResultsView';
import { DoctorFinderView } from './views/DoctorFinderView';
import { HistoryView } from './views/HistoryView';
import { AdminView } from './views/AdminView';
import { ProfileView } from './views/ProfileView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { MASTER_SYMPTOMS } from '../shared/constants/symptoms_data';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  hasRestorableSession,
  isSessionDismissed,
  markSessionDismissed
} from './services/sessionStorageService';

export default function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'desktop' | 'mobile'>('responsive');
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Shared Patient Assessment Symptoms State
  const [collectedSymptoms, setCollectedSymptoms] = useState<ExtractedSymptom[]>([
    { id: 'fever', name: 'Fever / High Temperature', severity: 'moderate' }
  ]);

  // User state
  const [user, setUser] = useState<User | null>({
    id: 'guest',
    name: 'Guest User',
    email: '',
    role: 'guest',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString()
  });

  // Current assessment state
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);

  // Session state & banner
  const [restorableSession, setRestorableSession] = useState<SavedAssessmentSession | null>(null);
  const [isSaveSessionOpen, setIsSaveSessionOpen] = useState(false);

  // Modal states
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Load auth token & check for restorable assessment session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('ai_health_token');
    const savedUser = localStorage.getItem('ai_health_user');
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.preferredLanguage) {
          setLanguage(parsed.preferredLanguage);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Check if there is an in-progress session to restore
    if (hasRestorableSession()) {
      const active = getActiveSession();
      if (active && !isSessionDismissed(active.id)) {
        setRestorableSession(active);
      }
    }
  }, []);

  // Continuous Auto-Save Handler for symptom assessment state
  const saveTimeoutRef = useRef<any>(null);
  useEffect(() => {
    // Only auto-save if in an active triage view or symptoms are present
    if (collectedSymptoms.length > 0 || currentAssessment || activeView === 'checker' || activeView === 'bodymap' || activeView === 'results') {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveActiveSession({
          userId: user?.id || 'guest',
          activeView,
          collectedSymptoms,
          currentAssessment: currentAssessment || undefined,
          isAutoSaved: true
        });
      }, 600);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [collectedSymptoms, activeView, currentAssessment, user]);

  // Synchronous beforeunload and visibilitychange session persistence
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (collectedSymptoms.length > 0 || currentAssessment) {
        saveActiveSession({
          userId: user?.id || 'guest',
          activeView,
          collectedSymptoms,
          currentAssessment: currentAssessment || undefined,
          isAutoSaved: true
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleBeforeUnload);
    };
  }, [collectedSymptoms, activeView, currentAssessment, user]);

  const handleResumeSession = (session: SavedAssessmentSession) => {
    if (session.collectedSymptoms && session.collectedSymptoms.length > 0) {
      setCollectedSymptoms(session.collectedSymptoms);
    }
    if (session.currentAssessment) {
      setCurrentAssessment(session.currentAssessment);
    }
    if (session.activeView) {
      setActiveView(session.activeView);
    } else {
      setActiveView(session.currentAssessment ? 'results' : 'checker');
    }
    markSessionDismissed(session.id);
    setRestorableSession(null);
  };

  const handleDismissBanner = () => {
    if (restorableSession) {
      markSessionDismissed(restorableSession.id);
    }
    setRestorableSession(null);
  };

  const handleClearSession = () => {
    clearActiveSession();
    setCollectedSymptoms([]);
    setCurrentAssessment(null);
    if (restorableSession) {
      markSessionDismissed(restorableSession.id);
    }
    setRestorableSession(null);
  };

  const handleLoginSuccess = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('ai_health_token', token);
    localStorage.setItem('ai_health_user', JSON.stringify(newUser));
    if (newUser.preferredLanguage) {
      setLanguage(newUser.preferredLanguage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_health_token');
    localStorage.removeItem('ai_health_user');
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: '',
      role: 'guest',
      preferredLanguage: language,
      createdAt: new Date().toISOString()
    });
    setIsAuthOpen(false);
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setCurrentAssessment(result);
    setActiveView('results');
  };

  const handleToggleSymptom = (symptomId: string, severity?: 'mild' | 'moderate' | 'severe') => {
    const meta = MASTER_SYMPTOMS.find(s => s.id === symptomId);
    if (!meta) return;
    setCollectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptomId);
      if (exists) {
        return prev.filter(s => s.id !== symptomId);
      } else {
        return [...prev, { id: symptomId, name: meta.name, severity: severity || 'moderate' }];
      }
    });
  };

  const handleRemoveSymptom = (symptomId: string) => {
    setCollectedSymptoms(prev => prev.filter(s => s.id !== symptomId));
  };

  const handleClearSymptoms = () => {
    setCollectedSymptoms([]);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return (
          <HomeView
            language={language}
            onNavigate={(view) => setActiveView(view)}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'checker':
        return (
          <ChatSymptomCheckerView
            language={language}
            collectedSymptoms={collectedSymptoms}
            setCollectedSymptoms={setCollectedSymptoms}
            onAssessmentComplete={handleAssessmentComplete}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'bodymap':
        return (
          <BodyMapView
            language={language}
            collectedSymptoms={collectedSymptoms}
            onToggleSymptom={handleToggleSymptom}
            onRemoveSymptom={handleRemoveSymptom}
            onClearSymptoms={handleClearSymptoms}
            onAssessmentComplete={handleAssessmentComplete}
            onNavigate={(view) => setActiveView(view)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'results':
        return currentAssessment ? (
          <ResultsView
            assessment={currentAssessment}
            language={language}
            onNavigate={(view) => setActiveView(view)}
            onStartNew={() => {
              clearActiveSession();
              setCollectedSymptoms([]);
              setCurrentAssessment(null);
              setActiveView('checker');
            }}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        ) : (
          <ChatSymptomCheckerView
            language={language}
            collectedSymptoms={collectedSymptoms}
            setCollectedSymptoms={setCollectedSymptoms}
            onAssessmentComplete={handleAssessmentComplete}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'doctors':
        return (
          <DoctorFinderView
            language={language}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'history':
        return (
          <HistoryView
            language={language}
            onOpenSOS={() => setIsSOSOpen(true)}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      case 'admin':
        return (
          <AdminView
            language={language}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={user}
            language={language}
            onLanguageChange={setLanguage}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
            onNavigate={(view) => setActiveView(view)}
            onUpdateUser={(updates) => {
              if (user) {
                const updated = { ...user, ...updates };
                setUser(updated);
                localStorage.setItem('ai_health_user', JSON.stringify(updated));
              }
            }}
          />
        );
      case 'privacy':
        return (
          <PrivacyPolicyView
            language={language}
            onNavigate={(view) => setActiveView(view)}
          />
        );
      default:
        return (
          <HomeView
            language={language}
            onNavigate={(view) => setActiveView(view)}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Primary Top Bar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        activeView={activeView}
        onNavigate={setActiveView}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenSaveSession={() => setIsSaveSessionOpen(true)}
        savedSymptomsCount={collectedSymptoms.length}
      />

      {/* Resume Session Banner */}
      {restorableSession && (
        <ResumeSessionBanner
          session={restorableSession}
          language={language}
          onResume={handleResumeSession}
          onDismiss={handleDismissBanner}
          onClear={handleClearSession}
        />
      )}

      {/* Main Body based on Device Simulator Mode */}
      {deviceMode === 'mobile' ? (
        // Mobile Smartphone Simulator Container
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-800/80">
          <div className="w-full max-w-[400px] h-[840px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col relative overflow-hidden ring-1 ring-white/10">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mr-2" />
              <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
            </div>

            {/* Inner Mobile Screen */}
            <div className="flex-1 bg-slate-50 rounded-[34px] overflow-hidden flex flex-col relative pt-7">
              {/* Mobile Status Bar */}
              <div className="px-6 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-800 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px]">5G</span>
                  <div className="w-4 h-2 border border-slate-700 rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-full bg-slate-800 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Viewport */}
              <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
                {renderActiveView()}
              </div>

              {/* Mobile Bottom Navigation */}
              <BottomNav
                activeView={activeView}
                onNavigate={setActiveView}
                language={language}
              />
            </div>
          </div>
        </div>
      ) : deviceMode === 'desktop' ? (
        // Desktop Workspace 1440px Mode with Sidebar
        <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            language={language}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
          <main className="flex-1 p-6 overflow-x-hidden min-h-[calc(100vh-4rem)]">
            {renderActiveView()}
          </main>
        </div>
      ) : (
        // Standard Fluid Responsive Web View
        <div className="flex-1">
          <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 lg:pb-8">
            {renderActiveView()}
          </main>
          {/* Bottom Nav on Mobile screens in responsive mode */}
          <div className="lg:hidden">
            <BottomNav
              activeView={activeView}
              onNavigate={setActiveView}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Global Modals */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        language={language}
      />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={user}
      />

      <SaveSessionModal
        isOpen={isSaveSessionOpen}
        onClose={() => setIsSaveSessionOpen(false)}
        language={language}
        currentSymptoms={collectedSymptoms}
        activeView={activeView}
        onResumeSession={handleResumeSession}
        onSessionCleared={handleClearSession}
      />
    </div>
  );
}

