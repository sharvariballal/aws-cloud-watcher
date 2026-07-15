import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const registeredUser = await authService.register(email, password, name);
      setUser(registeredUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('aws_watcher_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
