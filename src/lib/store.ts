import { fetchState } from './api';
import { createWebSocket } from './ws';
import type { AppStateResponse, Team, ScoreData } from './api';

export type { ScoreData };

export interface AppState {
  teams: Team[];
  activeTeamId: string | null;
  pitchDuration: number;
  pitchEndTime: number | null;
  judgeScores: Record<string, Record<string, ScoreData>>;
  audienceVotes: Record<string, string[]>;
  quizDuration: number;
  quizEndTime: number | null;
  quizSubmissions: Record<string, { score: number; timeTaken: number; submitTime: number }>;
  portalsEnabled: { judge: boolean; audience: boolean; quiz: boolean };
  scoreRequests: Record<string, 'pending' | 'approved' | 'rejected'>;
}

const defaultState: AppState = {
  teams: [],
  activeTeamId: null,
  pitchDuration: 5,
  pitchEndTime: null,
  judgeScores: {},
  audienceVotes: {},
  quizDuration: 5,
  quizEndTime: null,
  quizSubmissions: {},
  portalsEnabled: { judge: true, audience: true, quiz: true },
  scoreRequests: {},
};

let currentState: AppState = { ...defaultState };
let pollInterval: ReturnType<typeof setInterval> | null = null;

function mapServerState(s: AppStateResponse): AppState {
  return {
    teams: s.teams,
    activeTeamId: s.activeTeamId,
    pitchDuration: s.pitchDuration,
    pitchEndTime: s.pitchEndTime,
    judgeScores: s.judgeScores,
    audienceVotes: s.audienceVotes,
    quizDuration: s.quizDuration,
    quizEndTime: s.quizEndTime,
    quizSubmissions: s.quizSubmissions,
    portalsEnabled: s.portalsEnabled,
    scoreRequests: s.scoreRequests as Record<string, 'pending' | 'approved' | 'rejected'>,
  };
}

export const getStore = (): AppState => currentState;

export const setStore = (patch: Partial<AppState>) => {
  currentState = { ...currentState, ...patch };
  window.dispatchEvent(new Event('h4h_state_change'));
};

// Fetch full state from API and push to local store
export async function refreshStore(): Promise<void> {
  try {
    const data = await fetchState();
    currentState = mapServerState(data);
    window.dispatchEvent(new Event('h4h_state_change'));
  } catch (e) {
    console.error('[Store] Failed to refresh state:', e);
  }
}

// Initialize store: fetch state + connect WebSocket + set up polling fallback
export async function initStore(): Promise<void> {
  await refreshStore();

  // WebSocket for real-time push
  try {
    createWebSocket(async (msg) => {
      const type = msg.type as string;
      if (['state_update', 'settings_update', 'reset', 'scores_update',
        'votes_update', 'quiz_update', 'score_request_update', 'score_request_new',
        'teams_update'].includes(type)) {
        await refreshStore();
      }
    });
  } catch (e) {
    console.warn('[Store] WebSocket unavailable, falling back to polling');
  }

  // Poll every 5s as fallback / supplement
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(refreshStore, 5000);
}

export const resetStore = async () => {
  currentState = { ...defaultState };
  window.dispatchEvent(new Event('h4h_state_change'));
};
