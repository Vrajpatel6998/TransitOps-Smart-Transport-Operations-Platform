/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Input } from '../components/FormControls';
import { Button } from '../components/Button';
import { Mail, Lock, Server, CheckCircle2, AlertCircle, Eye, EyeOff, Truck } from 'lucide-react';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Health check states
  const [healthStatus, setHealthStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [healthTimestamp, setHealthTimestamp] = useState<string | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Verify backend health check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setHealthStatus('checking');
        const response = await api.get('/api/health');
        if (response.data && response.data.status === 'ok') {
          setHealthStatus('connected');
          setHealthTimestamp(new Date(response.data.timestamp).toLocaleTimeString());
        } else {
          setHealthStatus('error');
        }
      } catch (e) {
        console.error('Failed to connect to backend health check', e);
        setHealthStatus('error');
      }
    };
    checkConnection();
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      onNavigate('/dashboard');
    }
  }, [user, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;
      
      // Store session state
      login(token, loggedUser);
      
      // Navigate to dashboard
      onNavigate('/dashboard');
    } catch (err: any) {
      console.error('Login error', err);
      const msg = err.response?.data?.error || 'Invalid credentials or failed to contact server';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill helper for hackathon demo convenience
  const handlePrefill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      {/* Visual background accents */}
      <div className="absolute top-1/4 -left-12 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
        
        {/* Main login box */}
        <div className="bg-white rounded border border-slate-200 shadow-2xl p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 self-center mb-5">
            <div className="p-1.5 bg-teal-600 rounded text-white">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-slate-950 tracking-tight uppercase">
              Transit<span className="text-teal-600 font-black">Ops</span>
            </span>
          </div>

          <div className="text-center mb-5">
            <h1 className="text-base font-black text-slate-900 uppercase tracking-wider">Welcome Back</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Sign in to manage fleet dispatch & logistics operations</p>
          </div>

          {/* Connection diagnostics */}
          <div className="mb-5 p-3 rounded-xl border flex items-center justify-between text-xs transition-all bg-slate-50 border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>Backend API:</span>
            </div>
            {healthStatus === 'checking' && (
              <span className="flex items-center gap-1.5 font-semibold text-amber-600 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Checking Route...
              </span>
            )}
            {healthStatus === 'connected' && (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Connected ({healthTimestamp})
              </span>
            )}
            {healthStatus === 'error' && (
              <span className="flex items-center gap-1.5 font-semibold text-rose-600">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                API Offline
              </span>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email-input"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@transitops.com"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="relative">
              <Input
                id="password-input"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[29px] text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button id="login-button" type="submit" loading={loading} className="w-full mt-2 font-semibold">
              Sign In to Platform
            </Button>
          </form>

          {/* Hackathon convenience pre-fills */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Hackathon Pre-fills (Demo Roles)
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600">
              <button
                onClick={() => handlePrefill('admin@transitops.com', 'admin123')}
                className="p-2 border border-slate-200 rounded bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 hover:text-teal-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold uppercase tracking-wider text-slate-900">Admin</p>
                <p className="text-[9px] text-slate-400 truncate">admin@transitops.com</p>
              </button>
              <button
                onClick={() => handlePrefill('manager@transitops.com', 'manager123')}
                className="p-2 border border-slate-200 rounded bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 hover:text-teal-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold uppercase tracking-wider text-slate-900">Fleet Manager</p>
                <p className="text-[9px] text-slate-400 truncate">manager@transitops.com</p>
              </button>
              <button
                onClick={() => handlePrefill('driver@transitops.com', 'driver123')}
                className="p-2 border border-slate-200 rounded bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 hover:text-teal-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold uppercase tracking-wider text-slate-900">Driver</p>
                <p className="text-[9px] text-slate-400 truncate">driver@transitops.com</p>
              </button>
              <button
                onClick={() => handlePrefill('finance@transitops.com', 'finance123')}
                className="p-2 border border-slate-200 rounded bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 hover:text-teal-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold uppercase tracking-wider text-slate-900">Financial Analyst</p>
                <p className="text-[9px] text-slate-400 truncate">finance@transitops.com</p>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info banner */}
        <p className="text-center text-[10px] text-slate-500 font-medium">
          TransitOps Smart Transport Operations • Hackathon Submission 2026
        </p>
      </div>
    </div>
  );
};

export default Login;
