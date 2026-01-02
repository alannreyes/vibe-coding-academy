import { getIdToken } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getIdToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth
export async function loginWithToken(firebaseToken: string) {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ firebaseToken }),
  });
}

export async function getCurrentUser() {
  return fetchWithAuth('/auth/me');
}

// Progress
export async function getUserProgress() {
  return fetchWithAuth('/progress');
}

export async function getJourneyProgress(journeyId: number) {
  return fetchWithAuth(`/progress/journey/${journeyId}`);
}

// Journeys
export async function getJourneys() {
  return fetchWithAuth('/journeys');
}

export async function getJourney(id: number) {
  return fetchWithAuth(`/journeys/${id}`);
}

// Missions
export async function getMission(id: number) {
  return fetchWithAuth(`/missions/${id}`);
}

export async function startMission(id: number) {
  return fetchWithAuth(`/missions/${id}/start`, { method: 'POST' });
}

export async function getMissionCards(id: number) {
  return fetchWithAuth(`/missions/${id}/cards`);
}

// Quiz
export async function getQuizQuestions(missionId: number) {
  return fetchWithAuth(`/quiz/${missionId}`);
}

export async function getQuizStatus(missionId: number) {
  return fetchWithAuth(`/quiz/${missionId}/status`);
}

export async function submitQuiz(missionId: number, answers: Record<string, string>) {
  return fetchWithAuth(`/quiz/${missionId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

export async function getQuizAttempts(missionId: number) {
  return fetchWithAuth(`/quiz/${missionId}/attempts`);
}

// Certificates
export async function getCertificates() {
  return fetchWithAuth('/certificates');
}

export async function downloadCertificate(id: string) {
  const token = await getIdToken();
  const response = await fetch(`${API_URL}/api/certificates/${id}/download`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download certificate');
  }

  return response.blob();
}

// Public - Verify certificate
export async function verifyCertificate(code: string) {
  const response = await fetch(`${API_URL}/api/verify/${code}`);
  return response.json();
}

// User preferences
export async function updateUserPreferences(data: {
  operatingSystem?: 'windows' | 'mac' | 'linux';
  onboardingCompleted?: boolean;
}) {
  return fetchWithAuth('/users/preferences', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
