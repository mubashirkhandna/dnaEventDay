import { initialTeams, Team } from '../data/mockData';

export interface ScoreData {
  costEffectiveness: number;
  medicalImpact: number;
  feasibility: number;
  technicalExecution: number;
  note: string;
}

export interface AppState {
  teams: Team[];
  activeTeamId: string | null;
  pitchDuration: number; // In minutes
  pitchEndTime: number | null; // Timestamp for when the pitch ends
  judgeScores: Record<string, Record<string, ScoreData>>; // judgeEmail -> teamId -> ScoreData
  audienceVotes: Record<string, string[]>; // teamId -> list of IPs/phone numbers
  quizDuration: number; // In minutes
  quizEndTime: number | null; // Timestamp for when quiz ends
  quizSubmissions: Record<string, { score: number; timeTaken: number; submitTime: number }>;
  portalsEnabled: { judge: boolean; audience: boolean; quiz: boolean };
}

const defaultState: AppState = {
  teams: initialTeams,
  activeTeamId: null, // No active team by default
  pitchDuration: 5, // Default 5 minutes
  pitchEndTime: null,
  judgeScores: {},
  audienceVotes: {},
  quizDuration: 5, // Default 5 minutes
  quizEndTime: null,
  quizSubmissions: {},
  portalsEnabled: { judge: true, audience: true, quiz: true }
};

export const getStore = (): AppState => {
  const stored = localStorage.getItem('h4h_state');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...defaultState, ...parsed, portalsEnabled: { ...defaultState.portalsEnabled, ...(parsed.portalsEnabled || {}) } };
    } catch (e) {
      console.error('Failed to parse store', e);
    }
  }
  return defaultState;
};

export const setStore = (newState: Partial<AppState>) => {
  const current = getStore();
  const updated = { ...current, ...newState };
  localStorage.setItem('h4h_state', JSON.stringify(updated));
  // Dispatch custom event so other components can react
  window.dispatchEvent(new Event('h4h_state_change'));
};

export const resetStore = () => {
  localStorage.setItem('h4h_state', JSON.stringify(defaultState));
  window.dispatchEvent(new Event('h4h_state_change'));
};
