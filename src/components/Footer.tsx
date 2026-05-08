import { Link } from 'react-router-dom';
import { Dna } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-void-950 text-center relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <Link to="/" className="flex items-center gap-2">
            <Dna className="text-brand-500 w-6 h-6" />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              DNA<span className="text-brand-500">HackForHealth</span>
            </span>
          </Link>
        </div>
        <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Designed for the 2030 Healthtech Ecosystem. Empowering medical students to build scalable solutions.
        </p>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p className="text-slate-600 text-xs font-mono">&copy; 2026 DNA Health Communication. All rights reserved.</p>
          <div className="flex gap-4 text-xs font-mono text-slate-600">
            <Link to="#" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="#" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
