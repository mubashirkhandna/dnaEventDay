import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStore, setStore, ScoreData } from '../../lib/store';
import { Team } from '../../data/mockData';
import { ArrowLeft, Play, Presentation, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function JudgeTeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const judgeEmail = localStorage.getItem('judge_email') || '';
  
  const [scores, setScores] = useState<ScoreData>({
    costEffectiveness: 0, medicalImpact: 0, feasibility: 0,
    technicalExecution: 0, note: ''
  });
  
  const [hasScored, setHasScored] = useState(false);
  const [isActiveTeam, setIsActiveTeam] = useState(false);

  useEffect(() => {
    const state = getStore();
    const foundTeam = state.teams.find(t => t.id === id);
    if (foundTeam) setTeam(foundTeam);
    setIsActiveTeam(state.activeTeamId === id);
    
    if (state.judgeScores[judgeEmail]?.[id || '']) {
      setHasScored(true);
      setScores(state.judgeScores[judgeEmail][id || '']);
    }
  }, [id, judgeEmail]);

  if (!team) return <div className="p-20 text-center">Team not found.</div>;

  const CRITERIA_WEIGHTS: Record<string, number> = {
    costEffectiveness: 35,
    medicalImpact: 30,
    feasibility: 20,
    technicalExecution: 15
  };

  const handleScoreChange = (field: keyof ScoreData, value: string) => {
    if (field === 'note') {
      setScores({ ...scores, [field]: value });
    } else {
      let num = parseInt(value, 10);
      if (isNaN(num)) num = 0;
      const maxScore = CRITERIA_WEIGHTS[field as string] || 100;
      if (num > maxScore) num = maxScore;
      if (num < 0) num = 0;
      setScores({ ...scores, [field]: num });
    }
  };

  const handleSubmitScore = () => {
    const state = getStore();
    const newJudgeScores = { ...state.judgeScores };
    if (!newJudgeScores[judgeEmail]) newJudgeScores[judgeEmail] = {};
    
    newJudgeScores[judgeEmail][team.id] = scores;
    setStore({ judgeScores: newJudgeScores });
    setHasScored(true);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <button onClick={() => navigate('/judge/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Team Details */}
      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{team.name}</h1>
        <p className="text-brand-400 text-sm font-mono mb-6">{team.theme}</p>
        
        {/* Intro Video Mock */}
        <div className="aspect-video bg-void-950 rounded-xl mb-6 flex items-center justify-center border border-white/5 relative group cursor-pointer overflow-hidden">
          {team.videoUrl ? (
            <img src={`https://img.youtube.com/vi/${team.videoUrl.split('embed/')[1]}/maxresdefault.jpg`} alt="Video Thumbnail" className="absolute w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          ) : (
            <div className="absolute inset-0 bg-void-900"></div>
          )}
          <div className="w-16 h-16 bg-brand-500/80 rounded-full flex items-center justify-center text-black z-10 group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm">
            <Play className="w-8 h-8 ml-1" />
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed mb-8">{team.description}</p>

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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Presentation className="text-brand-400" /> Pitch Deck</h3>
          <div className="aspect-[4/3] md:aspect-video bg-void-900 rounded-xl overflow-hidden border border-white/10 relative">
             <iframe src={team.pdfUrl ? `${team.pdfUrl}#toolbar=0&navpanes=0` : ''} className="w-full h-full border-0 bg-white" title="Pitch Deck" />
          </div>
        </div>
      </div>

      {/* Action Area */}
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
        ) : !isActiveTeam ? (
          <div className="text-center py-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-white font-bold">Scoring is Locked</p>
            <p className="text-slate-400 text-sm">You can only evaluate a team while they are actively presenting their pitch.</p>
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
                { key: 'costEffectiveness', label: 'Cost-Effectiveness (“Budget Genius” Factor)', max: 35 },
                { key: 'medicalImpact', label: 'Medical Impact (“Life-Saving” Factor)', max: 30 },
                { key: 'feasibility', label: 'Feasibility & Scalability (“Rural Readiness” Factor)', max: 20 },
                { key: 'technicalExecution', label: 'Technical Execution (“Professional” Factor)', max: 15 }
              ].map(criteria => (
                <div key={criteria.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-void-950/50 p-4 rounded-xl border border-white/5">
                  <label className="text-sm font-medium text-slate-300">{criteria.label}</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" max={criteria.max}
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
                <p className="text-xs text-red-200/80">Caution: Submitting these scores is final and cannot be undone. Your notes will be saved alongside this submission.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-void-800 text-white font-medium rounded-xl hover:bg-void-700 transition-colors">Cancel</button>
                <button onClick={handleSubmitScore} className="flex-1 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors">Submit Final Score</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
