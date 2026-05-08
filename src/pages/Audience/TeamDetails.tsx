import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStore, setStore } from '../../lib/store';
import { Team } from '../../data/mockData';
import { ArrowLeft, Play, ThumbsUp, CheckCircle2 } from 'lucide-react';

export default function AudienceTeamDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const audienceUserStr = localStorage.getItem('audience_user');
  const userIdentifier = audienceUserStr ? JSON.parse(audienceUserStr).whatsapp : 'anonymous_ip';

  useEffect(() => {
    const state = getStore();
    const foundTeam = state.teams.find(t => t.id === id);
    if (foundTeam) setTeam(foundTeam);
    
    // Check if this user has already voted for any team (one IP = one vote to ANY team)
    const allVotes = Object.values(state.audienceVotes).flat();
    if (allVotes.includes(userIdentifier)) {
       setHasVoted(true);
    }
  }, [id, userIdentifier]);

  if (!team) return <div className="p-20 text-center">Team not found.</div>;

  const handleVoteConfirm = () => {
    const state = getStore();
    const newVotes = { ...state.audienceVotes };
    if (!newVotes[team.id]) newVotes[team.id] = [];
    
    // Only add if not already voted
    const allVotes = Object.values(newVotes).flat();
    if (!allVotes.includes(userIdentifier)) {
        newVotes[team.id].push(userIdentifier);
        setStore({ audienceVotes: newVotes });
    }
    setHasVoted(true);
    setShowConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <button onClick={() => navigate('/audience/teams')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </button>

      <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{team.name}</h1>
        <p className="text-brand-400 text-sm font-mono mb-6">{team.theme}</p>
        
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
             <p className="text-white font-medium mb-4">Are you sure you want to vote for {team.name}? <br/><span className="text-sm text-brand-400">You can only vote for one team.</span></p>
             <div className="flex gap-4 max-w-sm mx-auto">
               <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-void-800 text-white rounded-xl hover:bg-void-700 transition-colors">Cancel</button>
               <button onClick={handleVoteConfirm} className="flex-1 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]">Confirm Vote</button>
             </div>
           </div>
        ) : (
           <button onClick={() => setShowConfirm(true)} className="w-full max-w-md mx-auto py-4 bg-void-800 border border-brand-500/50 text-white font-bold text-lg rounded-xl hover:bg-brand-500 hover:text-black transition-all shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2 group">
             <ThumbsUp className="group-hover:scale-110 transition-transform" /> Vote for {team.name}
           </button>
        )}
      </div>
    </div>
  );
}
