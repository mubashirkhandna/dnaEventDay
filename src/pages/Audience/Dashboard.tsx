import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, AppState } from '../../lib/store';

export default function AudienceDashboard() {
  const [state, setState] = useState<AppState>(getStore());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => setState(getStore());
    window.addEventListener('h4h_state_change', handleStorage);
    return () => window.removeEventListener('h4h_state_change', handleStorage);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Select a Team</h2>
        <p className="text-slate-400">Review their mission and cast your vote.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.teams.map((team) => (
          <div 
            key={team.id}
            onClick={() => navigate(`/audience/team/${team.id}`)}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full pointer-events-none group-hover:bg-brand-500/10 transition-colors"></div>
            <h3 className="text-2xl font-bold text-white group-hover:text-brand-400 transition-colors mb-2">{team.name}</h3>
            <p className="text-xs font-mono text-brand-500 mb-4">{team.theme}</p>
            <p className="text-sm text-slate-400 line-clamp-3">{team.description}</p>
            <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-white transition-colors">
              View Details & Vote <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
