export interface QuizQuestion {
  id: string;
  missionId: number;
  question: string;
  options: QuizOption[];
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestionWithAnswer extends QuizQuestion {
  correctId: string;
  explanation: string | null;
}

export interface QuizSubmitRequest {
  answers: Record<string, string>; // { questionId: selectedOptionId }
}

export interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  attemptsRemaining: number;
  pointsEarned: number;
  results: Record<string, boolean>; // { questionId: isCorrect }
  explanations?: Record<string, string>; // { questionId: explanation }
  nextMissionUnlocked?: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  missionId: number;
  attemptNumber: number;
  score: number;
  passed: boolean;
  createdAt: Date;
}

export interface QuizStatus {
  attemptsUsed: number;
  maxAttempts: number;
  canAttempt: boolean;
  nextAttemptAt?: Date;
  bestScore?: number;
  passed: boolean;
}
