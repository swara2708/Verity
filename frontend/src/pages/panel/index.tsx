import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Calendar, MessageSquare, LogOut, Award, Send, Link as LinkIcon } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
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

const DEMO_DRAFTS: DraftItem[] = [
  { id: 'd-1', entry_date: 'Today', content: 'Shipped multi-tenant authentication backend and database migration ahead of quarterly sprint schedule.' },
  { id: 'd-2', entry_date: 'Yesterday', content: 'Completed unit test coverage for PostgreSQL Row-Level Security policy enforcement.' },
];

const DEMO_FEEDBACK: FeedbackItem[] = [
  { id: 'f-1', source_type: 'self', content: 'Demonstrated strong ownership over authentication module refactor.', created_at: '2 days ago' },
  { id: 'f-2', source_type: 'peer', content: 'Dev provided clear API documentation and helped unblock frontend integration.', created_at: '3 days ago' },
  { id: 'f-3', source_type: 'manager', content: 'Consistently delivers high-quality backend code ahead of sprint deadlines.', created_at: '1 week ago' },
];

const DEMO_EVIDENCE: EvidenceItem[] = [
  { id: 'e-1', evidence_type: 'project_outcome', description: 'PR #42 - PostgreSQL Multi-Tenant Auth Migration', link_url: 'https://github.com/acme/verity/pull/42', date: 'Oct 15' },
  { id: 'e-2', evidence_type: 'metric', description: 'Zero API Key Exposure over 90-day evaluation cycle', date: 'Oct 12' },
];

