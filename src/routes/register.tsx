import React, { useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import logoUrl from '../assets/logo.png';
import { GraduationCap } from 'lucide-react';

export const Route = {
  options: {
    component: RegisterPage,
  },
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all requested fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      if (role === 'student') navigate({ to: '/student/dashboard' });
      else if (role === 'lecturer') navigate({ to: '/lecturer/overview' });
      else if (role === 'admin') navigate({ to: '/admin/overview' });
    } catch (err) {
      setError('Registration failed. Please make sure the server is reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <img src={logoUrl} className="h-14 w-auto mx-auto mb-2" alt="JifunzeHub Logo" />
          <h1 className="text-3xl font-extrabold text-zinc-900">Register Campus ID</h1>
          <p className="text-zinc-500 text-sm">
            Create an account on the local campus network router to begin downloading coursework.
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
              label="Your Full Name"
              placeholder="e.g. Dennis Kiprop"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Institutional Email"
              type="email"
              placeholder="e.g. dennis.kiprop@student.ac.ke"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Your Portal Role</label>
              <select
                className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="student">Student Learner</option>
                <option value="lecturer">Lecturer / Instructor</option>
                <option value="admin">Campus System Administrator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">Portal Password</label>
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
            Register ID & Enroll
          </Button>

          <div className="text-center text-xs text-zinc-500">
            Already registered? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Portal Sign In</Link>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
