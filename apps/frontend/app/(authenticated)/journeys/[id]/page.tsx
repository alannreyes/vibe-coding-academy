'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Lock,
  CheckCircle,
  Clock,
  Target,
  Trophy,
} from 'lucide-react';
import { getJourney } from '@/lib/api';
import { getJourneyColor, getMissionStatusStyles } from '@/lib/utils';

interface Mission {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  duration: number;
  difficulty: string;
  points: number;
  status: string;
  quizPassed: boolean;
  quizScore: number | null;
}

interface Journey {
  id: number;
  name: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  requiredMissions: number;
  missions: Mission[];
}

export default function JourneyPage() {
  const params = useParams();
  const journeyId = parseInt(params.id as string, 10);

  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJourney() {
      try {
        const data = await getJourney(journeyId);
        setJourney(data);
      } catch (error) {
        console.error('Error loading journey:', error);
      } finally {
        setLoading(false);
      }
    }

    loadJourney();
  }, [journeyId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-48 bg-white rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-slate-500">Jornada no encontrada</p>
        <Link href="/dashboard" className="text-cyan-600 hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const colors = getJourneyColor(journey.id);
  const completedMissions = journey.missions.filter(
    (m) => m.status === 'completed'
  ).length;
  const progress = Math.round((completedMissions / journey.missions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 text-white mb-6`}
      >
        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
          <span>Jornada {journey.id}</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full">
            {journey.name}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{journey.title}</h1>
        <p className="text-white/90 mb-6">{journey.description}</p>

        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Progreso</span>
            <span className="font-semibold">
              {completedMissions}/{journey.missions.length} misiones
            </span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Missions */}
      <div className="space-y-4">
        {journey.missions.map((mission, index) => {
          const styles = getMissionStatusStyles(mission.status);
          const isLocked = mission.status === 'locked';
          const isCompleted = mission.status === 'completed';

          const MissionCard = isLocked ? 'div' : Link;
          const cardProps = isLocked
            ? {}
            : { href: `/missions/${mission.id}` };

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MissionCard
                {...cardProps}
                className={`block bg-white rounded-xl border p-5 transition ${styles.card}`}
              >
                <div className="flex items-center gap-4">
                  {/* Number/Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isLocked
                        ? 'bg-slate-100'
                        : isCompleted
                          ? 'bg-green-100'
                          : `bg-gradient-to-r ${colors.gradient}`
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {mission.number}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold ${isLocked ? 'text-slate-400' : ''}`}
                      >
                        {mission.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${styles.badge}`}
                      >
                        {isCompleted
                          ? 'Completada'
                          : mission.status === 'in_progress'
                            ? 'En progreso'
                            : mission.status === 'available'
                              ? 'Disponible'
                              : 'Bloqueada'}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      {mission.subtitle}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mission.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        +{mission.points} pts
                      </span>
                      {isCompleted && mission.quizScore && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Trophy className="w-3 h-3" />
                          {mission.quizScore}/10
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  {!isLocked && (
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </MissionCard>
            </motion.div>
          );
        })}
      </div>

      {/* Certificate CTA */}
      {completedMissions === journey.missions.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center"
        >
          <Trophy className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            ¡Jornada Completada!
          </h2>
          <p className="text-white/90 mb-4">
            Has completado todas las misiones. Tu certificado está listo.
          </p>
          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition"
          >
            Ver Certificado
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
