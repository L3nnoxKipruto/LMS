import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import { appShellService } from '../services/api';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Route = {
  options: {
    component: ContactPage,
  },
};

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await appShellService.submitSupportTicket({
      name: formData.name,
      email: formData.email,
      title: formData.subject,
      description: formData.message,
      priority: 'medium'
    });
    setSubmitted(true);
    setToastOpen(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 3000);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge variant="info">Get In Touch</Badge>
          <h1 className="text-4xl font-extrabold text-zinc-900">Contact Institutional Support</h1>
          <p className="text-zinc-500">
            Have questions about local server setup, device enrollment, or syllabus partnership? Our technical support desk is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-100 p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold text-zinc-900">Support Channels</h3>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Call Campus Hotline</p>
                  <p className="text-sm font-semibold text-zinc-800">+254 (0) 712 345 678</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Administration</p>
                  <p className="text-sm font-semibold text-zinc-800">support@jifunzehub.ac.ke</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Physical Hub</p>
                  <p className="text-sm font-semibold text-zinc-800">Alimex Plaza, 4th Floor, Mombasa Road, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="border border-zinc-200 p-8 rounded-2xl bg-white space-y-6">
              <h3 className="text-xl font-bold text-zinc-900">Submit a Direct Ticket</h3>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold">Ticket Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">Your support request has been queued and stored in local cache. It will sync instantly.</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. John Kamau"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. john@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Input
                label="Message Subject"
                placeholder="e.g. Local Server Installation Request"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700">Message Content</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your issue or custom request..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" isLoading={loading} className="w-full flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                <span>Submit Ticket</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Toast open={toastOpen} message="Support ticket saved locally and queued for sync." severity="success" onClose={() => setToastOpen(false)} />
    </PublicLayout>
  );
}
