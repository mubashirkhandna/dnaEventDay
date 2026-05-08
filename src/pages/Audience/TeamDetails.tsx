import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStore, AppState } from '../../lib/store';
import { castVote } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Team } from '../../lib/api';
import PitchDeckViewer from '../../components/PitchDeckViewer';
import { ArrowLeft, ExternalLink, ThumbsUp, CheckCircle2, Loader2 } from 'lucide-react';

export default function AudienceTeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>(getStore());
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voting, setVoting] = useState(false);

  const audienceUserStr = localStorage.getItem('audience_user');
  const userIdentifier: string = audienceUserStr ? JSON.parse(audienceUserStr).whatsapp : 'anonymous';

  useEffect(() => {
    const sync = () => {
      const s = getStore();
      setState(s);
      // Only check this specific team's voter list — not all teams.
      // Multiple votes and cross-team votes are allowed; "hasVoted" is
      // just a per-team indicator showing the most recent vote state.
      const teamVoters: string[] = s.audienceVotes[id || ''] || [];
      setHasVoted(teamVoters.includes(userIdentifier));
    };
    sync();
    window.addEventListener('h4h_state_change', sync);
    return () => window.removeEventListener('h4h_state_change', sync);
  }, [userIdentifier, id]);

  const team: Team | undefined = state.teams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="p-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-400" />
        Loading team...
      </div>
    );
  }

  const handleVoteConfirm = async () => {
    if (!id) return;
    setVoting(true);
    try {
      await castVote(id);
      toast.success(`Vote cast for ${team.name}!`);
      setShowConfirm(false);
      // After a brief delay, reset the voted state so users can vote again.
      // Multiple votes are allowed; unique-IP tracking is handled server-side.
      setTimeout(() => setHasVoted(false), 3000);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <button onClick={() => navigate('/audience/teams')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </button>

      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{team.name}</h1>
        <p className="text-brand-400 text-sm font-mono mb-6">{team.theme}</p>

        {/* Pitch Deck — prefer Canva link if available, otherwise render PDF */}
        {team.pptxUrl ? (
          <div className="rounded-xl mb-6 overflow-hidden border border-white/10 bg-void-900/50">
            <div className="aspect-video flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">Canva Presentation</p>
                <p className="text-slate-400 text-sm mb-4">View this team's pitch deck on Canva</p>
                <a
                  href={team.pptxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-bold rounded-xl hover:bg-violet-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Open in Canva
                </a>
              </div>
            </div>
          </div>
        ) : team.pdfUrl ? (
          <div className="rounded-xl mb-6 overflow-hidden border border-white/10">
            <PitchDeckViewer url={team.pdfUrl} />
          </div>
        ) : (
          <div className="aspect-video bg-void-900 rounded-xl mb-6 flex items-center justify-center border border-white/5">
            <p className="text-slate-500 text-sm">No pitch deck submitted.</p>
          </div>
        )}

        <p className="text-slate-300 leading-relaxed mb-8">{team.description}</p>

        {(team.whyTheme || team.howSolution) && (
          <div className="space-y-4 mb-8">
            {team.whyTheme && (
              <div className="bg-void-900/60 border border-white/8 rounded-2xl p-5">
                <p className="text-[11px] font-mono text-brand-400 uppercase tracking-widest mb-2">Why this theme?</p>
                <p className="text-slate-300 text-sm leading-relaxed">{team.whyTheme}</p>
              </div>
            )}
            {team.howSolution && (
              <div className="bg-void-900/60 border border-white/8 rounded-2xl p-5">
                <p className="text-[11px] font-mono text-brand-400 uppercase tracking-widest mb-2">How did they come up with the solution?</p>
                <p className="text-slate-300 text-sm leading-relaxed">{team.howSolution}</p>
              </div>
            )}
          </div>
        )}

        {team.members.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-white mb-4">Team Members</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {team.members.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-void-900/50 p-3 rounded-xl border border-white/5">
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.display = 'none';
                        (t.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex');
                      }}
                    />
                  ) : null}
                  <div
                    className="w-10 h-10 rounded-full bg-void-800 border border-white/10 items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ display: m.photoUrl ? 'none' : 'flex' }}
                  >
                    {m.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{m.name}</p>
                    {i === 0 && <p className="text-[10px] text-brand-400 font-mono">Team Leader</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="sticky bottom-6 z-40 bg-void-900/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] text-center">
        {hasVoted ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mb-3 border border-brand-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-white font-bold text-lg">Thank You!</p>
            <p className="text-slate-400 text-sm mt-1">Your vote has been recorded securely.</p>
          </div>
        ) : showConfirm ? (
          <div className="py-2">
            <p className="text-white font-medium mb-4">
              Are you sure you want to vote for {team.name}?{' '}
              <br /><span className="text-sm text-brand-400">You can only vote for one team.</span>
            </p>
            <div className="flex gap-4 max-w-sm mx-auto">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={voting}
                className="flex-1 py-3 bg-void-800 text-white rounded-xl hover:bg-void-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVoteConfirm}
                disabled={voting}
                className="flex-1 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {voting ? <><Loader2 className="w-4 h-4 animate-spin" /> Voting...</> : 'Confirm Vote'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full max-w-md mx-auto py-4 bg-void-800 border border-brand-500/50 text-white font-bold text-lg rounded-xl hover:bg-brand-500 hover:text-black transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2 group"
          >
            <ThumbsUp className="group-hover:scale-110 transition-transform" /> Vote for {team.name}
          </button>
        )}
      </div>
    </div>
  );
}
