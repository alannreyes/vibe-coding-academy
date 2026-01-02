export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Mission {
  id: number;
  journeyId: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  duration: number;
  difficulty: Difficulty;
  resultTitle: string;
  resultDesc: string;
  showOffText: string;
  content: string;
  videoUrl: string | null;
  repoUrl: string | null;
  points: number;
  order: number;
}

export interface MissionWithStatus extends Mission {
  status: MissionStatus;
  quizPassed: boolean;
  quizScore: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface Card {
  id: string;
  missionId: number;
  type: CardType;
  icon: string;
  title: string;
  content: string;
  order: number;
}

export type CardType =
  | 'rescue'
  | 'concept'
  | 'comparison'
  | 'architecture'
  | 'command'
  | 'decision';

export interface MissionContent {
  sections: ContentSection[];
}

export interface ContentSection {
  type: 'intro' | 'theory' | 'practice' | 'code' | 'checkpoint' | 'reflection';
  title?: string;
  content: string;
  codeLanguage?: string;
  copyable?: boolean;
  checkItems?: string[];
}
