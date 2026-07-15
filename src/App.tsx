import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Loader from './components/Loader';

function MainAppRouter() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<string>('landing');

  // Set page dynamically if user logs in
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If logged in, by default enter the dashboard
        if (activePage === 'landing' || activePage === 'login' || activePage === 'register') {
          setActivePage('dashboard');
        }
      } else {
        // If logged out, prevent accessing secure layouts
        if (['dashboard', 'alerts', 'profile'].includes(activePage)) {
          setActivePage('landing');
        }
      }
    }
  }, [user, loading]);

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader message="Synthesizing AWS Cognito authorization handshake..." size="lg" />
      </div>
    );
  }

  // Router dispatcher
  switch (activePage) {
    case 'landing':
      return <Landing onNavigate={handleNavigate} />;
    
    case 'login':
      return <Login onNavigate={handleNavigate} />;
    
    case 'register':
      return <Register onNavigate={handleNavigate} />;
    
    case 'dashboard':
      return (
        <DashboardLayout activePage="dashboard" onNavigate={handleNavigate}>
          <Dashboard onNavigate={handleNavigate} />
        </DashboardLayout>
      );
    
    case 'alerts':
      return (
        <DashboardLayout activePage="alerts" onNavigate={handleNavigate}>
          <Alerts />
        </DashboardLayout>
      );
    
    case 'profile':
      return (
        <DashboardLayout activePage="profile" onNavigate={handleNavigate}>
          <Profile />
        </DashboardLayout>
      );
    
    default:
      return <NotFound onNavigate={handleNavigate} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppRouter />
    </AuthProvider>
  );
}
