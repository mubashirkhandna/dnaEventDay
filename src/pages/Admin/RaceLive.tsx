import { useState, useEffect } from 'react';
import { getStore, initStore, AppState } from '../../lib/store';
import { motion } from 'framer-motion';

const TEAM_LEADER_PHOTOS: Record<string, string> = {
  'DNA-7776': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777371906/gqyh1ajrptduflsrdrfi.jpg',
  'DNA-1058': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825352/fhbw1deui0qqds2cgnae.jpg',
  'DNA-9480': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543703/be6uwxb5knkbkihvnfan.jpg',
  'DNA-8007': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828406/lmqkmaq7ddruo7pkfbot.jpg',
  'DNA-9804': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049017/gjhentasl1zpfw1p1iqc.png',
  'DNA-4795': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396543/owutwtc1ysqclnxyrjkd.jpg',
  'DNA-8629': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131166/uauqtrvekmd7di9frrb4.jpg',
  'DNA-8505': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816850/yzohfoknoppxtlk2xswn.jpg',
  'DNA-6684': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777998812/xu46envftwjovy40e8y3.jpg',
  'DNA-8241': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186584/xadbvhyo7wnns948bsox.jpg',
  'DNA-9506': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476394/f1pgjtxbniirxhuiipdv.jpg',
  'DNA-3525': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999039/voqjsrrsxwj71qxtkao4.jpg',
  'DNA-4961': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288866/r8gz9fqfsypwzhefnj0x.jpg',
  '0J1K6C6X': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481961/tq6nvoerumkogvwofys5.jpg',
  'DNA-3212':  'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481961/tq6nvoerumkogvwofys5.jpg',
  'DNA-8708': 'https://res.cloudinary.com/dtnyglz2z/image/upload/f_jpg/v1777397892/hnvhzwk5divndab0jvnb.heic',
  'DNA-9504': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095403/gqapmwxt79uv4vi3ceac.jpg',
  'DNA-1190': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778093168/li3adwrlu55kilj4redv.jpg',
  'DNA-9443': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778090055/zo2mxzekdorzuhk0kezv.jpg',
  'DNA-6438': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737259/gr4yblbx8hx9xdpzyf5r.jpg',
  'DNA-5702': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651652/mfuzqwwdygivm6g1pgsr.jpg',
  'DNA-6466': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568208/uxz6pmbnpgycamh4wm9d.jpg',
  'DNA-4691': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386529/oswf5as49gnkn4nzuvgw.jpg',
  'DNA-5481': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777031482/kwmaaayaiinu7wxhlfu7.jpg',
  'DNA-5627': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1775839717/qi38gxlg8v4dbssxd2hq.jpg',
};

export default function RaceLive() {
  const [state, setState] = useState<AppState>(getStore());

  useEffect(() => {
    initStore();
    const sync = () => setState(getStore());
    sync();
    window.addEventListener('h4h_state_change', sync);
    return () => window.removeEventListener('h4h_state_change', sync);
  }, []);

  const teamsWithVotes = state.teams
    .map((t) => ({
      ...t,
      totalVotes: state.audienceVoteTotals[t.id]?.total || 0,
      uniqueVotes: state.audienceVoteTotals[t.id]?.unique || 0,
    }))
    .sort((a, b) => b.uniqueVotes - a.uniqueVotes);

  const totalUniqueVotes = teamsWithVotes.reduce((s, t) => s + t.uniqueVotes, 0);
  const totalVotes = teamsWithVotes.reduce((s, t) => s + t.totalVotes, 0);
  const maxVotes = Math.max(...teamsWithVotes.map((t) => t.uniqueVotes), 1);

  return (
    <div className="min-h-screen bg-void-950 text-white px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-glow tracking-widest uppercase mb-3">
          Live Race: Audience Choice
        </h1>
        <div className="flex items-center justify-center gap-8 text-sm">
          <span className="text-slate-400">
            Unique Votes: <span className="text-brand-400 font-bold text-xl font-display">{totalUniqueVotes}</span>
          </span>
          <span className="text-slate-400">
            Total Cast: <span className="text-emerald-400 font-bold text-xl font-display">{totalVotes}</span>
          </span>
        </div>
        <p className="text-slate-600 text-xs mt-2 font-mono">Auto-refreshes every 5 s · sorted by unique votes</p>
      </div>

      {/* Race tracks */}
      <div className="max-w-5xl mx-auto space-y-4 relative pb-16">
        {/* Finish-line marker */}
        <div className="absolute top-0 bottom-0 right-[8%] border-r-2 border-dashed border-white/15 z-0 pointer-events-none" />

        {teamsWithVotes.map((team, rank) => {
          const pct = Math.min((team.uniqueVotes / maxVotes) * 88, 88);
          const leaderPhoto = TEAM_LEADER_PHOTOS[team.teamCode || ''] || team.members[0]?.photoUrl || '';
          const isLeader = rank === 0 && team.uniqueVotes > 0;

          return (
            <div
              key={team.id}
              className="relative z-10 w-full h-[4.5rem] bg-void-900/60 rounded-full border border-white/5 overflow-visible flex items-center"
            >
              {/* Rank badge */}
              <div className="absolute -left-8 z-30 w-6 text-center text-xs font-bold text-slate-500">
                #{rank + 1}
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 40, damping: 18 }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-r-full z-10 ${
                  isLeader
                    ? 'bg-brand-500 shadow-[0_0_20px_rgba(20,184,166,1)]'
                    : rank === 1
                    ? 'bg-slate-300/70'
                    : rank === 2
                    ? 'bg-amber-600/70'
                    : 'bg-brand-500/30'
                }`}
              />

              {/* Avatar */}
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `calc(${pct}% - 1.75rem)` }}
                transition={{ type: 'spring', stiffness: 40, damping: 18 }}
                className={`absolute z-20 h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 bg-void-800 ${
                  isLeader
                    ? 'border-brand-400 shadow-[0_0_28px_rgba(20,184,166,0.9)]'
                    : rank === 1
                    ? 'border-slate-300/60'
                    : rank === 2
                    ? 'border-amber-500/60'
                    : 'border-white/20'
                }`}
                style={{ marginLeft: '0.5rem' }}
              >
                {leaderPhoto ? (
                  <img src={leaderPhoto} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg">
                    {team.name[0]}
                  </div>
                )}
              </motion.div>

              {/* Name + vote count */}
              <div className="absolute right-4 z-30 flex items-center gap-3">
                <span className="text-slate-300 font-medium text-sm hidden sm:block truncate max-w-[9rem]">
                  {team.name}
                </span>
                <span className={`font-display font-bold text-2xl tabular-nums ${isLeader ? 'text-brand-400' : 'text-white'}`}>
                  {team.uniqueVotes}
                </span>
                <span className="text-xs text-slate-600 tabular-nums hidden md:block">/ {team.totalVotes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
