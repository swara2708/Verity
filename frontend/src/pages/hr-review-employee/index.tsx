import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Sparkles, TrendingUp, Target, FileText, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Logo, Button, Card, StatusBadge, Claim, ScoreGauge, AuditFlagCard } from '../../components/ui/primitives';

interface ClaimEvidenceItem {
  claim: string;
  supported: boolean;
  evidence_id?: string | null;
  link_url?: string | null;
}

interface ReviewData {
  review_id: string;
  employee_id: string;
  status: string;
  report: {
    strengths?: string[];
    growth_areas?: string[];
    impact_highlights?: string[];
    goal_progress?: { goal: string; status: string }[];
    claim_evidence?: ClaimEvidenceItem[];
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
      console.log('No existing review found:', err);
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
      const freshData = await apiFetch<ReviewData>(`/reviews/${res.review_id}`);
      setReview(freshData);
    } catch (err: any) {
      alert(err.message || 'Failed to trigger review pipeline');
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
      <div className="min-h-screen bg-[#161616] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0f347]" />
      </div>
    );
  }

  const bias = review?.bias_report;
  const claimMap = new Map<string, ClaimEvidenceItem>();
  review?.report?.claim_evidence?.forEach((ce) => {
    claimMap.set(ce.claim.trim().toLowerCase(), ce);
  });

  return (
    <div className="min-h-screen bg-[#161616] text-white pb-16">
      {/* Top Nav */}
      <nav className="border-b border-[#2e2e2e] bg-[#161616]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/hr/dashboard" className="p-2 rounded-xl bg-[#181818] border border-[#2e2e2e] text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Logo />
          </div>

          <Button
            onClick={handleGenerateReview}
            disabled={generating}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d0f347]" />
            {generating ? 'Running Agents...' : 'Run Agent Pipeline'}
          </Button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Header: Employee Name + Department + StatusBadge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">Dev Patel</h1>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#181818] border border-[#2e2e2e] text-[#d0f347] font-bold">
                Engineering &bull; {employeeId}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono mt-1">Review draft synthesized with claim-evidence verification</p>
          </div>

          {review && (
            <div className="flex items-center gap-3">
              <StatusBadge status={review.status} />

              {review.status !== 'approved' && review.status !== 'needs_input' && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Request Input
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    variant="primary"
                    size="sm"
                    className="gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Review
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {!review ? (
          <Card className="p-12 text-center shadow-2xl space-y-4">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">No Review Draft Generated</h3>
            <p className="text-slate-400 text-xs mb-6">Click "Run Agent Pipeline" above to trigger evidence retrieval, synthesis, and claim matching.</p>
            <Button onClick={handleGenerateReview} disabled={generating} variant="primary" size="md">
              {generating ? 'Running Agents...' : 'Trigger Review Generation'}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT (Wide, 8 cols): Draft Report */}
            <div className="lg:col-span-8 space-y-6">
              {/* STRENGTHS SECTION */}
              <Card className="shadow-2xl space-y-4">
                <div className="font-mono text-xs font-bold text-[#34d399] uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                  STRENGTHS (VERIFIED EVIDENCE)
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                  {review.report?.strengths?.map((s, idx) => {
                    const match = claimMap.get(s.trim().toLowerCase());
                    return (
                      <div key={idx} className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e]">
                        <Claim
                          text={s}
                          supported={match ? match.supported : true}
                          sourceId={match?.evidence_id}
                          linkUrl={match?.link_url}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* GROWTH AREAS SECTION */}
              <Card className="shadow-2xl space-y-4">
                <div className="font-mono text-xs font-bold text-[#fbbf24] uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#fbbf24]" />
                  GROWTH AREAS (CLAIM AUDIT)
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                  {review.report?.growth_areas?.map((g, idx) => {
                    const match = claimMap.get(g.trim().toLowerCase());
                    return (
                      <div key={idx} className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e]">
                        <Claim
                          text={g}
                          supported={match ? match.supported : true}
                          sourceId={match?.evidence_id}
                          linkUrl={match?.link_url}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* IMPACT HIGHLIGHTS */}
              <Card className="shadow-2xl space-y-4">
                <div className="font-mono text-xs font-bold text-[#d0f347] uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d0f347]" />
                  IMPACT HIGHLIGHTS
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                  {review.report?.impact_highlights?.map((h, idx) => {
                    const match = claimMap.get(h.trim().toLowerCase());
                    return (
                      <div key={idx} className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e]">
                        <Claim
                          text={h}
                          supported={match ? match.supported : true}
                          sourceId={match?.evidence_id}
                          linkUrl={match?.link_url}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* GOAL PROGRESS */}
              <Card className="shadow-2xl space-y-3">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#d0f347]" />
                  CYCLE GOAL PROGRESS
                </div>
                <div className="space-y-2.5">
                  {review.report?.goal_progress?.map((goalItem, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs">
                      <span className="font-bold text-white">{goalItem.goal}</span>
                      <span className="font-mono text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#d0f347]/15 text-[#d0f347] uppercase border border-[#d0f347]/30">
                        {goalItem.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* RIGHT (Narrow, 4 cols): Bias Analysis Panel */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="shadow-2xl space-y-6 sticky top-24 border-[#d0f347]/30">
                <div className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center justify-between">
                  <span>BIAS ANALYSIS PANEL</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] font-bold border border-[#d0f347]/30">PURE MATH</span>
                </div>

                <div className="space-y-5">
                  <ScoreGauge
                    label="Recency Bias Index"
                    score={bias?.recency_score || 0}
                    threshold={0.70}
                    invertRisk={true}
                    subtext="70% max recency threshold marker."
                  />

                  <ScoreGauge
                    label="Source Diversity Score"
                    score={bias?.diversity_score || 0}
                    threshold={0.50}
                    invertRisk={false}
                    subtext="Requires 2+ unique sources (Self/Peer/Manager)."
                  />

                  <div className="p-4 bg-[#181818] rounded-xl border border-[#2e2e2e] flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300">Unsupported Claims</span>
                    <span className={`font-mono text-sm font-black ${bias && bias.unsupported_claims > 0 ? 'text-[#fb7185]' : 'text-[#d0f347]'}`}>
                      {bias?.unsupported_claims || 0}
                    </span>
                  </div>
                </div>

                {/* Audit Flags Card */}
                <div>
                  <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    HUMAN-READABLE AUDIT FLAGS
                  </div>
                  {bias?.flags && bias.flags.length > 0 ? (
                    <div className="space-y-2.5">
                      {bias.flags.map((flag, idx) => (
                        <AuditFlagCard key={idx} flag={flag} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-[#10b981]/15 border border-[#10b981]/30 rounded-xl text-[#34d399] text-xs flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Zero bias flags detected.</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons Pinned Bottom */}
                <div className="pt-4 border-t border-[#2e2e2e] flex flex-col gap-2.5">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading || review.status === 'approved'}
                    variant="primary"
                    size="md"
                    className="w-full justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve Review
                  </Button>
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    variant="outline"
                    size="md"
                    className="w-full justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Request Additional Input
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-[#141414]/80 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-backdrop-enter">
          <Card className="max-w-md w-full p-6 shadow-2xl space-y-4 animate-modal-card-enter">
            <h3 className="text-xl font-bold text-white">Request Additional Evidence</h3>
            <p className="text-xs text-slate-400">Returns review status to 'Needs Input' for further team draft entries.</p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Requires peer feedback from engineering team before finalization."
              className="w-full p-3.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347] h-28"
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-[#2e2e2e]">
              <Button
                onClick={() => setShowRejectModal(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                variant="primary"
                size="sm"
              >
                Submit Request
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
