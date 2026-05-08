import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { getStore } from '../../lib/store';
import ComingSoon from '../../components/ComingSoon';

export default function QuizLogin() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && whatsapp) {
      localStorage.setItem('quiz_user', JSON.stringify({ email, whatsapp }));
      navigate('/quiz/take');
    }
  };

  const state = getStore();
  if (!state.portalsEnabled.quiz) {
    return <ComingSoon title="Quiz" />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-void-950">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl relative overflow-hidden border-yellow-500/20">
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none transform -translate-y-1/2"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            Live Now
          </div>
          <div className="mx-auto w-16 h-16 bg-void-800 rounded-full flex items-center justify-center border border-yellow-500/20 mb-4 shadow-lg">
            <BrainCircuit className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">Mega Quiz</h2>
          <p className="text-slate-400 text-sm mt-2">Enter the email and WhatsApp number you registered with.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Registered Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Number</label>
            <input 
              type="tel" 
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="+880 1..."
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.2)] transform hover:-translate-y-1 duration-200"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
