import { useAuth } from '../context/AuthContext';
import { Cloud, LogOut, ShieldAlert, Check, RefreshCw, Layers, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

export default function Navbar({ onNavigate, activePage }: NavbarProps) {
  const { user, logout } = useAuth();
  const [activeRegion, setActiveRegion] = useState('us-east-1');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync region selector from localStorage if set
  useEffect(() => {
    const stored = localStorage.getItem('aws_watcher_profile_config');
    if (stored) {
      try {
        const config = JSON.parse(stored);
        if (config.awsRegion) {
          setActiveRegion(config.awsRegion);
        }
      } catch {
        // use default
      }
    }
  }, [activePage]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center h-8 w-8 rounded bg-orange-500 shadow-md shadow-orange-500/10 group-hover:scale-105 transition-all">
            <Cloud className="h-4.5 w-4.5 text-white" />
            <div className="absolute inset-0 rounded border border-white/10" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white uppercase font-display flex items-center gap-1.5">
              AWS Watcher
              <span className="hidden xs:inline-block text-[9px] uppercase tracking-widest bg-orange-500/15 text-orange-400 border border-orange-500/25 px-1 rounded font-mono">
                Console
              </span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono hidden sm:block">
              Continuous FinOps & Metric Auditing
            </p>
          </div>
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500">AWS Account:</span>
          <span className="text-emerald-400 font-semibold uppercase">Connected</span>
        </div>

        {/* Selected Region info */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300">
          <MapPin className="h-3 w-3 text-orange-400" />
          <span className="font-semibold text-orange-400">{activeRegion}</span>
        </div>

        {/* Sync Refresh action */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 transition"
          title="Force sync metrics"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
        </button>

        {/* User Session profile menu or Auth Actions */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div
              onClick={() => onNavigate('profile')}
              className="hidden sm:flex flex-col text-right cursor-pointer"
            >
              <span className="text-xs font-semibold text-white">{user.name}</span>
              <span className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
            
            {/* Log Out button */}
            <button
              onClick={async () => {
                await logout();
                onNavigate('landing');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all duration-200 border border-transparent hover:border-rose-500/10"
              title="Sign Out Console"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-lg transition shadow-lg shadow-orange-600/10"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
