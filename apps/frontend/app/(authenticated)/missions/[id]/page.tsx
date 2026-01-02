'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  Play,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { getMission, startMission } from '@/lib/api';
import { getJourneyColor } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import StepRenderer from '@/components/mission/StepRenderer';

interface Mission {
  id: number;
  journeyId: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  duration: number;
  difficulty: string;
  resultTitle: string;
  resultDesc: string;
  showOffText: string;
  content: string;
  points: number;
  status: string;
  quizPassed: boolean;
  journey: {
    name: string;
    title: string;
  };
}

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const missionId = parseInt(params.id as string, 10);
  const userOS = user?.operatingSystem || 'windows';

  useEffect(() => {
    async function loadMission() {
      try {
        const data = await getMission(missionId);
        setMission(data);

        // Auto-start mission if available
        if (data.status === 'available') {
          await startMission(missionId);
        }

        // Load saved progress from localStorage
        const savedProgress = localStorage.getItem(`mission-${missionId}-progress`);
        if (savedProgress) {
          const { completed, current } = JSON.parse(savedProgress);
          setCompletedSteps(completed || []);
          setCurrentStep(current || 0);
        }
      } catch (error) {
        console.error('Error loading mission:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMission();
  }, [missionId]);

  // Save progress to localStorage
  useEffect(() => {
    if (mission) {
      localStorage.setItem(
        `mission-${missionId}-progress`,
        JSON.stringify({ completed: completedSteps, current: currentStep })
      );
    }
  }, [completedSteps, currentStep, mission, missionId]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse w-32" />
        <div className="h-48 bg-white rounded-2xl animate-pulse" />
        <div className="h-96 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-slate-500">Misión no encontrada</p>
        <Link href="/dashboard" className="text-cyan-600 hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const colors = getJourneyColor(mission.journeyId);

  // Parse content - check for new version 2 format
  let parsedContent: any = { sections: [] };
  try {
    parsedContent = JSON.parse(mission.content);
  } catch {
    parsedContent = { sections: [] };
  }

  const isNewFormat = parsedContent.version === 2;
  const steps = parsedContent.steps || [];
  const allStepsCompleted = isNewFormat && steps.length > 0 && completedSteps.length >= steps.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al dashboard
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 text-white mb-6`}
      >
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <span>
            Jornada {mission.journeyId}: {mission.journey.name}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span>Misión {mission.number}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{mission.title}</h1>
        <p className="text-white/90 mb-4">{mission.subtitle}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{mission.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>+{mission.points} pts</span>
          </div>
          {mission.quizPassed && (
            <div className="flex items-center gap-2 bg-white/20 px-2 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>Completada</span>
            </div>
          )}
        </div>

        {/* Progress bar for new format */}
        {isNewFormat && steps.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progreso</span>
              <span>
                {completedSteps.length} / {steps.length} pasos
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedSteps.length / steps.length) * 100}%`,
                }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* New step-based content */}
      {isNewFormat && steps.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <StepRenderer
            steps={steps}
            userOS={userOS}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            completedSteps={completedSteps}
            onStepComplete={handleStepComplete}
          />
        </motion.div>
      ) : (
        /* Old format - legacy content rendering */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border mb-6"
        >
          <h2 className="font-semibold mb-4">Objetivos de la misión</h2>
          <ul className="space-y-3">
            {mission.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full ${colors.bg} text-white flex items-center justify-center text-xs font-medium flex-shrink-0`}
                >
                  {index + 1}
                </div>
                <span className="text-slate-600">{objective}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Result preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold">Lo que lograrás</h2>
        </div>
        <p className="text-xl font-bold mb-2">{mission.resultTitle}</p>
        <p className="text-slate-300 mb-4">{mission.resultDesc}</p>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-sm text-slate-300">Para presumir:</p>
          <p className="font-medium">&ldquo;{mission.showOffText}&rdquo;</p>
        </div>
      </motion.div>

      {/* Quiz CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border text-center"
      >
        {mission.quizPassed ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">¡Misión completada!</h2>
            <p className="text-slate-500 mb-4">
              Ya aprobaste el quiz de esta misión.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
            >
              Continuar con la siguiente misión
              <ChevronRight className="w-4 h-4" />
            </Link>
          </>
        ) : allStepsCompleted ? (
          <>
            <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              ¡Completaste todos los pasos!
            </h2>
            <p className="text-slate-500 mb-4">
              Demuestra lo que aprendiste con un quiz rápido.
            </p>
            <Link
              href={`/missions/${mission.id}/quiz`}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-lg font-medium hover:opacity-90 transition`}
            >
              <Play className="w-4 h-4" />
              Iniciar Quiz
            </Link>
          </>
        ) : (
          <>
            <Target className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Completa los pasos primero
            </h2>
            <p className="text-slate-500 mb-4">
              Sigue los pasos de arriba para desbloquear el quiz.
            </p>
            <div className="text-sm text-slate-400">
              {completedSteps.length} de {steps.length || mission.objectives.length} pasos
              completados
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
