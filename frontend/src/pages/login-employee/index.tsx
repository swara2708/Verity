import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Logo, Button, Card } from '../../components/ui/primitives';

export default function EmployeeLoginPage() {
  const navigate = useNavigate();
  const { loginEmployee } = useAuth();
  const [email, setEmail] = useState('dev@acme.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      loginEmployee(data.token, data.user);
      navigate('/panel');
    } catch (err: any) {
      if (err.message?.includes('use_hr_login_instead')) {
        setError('HR Admin accounts must sign in via the HR Admin Portal.');
      } else {
        setError(err.message || 'Login failed. Verify credentials or pending approval status.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-3" />
          <h1 className="text-2xl font-bold text-white">Employee & Manager Sign In</h1>
          <p className="text-slate-400 text-xs mt-1">Access your continuous draft logs, 360° feedback, and formal evidence timeline.</p>
        </div>

        <Card className="p-8 shadow-2xl space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#fb7185]/15 border border-[#fb7185]/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Company Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  placeholder="employee@company.com"
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
              {submitting ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Invite Note */}
          <div className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#d0f347] flex-shrink-0 mt-0.5" />
            <span>New employee accounts require an HR-issued signed invite token to register.</span>
          </div>

          <div className="pt-4 border-t border-[#2e2e2e] text-center text-xs text-slate-400">
            Are you an HR Admin? <Link to="/login/hr" className="text-[#d0f347] font-bold underline">Sign in to HR Portal</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
