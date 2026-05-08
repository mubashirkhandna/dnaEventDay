import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 bg-void-950"
    >
      <div className="max-w-md w-full glass-card p-10 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <Lock className="w-12 h-12 text-slate-500 mx-auto mb-6" />
        <h2 className="text-3xl font-display font-bold text-white mb-2">{title} Portal</h2>
        <p className="text-slate-400 mb-8">This portal is currently closed or has not started yet. Please wait for the admin to grant access.</p>
        <Link to="/" className="px-6 py-3 bg-void-800 border border-white/10 text-white font-bold rounded-xl hover:bg-void-700 transition-colors inline-block">
          Return to Home
        </Link>
      </div>
    </motion.div>
  );
}
