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
  ],
};

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<HROverview | null>(DEMO_HR_OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('employee');
  const [inviteDepartment, setInviteDepartment] = useState('Engineering');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingCount = 0;

  const fetchDashboardData = async () => {
    try {
      const res = await apiFetch<HROverview>('/hr/overview');
      if (res && res.employees) {
        setOverview(res);
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
      <div className="min-h-screen bg-[#C1E8FF] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052659]" />
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
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#C1E8FF]" />,
    },
    {
      label: `Requests ${pendingCount > 0 ? `(${pendingCount})` : ''}`,
      href: "/hr/requests",
      icon: <ClockIcon className="h-5 w-5 shrink-0 text-[#C1E8FF]" />,
    },
    {
      label: "Logout",
      href: "#logout",
      icon: <LogOutIcon className="h-5 w-5 shrink-0 text-[#7DA0CA]" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#C1E8FF] text-[#021024]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Link to="/hr/dashboard" className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-black">
                <Hexagon className="w-5 h-5 fill-[#C1E8FF]" />
              </div>
              <span className="font-sora font-extrabold text-xl tracking-tight text-white uppercase font-mono-code">
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
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#052659] text-[#C1E8FF] font-bold font-mono-code flex items-center justify-center text-xs border border-[#7DA0CA]">
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
        <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider bg-white border border-[#7DA0CA] px-3 py-1 rounded-full">
              {overview?.org_name || 'Acme Corp'} &bull; HR Admin Panel
            </span>
            <h1 className="text-3xl font-sora font-extrabold text-[#021024] mt-3">360° Performance Roster</h1>
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
          <Card hoverLift className="bg-white border-[#7DA0CA]">
            <div className="flex items-center justify-between text-[#5483B3] mb-2 font-mono-code text-[11px] uppercase font-bold tracking-wider">
              <span>Active Employees</span>
              <Users className="w-4 h-4 text-[#052659]" />
            </div>
            <div className="text-4xl font-sora font-extrabold text-[#021024]">{activeCount}</div>
            <div className="font-mono-code text-[11px] text-[#5483B3] mt-1">Scoped to org_1</div>
          </Card>

          <Card hoverLift className="bg-white border-[#7DA0CA]">
            <div className="flex items-center justify-between text-[#5483B3] mb-2 font-mono-code text-[11px] uppercase font-bold tracking-wider">
              <span>Reviews in Progress</span>
              <FileText className="w-4 h-4 text-[#052659]" />
            </div>
            <div className="text-4xl font-sora font-extrabold text-[#052659]">{inProgressCount}</div>
            <div className="font-mono-code text-[11px] text-[#5483B3] mt-1">Accumulating evidence logs</div>
          </Card>

          <Card hoverLift className="bg-white border-[#7DA0CA]">
            <div className="flex items-center justify-between text-[#5483B3] mb-2 font-mono-code text-[11px] uppercase font-bold tracking-wider">
              <span>Pending Approvals</span>
              <Clock className="w-4 h-4 text-[#052659]" />
            </div>
            <div className="text-4xl font-sora font-extrabold text-[#052659]">{pendingCount}</div>
            <div className="font-mono-code text-[11px] text-[#5483B3] mt-1">Registration queue approval</div>
          </Card>

          <Card hoverLift className="bg-white border-[#7DA0CA]">
            <div className="flex items-center justify-between text-[#5483B3] mb-2 font-mono-code text-[11px] uppercase font-bold tracking-wider">
              <span>Flagged Reviews</span>
              <AlertTriangle className="w-4 h-4 text-[#5483B3]" />
            </div>
            <div className="text-4xl font-sora font-extrabold text-[#021024]">{flaggedCount}</div>
            <div className="font-mono-code text-[11px] text-[#5483B3] mt-1">Bias threshold warning</div>
          </Card>
        </div>

        {/* Roster Table */}
        <Card className="p-0 overflow-hidden shadow-xl bg-white border-[#7DA0CA]">
          <div className="p-6 border-b border-[#7DA0CA] bg-[#EAF3FB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-sora font-bold text-[#021024] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#052659]" />
              Employee Review Roster
            </h2>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#5483B3]" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white border border-[#7DA0CA] text-[#021024] text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#052659]"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#021024]">
              <thead className="bg-[#EAF3FB] font-mono-code text-[11px] uppercase text-[#5483B3] font-bold tracking-wider border-b border-[#7DA0CA]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Review Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7DA0CA]/40">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#EAF3FB]/60 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-[#021024] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#052659] text-[#C1E8FF] font-mono-code font-bold flex items-center justify-center text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-sora font-bold text-[#021024] text-sm">{emp.name}</div>
                        <div className="font-mono-code text-[11px] text-[#5483B3]">{emp.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#021024] font-medium">{emp.department}</td>
                    <td className="px-6 py-4 text-[#5483B3] capitalize">{emp.role}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emp.review_status} />
                    </td>
                    <td className="px-6 py-4 font-mono-code text-[11px] text-[#5483B3]">Today</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/hr/review/${emp.id}`)}
                        className="px-3.5 py-2 bg-[#052659] hover:bg-[#021024] text-[#C1E8FF] rounded-xl text-xs font-sora font-bold transition-all inline-flex items-center gap-1 shadow-sm"
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
        <div className="fixed inset-0 bg-[#021024]/70 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <Card className="max-w-md w-full p-6 shadow-2xl space-y-4 bg-white border-[#7DA0CA]">
            <h3 className="text-xl font-sora font-bold text-[#021024]">Issue Signed Invite Token</h3>
            <p className="text-xs text-[#5483B3]">Generates a time-limited 7-day invite link pre-authorized for your organization.</p>

            {!createdInviteUrl ? (
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase mb-1">Invitee Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="new.employee@acme.com"
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="peer">Peer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#7DA0CA]/50">
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
                <div className="p-4 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA]">
                  <label className="block text-xs text-[#5483B3] font-mono-code font-semibold mb-1">Signed Invite Link (7-day Expiry):</label>
                  <div className="text-xs text-[#052659] font-mono-code break-all bg-white p-3 rounded-lg border border-[#7DA0CA] mb-3 font-bold">
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
