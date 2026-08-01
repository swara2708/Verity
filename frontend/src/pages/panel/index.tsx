import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Calendar, MessageSquare, LogOut, Award, Send, Link as LinkIcon } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Logo, Button, Card } from '../../components/ui/primitives';
import { Sidebar, SidebarBody, SidebarLink } from '../../components/ui/sidebar';
import { LayoutDashboard, Calendar as CalendarIcon, PlusCircle as PlusIcon, LogOut as LogOutIcon, Hexagon } from 'lucide-react';

interface DraftItem {
  id: string;
  entry_date: string;
  content: string;
}

interface FeedbackItem {
  id: string;
  source_type: string;
  content: string;
  created_at: string;
}

interface EvidenceItem {
  id: string;
  evidence_type: string;
  description: string;
  link_url?: string;
  date: string;
}

export default function EmployeePanelPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Evidence Modal state
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [evidenceDescription, setEvidenceDescription] = useState<string>('');
  const [evidenceLinkUrl, setEvidenceLinkUrl] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<string>('project_outcome');
  const [submittingEvidence, setSubmittingEvidence] = useState<boolean>(false);

  const fetchPanelData = async () => {
    if (!user) return;
    try {
      const draftRes = await apiFetch<{ drafts: DraftItem[] }>(`/daily-drafts/${user.id}`);
      setDrafts(draftRes.drafts || []);

      const fbRes = await apiFetch<{ feedback: FeedbackItem[] }>(`/feedback/${user.id}`);
      setFeedback(fbRes.feedback || []);

      const evRes = await apiFetch<{ evidence: EvidenceItem[] }>(`/evidence/${user.id}`);
      setEvidenceList(evRes.evidence || []);
    } catch (err) {
      console.error('Error fetching employee panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanelData();
  }, [user]);

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingEvidence(true);
    try {
      await apiFetch('/evidence', {
        method: 'POST',
        body: JSON.stringify({
          description: evidenceDescription,
          link_url: evidenceLinkUrl || null,
          evidence_type: evidenceType,
          employee_id: user.id,
        }),
      });
      setEvidenceDescription('');
      setEvidenceLinkUrl('');
      setShowEvidenceModal(false);
      alert('Formal evidence recorded successfully!');
      fetchPanelData();
    } catch (err: any) {
      alert(err.message || 'Failed to record evidence');
    } finally {
      setSubmittingEvidence(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0f347]" />
      </div>
    );
  }

  const selfFeedback = feedback.filter((f) => f.source_type === 'self');
  const peerFeedback = feedback.filter((f) => f.source_type === 'peer');
  const managerFeedback = feedback.filter((f) => f.source_type === 'manager');

  const sidebarLinks = [
    {
      label: "Portal Overview",
      href: "/panel",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#d0f347]" />,
    },
    {
      label: "Daily Check-in",
      href: "/panel/daily",
      icon: <CalendarIcon className="h-5 w-5 shrink-0 text-emerald-400" />,
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
            <Link to="/panel" className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-[#d0f347] text-[#141414] flex items-center justify-center font-black">
                <Hexagon className="w-5 h-5 fill-[#141414]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white uppercase font-mono">
                Verity
              </span>
            </Link>

            <div className="mt-8 flex flex-col gap-2">
              {sidebarLinks.map((link, idx) => (
                <div key={idx} onClick={link.href === '#logout' ? () => { logout(); navigate('/login'); } : undefined}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <SidebarLink
              link={{
                label: user?.name || "Employee",
                href: "/panel",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#d0f347] text-[#141414] font-bold font-mono flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'E'}
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
        <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Employee Evidence & Feedback Portal</h1>
          <p className="text-slate-400 text-xs font-mono mt-1">Accumulate continuous evidence logs to eliminate end-of-cycle memory bias.</p>
        </div>

        {/* Two-Column Grid: Daily Draft Log & 360 Feedback Received */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Daily Draft Log Card */}
          <Card className="shadow-2xl space-y-4">
            <div className="font-mono text-xs font-bold text-[#d0f347] uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d0f347]" />
                DAILY DRAFT LOG (CHRONOLOGICAL)
              </span>
              <Link to="/panel/daily" className="text-[11px] text-[#d0f347] hover:underline font-mono">
                + New Log
              </Link>
            </div>

            {drafts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center font-mono">No daily draft entries logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {drafts.map((d) => (
                  <div key={d.id} className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs space-y-1">
                    <div className="font-mono text-[11px] font-bold text-[#d0f347]">{d.entry_date}</div>
                    <p className="text-slate-200 leading-relaxed">{d.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 360 Feedback Received Card */}
          <Card className="shadow-2xl space-y-4">
            <div className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#d0f347]" />
              360° FEEDBACK RECEIVED (GROUPED BY SOURCE)
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {/* Manager */}
              <div>
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 uppercase">
                  Manager Feedback ({managerFeedback.length})
                </span>
                {managerFeedback.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic mt-1 font-mono">No manager feedback recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {managerFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs text-slate-200">
                        <p>{f.content}</p>
                        <span className="font-mono text-[10px] text-slate-500 mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Peer */}
              <div>
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 uppercase">
                  Peer Feedback ({peerFeedback.length})
                </span>
                {peerFeedback.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic mt-1 font-mono">No peer feedback recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {peerFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs text-slate-200">
                        <p>{f.content}</p>
                        <span className="font-mono text-[10px] text-slate-500 mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Self */}
              <div>
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 uppercase">
                  Self Assessment ({selfFeedback.length})
                </span>
                {selfFeedback.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic mt-1 font-mono">No self assessments recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {selfFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs text-slate-200">
                        <p>{f.content}</p>
                        <span className="font-mono text-[10px] text-slate-500 mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Full-Width Formal Evidence Card */}
        <Card className="shadow-2xl space-y-4 mb-8">
          <div className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d0f347]" />
              FORMAL EVIDENCE ARTIFACTS
            </span>
            <Button
              onClick={() => setShowEvidenceModal(true)}
              variant="primary"
              size="sm"
            >
              + Add Evidence
            </Button>
          </div>

          {evidenceList.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono py-6 text-center">
              No formal evidence items recorded yet. Use the "+ Add Evidence" button above.
            </p>
          ) : (
            <div className="space-y-3">
              {evidenceList.map((e) => (
                <div key={e.id} className="p-4 bg-[#181818] rounded-xl border border-[#2e2e2e] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 uppercase">
                        {e.evidence_type.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{e.date}</span>
                    </div>
                    <p className="text-xs text-white font-medium">{e.description}</p>
                    {e.link_url && (
                      <a
                        href={e.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[#d0f347] hover:underline mt-1.5"
                      >
                        <LinkIcon className="w-3 h-3" /> {e.link_url}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>

      {/* Add Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-backdrop-enter">
          <Card className="max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-card-enter">
            <h3 className="text-xl font-bold text-white">Add Formal Evidence Artifact</h3>
            <p className="text-xs text-slate-400">Attach tangible outcomes, PR links, or metric updates.</p>

            <form onSubmit={handleSubmitEvidence} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  placeholder="e.g. Delivered invite token auth refactor ahead of schedule..."
                  className="w-full p-3.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347] h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                >
                  <option value="project_outcome">Project Outcome</option>
                  <option value="metric">Metric Improvement</option>
                  <option value="link">Pull Request / Link</option>
                  <option value="goal_progress">Goal Update</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Optional Link URL</label>
                <input
                  type="url"
                  value={evidenceLinkUrl}
                  onChange={(e) => setEvidenceLinkUrl(e.target.value)}
                  placeholder="https://github.com/org/repo/pull/42"
                  className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2e2e2e]">
                <Button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEvidence}
                  variant="primary"
                  size="sm"
                >
                  Save Evidence Item
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
