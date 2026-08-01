import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, ArrowLeft, FileText, Check, X, Sparkles, TrendingUp, Target } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

interface ReviewData {
  review_id: string;
  employee_id: string;
  status: string;
  report: {
    strengths?: string[];
    growth_areas?: string[];
    impact_highlights?: string[];
    goal_progress?: { goal: string; status: string }[];
  };
  bias_report: {
    recency_score: number;
    diversity_score: number;
    unsupported_claims: number;
    flags: string[];
  };
}

export default function HRReviewPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const fetchReview = async () => {
    if (!employeeId) return;
    try {
      const data = await apiFetch<ReviewData>(`/reviews/${employeeId}`);
      setReview(data);
    } catch (err: any) {
      console.log('No existing review found or failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [employeeId]);

  const handleGenerateReview = async () => {
    if (!employeeId) return;
    setGenerating(true);
    try {
      const res = await apiFetch<{ review_id: string; status: string }>('/reviews/generate', {
        method: 'POST',
        body: JSON.stringify({ employee_id: employeeId }),
      });
      // Fetch fresh review details
      const freshData = await apiFetch<ReviewData>(`/reviews/${res.review_id}`);
      setReview(freshData);
    } catch (err: any) {
      alert(err.message || 'Failed to trigger agent pipeline');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!review) return;
    setActionLoading(true);
    try {
      await apiFetch(`/reviews/${review.review_id}/approve`, { method: 'POST' });
      setReview((prev) => prev ? { ...prev, status: 'approved' } : null);
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!review) return;
    setActionLoading(true);
    try {
      await apiFetch(`/reviews/${review.review_id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectReason }),
      });
      setReview((prev) => prev ? { ...prev, status: 'needs_input' } : null);
      setShowRejectModal(false);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const bias = review?.bias_report;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/hr/dashboard" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <span className="font-extrabold text-lg text-white">Verity Review & Bias Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateReview}
              disabled={generating}
              className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {generating ? 'Running Agents...' : 'Run Agent Pipeline'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">Performance Review Inspection</h1>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {employeeId}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">Review draft generated via evidence retrieval & synthesis pipeline</p>
          </div>

          {review && (
            <div className="flex items-center gap-3">
              {review.status === 'approved' ? (
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Review Approved
                </span>
              ) : review.status === 'needs_input' ? (
                <span className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Returned for Input
                </span>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <X className="w-4 h-4" /> Request Input
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" /> Approve Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!review ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">No Review Generated Yet</h3>
            <p className="text-slate-400 text-xs mb-6">Click "Run Agent Pipeline" above to trigger evidence retrieval, synthesis, and bias detection.</p>
            <button
              onClick={handleGenerateReview}
              disabled={generating}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              {generating ? 'Running Agents...' : 'Trigger Review Generation'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Synthesis Report */}
            <div className="lg:col-span-2 space-y-6">
              {/* Strengths */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm uppercase font-bold text-emerald-400 tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Key Strengths
                </h3>
                <ul className="space-y-2.5">
                  {review.report?.strengths?.map((s, idx) => (
                    <li key={idx} className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Areas */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm uppercase font-bold text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Growth Areas
                </h3>
                <ul className="space-y-2.5">
                  {review.report?.growth_areas?.map((g, idx) => (
                    <li key={idx} className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Highlights */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm uppercase font-bold text-indigo-400 tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Impact Highlights
                </h3>
                <ul className="space-y-2.5">
                  {review.report?.impact_highlights?.map((h, idx) => (
                    <li key={idx} className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Goal Progress */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-sm uppercase font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" /> Goal Progress
                </h3>
                <div className="space-y-3">
                  {review.report?.goal_progress?.map((goalItem, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-sm">
                      <span className="font-medium text-white">{goalItem.goal}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
                        {goalItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Bias Detection Panel */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    Bias Analysis Engine
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Pure Math</span>
                </div>

                {/* Score Meters */}
                <div className="space-y-5 mb-6">
                  {/* Recency Score */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Recency Bias Index</span>
                      <span className={bias && bias.recency_score > 0.7 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {Math.round((bias?.recency_score || 0) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${bias && bias.recency_score > 0.7 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(bias?.recency_score || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Lower is better (&lt; 70% threshold)</span>
                  </div>

                  {/* Diversity Score */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-300">Source Diversity Score</span>
                      <span className={bias && bias.diversity_score < 0.5 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {Math.round((bias?.diversity_score || 0) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${bias && bias.diversity_score < 0.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(bias?.diversity_score || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">Higher is better (Self + Peer + Manager)</span>
                  </div>

                  {/* Unsupported Claims */}
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Unsupported Claims</span>
                    <span className={`text-sm font-bold ${bias && bias.unsupported_claims > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {bias?.unsupported_claims || 0}
                    </span>
                  </div>
                </div>

                {/* Flags Section */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detected Audit Flags</h4>
                  {bias?.flags && bias.flags.length > 0 ? (
                    <div className="space-y-2.5">
                      {bias.flags.map((flag, idx) => (
                        <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Clean review case — no significant bias flags detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Request Additional Evidence</h3>
            <p className="text-slate-400 text-xs mb-4">Set status to Needs Input so manager or peers can submit further daily drafts or feedback.</p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Needs peer feedback before this review can be finalized."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 mb-4 h-24"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
