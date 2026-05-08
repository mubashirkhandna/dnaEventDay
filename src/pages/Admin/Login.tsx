import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'smon' && pass === 'focusshadman') {
      localStorage.setItem('admin_auth', 'true');
      navigate('/hello-kitty/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-void-950">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl relative overflow-hidden border-red-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-[100px] pointer-events-none"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-void-800 rounded-full flex items-center justify-center border border-red-500/20 mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">System Admin</h2>
          <p className="text-slate-400 text-sm mt-2">Restricted Area. Authorized access only.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input 
              type="text" 
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] transform hover:-translate-y-1 duration-200"
          >
            Access Mainframe
          </button>
        </form>
      </div>
    </div>
  );
}
