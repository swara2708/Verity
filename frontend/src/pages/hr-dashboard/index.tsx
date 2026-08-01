import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, Users, Clock, AlertTriangle, FileText, CheckCircle, ExternalLink, LogOut, Copy, Check } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface EmployeeItem {
  id: string;
  name: string;
  department: string;
  role: string;
  status: string;
  review_status: string;
}

interface HROverview {
  org_name: string;
  employees: EmployeeItem[];
}

export default function HRDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState<HROverview | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Invite Modal state
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<string>('employee');
  const [inviteDepartment, setInviteDepartment] = useState<string>('Engineering');
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch<HROverview>('/hr/overview');
      setOverview(data);

      const reqData = await apiFetch<{ requests: any[] }>('/hr/requests');
      setPendingCount(reqData.requests.length);
    } catch (err) {
      console.error('Error fetching HR overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const res = await apiFetch<{ invite_url: string }>('/invites', {
        method: 'POST',
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          department: inviteDepartment,
        }),
      });
      const fullUrl = `${window.location.origin}${res.invite_url}`;
      setCreatedInviteUrl(fullUrl);
    } catch (err: any) {
      alert(err.message || 'Failed to create invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdInviteUrl) {
      navigator.clipboard.writeText(createdInviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white">Verity HR</span>
              <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {overview?.org_name || 'Acme Corp'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/hr/requests" className="relative px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition-all">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pending Requests</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-amber-500 text-slate-950 font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login/hr');
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Hero Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">360° Review Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Multi-tenant bias detection & evidence-driven review pipeline</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCreatedInviteUrl(null);
                setInviteEmail('');
                setShowInviteModal(true);
              }}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Issue Invite Link
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider">Total Active Staff</span>
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{overview?.employees?.length || 0}</div>
            <div className="text-xs text-slate-400 mt-2">Scoped to organization org_1</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider">Pending HR Approvals</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{pendingCount}</div>
            <div className="text-xs text-slate-400 mt-2">Requires admin verification</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider">Bias System Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">Active</div>
            <div className="text-xs text-slate-400 mt-2">Recency & Source diversity engine</div>
          </div>
        </div>

        {/* Employee Review Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Employee Review Roster
            </h2>
            <span className="text-xs text-slate-400">Select employee to inspect bias & draft report</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Review Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {overview?.employees?.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-indigo-300 font-bold flex items-center justify-center text-sm border border-slate-700">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-xs text-slate-500 font-normal">{emp.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{emp.department}</td>
                    <td className="px-6 py-4 text-slate-400 capitalize">{emp.role}</td>
                    <td className="px-6 py-4">
                      {emp.review_status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : emp.review_status === 'draft' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                          <FileText className="w-3.5 h-3.5" /> Draft Ready
                        </span>
                      ) : emp.review_status === 'needs_input' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Needs Input
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/hr/review/${emp.id}`)}
                        className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        Inspect Review <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">Issue HR Invite Link</h3>
            <p className="text-slate-400 text-xs mb-6">Generates a signed, time-limited token scoped to your organization.</p>

            {!createdInviteUrl ? (
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Invitee Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="new.employee@acme.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="peer">Peer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    {inviteLoading ? 'Generating...' : 'Generate Invite Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Signed Invite Link (7-day Expiry):</label>
                  <div className="text-xs text-indigo-300 font-mono break-all bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
                    {createdInviteUrl}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Link'}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
