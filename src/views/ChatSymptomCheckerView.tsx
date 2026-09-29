import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, ExtractedSymptom, AssessmentResult, Symptom } from '../types';
import { TRANSLATIONS } from '../../shared/constants/languages';
import { MASTER_SYMPTOMS } from '../../shared/constants/symptoms_data';
import { SymptomAutocomplete } from '../components/SymptomAutocomplete';
import { BodyAnatomySelector } from '../components/BodyAnatomySelector';
import { getActiveSession, saveActiveSession } from '../services/sessionStorageService';
import { Send, Bot, User, AlertTriangle, Sparkles, Check, RefreshCw, ChevronRight, Plus, X, HeartPulse, MessageSquare, Accessibility, Mic, MicOff, Volume2, Bookmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SPEECH_LANG_CONFIG: Record<SupportedLanguage, { bcp47: string; label: string }> = {
  en: { bcp47: 'en-IN', label: 'English' },
  hi: { bcp47: 'hi-IN', label: 'हिन्दी' },
  kn: { bcp47: 'kn-IN', label: 'ಕನ್ನಡ' },
  ta: { bcp47: 'ta-IN', label: 'தமிழ்' },
  te: { bcp47: 'te-IN', label: 'తెలుగు' }
};

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  extracted?: ExtractedSymptom[];
  duration?: string;
  isEmergencyAlert?: boolean;
}

interface ChatSymptomCheckerProps {
  language: SupportedLanguage;
  onAssessmentComplete: (result: AssessmentResult) => void;
  onOpenSOS: () => void;
  collectedSymptoms?: ExtractedSymptom[];
  setCollectedSymptoms?: React.Dispatch<React.SetStateAction<ExtractedSymptom[]>>;
}

