import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { LogoDark, Button, Card } from '../../components/ui/primitives';

export default function HRLoginPage() {
  const navigate = useNavigate();
  const { loginHR } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch<{ token: string; user: any }>('/auth/login/hr', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      loginHR(data.token, data.user);
      navigate('/hr/dashboard');
    } catch (err: any) {
      setError(err.message || 'HR login failed. Verify credentials or HR admin role.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white flex flex-col md:flex-row">
      {/* Left Dark Sidebar Panel (#181818) */}
      <div className="md:w-1/2 bg-[#181818] border-r border-[#2e2e2e] p-8 md:p-16 flex flex-col justify-between relative">
        <div>
          <LogoDark className="mb-10" />

          <div className="inline-block font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 mb-6 uppercase tracking-wider">
            HR / ADMIN PORTAL
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-white">
            Continuous, <span className="text-[#d0f347]">unbiased</span> performance intelligence.
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
            Manage company review cycles, inspect semantic evidence claims, and audit recency bias with PostgreSQL Row-Level Security isolation.
          </p>
        </div>

        <div className="pt-6 border-t border-[#2e2e2e] font-mono text-xs text-slate-500 flex items-center justify-between">
          <span>VERITY_INTELLIGENCE_v2.0</span>
          <span>POSTGRESQL_RLS_ENFORCED</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Sign in to HR Admin</h2>
            <p className="text-slate-400 text-xs mt-1">Access company overview, review roster, requests queue, and bias auditing.</p>
          </div>

          <Card className="shadow-2xl">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#fb7185]/15 border border-[#fb7185]/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="hr.admin@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2 mt-2"
              >
                {submitting ? 'Authenticating...' : 'Sign in as HR Admin'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          <div className="text-center text-xs text-slate-400 flex flex-col gap-2 pt-2">
            <span>Looking for Employee Access? <Link to="/login" className="text-[#d0f347] font-bold hover:underline">Employee / Manager Login</Link></span>
            <span>First time setting up? <Link to="/onboarding" className="text-white font-semibold hover:underline">Organization Onboarding</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
}
