import React, { useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/logo.png';

export const Route = {
  options: {
    component: LoginPage,
  },
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'student') {
        navigate({ to: '/student/dashboard' });
      } else if (user.role === 'lecturer') {
        navigate({ to: '/lecturer/overview' });
      } else if (user.role === 'admin') {
        navigate({ to: '/admin/overview' });
      }
    } catch (err) {
      setError('Failed to login. Please verify your credentials and connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <img src={logoUrl} className="h-14 w-auto mx-auto mb-2" alt="JifunzeHub Logo" />
          <h1 className="text-3xl font-extrabold text-zinc-900">TVET Portal Sign In</h1>
          <p className="text-zinc-500 text-sm">
            Sign in to access your offline modules, cached classes, and submit quiz metrics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-zinc-200 p-8 rounded-2xl bg-white space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. dennis@student.ac.ke"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full justify-center">
            Sign In to Portal
          </Button>

          <div className="text-center text-xs text-zinc-500">
            Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register Campus ID</Link>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
