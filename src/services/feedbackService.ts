import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { UserFeedback, FeedbackCategory } from '../types';

export interface SubmitFeedbackPayload {
  rating: number;
  category: FeedbackCategory;
  comment: string;
  tags?: string[];
  consultationId?: string;
  userName?: string;
  userEmail?: string;
}

export async function submitFeedback(payload: SubmitFeedbackPayload): Promise<UserFeedback> {
  const token = localStorage.getItem('ai_health_auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Submit to REST API backend
  let savedRecord: UserFeedback | null = null;
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      savedRecord = await res.json();
    }
  } catch (err) {
    console.warn('Backend feedback recording fallback:', err);
  }

  // 2. Also persist directly into Firebase Firestore for cloud persistence
  try {
    const firestorePayload = {
      ...payload,
      id: savedRecord?.id || `fb_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'feedback'), firestorePayload);
  } catch (firebaseErr) {
    console.warn('Firestore feedback persistence notice:', firebaseErr);
  }

  if (savedRecord) {
    return savedRecord;
  }

  return {
    id: `fb_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString()
  };
}

export async function getFeedbackList(): Promise<UserFeedback[]> {
  // Try backend first
  try {
    const res = await fetch('/api/feedback');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from backend, attempting Firestore fallback', err);
  }

  // Fallback to Firestore
  try {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const results: UserFeedback[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        rating: data.rating || 5,
        category: data.category || 'ui_experience',
        comment: data.comment || '',
        tags: data.tags || [],
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        consultationId: data.consultationId,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    return results;
  } catch (firestoreErr) {
    console.warn('Firestore fallback fetch notice:', firestoreErr);
    return [];
  }
}

export async function getFeedbackSummary() {
  try {
    const res = await fetch('/api/feedback/summary');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to load feedback summary:', e);
  }
  return {
    totalCount: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    categoryBreakdown: {}
  };
}
