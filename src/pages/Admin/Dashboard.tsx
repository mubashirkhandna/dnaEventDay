import { useState, useEffect } from 'react';
import { getStore, setStore, AppState, resetStore } from '../../lib/store';
import { BarChart, Upload, Settings, Play, Users, Trophy, ChevronRight, FastForward, Timer, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'judgement' | 'quiz' | 'audience'>('dashboard');
  const [state, setState] = useState<AppState>(getStore());
  
  const [pitchInput, setPitchInput] = useState('');
  const [quizInput, setQuizInput] = useState('');
  const [editingScore, setEditingScore] = useState<{ judge: string, teamId: string } | null>(null);
  
  const [pitchTimeLeft, setPitchTimeLeft] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  
  useEffect(() => {
    const handleStorage = () => setState(getStore());
    window.addEventListener('h4h_state_change', handleStorage);
    
    const checkTimer = () => {
      const currentState = getStore();
      if (currentState.pitchEndTime) {
        setPitchTimeLeft(Math.max(0, Math.floor((currentState.pitchEndTime - Date.now()) / 1000)));
      } else {
        setPitchTimeLeft(0);
      }
      if (currentState.quizEndTime) {
        setQuizTimeLeft(Math.max(0, Math.floor((currentState.quizEndTime - Date.now()) / 1000)));
      } else {
        setQuizTimeLeft(0);
      }
    };
    checkTimer();
    const interval = setInterval(checkTimer, 1000);

    return () => {
      window.removeEventListener('h4h_state_change', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Helpers
  const handleSetSpeechTime = () => {
    const time = parseInt(pitchInput, 10);
    if (!isNaN(time) && time > 0) {
       setStore({ pitchDuration: time });
       // Also update current timer if there is an active team
       if (state.activeTeamId) {
         setStore({ pitchEndTime: Date.now() + time * 60000 });
       }
       setPitchInput('');
    }
  };

  const handleClearSpeechTime = () => {
    setStore({ pitchEndTime: null });
  };
  
  const handleTogglePitching = (teamId: string) => {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;
    
    let newStatus = team.status;
    let newActiveId = state.activeTeamId;
    let newPitchEndTime = state.pitchEndTime;
    
    if (state.activeTeamId === teamId) {
      // Stop pitching -> completed
      newStatus = 'completed';
      newActiveId = null;
      newPitchEndTime = null;
    } else {
      // Start pitching -> presenting
      newStatus = 'presenting';
      newActiveId = teamId;
      newPitchEndTime = Date.now() + state.pitchDuration * 60000;
      
      // Auto complete the previous active team
      if (state.activeTeamId) {
         const oldTeam = state.teams.find(t => t.id === state.activeTeamId);
         if (oldTeam) oldTeam.status = 'completed';
      }
    }
    
    team.status = newStatus as 'waiting' | 'presenting' | 'completed';
    setStore({ teams: [...state.teams], activeTeamId: newActiveId, pitchEndTime: newPitchEndTime });
  };

  const handleRestartActivePitchTimer = () => {
    setStore({ pitchEndTime: Date.now() + state.pitchDuration * 60000 });
  };

  const handleResetTeamStatus = (teamId: string) => {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;
    team.status = 'waiting';
    setStore({ teams: [...state.teams] });
  };

  const handleSetQuizTime = () => {
    const time = parseInt(quizInput, 10);
    if (!isNaN(time) && time > 0) {
       setStore({ quizEndTime: Date.now() + time * 60000 });
       setQuizInput('');
    }
  };

  const handleResetQuizTime = () => {
    setStore({ quizEndTime: null });
  };

  const togglePortal = (portal: 'judge' | 'audience' | 'quiz') => {
    setStore({ 
      portalsEnabled: { 
        ...state.portalsEnabled, 
        [portal]: !state.portalsEnabled[portal] 
      } 
    });
  };

  const calculateUniqueVotes = (teamId: string) => {
    const votes = state.audienceVotes[teamId] || [];
    return new Set(votes).size;
  };

  // 1. Dashboard Tab
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
          {(['judge', 'audience', 'quiz'] as const).map(portal => (
            <button 
              key={portal} 
              onClick={() => togglePortal(portal)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold capitalize transition-all ${state.portalsEnabled[portal] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
            >
              <div className={`w-2 h-2 rounded-full ${state.portalsEnabled[portal] ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {portal} Portal: {state.portalsEnabled[portal] ? 'Live' : 'Closed'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Hackathon Judgement Tab
  const CRITERIA_WEIGHTS: Record<string, number> = {
    costEffectiveness: 35,
    medicalImpact: 30,
    feasibility: 20,
    technicalExecution: 15
  };

  const renderJudgement = () => (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-brand-400" /> Global Controls</h3>
        <div className="flex flex-wrap items-center gap-4">
          <button className="px-6 py-3 bg-void-800 border border-white/10 rounded-xl hover:bg-void-700 flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Upload Teams CSV (Mock)</button>
          <button onClick={() => { if(confirm('Are you sure you want to reset all app data?')) resetStore(); }} className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500/30 flex items-center gap-2 text-sm font-bold"><AlertTriangle className="w-4 h-4" /> Hard Reset All Data</button>
          <div className="flex items-center gap-2 bg-void-950/50 p-2 rounded-xl border border-white/5">
              <span className="text-sm text-slate-400">Duration: <span className="font-bold text-white">{state.pitchDuration} mins</span></span>
              <input 
                type="number" 
                value={pitchInput}
                onChange={(e) => setPitchInput(e.target.value)}
                placeholder="Mins" 
                className="w-16 bg-void-800 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-brand-500 text-sm ml-2"
              />
              <button onClick={handleSetSpeechTime} className="px-4 py-1.5 rounded-lg text-sm font-bold bg-brand-500 text-black hover:bg-brand-400 transition-colors">Set Config</button>
              <button onClick={handleClearSpeechTime} className="px-3 py-1.5 rounded-lg text-sm font-bold bg-void-800 text-white border border-white/10 hover:bg-void-700 transition-colors">Clear Live Timer</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Team Controller</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="p-3 font-medium">Team Name</th>
                <th className="p-3 font-medium">Pitch Status</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.teams.map(team => {
                const isActive = state.activeTeamId === team.id;
                return (
                  <tr key={team.id} className="border-b border-white/5 hover:bg-void-900/50 transition-colors">
                    <td className="p-3 text-white font-medium">{team.name}</td>
                    <td className="p-3">
                      {team.status === 'presenting' ? <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full border border-brand-500/30 animate-pulse">Presenting</span> : 
                       team.status === 'completed' ? <span className="text-xs bg-slate-500/20 text-slate-400 px-2 py-1 rounded-full border border-white/10">Completed</span> :
                       <span className="text-xs text-slate-500">Waiting</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {team.status === 'presenting' && pitchTimeLeft > 0 && (
                          <div className="flex items-center gap-2 bg-void-900 px-3 py-1.5 rounded-lg border border-brand-500/30">
                            <Timer className={`w-4 h-4 ${pitchTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-brand-400'}`} />
                            <span className={`font-mono font-bold text-sm ${pitchTimeLeft < 30 ? 'text-red-400' : 'text-white'}`}>{formatTime(pitchTimeLeft)}</span>
                          </div>
                        )}
                        {team.status === 'presenting' && (
                          <button onClick={handleRestartActivePitchTimer} className="px-3 py-2 rounded-lg text-sm font-bold bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30 transition-colors">
                            Reset Timer
                          </button>
                        )}
                        {team.status !== 'completed' && (
                          <button onClick={() => handleTogglePitching(team.id)} className={`px-4 py-2 rounded-lg text-sm font-bold ${isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-500/20 text-brand-400 hover:bg-brand-500/30'}`}>
                            {isActive ? 'End Pitch' : 'Start Pitch'}
                          </button>
                        )}
                        {team.status === 'completed' && (
                           <button onClick={() => handleResetTeamStatus(team.id)} className="px-3 py-2 rounded-lg text-sm font-bold bg-slate-500/20 text-slate-400 hover:bg-slate-500/30 border border-white/10 transition-colors">
                             Reset to Waiting
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Judge Evaluations & Editing</h3>
        <div className="space-y-6">
          {(!state.judgeScores || Object.entries(state.judgeScores).length === 0) ? (
            <p className="text-slate-500">No evaluations submitted yet.</p>
          ) : (
            Object.entries(state.judgeScores).map(([judgeEmail, teamScores]) => (
              <div key={judgeEmail} className="border border-white/10 rounded-xl p-4 bg-void-950/30">
                <h4 className="font-bold text-brand-400 mb-3">{judgeEmail}</h4>
                <div className="space-y-4">
                  {Object.entries(teamScores).map(([teamId, scoreData]) => {
                    const teamName = state.teams.find(t => t.id === teamId)?.name || teamId;
                    const totalScore = Object.values(scoreData).filter(v => typeof v === 'number').reduce((a,b) => (a as number)+(b as number), 0) as number;
                    const isEditing = editingScore?.judge === judgeEmail && editingScore?.teamId === teamId;
                    
                    return (
                      <div key={teamId} className="bg-void-900/50 p-4 rounded-lg border border-white/5 relative">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white">{teamName} <span className="text-slate-500 text-sm ml-2">Total: {totalScore}/100</span></span>
                          <button onClick={() => setEditingScore(isEditing ? null : { judge: judgeEmail, teamId })} className="text-xs bg-void-800 px-3 py-1 rounded text-slate-300 hover:text-white border border-white/10">
                            {isEditing ? 'Cancel Edit' : 'Edit Scores'}
                          </button>
                        </div>
                        
                        {isEditing ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            {['costEffectiveness', 'medicalImpact', 'feasibility', 'technicalExecution'].map(crit => (
                              <div key={crit}>
                                <label className="text-[10px] text-slate-500 uppercase">{crit} (/{CRITERIA_WEIGHTS[crit]})</label>
                                <input 
                                  type="number" 
                                  value={(scoreData as any)[crit]} 
                                  onChange={(e) => {
                                    let val = parseInt(e.target.value) || 0;
                                    const maxVal = CRITERIA_WEIGHTS[crit];
                                    if (val > maxVal) val = maxVal;
                                    if (val < 0) val = 0;
                                    
                                    const newJudgeScores = {...state.judgeScores};
                                    (newJudgeScores[judgeEmail][teamId] as any)[crit] = val;
                                    setStore({ judgeScores: newJudgeScores });
                                  }}
                                  className="w-full bg-void-950 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                />
                              </div>
                            ))}
                            <div className="col-span-full mt-2">
                                <label className="text-[10px] text-slate-500 uppercase">Judge Note</label>
                                <textarea 
                                  value={scoreData.note} 
                                  onChange={(e) => {
                                    const newJudgeScores = {...state.judgeScores};
                                    newJudgeScores[judgeEmail][teamId].note = e.target.value;
                                    setStore({ judgeScores: newJudgeScores });
                                  }}
                                  className="w-full h-16 bg-void-950 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                />
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic">"{scoreData.note || 'No notes provided'}"</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // 3. Quiz Segment Tab
  const renderQuiz = () => {
    // Sort submissions by score (desc), then by timeTaken (asc), then by submitTime (asc)
    const sortedSubmissions = Object.entries(state.quizSubmissions).sort(([, a], [, b]) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
      return a.submitTime - b.submitTime;
    });

    return (
      <div className="space-y-8">
        <div className="glass-card p-6 rounded-2xl border-yellow-500/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-yellow-500" /> Quiz Settings</h3>
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-6 py-3 bg-void-800 border border-white/10 rounded-xl hover:bg-void-700 flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Upload Quiz CSV (Mock)</button>
            <div className="flex items-center gap-2 bg-void-950/50 p-2 rounded-xl border border-white/5">
              <input 
                type="number" 
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="Mins" 
                className="w-20 bg-void-800 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-yellow-500 text-sm"
              />
              <button onClick={handleSetQuizTime} className="px-4 py-1.5 rounded-lg text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors">Set Timer</button>
              <button onClick={handleResetQuizTime} className="px-4 py-1.5 rounded-lg text-sm font-bold bg-void-800 text-white border border-white/10 hover:bg-void-700 transition-colors">Reset</button>
            </div>
            
            {state.quizEndTime && quizTimeLeft > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/30 ml-auto">
                <Timer className={`w-5 h-5 ${quizTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-yellow-500'}`} />
                <span className="text-sm text-yellow-500 font-bold">Quiz Timer:</span>
                <span className={`font-mono text-xl font-bold ${quizTimeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{formatTime(quizTimeLeft)}</span>
              </div>
            )}
            
            {!state.quizEndTime && (
              <button className="px-6 py-3 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-xl hover:bg-yellow-500 hover:text-black font-bold flex items-center gap-2 ml-auto"><Play className="w-4 h-4" /> Start Quiz Event</button>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Live Leaderboard</h3>
          {sortedSubmissions.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No submissions yet.</p>
          ) : (
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
                  {sortedSubmissions.map(([email, sub], idx) => (
                    <tr key={email} className={`border-b border-white/5 hover:bg-void-900/50 transition-colors ${idx === 0 ? 'bg-yellow-500/5' : ''}`}>
                      <td className="p-3 font-bold text-slate-300">
                        {idx === 0 ? <span className="text-yellow-500">#1</span> : `#${idx + 1}`}
                      </td>
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

  // 4. Audience Choice Tab
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const renderAudience = () => {
    const teamsWithVotes = state.teams.map(t => ({
      ...t,
      totalVotes: state.audienceVotes[t.id]?.length || 0,
      uniqueVotes: calculateUniqueVotes(t.id)
    })).sort((a, b) => b.totalVotes - a.totalVotes);

    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-[100] bg-void-950 flex flex-col items-center justify-center p-8">
           <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur z-50">Exit Fullscreen</button>
           <h2 className="text-5xl font-display font-bold text-white mb-16 text-glow tracking-widest uppercase">Live Race: Audience Choice</h2>
           
           <div className="w-full max-w-6xl space-y-8 relative">
              {/* Finish Line Indicator */}
              <div className="absolute top-0 bottom-0 right-[10%] w-2 border-r-4 border-dashed border-white/20 z-0"></div>
              
              {teamsWithVotes.map((team) => {
                 // Calculate percentage based on max votes (or a fixed max for racing effect)
                 const maxVotes = Math.max(...teamsWithVotes.map(t => t.totalVotes), 10);
                 const percentage = Math.min((team.totalVotes / maxVotes) * 90, 90); // max 90% so they don't go off screen
                 
                 return (
                   <div key={team.id} className="relative z-10 w-full h-20 bg-void-900/50 rounded-full border border-white/5 overflow-hidden flex items-center px-4">
                      {/* Track Background */}
                      <div className="absolute inset-0 bg-grid opacity-20"></div>
                      
                      {/* Racer Component */}
                      <motion.div 
                        initial={{ left: "0%" }}
                        animate={{ left: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="absolute h-14 w-14 rounded-full border-2 border-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.5)] z-20 overflow-hidden flex items-center justify-center bg-void-800"
                        style={{ marginLeft: '1rem' }}
                      >
                         <img src={team.members[0]?.photoUrl || ''} alt="leader" className="w-full h-full object-cover animate-pulse" />
                      </motion.div>
                      
                      {/* Trail Effect */}
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500/50 shadow-[0_0_10px_rgba(20,184,166,0.8)] rounded-r-full z-10"
                      ></motion.div>

                      <div className="absolute right-4 text-white font-bold font-mono z-30 bg-void-950/80 px-3 py-1 rounded-lg border border-white/10">
                        {team.name} - {team.totalVotes} Votes
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <button onClick={() => setIsFullscreen(true)} className="px-6 py-3 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            <FastForward className="w-5 h-5" /> Launch Live Race Animation
          </button>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Audience Vote Assessment</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="p-3 font-medium">Rank</th>
                  <th className="p-3 font-medium">Team Name</th>
                  <th className="p-3 font-medium text-right text-brand-400">Total Votes</th>
                  <th className="p-3 font-medium text-right text-blue-400">Unique Votes (IPs)</th>
                </tr>
              </thead>
              <tbody>
                {teamsWithVotes.map((team, idx) => (
                  <tr key={team.id} className="border-b border-white/5 hover:bg-void-900/50 transition-colors">
                    <td className="p-3 text-slate-300 font-bold">#{idx + 1}</td>
                    <td className="p-3 text-white">{team.name}</td>
                    <td className="p-3 text-right font-bold text-brand-400">{team.totalVotes}</td>
                    <td className="p-3 text-right font-bold text-blue-400">{team.uniqueVotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <div className="glass-card p-4 rounded-2xl flex flex-col gap-2 sticky top-24">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest px-4 mb-2">Admin Modules</h2>
            {[
              { id: 'dashboard', label: 'Overview' },
              { id: 'judgement', label: 'Hackathon Judgment' },
              { id: 'quiz', label: 'Quiz Segment' },
              { id: 'audience', label: 'Audience Choice' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-slate-400 hover:bg-void-800 hover:text-white border border-transparent'}`}
              >
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'judgement' && renderJudgement()}
              {activeTab === 'quiz' && renderQuiz()}
              {activeTab === 'audience' && renderAudience()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