export const ChatSymptomCheckerView: React.FC<ChatSymptomCheckerProps> = ({
  language,
  onAssessmentComplete,
  onOpenSOS,
  collectedSymptoms: propCollectedSymptoms,
  setCollectedSymptoms: propSetCollectedSymptoms
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Retrieve initial saved session if available
  const initialSession = getActiveSession();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (initialSession?.chatMessages && initialSession.chatMessages.length > 0) {
      return initialSession.chatMessages;
    }
    return [
      {
        id: 'm1',
        sender: 'ai',
        text: "Hello! I am your AI Health Assistant. Please describe how you are feeling in natural language (for example: 'I have had a high fever and severe headache since yesterday'). What symptoms are you experiencing?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingAssessment, setAnalyzingAssessment] = useState(false);

  // Patient Structured Demographics & Symptoms State
  const [patientAge, setPatientAge] = useState<number>(initialSession?.patientDemographics?.age ?? 26);
  const [patientSex, setPatientSex] = useState<'female' | 'male' | 'other'>(initialSession?.patientDemographics?.sex ?? 'female');
  const [duration, setDuration] = useState<string>(initialSession?.patientDemographics?.duration ?? '2 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>(initialSession?.patientDemographics?.severity ?? 'moderate');
  const [medications, setMedications] = useState<string>(initialSession?.patientDemographics?.medications ?? '');
  const [existingConditions, setExistingConditions] = useState<string>(initialSession?.patientDemographics?.existingConditions ?? '');
  
  const [localSymptoms, setLocalSymptoms] = useState<ExtractedSymptom[]>(() => {
    if (initialSession?.collectedSymptoms && initialSession.collectedSymptoms.length > 0) {
      return initialSession.collectedSymptoms;
    }
    return [{ id: 'fever', name: 'Fever', severity: 'moderate' }];
  });

  const collectedSymptoms = propCollectedSymptoms || localSymptoms;
  const setCollectedSymptoms = propSetCollectedSymptoms || setLocalSymptoms;
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'chat' | 'anatomy'>('chat');
  const [justSaved, setJustSaved] = useState(false);

  // Synchronize state changes back to active session
  useEffect(() => {
    saveActiveSession({
      activeView: 'checker',
      chatMessages: messages,
      collectedSymptoms,
      patientDemographics: {
        age: patientAge,
        sex: patientSex,
        duration,
        severity,
        medications,
        existingConditions
      },
      isAutoSaved: true
    });
  }, [messages, collectedSymptoms, patientAge, patientSex, duration, severity, medications, existingConditions]);

  const handleManualSave = () => {
    saveActiveSession({
      activeView: 'checker',
      chatMessages: messages,
      collectedSymptoms,
      patientDemographics: {
        age: patientAge,
        sex: patientSex,
        duration,
        severity,
        medications,
        existingConditions
      },
      isAutoSaved: false
    });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  // Speech Recognition (Voice-to-Text) State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  const startListening = () => {
    setSpeechError(null);
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your symptoms.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_CONFIG[language]?.bcp47 || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let finalSegment = '';
        let interimSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += transcript;
          } else {
            interimSegment += transcript;
          }
        }

        if (finalSegment) {
          setInputText(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalSegment.trim()}` : finalSegment.trim();
          });
        }
        setInterimTranscript(interimSegment);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Normal silence, don't show error
        } else if (event.error === 'network') {
          setSpeechError('Network error during speech recognition. Please check your connection.');
          setIsListening(false);
        } else if (event.error !== 'aborted') {
          setSpeechError(`Speech recognition: ${event.error}`);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize SpeechRecognition:', err);
      setSpeechError('Could not start microphone. Please check permissions or type symptoms.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup speech recognition on unmount or inputMode switch
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // When input mode switches to anatomy, stop voice recording
  useEffect(() => {
    if (inputMode === 'anatomy' && isListening) {
      stopListening();
    }
  }, [inputMode]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send conversational message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (isListening) {
      stopListening();
    }

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputText;
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language })
      });
      const data = await res.json();

      if (data.extractedSymptoms && data.extractedSymptoms.length > 0) {
        // Add to collected symptoms
        setCollectedSymptoms(prev => {
          const map = new Map<string, ExtractedSymptom>();
          prev.forEach(item => map.set(item.id, item));
          data.extractedSymptoms.forEach((s: ExtractedSymptom) => map.set(s.id, s));
          return Array.from(map.values());
        });
      }

      if (data.duration && data.duration !== 'Unspecified') {
        setDuration(data.duration);
      }

      if (data.emergencyDetected) {
        setEmergencyTriggered(true);
      }

      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || "Thank you. I have noted your symptoms. You can add more details or review the demographic details on the right to run your ML assessment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extracted: data.extractedSymptoms,
        duration: data.duration,
        isEmergencyAlert: data.emergencyDetected
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: "I am noting your symptoms. Please review your active symptoms and confirm patient age/sex to generate clinical guidance.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick symptom toggle
  const toggleSymptom = (symId: string) => {
    const meta = MASTER_SYMPTOMS.find(s => s.id === symId);
    if (!meta) return;

    const isCurrentlySelected = collectedSymptoms.some(s => s.id === symId);
    if (!isCurrentlySelected && meta.isEmergencyIndicator) {
      setEmergencyTriggered(true);
    }

    setCollectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symId);
      if (exists) {
        return prev.filter(s => s.id !== symId);
      } else {
        return [...prev, { id: symId, name: meta.name, severity: 'moderate' }];
      }
    });
  };

  // Auto-complete symptom selection handler
  const handleSelectAutocompleteSymptom = (symptom: Symptom) => {
    // Add to collected symptoms if not already present
    setCollectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) return prev;
      return [...prev, { id: symptom.id, name: symptom.name, severity: 'moderate' }];
    });

    if (symptom.isEmergencyIndicator) {
      setEmergencyTriggered(true);
    }

    const cleanName = symptom.name.split('/')[0].trim();
    setMessages(prev => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        text: `Standardized clinical symptom "${cleanName}" (${symptom.category}) identified from predefined medical lexicon. Mapped to ML feature vector.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extracted: [{ id: symptom.id, name: symptom.name, severity: 'moderate' }],
        isEmergencyAlert: symptom.isEmergencyIndicator
      }
    ]);
  };

  // Run full ML Disease Prediction Assessment
  const runAssessment = async () => {
    setAssessmentError(null);
    if (collectedSymptoms.length === 0) {
      setAssessmentError('Please select or describe at least one symptom.');
      return;
    }

    setAnalyzingAssessment(true);
    try {
      const symptomsList = collectedSymptoms.map(s => s.id);
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsList,
          age: Number(patientAge),
          sex: patientSex,
          existingConditions: existingConditions ? [existingConditions] : [],
          medications: medications ? [medications] : []
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Prediction service error');
      }

      const assessmentResult: AssessmentResult = await res.json();
      onAssessmentComplete(assessmentResult);
    } catch (err: any) {
      setAssessmentError(err?.message || 'Prediction failed. Please try again.');
    } finally {
      setAnalyzingAssessment(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Chatbot Area (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[700px] overflow-hidden">
        
        {/* Chat / Anatomy Header with Mode Switcher */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {inputMode === 'chat' ? <Bot className="w-4 h-4" /> : <Accessibility className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {inputMode === 'chat' ? 'Conversational AI Symptom Intake' : 'Visual Human Anatomy Selector'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {inputMode === 'chat' ? 'NLP extraction with predefined medical auto-complete' : 'Interactive human body map with localized clinical symptoms'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Input Mode Switcher (AI Chat vs Human Body Anatomy) */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setInputMode('chat')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  inputMode === 'chat'
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('anatomy')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  inputMode === 'anatomy'
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Accessibility className="w-3.5 h-3.5 text-teal-600" />
                <span>Body Anatomy</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleManualSave}
                className="px-2 py-1 text-xs font-medium text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                title="Save current progress"
              >
                {justSaved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-[11px] text-emerald-700 font-bold">Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3 h-3 text-teal-600" />
                    <span className="text-[11px]">Save</span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-semibold text-teal-700 uppercase bg-teal-50 px-2 py-1 rounded border border-teal-200">
                {language}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Alert Header if triggered */}
        {emergencyTriggered && (
          <div className="bg-red-50 border-b border-red-200 p-3 flex items-center justify-between gap-3 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">Potentially serious symptom detected. Medical evaluation recommended.</span>
            </div>
            <button
              onClick={onOpenSOS}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shrink-0"
            >
              Call 108
            </button>
          </div>
        )}

        {/* Main Content: Chat Mode vs Anatomy Map Mode */}
        {inputMode === 'anatomy' ? (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            <BodyAnatomySelector
              collectedSymptoms={collectedSymptoms}
              onToggleSymptom={toggleSymptom}
              onOpenSOS={onOpenSOS}
            />
          </div>
        ) : (
          <>
            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : m.isEmergencyAlert
                        ? 'bg-red-50 border border-red-200 text-red-900 rounded-bl-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <div
                      className={`mt-1.5 text-[10px] text-right ${
                        m.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isListening && (
                <div className="flex gap-2.5 items-center p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs shadow-2xs animate-in fade-in">
                  <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Listening to verbal symptoms ({SPEECH_LANG_CONFIG[language]?.label})...</span>
                      <span className="flex space-x-0.5 items-end h-3">
                        <span className="w-0.5 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                        <span className="w-0.5 h-3 bg-rose-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-0.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 italic truncate mt-0.5">
                      {interimTranscript ? `"${interimTranscript}"` : 'Speak naturally, e.g. "I have had fever and severe headache since yesterday"'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={stopListening}
                    className="px-2.5 py-1 bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 rounded font-semibold text-[11px] shrink-0 shadow-2xs"
                  >
                    Done Speaking
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex gap-2.5 items-center text-xs text-slate-500 italic">
                  <Bot className="w-4 h-4 text-teal-600 animate-spin" />
                  <span>Analyzing medical entities & duration...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Common Quick Chips */}
            <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">Quick add:</span>
              {['fever', 'headache', 'cough', 'shortness_of_breath', 'chest_pain', 'diarrhea', 'joint_pain'].map(id => {
                const isSelected = collectedSymptoms.some(s => s.id === id);
                const meta = MASTER_SYMPTOMS.find(s => s.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleSymptom(id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-teal-700 text-white'
                        : meta?.isEmergencyIndicator
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-white border border-slate-300 text-slate-700 hover:border-teal-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{meta?.name.split('/')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Bar with Medical Symptom Auto-Complete and Voice-to-Text */}
            <div className="p-3 bg-white border-t border-slate-200">
              <SymptomAutocomplete
                inputText={inputText}
                onInputChange={setInputText}
                onSelectSymptom={handleSelectAutocompleteSymptom}
                collectedSymptoms={collectedSymptoms}
                onSubmit={handleSendMessage}
                loading={loading}
                isListening={isListening}
                onToggleVoice={toggleVoice}
                interimTranscript={interimTranscript}
                speechSupported={speechSupported}
                speechLanguageLabel={SPEECH_LANG_CONFIG[language]?.label || 'English'}
                speechError={speechError}
                onDismissSpeechError={() => setSpeechError(null)}
              />
            </div>
          </>
        )}
      </div>

      {/* Right Structured Patient & Clinical Details (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clinical Assessment Data</h3>
              <p className="text-[11px] text-slate-500">Demographics & Machine Learning Parameters</p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Primary: Random Forest
            </span>
          </div>

          {/* Active Extracted Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Identified Symptoms ({collectedSymptoms.length})
            </label>
            {collectedSymptoms.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No symptoms identified yet. Chat with the AI or click quick buttons.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {collectedSymptoms.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-900 rounded-md text-xs font-medium"
                  >
                    <span>{s.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Patient Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Sex</label>
              <select
                value={patientSex}
                onChange={(e) => setPatientSex(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Duration & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 days"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="mild">Mild (Manageable)</option>
                <option value="moderate">Moderate (Noticeable)</option>
                <option value="severe">Severe (Incapacitating)</option>
              </select>
            </div>
          </div>

          {/* Medical History & Current Medications */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Known Medical Conditions (Optional)</label>
            <input
              type="text"
              value={existingConditions}
              onChange={(e) => setExistingConditions(e.target.value)}
              placeholder="e.g. Hypertension, Diabetes, Asthma"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Current Medications (Optional)</label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Metformin 500mg, Paracetamol"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Run ML Prediction Button */}
          <div className="pt-2 space-y-2">
            {assessmentError && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center justify-between">
                <span>{assessmentError}</span>
                <button onClick={() => setAssessmentError(null)} className="text-xs font-bold text-amber-900 underline">Dismiss</button>
              </div>
            )}
            <button
              onClick={runAssessment}
              disabled={analyzingAssessment || collectedSymptoms.length === 0}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <HeartPulse className="w-4 h-4" />
              <span>{analyzingAssessment ? 'Executing Machine Learning Models...' : 'Generate Clinical Triage Assessment'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Runs Random Forest, Decision Tree & Naive Bayes classifiers simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