export default function EmployeePanelPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [drafts, setDrafts] = useState<DraftItem[]>(DEMO_DRAFTS);
  const [feedback, setFeedback] = useState<FeedbackItem[]>(DEMO_FEEDBACK);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(DEMO_EVIDENCE);

  const [newDraft, setNewDraft] = useState('');

  const [evType, setEvType] = useState('project_outcome');
  const [evDesc, setEvDesc] = useState('');
  const [evLink, setEvLink] = useState('');
  const [submittingEvidence, setSubmittingEvidence] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchPanelData = async () => {
    try {
      const [dRes, fRes, eRes] = await Promise.all([
        apiFetch<DraftItem[]>('/daily-drafts'),
        apiFetch<FeedbackItem[]>('/reviews/feedback'),
        apiFetch<EvidenceItem[]>('/evidence'),
      ]);
      if (dRes && Array.isArray(dRes)) setDrafts(dRes);
      if (fRes && Array.isArray(fRes)) setFeedback(fRes);
      if (eRes && Array.isArray(eRes)) setEvidenceList(eRes);
    } catch (err) {
      console.warn('Using panel fallback demo data');
    }
  };

  useEffect(() => {
    fetchPanelData();
  }, []);

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraft.trim()) return;
    try {
      const res = await apiFetch<DraftItem>('/daily-drafts', {
        method: 'POST',
        body: JSON.stringify({ content: newDraft }),
      });
      setDrafts([res, ...drafts]);
      setNewDraft('');
    } catch (err) {
      setDrafts([{ id: `d-${Date.now()}`, entry_date: 'Today', content: newDraft }, ...drafts]);
      setNewDraft('');
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evDesc.trim()) return;
    setSubmittingEvidence(true);
    try {
      const res = await apiFetch<EvidenceItem>('/evidence', {
        method: 'POST',
        body: JSON.stringify({
          evidence_type: evType,
          description: evDesc,
          link_url: evLink || null,
        }),
      });
      setEvidenceList([res, ...evidenceList]);
      setEvDesc('');
      setEvLink('');
    } catch (err) {
      setEvidenceList([
        { id: `e-${Date.now()}`, evidence_type: evType, description: evDesc, link_url: evLink || undefined, date: 'Today' },
        ...evidenceList,
      ]);
      setEvDesc('');
      setEvLink('');
    } finally {
      setSubmittingEvidence(false);
    }
  };

  const selfFeedback = feedback.filter((f) => f.source_type === 'self');
  const peerFeedback = feedback.filter((f) => f.source_type === 'peer');
  const managerFeedback = feedback.filter((f) => f.source_type === 'manager');

  const sidebarLinks = [
    {
      label: "Portal Overview",
      href: "/panel",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-[#C1E8FF]" />,
    },
    {
      label: "Daily Check-in",
      href: "/panel/daily",
      icon: <CalendarIcon className="h-5 w-5 shrink-0 text-[#C1E8FF]" />,
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
            <Link to="/panel" className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-black">
                <Hexagon className="w-5 h-5 fill-[#C1E8FF]" />
              </div>
              <span className="font-sora font-extrabold text-xl tracking-tight text-white uppercase font-mono-code">
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
                  <div className="h-7 w-7 shrink-0 rounded-full bg-[#052659] text-[#C1E8FF] font-bold font-mono-code flex items-center justify-center text-xs border border-[#7DA0CA]">
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
        <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-extrabold text-[#021024]">Employee Evidence & Feedback Portal</h1>
          <p className="text-[#5483B3] text-xs font-mono-code mt-1">Accumulate continuous evidence logs to eliminate end-of-cycle memory bias.</p>
        </div>

        {/* Two-Column Grid: Daily Draft Log & 360 Feedback Received */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Daily Draft Log Card */}
          <Card className="shadow-xl space-y-4 bg-white border-[#7DA0CA]">
            <div className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider border-b border-[#7DA0CA]/50 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#052659]" />
                DAILY DRAFT LOG (CHRONOLOGICAL)
              </span>
              <Link to="/panel/daily" className="text-[11px] text-[#052659] hover:underline font-mono-code font-bold">
                + New Log
              </Link>
            </div>

            {drafts.length === 0 ? (
              <p className="text-xs text-[#5483B3] italic py-4 text-center font-mono-code">No daily draft entries logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {drafts.map((d) => (
                  <div key={d.id} className="p-3.5 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA] text-xs space-y-1">
                    <div className="font-mono-code text-[11px] font-bold text-[#052659]">{d.entry_date}</div>
                    <p className="text-[#021024] leading-relaxed">{d.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 360 Feedback Received Card */}
          <Card className="shadow-xl space-y-4 bg-white border-[#7DA0CA]">
            <div className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider border-b border-[#7DA0CA]/50 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#052659]" />
              360° FEEDBACK RECEIVED (GROUPED BY SOURCE)
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {/* Manager */}
              <div>
                <span className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#052659]/10 text-[#052659] border border-[#052659]/30 uppercase">
                  Manager Feedback ({managerFeedback.length})
                </span>
                {managerFeedback.length === 0 ? (
                  <p className="text-[11px] text-[#5483B3] italic mt-1 font-mono-code">No manager feedback recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {managerFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA] text-xs text-[#021024]">
                        <p>{f.content}</p>
                        <span className="font-mono-code text-[10px] text-[#5483B3] mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Peer */}
              <div>
                <span className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#052659]/10 text-[#052659] border border-[#052659]/30 uppercase">
                  Peer Feedback ({peerFeedback.length})
                </span>
                {peerFeedback.length === 0 ? (
                  <p className="text-[11px] text-[#5483B3] italic mt-1 font-mono-code">No peer feedback recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {peerFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA] text-xs text-[#021024]">
                        <p>{f.content}</p>
                        <span className="font-mono-code text-[10px] text-[#5483B3] mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Self */}
              <div>
                <span className="font-mono-code text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#052659]/10 text-[#052659] border border-[#052659]/30 uppercase">
                  Self Assessment ({selfFeedback.length})
                </span>
                {selfFeedback.length === 0 ? (
                  <p className="text-[11px] text-[#5483B3] italic mt-1 font-mono-code">No self assessment recorded.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {selfFeedback.map((f) => (
                      <div key={f.id} className="p-3 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA] text-xs text-[#021024]">
                        <p>{f.content}</p>
                        <span className="font-mono-code text-[10px] text-[#5483B3] mt-1 block">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Card: Form to Submit Formal Evidence Item */}
        <Card className="shadow-xl space-y-4 bg-white border-[#7DA0CA]">
          <div className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider border-b border-[#7DA0CA]/50 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#052659]" />
              SUBMIT EVIDENCE ITEM (PROJECT PR, METRIC, RECORD)
            </span>
          </div>

          <form onSubmit={handleAddEvidence} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block text-xs font-mono-code text-[#5483B3] font-bold uppercase mb-1">Evidence Type</label>
              <select
                value={evType}
                onChange={(e) => setEvType(e.target.value)}
                className="w-full px-3 py-2 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
              >
                <option value="project_outcome">Project Outcome</option>
                <option value="metric">Metric Improvement</option>
                <option value="peer_praise">Peer Praise</option>
                <option value="certification">Certification</option>
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-mono-code text-[#5483B3] font-bold uppercase mb-1">Description</label>
              <input
                type="text"
                value={evDesc}
                onChange={(e) => setEvDesc(e.target.value)}
                placeholder="e.g. PR #42 - PostgreSQL Auth Migration"
                className="w-full px-3 py-2 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                required
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-mono-code text-[#5483B3] font-bold uppercase mb-1">Link URL (Optional)</label>
              <input
                type="url"
                value={evLink}
                onChange={(e) => setEvLink(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <Button type="submit" disabled={submittingEvidence} variant="primary" size="sm" className="gap-2">
                <Send className="w-3.5 h-3.5" />
                {submittingEvidence ? 'Submitting...' : 'Link Evidence Artifact'}
              </Button>
            </div>
          </form>

          {evidenceList.length > 0 && (
            <div className="pt-4 border-t border-[#7DA0CA]/50 space-y-2">
              <span className="font-mono-code text-[11px] text-[#5483B3] uppercase font-bold">Attached Evidence Artifacts ({evidenceList.length})</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {evidenceList.map((item) => (
                  <div key={item.id} className="p-3 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono-code text-[10px] text-[#052659] font-bold">
                      <span className="uppercase">{item.evidence_type.replace('_', ' ')}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-[#021024] font-medium">{item.description}</p>
                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#052659] font-bold hover:underline inline-flex items-center gap-1 font-mono-code text-[11px]"
                      >
                        <LinkIcon className="w-3 h-3" /> {item.link_url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </main>
      </div>
    </div>
  );
}
