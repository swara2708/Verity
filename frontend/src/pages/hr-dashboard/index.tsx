import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Users, Clock, AlertTriangle, FileText, ExternalLink, LogOut, Copy, Check, Filter } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Logo, Button, Card, StatusBadge } from '../../components/ui/primitives';
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar';
import { LayoutDashboard, Clock as ClockIcon, UserPlus as UserPlusIcon, LogOut as LogOutIcon, Hexagon } from 'lucide-react';

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

const DEMO_HR_OVERVIEW: HROverview = {
  org_name: 'Acme Corp',
  employees: [
    {
      id: 'emp-1',
      name: 'Dev Patel',
      department: 'Engineering',
      role: 'Lead Auth Architect',
      status: 'active',
      review_status: 'verified',
    },
    {
      id: 'emp-2',
      name: 'Johanna Williams',
      department: 'Infrastructure',
      role: 'Senior Systems Engineer',
      status: 'active',
      review_status: 'needs_input',
    },
    {
      id: 'emp-3',
      name: 'Alex Rivera',
      department: 'Product',
      role: 'Staff Product Manager',
      status: 'active',
      review_status: 'draft',
    },
    {
      id: 'emp-4',
      name: 'Sarah Chen',
      department: 'Engineering',
      role: 'Senior Frontend Lead',
      status: 'active',
      review_status: 'verified',
    },
  ],
};

export default function HRDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState<HROverview | null>(DEMO_HR_OVERVIEW);
  const [pendingCount, setPendingCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      if (data && data.employees) {
        setOverview(data);
      }

      const reqData = await apiFetch<{ requests: any[] }>('/hr/requests');
      if (reqData && reqData.requests) {
        setPendingCount(reqData.requests.length);
      }
    } catch (err) {
      console.warn('Using HR fallback overview data');
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
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0f347]" />
      </div>
    );
  }

  const employees = overview?.employees || [];
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const inProgressCount = employees.filter((e) => e.review_status === 'draft' || e.review_status === 'drafting').length;
  const flaggedCount = employees.filter((e) => e.review_status === 'flagged' || e.review_status === 'needs_input').length;

  const filteredEmployees = departmentFilter === 'all'
    ? employees
    : employees.filter((e) => e.department.toLowerCase() === departmentFilter.toLowerCase());

  const sidebarLinks = [
    {
      label: "360° Roster",
      href: "/hr/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#d0f347]" />,
    },
    {
      label: `Requests ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
      href: "/hr/requests",
      icon: <ClockIcon className="h-5 w-5 shrink-0 text-amber-400" />,
    },
    {
      label: "Logout",
      href: "#logout",
      icon: <LogOutIcon className="h-5 w-5 shrink-0 text-rose-400" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#161616] text-white">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Link to="/hr/dashboard" className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-[#d0f347] text-[#141414] flex items-center justify-center font-black">
                <Hexagon className="w-5 h-5 fill-[#141414]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white uppercase font-mono">
                Verity
              </span>
            </Link>

            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <div key={idx} onClick={link.href === '#logout' ? () => { logout(); navigate('/login/hr'); } : undefined}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || "HR Admin",
                href: "/hr/dashboard",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#d0f347] text-[#141414] font-bold font-mono flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'H'}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs font-bold text-[#d0f347] uppercase tracking-wider">
              {overview?.org_name || 'Acme Corp'} &bull; HR Admin Panel
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">360° Performance Roster</h1>
          </div>

          <Button
            onClick={() => {
              setCreatedInviteUrl(null);
              setInviteEmail('');
              setShowInviteModal(true);
            }}
            variant="primary"
            size="md"
            className="gap-2 self-start sm:self-center"
          >
            <UserPlus className="w-4 h-4" />
            Invite People
          </Button>
        </div>

        {/* 4-Stat Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card hoverLift>
            <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px] uppercase font-bold tracking-wider">
              <span>Active Employees</span>
              <Users className="w-4 h-4 text-[#d0f347]" />
            </div>
            <div className="text-4xl font-extrabold text-white">{activeCount}</div>
            <div className="font-mono text-[11px] text-slate-500 mt-1">Scoped to org_1</div>
          </Card>

          <Card hoverLift>
            <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px] uppercase font-bold tracking-wider">
              <span>Reviews in Progress</span>
              <FileText className="w-4 h-4 text-[#d0f347]" />
            </div>
            <div className="text-4xl font-extrabold text-[#d0f347]">{inProgressCount}</div>
            <div className="font-mono text-[11px] text-slate-500 mt-1">Accumulating evidence logs</div>
          </Card>

          <Card hoverLift>
            <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px] uppercase font-bold tracking-wider">
              <span>Pending Approvals</span>
              <Clock className="w-4 h-4 text-[#fbbf24]" />
            </div>
            <div className="text-4xl font-extrabold text-[#fbbf24]">{pendingCount}</div>
            <div className="font-mono text-[11px] text-slate-500 mt-1">Registration queue approval</div>
          </Card>

          <Card hoverLift>
            <div className="flex items-center justify-between text-slate-400 mb-2 font-mono text-[11px] uppercase font-bold tracking-wider">
              <span>Flagged Reviews</span>
              <AlertTriangle className="w-4 h-4 text-[#fb7185]" />
            </div>
            <div className="text-4xl font-extrabold text-[#fb7185]">{flaggedCount}</div>
            <div className="font-mono text-[11px] text-slate-500 mt-1">Bias threshold warning</div>
          </Card>
        </div>

        {/* Roster Table */}
        <Card className="p-0 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#2e2e2e] bg-[#181818] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#d0f347]" />
              Employee Review Roster
            </h2>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-[#181818] border border-[#2e2e2e] text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#d0f347]"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#181818] font-mono text-[11px] uppercase text-slate-400 font-bold tracking-wider border-b border-[#2e2e2e]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Review Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#181818] transition-colors card-hover-lift cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#d0f347]/15 text-[#d0f347] font-mono font-bold flex items-center justify-center text-xs border border-[#d0f347]/30">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{emp.name}</div>
                        <div className="font-mono text-[11px] text-slate-500">{emp.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{emp.department}</td>
                    <td className="px-6 py-4 text-slate-400 capitalize">{emp.role}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emp.review_status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">Today</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/hr/review/${emp.id}`)}
                        className="px-3.5 py-2 bg-[#d0f347]/15 hover:bg-[#d0f347] text-[#d0f347] hover:text-[#141414] border border-[#d0f347]/30 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1"
                      >
                        Inspect Review <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-backdrop-enter">
          <Card className="max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-card-enter">
            <h3 className="text-xl font-bold text-white">Issue Signed Invite Token</h3>
            <p className="text-xs text-slate-400">Generates a time-limited 7-day invite link pre-authorized for your organization.</p>

            {!createdInviteUrl ? (
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Invitee Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="new.employee@acme.com"
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="peer">Peer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#2e2e2e]">
                  <Button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={inviteLoading}
                    variant="primary"
                    size="sm"
                  >
                    {inviteLoading ? 'Generating...' : 'Send Invite Link'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[#181818] rounded-xl border border-[#2e2e2e]">
                  <label className="block text-xs text-slate-400 font-mono font-semibold mb-1">Signed Invite Link (7-day Expiry):</label>
                  <div className="text-xs text-[#d0f347] font-mono break-all bg-[#141414] p-3 rounded-lg border border-[#2e2e2e] mb-3">
                    {createdInviteUrl}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="primary"
                    size="sm"
                    className="w-full justify-center gap-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Link'}
                  </Button>
                </div>
                <div className="text-right">
                  <Button
                    onClick={() => setShowInviteModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
