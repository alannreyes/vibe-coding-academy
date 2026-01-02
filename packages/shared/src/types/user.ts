export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl: string | null;
  firebaseUid: string;
  currentJourney: number;
  currentMission: number;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  completedMissions: number;
  certificates: number;
  streak: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  firebaseToken: string;
}
