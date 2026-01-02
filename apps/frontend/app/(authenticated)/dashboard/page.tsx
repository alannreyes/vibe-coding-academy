'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  Trophy,
  Target,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getUserProgress, getJourney } from '@/lib/api';
import { getJourneyColor, getMissionStatusStyles } from '@/lib/utils';

interface Progress {
  totalPoints: number;
  currentJourney: number;
  currentMission: number;
  completedMissions: number;
  totalMissions: number;
  certificates: number;
  journeys: Array<{
    journeyId: number;
    completedMissions: number;
    totalMissions: number;
    percentage: number;
    isCompleted: boolean;
  }>;
}

interface Mission {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  duration: number;
  status: string;
  points: number;
}

interface Journey {
  id: number;
  name: string;
  title: string;
  color: string;
  missions: Mission[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [progressData, journeyData] = await Promise.all([
          getUserProgress(),
          getJourney(1), // Load Journey 1 for MVP
        ]);
        setProgress(progressData);
        setCurrentJourney(journeyData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-white rounded-2xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }

  const currentMission = currentJourney?.missions.find(
    (m) => m.status === 'available' || m.status === 'in_progress'
  );

  const journeyProgress = progress?.journeys.find((j) => j.journeyId === 1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          ¡Hola, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-cyan-100">
          {currentMission
            ? `Tu próxima misión: ${currentMission.title}`
            : 'Has completado todas las misiones disponibles'}
        </p>

        {currentMission && (
          <Link
            href={`/missions/${currentMission.id}`}
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-cyan-600 rounded-lg font-medium hover:bg-cyan-50 transition"
          >
            <Play className="w-4 h-4" />
            Continuar Misión
          </Link>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress?.completedMissions || 0}</p>
              <p className="text-sm text-slate-500">Misiones</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress?.totalPoints || 0}</p>
              <p className="text-sm text-slate-500">Puntos</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress?.certificates || 0}</p>
              <p className="text-sm text-slate-500">Certificados</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Journey Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Jornada 1: Básico</h2>
            <p className="text-sm text-slate-500">
              {currentJourney?.title || 'Tu Asistente IA en 4 Horas'}
            </p>
          </div>
          <Link
            href="/journeys/1"
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Progreso</span>
            <span className="font-medium">{journeyProgress?.percentage || 0}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${journeyProgress?.percentage || 0}%` }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full"
            />
          </div>
        </div>

        {/* Missions list */}
        <div className="space-y-3">
          {currentJourney?.missions.map((mission, index) => {
            const styles = getMissionStatusStyles(mission.status);
            const isLocked = mission.status === 'locked';
            const isCompleted = mission.status === 'completed';

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {isLocked ? (
                  <div
                    className={`flex items-center gap-4 p-4 rounded-xl border bg-slate-50 ${styles.card}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-400">
                        Misión {mission.number}: {mission.title}
                      </h3>
                      <p className="text-sm text-slate-400">{mission.subtitle}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/missions/${mission.id}`}
                    className={`flex items-center gap-4 p-4 rounded-xl border bg-white transition ${styles.card}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100' : 'bg-cyan-100'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="font-bold text-cyan-600">
                          {mission.number}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{mission.title}</h3>
                      <p className="text-sm text-slate-500">{mission.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}
                      >
                        {isCompleted
                          ? 'Completada'
                          : mission.status === 'in_progress'
                            ? 'En progreso'
                            : 'Disponible'}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        +{mission.points} pts
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
