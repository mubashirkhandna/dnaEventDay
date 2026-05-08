import { useState, useEffect } from 'react';
import { toast, Toast } from '../lib/toast';
import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />,
  error: <XCircle className="w-4 h-4 shrink-0 text-red-400" />,
  loading: <Loader2 className="w-4 h-4 shrink-0 text-brand-400 animate-spin" />,
  info: <Info className="w-4 h-4 shrink-0 text-blue-400" />,
};

const styles = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  loading: 'border-brand-500/30 bg-brand-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

function ToastItem({ t }: { t: Toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const tid = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(tid);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-sm text-white font-medium transition-all duration-300 ${styles[t.type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ maxWidth: 380 }}
    >
      {icons[t.type]}
      <span className="flex-1 leading-snug">{t.message}</span>
      {t.type !== 'loading' && (
        <button
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 text-slate-400 hover:text-white transition-colors ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem t={t} />
        </div>
      ))}
    </div>
  );
}
