import type { JourneyProgress } from './journey';
import type { MissionStatus } from './mission';

export interface UserProgress {
  totalPoints: number;
  currentJourney: number;
  currentMission: number;
  completedMissions: number;
  totalMissions: number;
  certificates: number;
  journeys: JourneyProgress[];
}

export interface MissionProgress {
  id: string;
  userId: string;
  missionId: number;
  status: MissionStatus;
  startedAt: Date | null;
  completedAt: Date | null;
  quizPassed: boolean;
  quizScore: number | null;
}

export interface ProgressUpdate {
  missionId: number;
  status: MissionStatus;
  pointsEarned?: number;
  nextMissionUnlocked?: number;
}
