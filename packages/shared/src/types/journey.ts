import type { Mission } from './mission';

export interface Journey {
  id: number;
  name: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  requiredMissions: number;
}

export interface JourneyWithMissions extends Journey {
  missions: Mission[];
}

export interface JourneyProgress {
  journeyId: number;
  completedMissions: number;
  totalMissions: number;
  percentage: number;
  isCompleted: boolean;
  certificateId?: string;
}
