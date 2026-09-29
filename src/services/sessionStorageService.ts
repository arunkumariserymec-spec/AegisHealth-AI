/**
 * AegisHealth AI - Assessment Session Storage Service
 * Handles seamless session auto-saving, draft persistence, restoration across reloads/crashes,
 * and optional Firestore cloud draft synchronization.
 */

import { SavedAssessmentSession, ExtractedSymptom, AssessmentResult } from '../types';
import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';

const ACTIVE_SESSION_STORAGE_KEY = 'aegishealth_active_assessment_session';
const SAVED_DRAFTS_STORAGE_KEY = 'aegishealth_saved_assessment_drafts';
const LAST_RESTORED_SESSION_KEY = 'aegishealth_last_dismissed_session_id';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type SessionSubscriber = (session: SavedAssessmentSession | null) => void;
const subscribers: Set<SessionSubscriber> = new Set();

/**
 * Notifies all registered subscribers of session changes.
 */
function notifySubscribers(session: SavedAssessmentSession | null) {
  subscribers.forEach((callback) => {
    try {
      callback(session);
    } catch (e) {
      console.warn('Session subscriber error:', e);
    }
  });
}

/**
 * Creates a human-friendly summary text for an assessment state
 */
export function generateSessionSummary(
  symptoms: ExtractedSymptom[],
  activeView: string,
  age?: number,
  sex?: string
): string {
  const symptomNames = symptoms.map(s => s.name).slice(0, 3).join(', ');
  const moreCount = symptoms.length > 3 ? ` +${symptoms.length - 3} more` : '';
  const patientDesc = age && sex ? `${age}y ${sex}` : '';
  
  if (symptoms.length === 0) {
    return 'Empty assessment in progress';
  }
  return `${symptoms.length} symptom${symptoms.length > 1 ? 's' : ''} (${symptomNames}${moreCount})${patientDesc ? ` • ${patientDesc}` : ''}`;
}

/**
 * Retrieves the currently active in-progress assessment session from localStorage.
 */
export function getActiveSession(): SavedAssessmentSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: SavedAssessmentSession = JSON.parse(raw);
    
    // Validate that session is valid and not older than 7 days
    const savedTime = new Date(parsed.savedAt).getTime();
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    
    if (isNaN(savedTime) || (now - savedTime) > sevenDaysMs) {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to read active session from storage:', error);
    return null;
  }
}

/**
 * Checks whether an active restorable session exists that has actionable content.
 */
export function hasRestorableSession(): boolean {
  const session = getActiveSession();
  if (!session) return false;
  
  // Has at least one symptom or conversational message or completed assessment
  const hasSymptoms = (session.collectedSymptoms && session.collectedSymptoms.length > 0);
  const hasChatMessages = (session.chatMessages && session.chatMessages.length > 1);
  const hasResults = Boolean(session.currentAssessment);
  
  return hasSymptoms || hasChatMessages || hasResults;
}

/**
 * Checks if a session has already been dismissed or restored to avoid repetitive popups.
 */
export function isSessionDismissed(sessionId: string): boolean {
  try {
    const dismissedId = localStorage.getItem(LAST_RESTORED_SESSION_KEY);
    return dismissedId === sessionId;
  } catch {
    return false;
  }
}

