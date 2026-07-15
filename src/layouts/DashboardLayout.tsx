import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Bell, User, Cloud } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function DashboardLayout({ children, activePage, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Universal Header Navbar */}
      <Navbar onNavigate={onNavigate} activePage={activePage} />

      {/* Main Structural Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation (Hidden on Mobile) */}
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        {/* Dynamic Content Display Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-16 md:pb-0">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar (Fixed Bottom, Only visible on small viewports) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md flex items-center justify-around py-2 px-4 shadow-2xl">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1.5 px-3 rounded-lg transition ${
            activePage === 'dashboard' ? 'text-orange-400 bg-orange-500/5' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          <span>Monitor</span>
        </button>

        <button
          onClick={() => onNavigate('alerts')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1.5 px-3 rounded-lg transition ${
            activePage === 'alerts' ? 'text-orange-400 bg-orange-500/5' : 'text-slate-400'
          }`}
        >
          <Bell className="h-4.5 w-4.5" />
          <span>Alarms</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1.5 px-3 rounded-lg transition ${
            activePage === 'profile' ? 'text-orange-400 bg-orange-500/5' : 'text-slate-400'
          }`}
        >
          <User className="h-4.5 w-4.5" />
          <span>IAM Config</span>
        </button>
      </nav>
    </div>
  );
}
