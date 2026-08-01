import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Check, X, ArrowLeft, Mail, Building2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Logo, Button, Card } from '../../components/ui/primitives';

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
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0f347]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white pb-16">
      {/* Navbar */}
      <nav className="border-b border-[#2e2e2e] bg-[#161616]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/hr/dashboard" className="p-2 rounded-xl bg-[#181818] border border-[#2e2e2e] text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Logo />
          </div>
          <span className="font-mono text-xs font-bold text-[#d0f347] uppercase tracking-wider">
            Approval Queue
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Pending Join Requests</h1>
          <p className="text-slate-400 text-xs font-mono mt-1">Users registered via signed invite tokens require explicit HR verification before access is granted.</p>
        </div>

        {requests.length === 0 ? (
          <Card className="p-12 text-center shadow-2xl">
            <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">Queue Clear</h3>
            <p className="text-slate-400 text-xs mb-6">All invite registration requests for your organization have been reviewed.</p>
            <Link to="/hr/dashboard">
              <Button variant="primary" size="md">Return to Dashboard</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.user_id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#d0f347]/15 text-[#d0f347] font-mono font-bold flex items-center justify-center text-sm border border-[#d0f347]/30 flex-shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {req.name}
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 uppercase">
                        {req.role}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#181818] text-slate-300 border border-[#2e2e2e]">
                        {req.department}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {req.email}</span>
                      <span>Requested: {new Date(req.requested_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Button
                    onClick={() => handleReject(req.user_id)}
                    disabled={actionUserId === req.user_id}
                    variant="danger"
                    size="sm"
                    className="gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(req.user_id)}
                    disabled={actionUserId === req.user_id}
                    variant="primary"
                    size="sm"
                    className="gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
