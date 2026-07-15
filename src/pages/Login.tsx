import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cloud, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid login coordinates. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Landing</span>
      </button>

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-600/10">
            <Cloud className="h-6.5 w-6.5" />
          </div>
          <h2 className="mt-4 text-2xl font-bold font-display tracking-tight text-white">
            Access your account
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 font-mono">
            use any valid email & 6-character password
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium font-mono text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800/80 focus:border-orange-500 focus:outline-none pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 transition"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800/80 focus:border-orange-500 focus:outline-none pl-10 pr-10 py-3 text-sm text-white font-mono placeholder:text-slate-600 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 font-semibold text-white text-sm py-3 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/15"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating Cognito Handshake...</span>
                </>
              ) : (
                <span>Sign in to console</span>
              )}
            </button>
          </form>

          {/* Prompt to register */}
          <div className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-orange-400 font-semibold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
