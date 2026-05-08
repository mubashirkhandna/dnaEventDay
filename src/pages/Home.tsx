import { Link } from 'react-router-dom';
import { Lock, Users, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center py-20 overflow-hidden bg-void-950 md:bg-[url('https://dnahealth.co/wp-content/uploads/2026/03/h4hcampaign.png')] bg-cover bg-center bg-no-repeat">
      {/* Overlays */}
      <div className="absolute inset-0 bg-void-950/95 md:bg-void-950/80 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid z-0 opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-brand-600/20 rounded-full blur-[100px] md:blur-[120px] animate-pulse-glow z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-1 gap-12 text-center md:text-left">
          
          <div className="max-w-4xl mx-auto md:mx-0 reveal active">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-void-900/80 border border-brand-500/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-xs font-mono text-brand-300 tracking-widest uppercase">Event Day Live Hub</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-6 leading-[1.1] md:leading-[1.05]">
              HACK FOR HEALTH <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-brand-500 text-glow block mt-2">LIVE PORTAL.</span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl border-l-4 border-brand-500 pl-4 md:pl-6 bg-void-900/40 p-4 rounded-r-xl backdrop-blur-sm shadow-sm">
              Welcome to the central hub for the DNA Hack For Health Event. Whether you are a judge evaluating the founders, an audience member supporting your favorite team, or a participant in the mega quiz, select your portal below.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mt-12">
              <Link to="/judge" className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-black font-bold rounded-xl hover:bg-brand-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transform hover:-translate-y-1 duration-200">
                Judge Log In
                <Lock className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/audience" className="w-full sm:w-auto px-8 py-4 bg-void-800 text-white border border-white/10 font-bold rounded-xl hover:bg-void-700 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1 duration-200 shadow-xl hover:shadow-2xl">
                Audience Vote
                <Users className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              </Link>
              <Link to="/quiz" className="w-full sm:w-auto px-8 py-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 font-bold rounded-xl hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1 duration-200 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                Participate Quiz
                <BrainCircuit className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
