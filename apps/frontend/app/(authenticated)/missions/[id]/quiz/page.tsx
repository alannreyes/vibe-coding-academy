'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
} from 'lucide-react';
import Confetti from 'react-confetti';
import { getQuizQuestions, getQuizStatus, submitQuiz } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  order: number;
}

interface QuizStatus {
  attemptsUsed: number;
  maxAttempts: number;
  canAttempt: boolean;
  passed: boolean;
  bestScore?: number;
}

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  attemptsRemaining: number;
  pointsEarned: number;
  results: Record<string, boolean>;
  explanations?: Record<string, string>;
  nextMissionUnlocked?: number;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const missionId = parseInt(params.id as string, 10);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [status, setStatus] = useState<QuizStatus | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const [questionsData, statusData] = await Promise.all([
          getQuizQuestions(missionId),
          getQuizStatus(missionId),
        ]);
        setQuestions(questionsData);
        setStatus(statusData);
      } catch (error) {
        console.error('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [missionId]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = questions.every((q) => answers[q.id]);

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const goNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setSubmitting(true);
    try {
      const resultData = await submitQuiz(missionId, answers);
      setResult(resultData);

      if (resultData.passed) {
        setShowConfetti(true);
        await refreshUser();
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-48 mb-6" />
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status && !status.canAttempt && !status.passed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sin intentos disponibles</h1>
        <p className="text-slate-500 mb-6">
          Has usado tus {status.maxAttempts} intentos. Espera 24 horas para intentar de nuevo.
        </p>
        <button
          onClick={() => router.push(`/missions/${missionId}`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la misión
        </button>
      </div>
    );
  }

  if (status?.passed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Quiz ya aprobado</h1>
        <p className="text-slate-500 mb-6">
          Ya completaste este quiz con {status.bestScore}/10.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
        >
          Ir al Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Show result
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 text-center"
        >
          {result.passed ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">
                ¡Felicitaciones!
              </h1>
              <p className="text-slate-500 mb-6">Has aprobado el quiz</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">
                No aprobaste
              </h1>
              <p className="text-slate-500 mb-6">
                Necesitas 8/10 para aprobar
              </p>
            </>
          )}

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold">{result.score}</p>
              <p className="text-sm text-slate-500">Correctas</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{result.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
            {result.passed && (
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-600">
                  +{result.pointsEarned}
                </p>
                <p className="text-sm text-slate-500">Puntos</p>
              </div>
            )}
          </div>

          {!result.passed && result.attemptsRemaining > 0 && (
            <p className="text-amber-600 mb-6">
              Te quedan {result.attemptsRemaining} intento(s)
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {result.passed ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
                >
                  <Home className="w-4 h-4" />
                  Ir al Dashboard
                </button>
                {result.nextMissionUnlocked && (
                  <button
                    onClick={() =>
                      router.push(`/missions/${result.nextMissionUnlocked}`)
                    }
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                  >
                    Siguiente Misión
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/missions/${missionId}`)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Repasar Misión
                </button>
                {result.attemptsRemaining > 0 && (
                  <button
                    onClick={() => {
                      setResult(null);
                      setAnswers({});
                      setCurrentIndex(0);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reintentar
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz questions
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          <span>
            {Object.keys(answers).length} respondidas
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-6 border mb-6"
        >
          <h2 className="text-xl font-semibold mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar respuestas'}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 px-4 py-2 text-cyan-600 hover:text-cyan-700"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex justify-center gap-2 mt-8">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex
                ? 'bg-cyan-500'
                : answers[q.id]
                  ? 'bg-cyan-200'
                  : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