export function markSessionDismissed(sessionId: string): void {
  try {
    localStorage.setItem(LAST_RESTORED_SESSION_KEY, sessionId);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Saves or updates the active in-progress session.
 */
export function saveActiveSession(
  sessionData: Partial<SavedAssessmentSession>
): SavedAssessmentSession {
  try {
    const existing = getActiveSession();
    const now = new Date().toISOString();
    
    const updatedSymptoms = sessionData.collectedSymptoms ?? existing?.collectedSymptoms ?? [];
    const activeView = sessionData.activeView ?? existing?.activeView ?? 'checker';
    const demographics = sessionData.patientDemographics ?? existing?.patientDemographics ?? {
      age: 26,
      sex: 'female',
      duration: '2 days',
      severity: 'moderate'
    };

    const session: SavedAssessmentSession = {
      id: existing?.id || `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: sessionData.userId ?? existing?.userId ?? 'guest',
      sessionName: sessionData.sessionName ?? existing?.sessionName ?? 'In-Progress Assessment',
      savedAt: now,
      activeView: activeView,
      collectedSymptoms: updatedSymptoms,
      patientDemographics: demographics,
      chatMessages: sessionData.chatMessages ?? existing?.chatMessages ?? [],
      selectedBodyRegion: sessionData.selectedBodyRegion ?? existing?.selectedBodyRegion ?? null,
      currentAssessment: sessionData.currentAssessment ?? existing?.currentAssessment ?? null,
      isAutoSaved: sessionData.isAutoSaved ?? true,
      summaryText: generateSessionSummary(
        updatedSymptoms,
        activeView,
        demographics.age,
        demographics.sex
      )
    };

    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    notifySubscribers(session);

    // If user is authenticated, also sync to Firestore in the background
    if (session.userId && session.userId !== 'guest') {
      syncSessionToFirestore(session).catch(e => {
        console.warn('Firestore session sync notice:', e);
      });
    }

    return session;
  } catch (error) {
    console.error('Failed to save active session:', error);
    throw error;
  }
}

/**
 * Clears the active in-progress session (e.g., when user starts a fresh assessment or completes triage).
 */
export function clearActiveSession(): void {
  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    notifySubscribers(null);
  } catch (error) {
    console.error('Failed to clear active session:', error);
  }
}

/**
 * Saves current session state as a permanent bookmark / named draft.
 */
export function saveAsDraftSnapshot(
  draftName?: string,
  customData?: Partial<SavedAssessmentSession>
): SavedAssessmentSession {
  const active = getActiveSession();
  const now = new Date().toISOString();
  
  const targetData = customData || active || {};
  const symptoms = targetData.collectedSymptoms || [];
  const demographics = targetData.patientDemographics || {
    age: 26,
    sex: 'female',
    duration: '2 days',
    severity: 'moderate'
  };

  const draftId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultName = draftName?.trim() || `Assessment Draft (${new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})`;

  const newDraft: SavedAssessmentSession = {
    id: draftId,
    userId: targetData.userId || 'guest',
    sessionName: defaultName,
    savedAt: now,
    activeView: targetData.activeView || 'checker',
    collectedSymptoms: symptoms,
    patientDemographics: demographics,
    chatMessages: targetData.chatMessages || [],
    selectedBodyRegion: targetData.selectedBodyRegion || null,
    currentAssessment: targetData.currentAssessment || null,
    isAutoSaved: false,
    summaryText: generateSessionSummary(symptoms, targetData.activeView || 'checker', demographics.age, demographics.sex)
  };

  try {
    const existingDrafts = getSavedDrafts();
    const updatedDrafts = [newDraft, ...existingDrafts.filter(d => d.id !== draftId)].slice(0, 20);
    localStorage.setItem(SAVED_DRAFTS_STORAGE_KEY, JSON.stringify(updatedDrafts));
    
    // Also save active session pointer
    saveActiveSession(newDraft);

    return newDraft;
  } catch (e) {
    console.error('Failed to save draft snapshot:', e);
    throw e;
  }
}

/**
 * Returns all saved drafts.
 */
export function getSavedDrafts(): SavedAssessmentSession[] {
  try {
    const raw = localStorage.getItem(SAVED_DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved drafts:', e);
    return [];
  }
}

/**
 * Deletes a draft by ID.
 */
export function deleteSavedDraft(draftId: string): void {
  try {
    const drafts = getSavedDrafts();
    const filtered = drafts.filter(d => d.id !== draftId);
    localStorage.setItem(SAVED_DRAFTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete draft:', e);
  }
}

/**
 * Subscribes a React component to active session storage changes.
 */
export function subscribeToSession(callback: SessionSubscriber): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * Sync active draft session to Firestore cloud database
 */
async function syncSessionToFirestore(session: SavedAssessmentSession) {
  try {
    if (!session.userId || session.userId === 'guest') return;
    const sessionDocRef = doc(db, 'user_sessions', `${session.userId}_active`);
    await setDoc(sessionDocRef, {
      ...session,
      syncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    // Non-blocking fallback to local storage
  }
}

/**
 * Fetches user draft session from Firestore if available
 */
export async function fetchRemoteSessionFromFirestore(userId: string): Promise<SavedAssessmentSession | null> {
  try {
    if (!userId || userId === 'guest') return null;
    const sessionDocRef = doc(db, 'user_sessions', `${userId}_active`);
    const docSnap = await getDoc(sessionDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as SavedAssessmentSession;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch remote session from Firestore:', err);
    return null;
  }
}
