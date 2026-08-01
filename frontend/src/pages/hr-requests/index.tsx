import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Clock, Check, X, ArrowLeft, User, Mail, Building2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface RequestItem {
  user_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  requested_at: string;
}

export default function HRRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await apiFetch<{ requests: RequestItem[] }>('/hr/requests');
      setRequests(data.requests);
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionUserId(userId);
    try {
      await apiFetch(`/hr/requests/${userId}/approve`, { method: 'POST' });
      setRequests((prev) => prev.filter((r) => r.user_id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to approve user');
    } finally {
      setActionUserId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionUserId(userId);
    try {
      await apiFetch(`/hr/requests/${userId}/reject`, { method: 'POST' });
      setRequests((prev) => prev.filter((r) => r.user_id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to reject user');
    } finally {
      setActionUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/hr/dashboard" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <span className="font-extrabold text-lg text-white">Pending Join Requests</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Container */}
      <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Registration Approval Queue</h1>
          <p className="text-slate-400 text-sm mt-1">Users registered via signed invite link require HR verification before system access is granted.</p>
        </div>

        {requests.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Pending Requests</h3>
            <p className="text-slate-400 text-xs mb-6">All invite registrations for your organization have been reviewed.</p>
            <Link to="/hr/dashboard" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.user_id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {req.name}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                        {req.role}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {req.email}</span>
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-slate-500" /> {req.department}</span>
                      <span className="text-slate-500">Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleReject(req.user_id)}
                    disabled={actionUserId === req.user_id}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.user_id)}
                    disabled={actionUserId === req.user_id}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Approve User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
