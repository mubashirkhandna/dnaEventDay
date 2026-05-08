import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStore, AppState } from '../../lib/store';
import { submitScore, requestScoreAccess, ScoreData, Team } from '../../lib/api';
import { withToast } from '../../lib/toast';
import { ArrowLeft, Presentation, CheckCircle2, AlertTriangle, Loader2, Download, ExternalLink } from 'lucide-react';
import PitchDeckViewer from '../../components/PitchDeckViewer';

export default function JudgeTeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>(getStore());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const judgeEmail = localStorage.getItem('judge_email') || '';

  const [scores, setScores] = useState<ScoreData>({
    costEffectiveness: 0, medicalImpact: 0, feasibility: 0,
    technicalExecution: 0, note: '',
  });

  useEffect(() => {
    const sync = () => setState(getStore());
    sync();
    window.addEventListener('h4h_state_change', sync);
    return () => window.removeEventListener('h4h_state_change', sync);
  }, []);

  // Sync scores from store when state changes
  useEffect(() => {
    const existing = state.judgeScores[judgeEmail]?.[id || ''];
    if (existing) setScores(existing);
  }, [state, judgeEmail, id]);

  const team: Team | undefined = state.teams.find((t) => t.id === id);
  const isActiveTeam = state.activeTeamId === id;
  const hasScored = !!state.judgeScores[judgeEmail]?.[id || ''];
  const requestStatus = state.scoreRequests[`${judgeEmail}_${id}`] || null;

  if (!team) {
    return (
      <div className="p-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-400" />
        Loading team...
      </div>
    );
  }

  const CRITERIA_WEIGHTS: Record<string, number> = {
    costEffectiveness: 35, medicalImpact: 30, feasibility: 20, technicalExecution: 15,
  };

  const handleScoreChange = (field: keyof ScoreData, value: string) => {
    if (field === 'note') {
      setScores({ ...scores, note: value });
    } else {
      let num = parseInt(value, 10);
      if (isNaN(num)) num = 0;
      const max = CRITERIA_WEIGHTS[field as string] || 100;
      setScores({ ...scores, [field]: Math.min(Math.max(num, 0), max) });
    }
  };

  const handleSubmitScore = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      await withToast(
        submitScore({ teamId: id, ...scores }),
        { loading: 'Submitting score...', success: 'Score submitted!' }
      );
      setIsModalOpen(false);
    } catch {
      // error already toasted
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!id) return;
    setRequesting(true);
    try {
      await withToast(
        requestScoreAccess(id),
        { loading: 'Sending request...', success: 'Access request sent to admin' }
      );
    } catch {
      // error already toasted
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <button onClick={() => navigate('/judge/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{team.name}</h1>
        <div className="flex items-center gap-3 mb-6">
          <p className="text-brand-400 text-sm font-mono">{team.theme}</p>
          {team.teamCode && (
            <span className="text-xs px-2 py-0.5 bg-void-800 border border-white/10 rounded-full text-slate-400 font-mono">
              {team.teamCode}
            </span>
          )}
        </div>

        <div className="aspect-video bg-void-900 rounded-xl mb-6 overflow-hidden border border-brand-500/30 relative shadow-[0_0_20px_rgba(20,184,166,0.15)]">
          <iframe
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Live Event Stream"
          />
        </div>

        <p className="text-slate-300 leading-relaxed mb-6">{team.description}</p>

        {(team.whyTheme || team.howSolution) && (
          <div className="space-y-4 mb-8">
            {team.whyTheme && (
              <div className="bg-void-950/60 border border-brand-500/15 rounded-2xl p-5">
                <p className="text-[11px] font-mono text-brand-400 uppercase tracking-widest mb-2">Why this theme?</p>
                <p className="text-slate-300 text-sm leading-relaxed">{team.whyTheme}</p>
              </div>
            )}
            {team.howSolution && (
              <div className="bg-void-950/60 border border-brand-500/15 rounded-2xl p-5">
                <p className="text-[11px] font-mono text-brand-400 uppercase tracking-widest mb-2">How did they come up with the solution?</p>
                <p className="text-slate-300 text-sm leading-relaxed">{team.howSolution}</p>
              </div>
            )}
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-4">Team Members</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {team.members.map((m, i) => (
            <div key={i} className="flex items-center gap-3 bg-void-900/50 p-3 rounded-xl border border-white/5">
              <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
              <span className="text-sm font-medium text-slate-200">{m.name}</span>
            </div>
          ))}
        </div>

        {/* PDF Presentation Viewer */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Presentation className="text-brand-400" /> Pitch Deck
            </h3>
            {team.pptxUrl && (
              <a
                href={team.pptxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${team.pptxUrl.includes('canva.link') ? 'bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 hover:text-violet-200' : 'bg-void-800 hover:bg-void-700 border border-white/10 text-slate-300 hover:text-white'}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {team.pptxUrl.includes('canva.link') ? 'Open in Canva' : 'Download PPTX'}
              </a>
            )}
            {team.pdfUrl && (
              <a
                href={team.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-void-800 hover:bg-void-700 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors ml-2"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
              </a>
            )}
          </div>
          {team.pptxUrl?.includes('canva.link') ? (
            <div className="flex flex-col items-center justify-center h-40 bg-violet-500/5 rounded-xl border border-violet-500/20 gap-3 text-violet-300">
              <ExternalLink className="w-10 h-10 opacity-60" />
              <p className="text-sm">Use the <span className="font-bold">Open in Canva</span> button above to view the presentation.</p>
            </div>
          ) : team.pdfUrl ? (
            <div className="w-full rounded-xl overflow-hidden border border-white/10">
              <PitchDeckViewer url={team.pdfUrl} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-void-900 rounded-xl border border-white/10 gap-3 text-slate-500">
              <Presentation className="w-10 h-10 opacity-30" />
              <p className="text-sm">No pitch deck submitted.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Area */}
      <div className="sticky bottom-6 z-40 bg-void-900/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-brand-500/30 shadow-[0_-10px_40px_rgba(20,184,166,0.15)]">
        {hasScored ? (
          <div>
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-4">
              <CheckCircle2 /> Score Submitted Successfully
            </div>
            <textarea
              value={scores.note}
              readOnly
              className="w-full h-24 bg-void-950/50 border border-white/10 rounded-xl p-3 text-slate-400 text-sm opacity-70 custom-scrollbar"
            />
          </div>
        ) : !isActiveTeam && requestStatus !== 'approved' ? (
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-white font-bold mb-1">Scoring is Locked</p>
            <p className="text-slate-400 text-sm mb-4">You can only evaluate a team while they are actively presenting.</p>
            {requestStatus === 'pending' ? (
              <div className="inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 rounded-xl text-sm font-bold">
                Request Pending Admin Approval...
              </div>
            ) : requestStatus === 'rejected' ? (
              <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl text-sm font-bold">
                Request Denied by Admin
              </div>
            ) : (
              <button
                onClick={handleRequestAccess}
                disabled={requesting}
                className="px-6 py-2 bg-void-800 border border-white/10 rounded-xl text-white text-sm font-bold hover:bg-brand-500 hover:text-black hover:border-brand-500 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {requesting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Request Access to Score'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-brand-500 text-black font-bold text-lg rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Score {team.name}
            </button>
            <textarea
              value={scores.note}
              onChange={(e) => handleScoreChange('note', e.target.value)}
              placeholder="Take private notes here... (Auto-saves with score)"
              className="w-full h-24 bg-void-950/80 border border-brand-500/20 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {/* Scoring Modal */}
      {isModalOpen && !hasScored && (
        <div className="fixed inset-0 z-50 bg-void-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto py-10">
          <div className="bg-void-900 border border-brand-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full my-auto shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Evaluating: {team.name}</h2>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { key: 'costEffectiveness', label: 'Cost-Effectiveness ("Budget Genius" Factor)', max: 35 },
                { key: 'medicalImpact', label: 'Medical Impact ("Life-Saving" Factor)', max: 30 },
                { key: 'feasibility', label: 'Feasibility & Scalability ("Rural Readiness" Factor)', max: 20 },
                { key: 'technicalExecution', label: 'Technical Execution ("Professional" Factor)', max: 15 },
              ].map((criteria) => (
                <div key={criteria.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-void-950/50 p-4 rounded-xl border border-white/5">
                  <label className="text-sm font-medium text-slate-300">{criteria.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={criteria.max}
                      value={scores[criteria.key as keyof ScoreData]}
                      onChange={(e) => handleScoreChange(criteria.key as keyof ScoreData, e.target.value)}
                      className="w-20 bg-void-800 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-xs text-slate-500">/ {criteria.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200/80">Caution: Submitting these scores is final. Your notes will be saved alongside this submission.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} disabled={submitting} className="flex-1 py-3 bg-void-800 text-white font-medium rounded-xl hover:bg-void-700 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button
                  onClick={handleSubmitScore}
                  disabled={submitting}
                  className="flex-1 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Final Score'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
