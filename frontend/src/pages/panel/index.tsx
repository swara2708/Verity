import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, PlusCircle, Calendar, MessageSquare, Clock, LogOut, FileText, Send, Link as LinkIcon, Award } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

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

  // New feedback submission form
  const [targetEmployeeId, setTargetEmployeeId] = useState<string>('');
  const [sourceType, setSourceType] = useState<string>('peer');
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

  // New formal evidence submission form
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

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingFeedback(true);
    try {
      const targetId = targetEmployeeId.trim() || user.id;
      await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          employee_id: targetId,
          source_type: sourceType,
          content: feedbackContent,
        }),
      });
      setFeedbackContent('');
      alert('Feedback submitted successfully!');
      fetchPanelData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

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
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white">Verity Portal</span>
              <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium capitalize">
                {user?.name} ({user?.role})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link to="/panel/daily" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 transition-all text-xs shadow-lg shadow-blue-600/20">
              <PlusCircle className="w-4 h-4" /> Daily Check-in
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
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
      <main className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Evidence & Feedback Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Continuous evidence accumulation prevents end-of-quarter recency bias</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Formal Evidence, Daily Drafts Timeline & Feedback History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formal Evidence Section */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Recorded Formal Evidence
                </h2>
                <span className="text-xs text-slate-400">Attached to performance reviews</span>
              </div>

              {evidenceList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No formal evidence items recorded yet. Use the "Add Evidence" form on the right!
                </div>
              ) : (
                <div className="space-y-4">
                  {evidenceList.map((e) => (
                    <div key={e.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                            {e.evidence_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">{e.date}</span>
                        </div>
                        <p className="text-sm text-slate-100 font-medium">{e.description}</p>
                        {e.link_url && (
                          <a
                            href={e.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline mt-2"
                          >
                            <LinkIcon className="w-3.5 h-3.5" /> {e.link_url}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Drafts Timeline */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Daily Draft Logs Timeline
                </h2>
                <Link to="/panel/daily" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  + Add Entry
                </Link>
              </div>

              {drafts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No daily drafts logged yet. Log daily updates to build your evidence timeline!
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((d) => (
                    <div key={d.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-4">
                      <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-xs font-semibold flex-shrink-0">
                        {d.entry_date}
                      </div>
                      <p className="text-sm text-slate-200">{d.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback History */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Recorded 360° Feedback
                </h2>
              </div>

              {feedback.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No feedback entries recorded yet for your account.
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((f) => (
                    <div key={f.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize">
                          {f.source_type} Feedback
                        </span>
                        <span className="text-xs text-slate-500">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-200">{f.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Add Evidence Form & Submit Feedback Form */}
          <div className="space-y-6">
            {/* Add Evidence Form */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                Add Formal Evidence
              </h3>
              <p className="text-xs text-slate-400 mb-4">Record tangible outcomes, metric improvements, or PR links.</p>

              <form onSubmit={handleSubmitEvidence} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">What Happened (Description)</label>
                  <textarea
                    value={evidenceDescription}
                    onChange={(e) => setEvidenceDescription(e.target.value)}
                    placeholder="e.g. Delivered invite token authentication refactor ahead of sprint deadline..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Evidence Type</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="project_outcome">Project Outcome</option>
                    <option value="metric">Metric Improvement</option>
                    <option value="link">Pull Request / Link</option>
                    <option value="goal_progress">Goal Update</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Optional Link URL</label>
                  <input
                    type="url"
                    value={evidenceLinkUrl}
                    onChange={(e) => setEvidenceLinkUrl(e.target.value)}
                    placeholder="https://github.com/org/repo/pull/42"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingEvidence}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {submittingEvidence ? 'Saving...' : 'Add Evidence Item'}
                </button>
              </form>
            </div>

            {/* Submit 360 Feedback Form */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                Submit 360° Feedback
              </h3>
              <p className="text-xs text-slate-400 mb-4">Provide feedback for self, peers, or team members.</p>

              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target Employee ID</label>
                  <input
                    type="text"
                    value={targetEmployeeId}
                    onChange={(e) => setTargetEmployeeId(e.target.value)}
                    placeholder={user?.id || 'usr_4'}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to target your own account ({user?.id})</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Source Type</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="peer">Peer</option>
                    <option value="self">Self</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Feedback Content</label>
                  <textarea
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    placeholder="Provide specific feedback on deliverables, mentorship, or collaboration..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 h-28"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
