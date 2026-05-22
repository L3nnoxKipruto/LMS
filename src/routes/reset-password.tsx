import React, { useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logoUrl from '../assets/logo.png';
import { GraduationCap } from 'lucide-react';

export const Route = {
  options: {
    component: ResetPasswordPage,
  },
};

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: '/login' });
    }, 2000);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <img src={logoUrl} className="h-14 w-auto mx-auto mb-2" alt="JifunzeHub Logo" />
          <h1 className="text-3xl font-extrabold text-zinc-900">Choose New Password</h1>
          <p className="text-zinc-500 text-sm">
            Update your local student credentials for JifunzeHub.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-zinc-200 p-8 rounded-2xl bg-white space-y-6">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
              Password updated successfully! Redirecting you to login...
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full justify-center">
                Save New Password
              </Button>
            </>
          )}

          <div className="text-center text-xs">
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Back to Login</Link>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
