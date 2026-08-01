import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserPlus, Building2, Lock, User, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

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
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!invite || !invite.valid) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-red-500/20 shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid or Expired Invite</h2>
          <p className="text-slate-400 text-sm mb-6">This invitation link is invalid, expired, or has already been redeemed.</p>
          <Link to="/login" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all inline-block">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  if (registeredPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-emerald-500/30 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Registration Submitted!</h2>
          <p className="text-slate-300 text-sm mb-6">
            Your account has been created for <strong className="text-white">{invite.org_name}</strong> and is currently <span className="text-amber-400 font-semibold">pending HR approval</span>.
          </p>
          <p className="text-xs text-slate-400 mb-6">You will be able to log in once your HR admin approves your request.</p>
          <Link to="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all inline-block shadow-lg">
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 mb-4 shadow-xl">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Join {invite.org_name}</h1>
          <p className="text-slate-400 mt-2 text-sm">Pre-authorized registration link</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Organization</label>
              <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{invite.org_name}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Email</label>
              <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{invite.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Role</label>
              <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-indigo-300 text-sm capitalize font-semibold">
                {invite.role}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="Dev Patel"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm mt-4 disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
