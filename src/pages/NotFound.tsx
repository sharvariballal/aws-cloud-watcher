import { Cloud, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6">
        <Cloud className="h-12 w-12 text-orange-500 animate-pulse" />
      </div>
      
      <h2 className="text-3xl font-bold font-display tracking-tight">404 - Resource Out Of Bounds</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-sm font-mono">
        The requested AWS console endpoint could not be resolved or the EventBridge route is inactive.
      </p>

      <button
        onClick={() => onNavigate('landing')}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Home Base</span>
      </button>
    </div>
  );
}
