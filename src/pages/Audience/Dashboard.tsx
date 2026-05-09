import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, AppState } from '../../lib/store';
import { Loader2, Trophy, Medal, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RankedTeam {
  id: string;
  name: string;
  theme: string;
  teamCode?: string;
  votes: number;
  rank: number;
}

const RANK_COLORS = [
  'from-yellow-500/30 to-yellow-500/5 border-yellow-500/40',
  'from-slate-400/30 to-slate-400/5 border-slate-400/40',
  'from-amber-600/30 to-amber-600/5 border-amber-600/40',
];
const RANK_ICONS = [
  <Trophy key="1" className="w-5 h-5 text-yellow-400" />,
  <Medal key="2" className="w-5 h-5 text-slate-300" />,
  <Medal key="3" className="w-5 h-5 text-amber-600" />,
];

export default function AudienceDashboard() {
  const [state, setState] = useState<AppState>(getStore());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setState(getStore());
    window.addEventListener('h4h_state_change', sync);
    return () => window.removeEventListener('h4h_state_change', sync);
  }, []);

  if (state.teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
        <p className="text-sm font-mono">Connecting to server...</p>
      </div>
    );
  }

  // Sort all teams by votes, take top 12
  const ranked: RankedTeam[] = state.teams
    .map((t) => ({ ...t, votes: state.audienceVoteTotals[t.id]?.unique || 0 }))
    .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name))
    .slice(0, 12)
    .map((t, i) => ({ ...t, rank: i + 1 }));

  const maxVotes = Math.max(...ranked.map((t) => t.votes), 1);
  const totalVotes = ranked.reduce((s, t) => s + t.votes, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
          Audience <span className="text-brand-400">Choice</span>
        </h2>
        <p className="text-slate-400 text-sm mb-2">Top 12 teams — live standings</p>
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-brand-400 font-mono text-sm font-bold">{totalVotes} votes cast</span>
          </div>
          <a
            href="/hello-kitty/race"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-400 text-black font-bold rounded-xl transition-colors shadow-[0_0_16px_rgba(20,184,166,0.35)] text-sm"
          >
            🏁 Watch Live Race
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {ranked.map((team) => {
            const barPct = Math.max((team.votes / maxVotes) * 100, team.votes > 0 ? 4 : 0);
            const rankStyle = RANK_COLORS[team.rank - 1] ?? 'from-void-800/60 to-void-900/60 border-white/10';
            const rankIcon = RANK_ICONS[team.rank - 1] ?? <Star className="w-4 h-4 text-slate-600" />;

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => navigate(`/audience/team/${team.id}`)}
                className={`relative cursor-pointer rounded-2xl border bg-gradient-to-r ${rankStyle} overflow-hidden group`}
              >
                {/* Vote bar fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-brand-500/10"
                  animate={{ width: `${barPct}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />

                <div className="relative z-10 flex items-center gap-4 px-4 py-4">
                  {/* Rank badge */}
                  <div className="flex items-center justify-center w-10 shrink-0">
                    {team.rank <= 3 ? rankIcon : (
                      <span className="text-slate-500 font-mono font-bold text-sm">#{team.rank}</span>
                    )}
                  </div>

                  {/* Team info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base leading-tight truncate group-hover:text-brand-400 transition-colors">
                      {team.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{team.theme}</p>
                  </div>

                  {/* Vote count */}
                  <div className="text-right shrink-0">
                    <motion.p
                      key={team.votes}
                      initial={{ scale: 1.4, color: '#14b8a6' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.4 }}
                      className="text-xl font-display font-bold text-white"
                    >
                      {team.votes}
                    </motion.p>
                    <p className="text-xs text-slate-500">votes</p>
                  </div>

                  {/* Arrow */}
                  <span className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all ml-1">→</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-slate-600 mt-8">
        Click a team to view details and cast your vote
      </p>
    </div>
  );
}
