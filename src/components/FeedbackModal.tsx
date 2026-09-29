import React, { useState } from 'react';
import { X, Star, MessageSquare, Check, Sparkles, AlertCircle, ThumbsUp, HeartPulse } from 'lucide-react';
import { User, FeedbackCategory } from '../types';
import { submitFeedback } from '../services/feedbackService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  consultationId?: string;
  consultationSummary?: string;
  onFeedbackSubmitted?: () => void;
}

const CATEGORIES: { id: FeedbackCategory; label: string; desc: string }[] = [
  { id: 'accuracy', label: 'Triage Accuracy', desc: 'Accuracy of disease predictions & red flags' },
  { id: 'anatomy_3d', label: '3D Human Atlas', desc: 'Organ explorer, zoom, rotation & explode views' },
  { id: 'voice_input', label: 'Voice-to-Text', desc: 'Speech recognition in English & Indian languages' },
  { id: 'ui_experience', label: 'User Experience', desc: 'Mobile responsiveness, typography & usability' },
  { id: 'doctor_referral', label: 'Doctor Finder', desc: 'Hospital & specialist discovery recommendations' },
  { id: 'other', label: 'Other Suggestions', desc: 'Feature requests, bug reports, or general comments' }
];

const QUICK_TAGS = [
  'Accurate Symptom Check',
  'Helpful Medical Guidance',
  'Realistic 3D Anatomy',
  'Easy Voice Recognition',
  'Clear Red Flag Warnings',
  'Add More Regional Languages',
  'Fast Response'
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  consultationId,
  consultationSummary,
  onFeedbackSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('accuracy');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Accurate Symptom Check']);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a brief comment or suggestion.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitFeedback({
        rating,
        category,
        comment: comment.trim(),
        tags: selectedTags,
        consultationId,
        userName: name.trim() || (currentUser?.name ? currentUser.name : 'Anonymous Patient'),
        userEmail: email.trim() || (currentUser?.email ? currentUser.email : undefined)
      });

      setSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      setTimeout(() => {
        handleReset();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(5);
    setCategory('accuracy');
    setComment('');
    setSelectedTags(['Accurate Symptom Check']);
    setSubmitted(false);
    setError(null);
  };

  const ratingLabels: Record<number, string> = {
    1: 'Poor · Needs Major Work',
    2: 'Fair · Needs Improvement',
    3: 'Good · Average Experience',
    4: 'Very Good · Helpful Tool',
    5: 'Excellent · Highly Recommended!'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">
                Patient & Clinician Feedback
              </h3>
              <p className="text-xs text-slate-500 truncate">
                Help improve medical precision & usability
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Thank you for your valuable feedback!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your ratings and insights help our clinical engineering team refine symptom triage accuracy, 3D anatomy rendering, and multilingual models.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Optional Consultation Reference Banner */}
              {consultationSummary && (
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-900">
                  <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate">
                    Feedback for: <strong>{consultationSummary}</strong>
                  </span>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Section */}
              <div className="space-y-1.5 text-center p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  How would you rate your overall experience?
                </label>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-115 focus:outline-hidden"
                        title={`${star} Star`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold text-teal-800">
                  {ratingLabels[hoverRating || rating]}
                </p>
              </div>

              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  What is your feedback mainly about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                        category === cat.id
                          ? 'border-teal-600 bg-teal-50/90 text-teal-900 font-bold ring-1 ring-teal-500 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Quick tags (select any that apply):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Field */}
              <div className="space-y-1.5">
                <label htmlFor="feedback-comment" className="block text-xs font-bold text-slate-700">
                  Detailed Thoughts or Suggestions <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share what worked well, any inaccuracies observed, or features you would like to see..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
                  required
                />
              </div>

              {/* Name & Email (Optional for guests) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label htmlFor="feedback-name" className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Your Name (optional)
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Email Address (optional)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For follow-up on issues"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
