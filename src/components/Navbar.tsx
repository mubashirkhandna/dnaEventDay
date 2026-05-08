import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dna, Timer, LogOut } from 'lucide-react';
import { getStore } from '../lib/store';
import { getToken, clearToken } from '../lib/api';

export default function Navbar() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTimer = () => {
      const state = getStore();
      setActiveTeam(state.teams.find(t => t.id === state.activeTeamId)?.name || null);
      if (state.pitchEndTime) {
        const remaining = Math.max(0, Math.floor((state.pitchEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }
    };
    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    window.addEventListener('h4h_state_change', checkTimer);
    return () => {
      clearInterval(interval);
      window.removeEventListener('h4h_state_change', checkTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const path = location.pathname;
  const isJudgePanel = path.includes('/judge');

  // Determine active session for logout
  const activeRole = (() => {
    if (path.startsWith('/admin') && getToken('admin')) return 'admin';
    if (path.startsWith('/judge') && getToken('judge')) return 'judge';
    if (path.startsWith('/audience') && getToken('audience')) return 'audience';
    if (path.startsWith('/quiz') && getToken('quiz')) return 'quiz';
    return null;
  })();

  const handleLogout = () => {
    if (!activeRole) return;
    clearToken(activeRole);
    if (activeRole === 'admin') navigate('/admin');
    else if (activeRole === 'judge') navigate('/judge');
    else if (activeRole === 'audience') navigate('/audience');
    else navigate('/quiz');
  };

  return (
    <nav className="fixed w-full z-50 glass h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-500 blur-md opacity-50 rounded-full"></div>
              <Dna className="text-brand-400 w-5 h-5 relative z-10" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              DNA<span className="text-brand-400">HackForHealth</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/judge" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Judge Panel</Link>
            <Link to="/audience" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Audience Vote</Link>
            <Link to="/quiz" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors">Take Quiz</Link>
          </div>

          <div className="flex items-center gap-4">
            {isJudgePanel && activeTeam && (
              <div className="flex items-center gap-2 sm:gap-3 bg-void-900/80 px-3 sm:px-4 py-1.5 rounded-full border border-brand-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Timer className={`w-4 h-4 ${timeLeft < 30 && timeLeft > 0 ? 'text-red-400 animate-pulse' : 'text-brand-400'}`} />
                <span className={`text-sm font-bold tracking-widest font-mono ${timeLeft < 30 && timeLeft > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{formatTime(timeLeft)}</span>
                <span className="hidden sm:inline text-xs text-slate-400 border-l border-white/20 pl-3">Pitching: <span className="text-brand-400 font-medium">{activeTeam}</span></span>
              </div>
            )}
            {activeRole && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
