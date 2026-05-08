import { useState, useEffect } from 'react';
import { getStore, AppState, refreshStore } from '../../lib/store';
import {
  adminPatchSettings, adminStartPitch, adminStopPitch, adminRestartPitch,
  adminResetTeam, adminStartQuiz, adminResetQuiz, adminGetScores, adminPatchScore,
  adminGetScoreRequests, adminPatchScoreRequest, adminReset, adminCreateJudge,
  JudgeScoreRecord, ScoreRequestRecord, getToken,
} from '../../lib/api';
import { withToast, toast } from '../../lib/toast';
import {
  BarChart, Settings, Play, Users, Trophy, ChevronRight,
  FastForward, Timer, AlertTriangle, Loader2, UserPlus, X, GripVertical,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

type Tab = 'dashboard' | 'judgement' | 'quiz' | 'audience' | 'judges';

// First photo from "Team Photos (URLs)" column in dna-hack-registrations.csv, keyed by team code
const TEAM_LEADER_PHOTOS: Record<string, string> = {
  'DNA-7776': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777371906/gqyh1ajrptduflsrdrfi.jpg',      // AXION
  'DNA-1058': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777825352/fhbw1deui0qqds2cgnae.jpg',      // Team 42
  'DNA-9480': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777543703/be6uwxb5knkbkihvnfan.jpg',      // Serenity Squad
  'DNA-8007': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777828406/lmqkmaq7ddruo7pkfbot.jpg',      // Team ImmuNexa
  'DNA-9804': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778049017/gjhentasl1zpfw1p1iqc.png',      // SYNC SQUAD
  'DNA-4795': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777396543/owutwtc1ysqclnxyrjkd.jpg',      // Medi Conect
  'DNA-8629': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777131166/uauqtrvekmd7di9frrb4.jpg',      // CUET Mongolchari
  'DNA-8505': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777816850/yzohfoknoppxtlk2xswn.jpg',      // Vanguard
  'DNA-6684': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777998812/xu46envftwjovy40e8y3.jpg',      // MediCare HMS
  'DNA-8241': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777186584/xadbvhyo7wnns948bsox.jpg',      // Nexus
  'DNA-9506': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777476394/f1pgjtxbniirxhuiipdv.jpg',      // GapHack
  'DNA-3525': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777999039/voqjsrrsxwj71qxtkao4.jpg',      // Arekta team
  'DNA-4961': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777288866/r8gz9fqfsypwzhefnj0x.jpg',      // AutoMed
  '0J1K6C6X': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481961/tq6nvoerumkogvwofys5.jpg',      // Livora (pitch deck code)
  'DNA-3212':  'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777481961/tq6nvoerumkogvwofys5.jpg',      // Livora (registration code)
  'DNA-8708': 'https://res.cloudinary.com/dtnyglz2z/image/upload/f_jpg/v1777397892/hnvhzwk5divndab0jvnb.heic', // Epidemic Lens (HEIC→jpg via Cloudinary)
  // Teams that hadn't submitted pitch decks yet
  'DNA-9504': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778095403/gqapmwxt79uv4vi3ceac.jpg',      // Syntax Surgeons
  'DNA-1190': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778093168/li3adwrlu55kilj4redv.jpg',      // LifeLineX
  'DNA-9443': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1778090055/zo2mxzekdorzuhk0kezv.jpg',      // SurgiMax
  'DNA-6438': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777737259/gr4yblbx8hx9xdpzyf5r.jpg',      // Renew_Motion
  'DNA-5702': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777651652/mfuzqwwdygivm6g1pgsr.jpg',      // PulseIQ
  'DNA-6466': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777568208/uxz6pmbnpgycamh4wm9d.jpg',      // Binary Blood
  'DNA-4691': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777386529/oswf5as49gnkn4nzuvgw.jpg',      // Team Hemo Hackers
  'DNA-5481': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1777031482/kwmaaayaiinu7wxhlfu7.jpg',      // Rhetoric Minds
  'DNA-5627': 'https://res.cloudinary.com/dtnyglz2z/image/upload/v1775839717/qi38gxlg8v4dbssxd2hq.jpg',      // GLITCH_GANG
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [state, setState] = useState<AppState>(getStore());
  const [pitchInput, setPitchInput] = useState('');
  const [quizInput, setQuizInput] = useState('');
  const [liveUrlInput, setLiveUrlInput] = useState('');
  const [pitchTimeLeft, setPitchTimeLeft] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);

  // Admin scores & requests (fetched from API, not store)
  const [scores, setScores] = useState<JudgeScoreRecord[]>([]);
  const [requests, setRequests] = useState<ScoreRequestRecord[]>([]);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<JudgeScoreRecord>>({});

  // Create judge modal
  const [showJudgeModal, setShowJudgeModal] = useState(false);
  const [judgeForm, setJudgeForm] = useState({ email: '', name: '', password: '' });
  const [creatingJudge, setCreatingJudge] = useState(false);

  // Generic loading flag for action buttons
  const [busy, setBusy] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Drag-and-drop team order
  const [orderedTeams, setOrderedTeams] = useState(state.teams);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);


  useEffect(() => {
    const sync = () => setState(getStore());
    sync();
    window.addEventListener('h4h_state_change', sync);
    const timerTick = setInterval(() => {
      const s = getStore();
      setPitchTimeLeft(s.pitchEndTime ? Math.max(0, Math.floor((s.pitchEndTime - Date.now()) / 1000)) : 0);
      setQuizTimeLeft(s.quizEndTime ? Math.max(0, Math.floor((s.quizEndTime - Date.now()) / 1000)) : 0);
    }, 1000);
    return () => { window.removeEventListener('h4h_state_change', sync); clearInterval(timerTick); };
  }, []);

  // Sync orderedTeams from server only when user has no unsaved drag changes
  useEffect(() => {
    if (!hasUnsavedOrder) {
      setOrderedTeams([...state.teams].sort((a, b) => a.order - b.order));
    }
  }, [state.teams, hasUnsavedOrder]);

  // Fetch scores & requests whenever on judgement tab
  useEffect(() => {
    if (activeTab === 'judgement') {
      adminGetScores().then(setScores).catch(() => {});
      adminGetScoreRequests().then(setRequests).catch(() => {});
    }
  }, [activeTab, state]); // re-fetch when state changes (WebSocket push)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── Pitch controls ────────────────────────────────────────────────────────
  const handleSetPitchDuration = async () => {
    const t = parseInt(pitchInput, 10);
    if (isNaN(t) || t <= 0) return;
    setBusy('pitch-duration');
    try {
      await withToast(adminPatchSettings({ pitchDuration: t }), { loading: 'Saving...', success: 'Pitch duration updated' });
      await refreshStore();
      setPitchInput('');
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  const handleTogglePitching = async (teamId: string) => {
    const isActive = state.activeTeamId === teamId;
    setBusy(`pitch-${teamId}`);
    try {
      if (isActive) {
        await withToast(adminStopPitch(), { loading: 'Stopping pitch...', success: 'Pitch ended' });
      } else {
        await withToast(adminStartPitch(teamId), { loading: 'Starting pitch...', success: 'Pitch started!' });
      }
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  const handleRestartTimer = async () => {
    setBusy('restart');
    try {
      await withToast(adminRestartPitch(), { loading: 'Restarting timer...', success: 'Timer restarted' });
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  const handleSaveOrder = async (newTeams: typeof orderedTeams) => {
    setOrderedTeams(newTeams);
    setIsSavingOrder(true);
    try {
      const orderedIds = newTeams.map((t) => t.id);
      const token = getToken('admin');
      const res = await fetch(`/api/admin/teams/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderedIds }),
      });
      if (!res.ok) throw new Error('Failed to save order');
      setHasUnsavedOrder(false);
      await refreshStore();
    } catch {
      toast.error('Failed to save order.');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleResetTeam = async (teamId: string) => {
    setBusy(`reset-${teamId}`);
    try {
      await withToast(adminResetTeam(teamId), { loading: 'Resetting...', success: 'Team reset to Waiting' });
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Live stream URL ───────────────────────────────────────────────────────
  const handleSaveLiveUrl = async () => {
    const url = liveUrlInput.trim();
    setBusy('live-url');
    try {
      await withToast(adminPatchSettings({ liveStreamUrl: url }), { loading: 'Saving...', success: 'Live stream URL saved' });
      await refreshStore();
      setLiveUrlInput('');
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  const handleClearLiveUrl = async () => {
    setBusy('live-url-clear');
    try {
      await adminPatchSettings({ liveStreamUrl: '' });
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Portal toggles ────────────────────────────────────────────────────────
  const handleTogglePortal = async (portal: 'judge' | 'audience' | 'quiz') => {
    const current = state.portalsEnabled[portal];
    setBusy(`portal-${portal}`);
    try {
      await adminPatchSettings({ [`${portal}Portal`]: !current });
      await refreshStore();
      toast.success(`${portal} portal ${!current ? 'opened' : 'closed'}`);
    } catch (e: unknown) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  // ── Quiz controls ─────────────────────────────────────────────────────────
  const handleStartQuiz = async () => {
    const t = parseInt(quizInput, 10);
    if (!isNaN(t) && t > 0) await adminPatchSettings({ quizDuration: t });
    setBusy('quiz-start');
    try {
      await withToast(adminStartQuiz(), { loading: 'Starting quiz timer...', success: 'Quiz timer started!' });
      await refreshStore();
      setQuizInput('');
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  const handleResetQuiz = async () => {
    setBusy('quiz-reset');
    try {
      await withToast(adminResetQuiz(), { loading: 'Resetting quiz...', success: 'Quiz timer reset' });
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Score request actions ─────────────────────────────────────────────────
  const handleScoreRequest = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setBusy(`req-${id}`);
    try {
      await withToast(adminPatchScoreRequest(id, status), {
        loading: status === 'APPROVED' ? 'Approving...' : 'Rejecting...',
        success: status === 'APPROVED' ? 'Access approved' : 'Request rejected',
      });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      await refreshStore();
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Inline score editing ──────────────────────────────────────────────────
  const handleSaveScore = async (id: string) => {
    setBusy(`score-${id}`);
    try {
      await withToast(adminPatchScore(id, editDraft), { loading: 'Saving...', success: 'Score updated' });
      setScores((prev) => prev.map((s) => (s.id === id ? { ...s, ...editDraft } : s)));
      setEditingScoreId(null);
      setEditDraft({});
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Hard reset ────────────────────────────────────────────────────────────
  const handleHardReset = async () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    setBusy('reset-all');
    try {
      await withToast(adminReset(), { loading: 'Resetting all data...', success: 'All data reset' });
      await refreshStore();
      setScores([]); setRequests([]);
    } catch { /* toasted */ } finally { setBusy(null); }
  };

  // ── Create judge ──────────────────────────────────────────────────────────
  const handleCreateJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJudge(true);
    try {
      await withToast(adminCreateJudge(judgeForm), { loading: 'Creating judge...', success: `Judge ${judgeForm.email} created!` });
      setJudgeForm({ email: '', name: '', password: '' });
      setShowJudgeModal(false);
    } catch { /* toasted */ } finally { setCreatingJudge(false); }
  };

  const WEIGHTS: Record<string, number> = { costEffectiveness: 35, medicalImpact: 30, feasibility: 20, technicalExecution: 15 };

  // ── Tab renders ───────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-6 rounded-2xl border-brand-500/20">
        <h3 className="text-lg font-bold text-slate-300 mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-brand-400" /> Total Votes Cast</h3>
        <p className="text-5xl font-display font-bold text-white">{Object.values(state.audienceVotes).flat().length}</p>
      </div>
      <div className="glass-card p-6 rounded-2xl border-yellow-500/20">
        <h3 className="text-lg font-bold text-slate-300 mb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Quiz Submissions</h3>
        <p className="text-5xl font-display font-bold text-white">{Object.keys(state.quizSubmissions).length}</p>
      </div>
      <div className="glass-card p-6 rounded-2xl border-blue-500/20">
        <h3 className="text-lg font-bold text-slate-300 mb-2 flex items-center gap-2"><BarChart className="w-5 h-5 text-blue-400" /> Judge Evaluations</h3>
        <p className="text-5xl font-display font-bold text-white">{Object.keys(state.judgeScores).length}</p>
      </div>
      <div className="glass-card p-6 rounded-2xl border-white/10 md:col-span-3">
        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" /> Public Portal Access</h3>
        <div className="flex flex-wrap gap-4">
          {(['judge', 'audience', 'quiz'] as const).map((portal) => (
            <button
              key={portal}
              onClick={() => handleTogglePortal(portal)}
              disabled={busy === `portal-${portal}`}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold capitalize transition-all disabled:opacity-60 ${state.portalsEnabled[portal] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
            >
              {busy === `portal-${portal}`
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <div className={`w-2 h-2 rounded-full ${state.portalsEnabled[portal] ? 'bg-green-500' : 'bg-red-500'}`}></div>}
              {portal} Portal: {state.portalsEnabled[portal] ? 'Live' : 'Closed'}
            </button>
          ))}
        </div>
      </div>

      {/* Live Stream */}
      <div className="glass-card p-6 rounded-2xl border-red-500/20 md:col-span-3">
        <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> YouTube Live Stream
        </h3>
        {state.liveStreamUrl && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-void-900/60 rounded-xl border border-white/10">
            <span className="text-slate-400 text-sm truncate flex-1 font-mono">{state.liveStreamUrl}</span>
            <a
              href={state.liveStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" /> Watch Live
            </a>
            <button
              onClick={handleClearLiveUrl}
              disabled={busy === 'live-url-clear'}
              className="shrink-0 p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Remove URL"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="url"
            value={liveUrlInput}
            onChange={(e) => setLiveUrlInput(e.target.value)}
            placeholder="Paste YouTube live stream URL..."
            className="flex-1 bg-void-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
          />
          <button
            onClick={handleSaveLiveUrl}
            disabled={busy === 'live-url' || !liveUrlInput.trim()}
            className="px-5 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {busy === 'live-url' ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save
          </button>
        </div>
      </div>
    </div>
  );

  const renderJudgement = () => (
    <div className="space-y-8">
      {/* Controls */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-brand-400" /> Global Controls</h3>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleHardReset}
            disabled={busy === 'reset-all'}
            className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500/30 flex items-center gap-2 text-sm font-bold disabled:opacity-60"
          >
            {busy === 'reset-all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            Hard Reset All Data
          </button>
          <div className="flex items-center gap-2 bg-void-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-sm text-slate-400">Duration: <span className="font-bold text-white">{state.pitchDuration} mins</span></span>
            <input
              type="number"
              value={pitchInput}
              onChange={(e) => setPitchInput(e.target.value)}
              placeholder="Mins"
              className="w-16 bg-void-800 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-brand-500 text-sm ml-2"
            />
            <button
              onClick={handleSetPitchDuration}
              disabled={busy === 'pitch-duration'}
              className="px-4 py-1.5 rounded-lg text-sm font-bold bg-brand-500 text-black hover:bg-brand-400 transition-colors disabled:opacity-60 flex items-center gap-1"
            >
              {busy === 'pitch-duration' ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Set Duration
            </button>
          </div>
        </div>
      </div>

      {/* Team Controller */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Team Controller</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <GripVertical className="w-3.5 h-3.5" />
            Drag to reorder pitch sequence
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={orderedTeams}
          onReorder={(newOrder) => { setOrderedTeams(newOrder); setHasUnsavedOrder(true); }}
          className="space-y-2"
        >
          {orderedTeams.map((team, idx) => {
            const isActive = state.activeTeamId === team.id;
            const isBusy = busy === `pitch-${team.id}` || busy === `reset-${team.id}`;
            return (
              <Reorder.Item
                key={team.id}
                value={team}
                className="list-none"
              >
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-colors cursor-grab active:cursor-grabbing ${isActive ? 'bg-brand-500/10 border-brand-500/30' : 'bg-void-900/50 border-white/5 hover:bg-void-900'}`}>
                  {/* Left: drag handle + team info */}
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-slate-600 shrink-0 select-none" />
                    <span className="text-xs font-mono text-slate-600 w-5 shrink-0">#{idx + 1}</span>
                    <span className="text-white font-medium">{team.name}</span>
                    {team.pptxUrl && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full font-mono">Canva</span>
                    )}
                    <span className="ml-2">
                      {team.status === 'presenting'
                        ? <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/30 animate-pulse">Presenting</span>
                        : team.status === 'completed'
                        ? <span className="text-xs bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded-full border border-white/10">Completed</span>
                        : <span className="text-xs text-slate-500">Waiting</span>}
                    </span>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0 ml-8 sm:ml-0">
                    {team.pdfUrl && (
                      <a
                        href={team.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-void-800 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Drive
                      </a>
                    )}
                    {team.pptxUrl && (
                      <a
                        href={team.pptxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/30 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Canva
                      </a>
                    )}
                    {team.status === 'presenting' && pitchTimeLeft > 0 && (
                      <div className="flex items-center gap-1.5 bg-void-950 px-2.5 py-1 rounded-lg border border-brand-500/30">
                        <Timer className={`w-3.5 h-3.5 ${pitchTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-brand-400'}`} />
                        <span className={`font-mono font-bold text-xs ${pitchTimeLeft < 30 ? 'text-red-400' : 'text-white'}`}>{fmt(pitchTimeLeft)}</span>
                      </div>
                    )}
                    {team.status === 'presenting' && (
                      <button
                        onClick={handleRestartTimer}
                        disabled={!!busy}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30 transition-colors disabled:opacity-60"
                      >
                        {busy === 'restart' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reset Timer'}
                      </button>
                    )}
                    {team.status !== 'completed' && (
                      <button
                        onClick={() => handleTogglePitching(team.id)}
                        disabled={isBusy}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-60 ${isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-500/20 text-brand-400 hover:bg-brand-500/30'}`}
                      >
                        {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        {isActive ? 'End Pitch' : 'Start Pitch'}
                      </button>
                    )}
                    {team.status === 'completed' && (
                      <button
                        onClick={() => handleResetTeam(team.id)}
                        disabled={isBusy}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 border border-white/10 transition-colors disabled:opacity-60 flex items-center gap-1"
                      >
                        {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Reset
                      </button>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        {/* Save order button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSaveOrder(orderedTeams)}
            disabled={isSavingOrder}
            className="px-5 py-2 bg-brand-500 text-black text-sm font-bold rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
          >
            {isSavingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSavingOrder ? 'Saving...' : 'Save Pitch Order'}
          </button>
        </div>
      </div>

      {/* Score Access Requests */}
      {requests.filter((r) => r.status === 'PENDING').length > 0 && (
        <div className="glass-card p-6 rounded-2xl border-brand-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" /> Score Access Requests</h3>
          <div className="space-y-4">
            {requests.filter((r) => r.status === 'PENDING').map((req) => (
              <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-void-950/50 p-4 rounded-xl border border-yellow-500/20">
                <div>
                  <p className="text-white font-bold">{req.judge.email}</p>
                  <p className="text-sm text-slate-400">Requested access to score: <span className="text-brand-400 font-medium">{req.team.name}</span></p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScoreRequest(req.id, 'REJECTED')}
                    disabled={busy === `req-${req.id}`}
                    className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg text-sm font-bold transition-colors disabled:opacity-60 flex items-center gap-1"
                  >
                    {busy === `req-${req.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Reject
                  </button>
                  <button
                    onClick={() => handleScoreRequest(req.id, 'APPROVED')}
                    disabled={busy === `req-${req.id}`}
                    className="px-4 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg text-sm font-bold transition-colors disabled:opacity-60 flex items-center gap-1"
                  >
                    {busy === `req-${req.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Judge Evaluations */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Judge Evaluations & Editing</h3>
        {scores.length === 0 ? (
          <p className="text-slate-500">No evaluations submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {scores.map((score) => {
              const total = score.costEffectiveness + score.medicalImpact + score.feasibility + score.technicalExecution;
              const isEditing = editingScoreId === score.id;
              return (
                <div key={score.id} className="border border-white/10 rounded-xl p-4 bg-void-950/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-brand-400">{score.judge.email}</p>
                      <p className="text-white font-bold">{score.team.name} <span className="text-slate-500 text-sm ml-2">Total: {total}/100</span></p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditing) { setEditingScoreId(null); setEditDraft({}); }
                        else { setEditingScoreId(score.id); setEditDraft({ ...score }); }
                      }}
                      className="text-xs bg-void-800 px-3 py-1 rounded text-slate-300 hover:text-white border border-white/10"
                    >
                      {isEditing ? 'Cancel' : 'Edit Scores'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(['costEffectiveness', 'medicalImpact', 'feasibility', 'technicalExecution'] as const).map((crit) => (
                          <div key={crit}>
                            <label className="text-[10px] text-slate-500 uppercase">{crit} (/{WEIGHTS[crit]})</label>
                            <input
                              type="number"
                              min={0}
                              max={WEIGHTS[crit]}
                              value={(editDraft[crit] as number) ?? score[crit]}
                              onChange={(e) => {
                                let v = parseInt(e.target.value) || 0;
                                v = Math.min(Math.max(v, 0), WEIGHTS[crit]);
                                setEditDraft((d) => ({ ...d, [crit]: v }));
                              }}
                              className="w-full bg-void-950 border border-white/10 rounded px-2 py-1 text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase">Judge Note</label>
                        <textarea
                          value={(editDraft.note as string) ?? score.note}
                          onChange={(e) => setEditDraft((d) => ({ ...d, note: e.target.value }))}
                          className="w-full h-16 bg-void-950 border border-white/10 rounded px-2 py-1 text-white text-sm"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveScore(score.id)}
                        disabled={busy === `score-${score.id}`}
                        className="px-4 py-2 bg-brand-500 text-black font-bold rounded-lg text-sm hover:bg-brand-400 disabled:opacity-60 flex items-center gap-1.5"
                      >
                        {busy === `score-${score.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Save Changes
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">"{score.note || 'No notes provided'}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuiz = () => {
    const sorted = Object.entries(state.quizSubmissions).sort(([, a], [, b]) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
      return a.submitTime - b.submitTime;
    });

    return (
      <div className="space-y-8">
        <div className="glass-card p-6 rounded-2xl border-yellow-500/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-yellow-500" /> Quiz Controls</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-void-950/50 p-2 rounded-xl border border-white/5">
              <input
                type="number"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="Mins"
                className="w-20 bg-void-800 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-yellow-500 text-sm"
              />
              <button
                onClick={handleStartQuiz}
                disabled={busy === 'quiz-start'}
                className="px-4 py-1.5 rounded-lg text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors disabled:opacity-60 flex items-center gap-1"
              >
                {busy === 'quiz-start' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Start Timer
              </button>
              <button
                onClick={handleResetQuiz}
                disabled={busy === 'quiz-reset'}
                className="px-4 py-1.5 rounded-lg text-sm font-bold bg-void-800 text-white border border-white/10 hover:bg-void-700 transition-colors disabled:opacity-60 flex items-center gap-1"
              >
                {busy === 'quiz-reset' ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Reset
              </button>
            </div>
            {state.quizEndTime && quizTimeLeft > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/30 ml-auto">
                <Timer className={`w-5 h-5 ${quizTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-500'}`} />
                <span className="text-sm text-yellow-500 font-bold">Quiz Timer:</span>
                <span className={`font-mono text-xl font-bold ${quizTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{fmt(quizTimeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Live Leaderboard</h3>
          {sorted.length === 0 ? <p className="text-slate-500 text-center py-10">No submissions yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-sm">
                    <th className="p-3 font-medium w-16">Rank</th>
                    <th className="p-3 font-medium">Participant Email</th>
                    <th className="p-3 font-medium text-right">Score</th>
                    <th className="p-3 font-medium text-right">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(([email, sub], idx) => (
                    <tr key={email} className={`border-b border-white/5 hover:bg-void-900/50 transition-colors ${idx === 0 ? 'bg-yellow-500/5' : ''}`}>
                      <td className="p-3 font-bold text-slate-300">{idx === 0 ? <span className="text-yellow-500">#1</span> : `#${idx + 1}`}</td>
                      <td className="p-3 text-white">{email}</td>
                      <td className="p-3 text-right font-bold text-brand-400">{sub.score} pts</td>
                      <td className="p-3 text-right text-slate-400 font-mono">{sub.timeTaken}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAudience = () => {
    const teamsWithVotes = state.teams.map((t) => ({
      ...t,
      totalVotes: state.audienceVoteTotals[t.id]?.total || 0,
      uniqueVotes: state.audienceVoteTotals[t.id]?.unique || 0,
    })).sort((a, b) => b.uniqueVotes - a.uniqueVotes);

    if (isFullscreen) {
      const totalVotesCast = teamsWithVotes.reduce((sum, t) => sum + t.uniqueVotes, 0);
      const maxVotes = Math.max(...teamsWithVotes.map((t) => t.uniqueVotes), 1);

      return (
        <div className="fixed inset-0 z-[100] bg-void-950 flex flex-col items-center justify-center p-8 overflow-hidden">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur z-50 text-sm"
          >
            Exit Fullscreen
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white text-glow tracking-widest uppercase">
              Live Race: Audience Choice
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-slate-400 text-lg">Total Votes Cast:</span>
              <span className="text-4xl font-display font-bold text-brand-400 text-glow">
                {totalVotesCast}
              </span>
            </div>
          </div>

          {/* Race tracks */}
          <div className="w-full max-w-6xl space-y-5 relative">
            {/* Finish line */}
            <div className="absolute top-0 bottom-0 right-[8%] border-r-4 border-dashed border-white/20 z-0 pointer-events-none" />

            {teamsWithVotes.slice(0, 12).map((team, rank) => {
              const pct = Math.min((team.uniqueVotes / maxVotes) * 88, 88);
              const leaderPhoto = TEAM_LEADER_PHOTOS[team.teamCode || ''] || team.members[0]?.photoUrl || '';
              const isLeader = rank === 0 && team.uniqueVotes > 0;

              return (
                <div
                  key={team.id}
                  className="relative z-10 w-full h-[4.5rem] bg-void-900/50 rounded-full border border-white/5 overflow-visible flex items-center"
                >
                  {/* Progress bar */}
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 40, damping: 18 }}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-r-full z-10 ${isLeader ? 'bg-brand-500 shadow-[0_0_16px_rgba(20,184,166,1)]' : 'bg-brand-500/40'}`}
                  />

                  {/* Team leader avatar */}
                  <motion.div
                    initial={{ left: '0%' }}
                    animate={{ left: `calc(${pct}% - 1.75rem)` }}
                    transition={{ type: 'spring', stiffness: 40, damping: 18 }}
                    className={`absolute z-20 h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 ${isLeader ? 'border-brand-400 shadow-[0_0_24px_rgba(20,184,166,0.8)]' : 'border-white/30'} bg-void-800`}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {leaderPhoto ? (
                      <img src={leaderPhoto} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                        {team.name[0]}
                      </div>
                    )}
                  </motion.div>

                  {/* Team name + vote count label */}
                  <div className="absolute right-4 z-30 flex items-center gap-3">
                    <span className="text-slate-300 font-medium text-sm hidden md:block">{team.name}</span>
                    <span className={`font-display font-bold text-xl tabular-nums ${isLeader ? 'text-brand-400' : 'text-white'}`}>
                      {team.uniqueVotes}
                      <span className="text-xs text-slate-500 font-normal ml-1">unique</span>
                      <span className="text-xs text-slate-600 font-normal ml-1">/ {team.totalVotes}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const totalVotesCast = teamsWithVotes.reduce((sum, t) => sum + t.totalVotes, 0);
    const totalUniqueVotes = teamsWithVotes.reduce((sum, t) => sum + t.uniqueVotes, 0);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-4">
            <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4">
              <Users className="w-6 h-6 text-brand-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Unique IP Votes</p>
                <p className="text-4xl font-display font-bold text-brand-400">{totalUniqueVotes}</p>
              </div>
            </div>
            <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4">
              <Users className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Total Votes Cast</p>
                <p className="text-4xl font-display font-bold text-emerald-400">{totalVotesCast}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="px-6 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            <FastForward className="w-5 h-5" /> Launch Live Race Animation
          </button>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Audience Vote Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="p-3 font-medium">Rank</th>
                  <th className="p-3 font-medium">Team</th>
                  <th className="p-3 font-medium text-center">Code</th>
                  <th className="p-3 font-medium text-right text-brand-400">Unique IPs</th>
                  <th className="p-3 font-medium text-right text-emerald-400">Total Votes</th>
                  <th className="p-3 font-medium text-right text-slate-500">Share</th>
                </tr>
              </thead>
              <tbody>
                {teamsWithVotes.map((team, idx) => {
                  const leaderPhoto = TEAM_LEADER_PHOTOS[team.teamCode || ''] || team.members[0]?.photoUrl || '';
                  const sharePct = totalUniqueVotes > 0 ? ((team.uniqueVotes / totalUniqueVotes) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={team.id} className="border-b border-white/5 hover:bg-void-900/50 transition-colors">
                      <td className="p-3 text-slate-300 font-bold">#{idx + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {leaderPhoto ? (
                            <img src={leaderPhoto} alt={team.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-void-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                              {team.name[0]}
                            </div>
                          )}
                          <span className="text-white font-medium">{team.name}</span>
                          {team.pptxUrl && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-full font-mono">Canva</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {team.teamCode && (
                          <span className="text-xs px-2 py-0.5 bg-void-800 border border-white/10 rounded-full text-slate-400 font-mono">
                            {team.teamCode}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold text-brand-400 text-lg">{team.uniqueVotes}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">{team.totalVotes}</td>
                      <td className="p-3 text-right text-slate-500 text-sm">{sharePct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderJudges = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Judge Accounts</h3>
        <button onClick={() => setShowJudgeModal(true)} className="px-4 py-2 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 flex items-center gap-2 text-sm">
          <UserPlus className="w-4 h-4" /> Add Judge
        </button>
      </div>
      <div className="glass-card p-4 rounded-2xl">
        <p className="text-slate-400 text-sm">Default judge: <span className="text-brand-400 font-mono">judge@h4h.com</span> / password: <span className="text-brand-400 font-mono">judge123</span></p>
        <p className="text-slate-500 text-xs mt-1">Use "Add Judge" to create additional accounts for your judges.</p>
      </div>
    </div>
  );

  const TABS: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'judgement', label: 'Hackathon Judgment' },
    { id: 'quiz', label: 'Quiz Segment' },
    { id: 'audience', label: 'Audience Choice' },
    { id: 'judges', label: 'Manage Judges' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-card p-4 rounded-2xl flex flex-col gap-2 sticky top-24">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest px-4 mb-2">Admin Modules</h2>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-slate-400 hover:bg-void-800 hover:text-white border border-transparent'}`}
              >
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'judgement' && renderJudgement()}
              {activeTab === 'quiz' && renderQuiz()}
              {activeTab === 'audience' && renderAudience()}
              {activeTab === 'judges' && renderJudges()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Create Judge Modal */}
      {showJudgeModal && (
        <div className="fixed inset-0 z-50 bg-void-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-void-900 border border-brand-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowJudgeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold text-white mb-6">Add New Judge</h2>
            <form onSubmit={handleCreateJudge} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <input type="email" required value={judgeForm.email} onChange={(e) => setJudgeForm({ ...judgeForm, email: e.target.value })} className="w-full bg-void-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Name</label>
                <input type="text" value={judgeForm.name} onChange={(e) => setJudgeForm({ ...judgeForm, name: e.target.value })} className="w-full bg-void-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Password</label>
                <input type="password" required value={judgeForm.password} onChange={(e) => setJudgeForm({ ...judgeForm, password: e.target.value })} className="w-full bg-void-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500" />
              </div>
              <button type="submit" disabled={creatingJudge} className="w-full py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {creatingJudge ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Judge Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
