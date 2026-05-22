import React, { useState } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';
const Link = RouterLink as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logoUrl from '../assets/logo.png';
import { GraduationCap } from 'lucide-react';

export const Route = {
  options: {
    component: ForgotPasswordPage,
  },
};

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <img src={logoUrl} className="h-14 w-auto mx-auto mb-2" alt="JifunzeHub Logo" />
          <h1 className="text-3xl font-extrabold text-zinc-900">Reset Portal Password</h1>
          <p className="text-zinc-500 text-sm">
            Enter your campus email to receive a recovery token. Note: If completely offline, consult your TVET lab instructor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-zinc-200 p-8 rounded-2xl bg-white space-y-6">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
              Recovery link successfully queued. Connect to campus network to process recovery tokens!
            </div>
          ) : (
            <>
              <Input
                label="Institutional Email"
                type="email"
                placeholder="e.g. dennis.kiprop@student.ac.ke"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button type="submit" className="w-full justify-center">
                Send Recovery Token
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
