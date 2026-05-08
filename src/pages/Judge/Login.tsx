import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { getStore } from '../../lib/store';
import { judgeLogin, setToken, getToken } from '../../lib/api';
import { toast } from '../../lib/toast';
import ComingSoon from '../../components/ComingSoon';

export default function JudgeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-login: must be before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (getToken('judge')) {
      navigate('/judge/dashboard', { replace: true });
    }
  }, [navigate]);

  const state = getStore();
  if (!state.portalsEnabled.judge) return <ComingSoon title="Judge" />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await judgeLogin(email, password);
      setToken('judge', res.token);
      localStorage.setItem('judge_email', res.email);
      toast.success(`Welcome, ${res.name || res.email}`);
      navigate('/judge/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-[100px] pointer-events-none"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-void-800 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Judge Portal</h2>
          <p className="text-slate-400 text-sm mt-2">Enter your credentials to access the scoring panel.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
              placeholder="judge@dnahealth.co"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)] transform hover:-translate-y-1 duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
