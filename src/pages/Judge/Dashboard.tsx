import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, AppState } from '../../lib/store';
import { Timer, CircleDot, Loader2 } from 'lucide-react';

export default function JudgeDashboard() {
  const [state, setState] = useState<AppState>(getStore());
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const handleStorage = () => setState(getStore());
    window.addEventListener('h4h_state_change', handleStorage);
    
    const timerInterval = setInterval(() => {
      const currentState = getStore();
      if (currentState.pitchEndTime) {
        setTimeLeft(Math.max(0, Math.floor((currentState.pitchEndTime - Date.now()) / 1000)));
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => {
      window.removeEventListener('h4h_state_change', handleStorage);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeTeam = state.teams.find(t => t.id === state.activeTeamId);
  const judgeEmail = localStorage.getItem('judge_email') || '';

  if (state.teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
        <p className="text-sm font-mono">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {activeTeam && (
        <div className="glass-card rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between border-brand-500/50 shadow-[0_0_30px_rgba(20,184,166,0.15)] bg-void-950/80">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/10 ${timeLeft < 30 ? 'bg-red-500/20' : 'bg-void-800'}`}>
              <Timer className={`w-7 h-7 ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-brand-400'}`} />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Active Pitch Timer</div>
              <div className={`text-4xl font-display font-bold tracking-tight ${timeLeft < 30 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</div>
            </div>
          </div>
          
          <div className="text-center md:text-right bg-void-900/50 px-6 py-3 rounded-xl border border-white/5">
            <div className="text-xs text-brand-400 uppercase tracking-widest font-bold mb-1 flex items-center justify-center md:justify-end gap-2">
              <CircleDot className="w-3 h-3 animate-pulse text-green-500" /> Currently Presenting
            </div>
            <div className="text-2xl font-bold text-white">{activeTeam.name}</div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-display font-bold text-white mb-6">Participating Teams</h2>
      
      <div className="space-y-4">
        {state.teams.map((team) => {
          const isActive = team.id === state.activeTeamId;
          const isWaiting = team.status === 'waiting';
          const hasScored = state.judgeScores[judgeEmail]?.[team.id];

          return (
            <div 
              key={team.id}
              onClick={() => {
                if (!isWaiting) navigate(`/judge/team/${team.id}`);
              }}
              className={`glass-card p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group 
                ${isWaiting ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'} 
                ${!isActive && !isWaiting && 'opacity-80 hover:opacity-100'} 
                ${hasScored && 'border-green-500/30 bg-green-900/10'}`}
            >
              <div className="flex items-center gap-4">
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                )}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-white group-hover:text-brand-400 transition-colors">{team.name}</h3>
                    <div className="flex gap-2">
                      {isWaiting && <span className="bg-void-800 text-slate-400 text-xs px-3 py-1 rounded-full border border-white/10">Locked</span>}
                      {hasScored && <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">Scored</span>}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{team.theme}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
