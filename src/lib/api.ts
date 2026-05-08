const API_URL = '';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = (role: string): string | null =>
  localStorage.getItem(`${role}_token`);

export const setToken = (role: string, token: string) =>
  localStorage.setItem(`${role}_token`, token);

export const clearToken = (role: string) =>
  localStorage.removeItem(`${role}_token`);

// ─── Core fetch ───────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  role?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (role) {
    const token = getToken(role);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── State ────────────────────────────────────────────────────────────────────
export const fetchState = () => apiFetch<AppStateResponse>('/api/state');

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminLogin = (username: string, password: string) =>
  apiFetch<{ token: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const adminPatchSettings = (data: Record<string, unknown>) =>
  apiFetch<AppSettings>('/api/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, 'admin');

export const adminStartPitch = (teamId: string) =>
  apiFetch<StateUpdate>('/api/admin/pitch/start', {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  }, 'admin');

export const adminStopPitch = () =>
  apiFetch<StateUpdate>('/api/admin/pitch/stop', { method: 'POST' }, 'admin');

export const adminRestartPitch = () =>
  apiFetch<AppSettings>('/api/admin/pitch/restart', { method: 'POST' }, 'admin');

export const adminResetTeam = (teamId: string) =>
  apiFetch<StateUpdate>('/api/admin/pitch/reset-team', {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  }, 'admin');

export const adminStartQuiz = () =>
  apiFetch<AppSettings>('/api/admin/quiz/start', { method: 'POST' }, 'admin');

export const adminResetQuiz = () =>
  apiFetch<AppSettings>('/api/admin/quiz/reset', { method: 'POST' }, 'admin');

export const adminGetScores = () =>
  apiFetch<JudgeScoreRecord[]>('/api/admin/scores', {}, 'admin');

export const adminPatchScore = (id: string, data: Record<string, unknown>) =>
  apiFetch<JudgeScoreRecord>(`/api/admin/scores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, 'admin');

export const adminGetScoreRequests = () =>
  apiFetch<ScoreRequestRecord[]>('/api/admin/score-requests', {}, 'admin');

export const adminPatchScoreRequest = (id: string, status: 'APPROVED' | 'REJECTED') =>
  apiFetch<ScoreRequestRecord>(`/api/admin/score-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'admin');

export const adminReset = () =>
  apiFetch<{ success: boolean }>('/api/admin/reset', { method: 'POST' }, 'admin');

export const adminCreateJudge = (data: { email: string; name: string; password: string }) =>
  apiFetch<{ id: string; email: string; name: string }>('/api/admin/judges', {
    method: 'POST',
    body: JSON.stringify(data),
  }, 'admin');

export const adminGetJudges = () =>
  apiFetch<{ id: string; email: string; name: string; createdAt: string }[]>(
    '/api/admin/judges',
    {},
    'admin'
  );

// ─── Teams ────────────────────────────────────────────────────────────────────
export const getTeams = () => apiFetch<Team[]>('/api/teams');
export const getTeam = (id: string) => apiFetch<Team>(`/api/teams/${id}`);

// ─── Judges ───────────────────────────────────────────────────────────────────
export const judgeLogin = (email: string, password: string) =>
  apiFetch<{ token: string; email: string; name: string }>('/api/judges/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const judgeGetMyScores = () =>
  apiFetch<JudgeScoreRecord[]>('/api/judges/me/scores', {}, 'judge');

// ─── Scores ───────────────────────────────────────────────────────────────────
export const submitScore = (data: {
  teamId: string;
  costEffectiveness: number;
  medicalImpact: number;
  feasibility: number;
  technicalExecution: number;
  note: string;
}) =>
  apiFetch<JudgeScoreRecord>('/api/scores', {
    method: 'POST',
    body: JSON.stringify(data),
  }, 'judge');

// ─── Score Requests ───────────────────────────────────────────────────────────
export const requestScoreAccess = (teamId: string) =>
  apiFetch<ScoreRequestRecord>('/api/score-requests', {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  }, 'judge');

export const getMyScoreRequests = () =>
  apiFetch<ScoreRequestRecord[]>('/api/score-requests/me', {}, 'judge');

// ─── Audience ─────────────────────────────────────────────────────────────────
export const audienceLogin = (name: string, whatsapp: string) =>
  apiFetch<{ token: string; name: string; whatsapp: string; hasVoted: boolean; votedTeamId: string | null }>(
    '/api/audience/login',
    { method: 'POST', body: JSON.stringify({ name, whatsapp }) }
  );

export const castVote = (teamId: string) =>
  apiFetch<{ id: string; teamId: string }>('/api/votes', {
    method: 'POST',
    body: JSON.stringify({ teamId }),
  }, 'audience');

export const getVotes = () =>
  apiFetch<{ teamId: string; teamName: string; voteCount: number }[]>('/api/votes');

export const getMyVote = () =>
  apiFetch<{ hasVoted: boolean; votedTeamId: string | null }>('/api/votes/mine', {}, 'audience');

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export const quizLogin = (email: string, whatsapp: string) =>
  apiFetch<{ token: string; email: string; whatsapp: string; hasSubmitted: boolean; score: number | null }>(
    '/api/quiz/login',
    { method: 'POST', body: JSON.stringify({ email, whatsapp }) }
  );

export const getQuizQuestions = () =>
  apiFetch<QuizQuestion[]>('/api/quiz/questions', {}, 'quiz');

export const submitQuiz = (answers: Record<string, string>, timeTaken: number) =>
  apiFetch<{ score: number; timeTaken: number }>('/api/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ answers, timeTaken }),
  }, 'quiz');

export const getLeaderboard = () =>
  apiFetch<QuizSubmission[]>('/api/quiz/leaderboard');

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  photoUrl: string;
}

export interface Team {
  id: string;
  name: string;
  teamCode?: string;
  theme: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  pptxUrl?: string;
  status: 'waiting' | 'presenting' | 'completed';
  order: number;
  members: TeamMember[];
}

export interface AppSettings {
  id: number;
  activeTeamId: string | null;
  pitchDuration: number;
  pitchEndTime: number | null;
  quizDuration: number;
  quizEndTime: number | null;
  judgePortal: boolean;
  audiencePortal: boolean;
  quizPortal: boolean;
}

export interface StateUpdate {
  settings: AppSettings;
  teams: Team[];
}

export interface AppStateResponse {
  settings: AppSettings;
  teams: Team[];
  audienceVotes: Record<string, string[]>;
  judgeScores: Record<string, Record<string, ScoreData>>;
  scoreRequests: Record<string, string>;
  quizSubmissions: Record<string, { score: number; timeTaken: number; submitTime: number }>;
  portalsEnabled: { judge: boolean; audience: boolean; quiz: boolean };
  activeTeamId: string | null;
  pitchDuration: number;
  pitchEndTime: number | null;
  quizDuration: number;
  quizEndTime: number | null;
}

export interface ScoreData {
  id?: string;
  costEffectiveness: number;
  medicalImpact: number;
  feasibility: number;
  technicalExecution: number;
  note: string;
}

export interface JudgeScoreRecord {
  id: string;
  judgeId: string;
  teamId: string;
  costEffectiveness: number;
  medicalImpact: number;
  feasibility: number;
  technicalExecution: number;
  note: string;
  judge: { id: string; email: string; name: string };
  team: { id: string; name: string };
}

export interface ScoreRequestRecord {
  id: string;
  judgeId: string;
  teamId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  judge: { id: string; email: string; name: string };
  team: { id: string; name: string };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
}

export interface QuizSubmission {
  id: string;
  email: string;
  whatsapp: string;
  score: number;
  timeTaken: number;
  submitTime: string;
  rank: number;
}
