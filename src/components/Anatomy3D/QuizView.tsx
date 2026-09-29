import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../../anatomy/quizData';
import { ANATOMY_STRUCTURES } from '../../anatomy/anatomyData';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';

interface QuizViewProps {
  onFocusStructure?: (structureId: string) => void;
  onExitQuiz?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onFocusStructure, onExitQuiz }) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Filtered questions
  const filteredQuestions = selectedSystem === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.system === selectedSystem);

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[currentIndex];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !quizFinished) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, quizFinished]);

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setUserAnswers(prev => [
      ...prev,
      { questionId: currentQuestion.id, selected: selectedAnswer, correct: isCorrect }
    ]);

    // If structure is linked, optionally notify parent
    if (currentQuestion.targetStructureId && onFocusStructure) {
      onFocusStructure(currentQuestion.targetStructureId);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      setIsTimerRunning(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-md">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Anatomy Quiz Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Medical Board Standard
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Test your knowledge of structures, histology, innervation, and clinical pathology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Score: {score}</span>
          </div>

          {onExitQuiz && (
            <button
              onClick={onExitQuiz}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Quiz Body */}
      {!quizFinished && currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-teal-400">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                {currentQuestion.systemName}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentQuestion.type.replace('_', ' ')} · Difficulty: {currentQuestion.difficulty}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;
              let btnClass = 'border-slate-700/80 bg-slate-800/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  btnClass = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500';
                } else {
                  btnClass = 'opacity-50 border-slate-800 bg-slate-900 text-slate-500';
                }
              } else if (isSelected) {
                btnClass = 'border-teal-500 bg-teal-950/40 text-white ring-1 ring-teal-500';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-4 rounded-xl border text-left font-medium text-sm flex items-center justify-between transition-all duration-150 ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-bold flex items-center justify-center text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-xl border space-y-2 text-xs leading-relaxed animate-in fade-in duration-200 ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {selectedAnswer === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-slate-300">{currentQuestion.explanation}</p>
              {currentQuestion.clinicalRelevance && (
                <div className="pt-1.5 border-t border-slate-700/50 flex items-start gap-1.5 text-[11px] text-teal-300">
                  <span className="font-bold shrink-0">Clinical Pearl:</span>
                  <span>{currentQuestion.clinicalRelevance}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'Click Next to continue' : 'Select an option and submit'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                type="button"
                disabled={selectedAnswer === null}
                onClick={handleSubmitAnswer}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
              >
                <span>{currentIndex + 1 < filteredQuestions.length ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Quiz Completed!</h3>
            <p className="text-xs text-slate-400">
              You finished {filteredQuestions.length} medical anatomy questions in {formatTime(timerSeconds)}
            </p>
          </div>

          {/* Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Final Score</span>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {score} / {filteredQuestions.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Accuracy</span>
              <div className="text-2xl font-black text-indigo-400 font-mono">
                {Math.round((score / filteredQuestions.length) * 100)}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Time Elapsed</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatTime(timerSeconds)}
              </div>
            </div>
          </div>

          {/* Performance Summary Feedback */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 max-w-lg mx-auto text-xs text-slate-300 leading-relaxed text-left">
            <span className="font-bold text-teal-400 block mb-1">Performance Evaluation:</span>
            {score / filteredQuestions.length >= 0.8 ? (
              <span>Excellent mastery! You demonstrated a comprehensive understanding of human organ systems, histology, and neurovascular anatomy.</span>
            ) : score / filteredQuestions.length >= 0.5 ? (
              <span>Good grasp of core concepts. Consider reviewing the respiratory and nervous systems in the 3D Atlas to strengthen your score.</span>
            ) : (
              <span>Needs additional review. Use the 3D Dissection and Flashcards study tools to explore structural relationships and blood supplies.</span>
            )}
          </div>

          {/* Restart Button */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
