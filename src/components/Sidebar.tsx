import { LayoutDashboard, Bell, User, CloudLightning, ShieldAlert, Key, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { alertService } from '../services/alertService';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const [unackCount, setUnackCount] = useState(0);
  const [hasCreds, setHasCreds] = useState(false);

  // Poll alert list for badge status
  useEffect(() => {
    async function loadAlertStats() {
      try {
        const alerts = await alertService.getAlerts();
        setUnackCount(alerts.filter((a) => !a.acknowledged).length);
      } catch (err) {
        console.error(err);
      }
    }
    loadAlertStats();
    
    // Poll storage for custom credential flags
    const creds = localStorage.getItem('aws_watcher_credentials');
    setHasCreds(!!creds);

    // Refresh occasionally
    const interval = setInterval(() => {
      loadAlertStats();
      setHasCreds(!!localStorage.getItem('aws_watcher_credentials'));
    }, 4000);

    return () => clearInterval(interval);
  }, [activePage]);

  const navItems = [
    { id: 'dashboard', label: 'Monitor Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { 
      id: 'alerts', 
      label: 'Operational Alarms', 
      icon: <Bell className="h-4 w-4" />, 
      badge: unackCount > 0 ? unackCount : undefined 
    },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-60 border-r border-slate-800 bg-slate-900 p-4 flex flex-col justify-between hidden md:flex flex-shrink-0">
      {/* Upper Navigation Links */}
      <div className="space-y-5">
        <div>
          <span className="text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase block px-3 mb-2.5">
            Console Categories
          </span>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-slate-800 text-orange-400 border border-slate-700/50 shadow-sm shadow-orange-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  
                  {item.badge !== undefined && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold font-mono text-[9px] px-1.5 py-0.2 rounded animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
