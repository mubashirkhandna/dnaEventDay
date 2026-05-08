import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, setStore } from '../../lib/store';
import { quizQuestions } from '../../data/mockData';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';

export default function QuizTake() {
  const navigate = useNavigate();
  const [state] = useState(getStore());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quizUserStr = localStorage.getItem('quiz_user');
  const userIdentifier = quizUserStr ? JSON.parse(quizUserStr).email : 'anonymous';

  useEffect(() => {
    if (state.quizSubmissions[userIdentifier]) {
      setIsSubmitted(true);
      return;
    }

    const checkTimer = () => {
      if (state.quizEndTime) {
        const remaining = Math.max(0, Math.floor((state.quizEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          handleSubmit(answers);
        }
      } else {
        setTimeLeft(0);
      }
    };
    checkTimer();
    const timer = setInterval(checkTimer, 1000);
    return () => clearInterval(timer);
  }, [userIdentifier, state.quizSubmissions, answers, state.quizEndTime]);

  const handleSubmit = (finalAnswers = answers) => {
    if (isSubmitted) return;
    
    let calculatedScore = 0;
    quizQuestions.forEach(q => {
      if (finalAnswers[q.id] === q.answer) calculatedScore += 10;
    });

    const timeTaken = 300 - timeLeft; // Roughly 5 mins minus remaining as mock
    
    const newState = getStore();
    const newSubmissions = { ...newState.quizSubmissions };
    newSubmissions[userIdentifier] = {
      score: calculatedScore,
      timeTaken,
      submitTime: Date.now()
    };
    
    setStore({ quizSubmissions: newSubmissions });
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const newAnswers = { ...answers, [quizQuestions[currentIdx].id]: selectedOption || '' };
    setAnswers(newAnswers);
    
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(newAnswers[quizQuestions[currentIdx + 1].id] || null);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-3xl text-center max-w-lg w-full border-yellow-500/30 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="w-20 h-20 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
             <CheckCircle2 className="w-10 h-10" />
           </div>
           <h2 className="text-4xl font-display font-bold text-white mb-2">Submitted Successfully!</h2>
           <p className="text-slate-300 mb-8">Thank you for participating. Please wait for the admin to announce the results on the main stage.</p>
           
           <button onClick={() => navigate('/')} className="px-8 py-3 bg-void-800 text-white rounded-xl hover:bg-void-700 transition-colors">Return Home</button>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentIdx];
  const progress = ((currentIdx) / quizQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Top Bar: Timer and Progress */}
      <div className="sticky top-24 z-40 bg-void-900/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-yellow-500 w-6 h-6" />
          <span className="font-bold text-white tracking-widest">MEGA QUIZ</span>
        </div>
        
        <div className="flex-1 w-full md:w-auto md:max-w-xs mx-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
            <span>Progress</span>
            <span>{currentIdx + 1} / {quizQuestions.length}</span>
          </div>
          <div className="h-2 bg-void-950 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className={`font-mono font-bold text-xl px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-void-950 text-yellow-400 border border-white/5'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Box */}
      <div className="glass-card p-6 md:p-10 rounded-3xl relative">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
          {question.question}
        </h3>
        
        <div className="space-y-4">
          {question.options.map((opt, i) => (
            <label 
              key={i} 
              className={`flex items-center p-4 md:p-5 rounded-xl border cursor-pointer transition-all ${selectedOption === opt ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'bg-void-950/50 border-white/10 hover:border-yellow-500/50 hover:bg-void-900'}`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 shrink-0 ${selectedOption === opt ? 'border-yellow-500' : 'border-slate-500'}`}>
                {selectedOption === opt && <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>}
              </div>
              <input 
                type="radio" 
                name="quiz-option" 
                value={opt}
                checked={selectedOption === opt}
                onChange={() => setSelectedOption(opt)}
                className="hidden"
              />
              <span className="text-lg text-slate-200">{opt}</span>
            </label>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={!selectedOption}
            className={`px-8 py-4 rounded-xl font-bold transition-all ${!selectedOption ? 'bg-void-800 text-slate-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] transform hover:-translate-y-1'}`}
          >
            {currentIdx === quizQuestions.length - 1 ? 'Submit Final Answers' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
