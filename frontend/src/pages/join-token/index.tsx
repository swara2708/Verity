import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, ShieldAlert, CheckCircle2, User, Lock, Clock } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Logo, Button, Card } from '../../components/ui/primitives';

interface InviteMeta {
  org_name: string;
  email: string;
  role: string;
  valid: boolean;
  reason?: string;
}

export default function JoinTokenPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<InviteMeta | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredPending, setRegisteredPending] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      if (!token) return;
      try {
        const data = await apiFetch<InviteMeta>(`/invites/${token}`);
        setInvite(data);
      } catch (err: any) {
        setInvite({ org_name: '', email: '', role: '', valid: false, reason: 'invalid_token' });
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiFetch<{ user_id: string; status: string }>(`/invites/${token}/register`, {
        method: 'POST',
        body: JSON.stringify({ name, password }),
      });
      setRegisteredPending(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0f347]" />
      </div>
    );
  }

  if (!invite || !invite.valid) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl p-8">
          <ShieldAlert className="w-12 h-12 text-[#fb7185] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid or Expired Invite</h2>
          <p className="text-slate-400 text-xs mb-6">This registration link has expired or has already been redeemed.</p>
          <Link to="/login">
            <Button variant="outline" size="md">Return to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (registeredPending) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl p-8">
          <CheckCircle2 className="w-12 h-12 text-[#d0f347] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Registration Submitted</h2>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            Your account has been created for <strong className="text-white">{invite.org_name}</strong> and is currently <span className="font-mono text-[#fbbf24] font-bold">pending HR approval</span>.
          </p>
          <p className="text-[11px] font-mono text-slate-500 mb-6">Once HR approves access, you will be able to log in.</p>
          <Link to="/login">
            <Button variant="primary" size="md">Go to Login Page</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-3" />
          <h1 className="text-3xl font-bold text-white">Pre-Authorized Registration</h1>
          <p className="text-slate-400 text-xs mt-1">Accept invitation to join {invite.org_name}</p>
        </div>

        <Card className="p-8 shadow-2xl space-y-6">
          {/* Context Card */}
          <div className="p-4 bg-[#181818] rounded-xl border border-[#2e2e2e] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Organization</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#d0f347]" /> {invite.org_name}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Assigned Email</span>
              <span className="text-slate-200 font-mono text-[11px]">{invite.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Assigned Role</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 font-mono text-[11px] uppercase font-bold">
                {invite.role}
              </span>
            </div>
            <div className="pt-2 border-t border-[#2e2e2e] flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="w-3 h-3 text-[#fbbf24]" /> Signed Token Expiry: 7 Days
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#fb7185]/15 border border-[#fb7185]/30 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  placeholder="Dev Patel"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Create Password
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
              className="w-full justify-center mt-2"
            >
              {submitting ? 'Submitting Registration...' : 'Complete Registration'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
