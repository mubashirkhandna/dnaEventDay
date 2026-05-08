import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { getStore } from '../../lib/store';
import ComingSoon from '../../components/ComingSoon';

export default function AudienceLogin() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && whatsapp) {
      localStorage.setItem('audience_user', JSON.stringify({ name, whatsapp }));
      navigate('/audience/teams');
    }
  };

  const state = getStore();
  if (!state.portalsEnabled.audience) {
    return <ComingSoon title="Audience" />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-void-950">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-void-800 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-lg">
            <Users className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Audience Vote</h2>
          <p className="text-slate-400 text-sm mt-2">Enter your details to support your favorite team.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Number</label>
            <input 
              type="tel" 
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="+880 1..."
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-void-800 border border-white/10 text-white font-bold rounded-xl hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-all shadow-lg"
          >
            Enter Portal
          </button>
        </form>
      </div>
    </div>
  );
}
