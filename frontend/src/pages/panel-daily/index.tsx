import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Clock } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Logo, Button, Card } from '../../components/ui/primitives';

interface DraftItem {
  id: string;
  entry_date: string;
  content: string;
}

export default function PanelDailyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);
  const [pastDrafts, setPastDrafts] = useState<DraftItem[]>([]);

  const fetchPastDrafts = async () => {
    if (!user) return;
    try {
      const res = await apiFetch<{ drafts: DraftItem[] }>(`/daily-drafts/${user.id}`);
      setPastDrafts(res.drafts || []);
    } catch (err) {
      console.error('Failed to fetch past daily drafts:', err);
    }
  };

  useEffect(() => {
    fetchPastDrafts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const res = await apiFetch<{ draft_id: string; entry_date: string }>('/daily-drafts', {
        method: 'POST',
        body: JSON.stringify({
          employee_id: user.id,
          content: content,
        }),
      });

      const newEntry: DraftItem = {
        id: res.draft_id,
        entry_date: res.entry_date,
        content: content,
      };

      setSubmittedDate(res.entry_date);
      setPastDrafts((prev) => [newEntry, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Failed to submit daily check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C1E8FF] text-[#021024] p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/panel">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Panel
            </Button>
          </Link>
          <Logo />
        </div>

        {!submittedDate ? (
          <Card className="p-8 shadow-2xl mb-8 space-y-6 bg-white border-[#7DA0CA]">
            <div>
              <h1 className="text-2xl font-sora font-extrabold text-[#021024]">Daily Progress Check-in</h1>
              <p className="text-xs font-mono-code text-[#5483B3] mt-1">Log short periodic updates to build your continuous evidence timeline</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">
                  What did you work on today?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Shipped the invite token authentication flow, paired with frontend team on JWT claims, and wrote unit tests..."
                  className="w-full p-3.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659] h-32 leading-relaxed"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2"
              >
                {submitting ? 'Saving Entry...' : 'Save Daily Check-in Log'}
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="p-8 shadow-2xl text-center mb-8 space-y-4 bg-white border-[#7DA0CA]">
            <CheckCircle2 className="w-12 h-12 text-[#052659] fill-[#052659] text-white mx-auto mb-2" />
            <h2 className="text-2xl font-sora font-bold text-[#021024]">Check-in Recorded</h2>
            <p className="text-[#5483B3] text-xs">
              Log entry saved for <span className="font-mono-code text-[#052659] font-bold">{submittedDate}</span>.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={() => {
                  setSubmittedDate(null);
                  setContent('');
                }}
                variant="outline"
                size="sm"
              >
                + Log Another Entry
              </Button>
              <Link to="/panel">
                <Button variant="primary" size="sm">Return to Panel</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Running List of Past Entries */}
        <Card className="p-6 shadow-2xl space-y-4 bg-white border-[#7DA0CA]">
          <div className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider border-b border-[#7DA0CA]/50 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#052659]" />
            RUNNING HISTORY OF PAST CHECK-INS ({pastDrafts.length})
          </div>

          {pastDrafts.length === 0 ? (
            <p className="text-xs text-[#5483B3] font-mono-code text-center py-4">No past check-in logs recorded yet.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {pastDrafts.map((d) => (
                <div key={d.id} className="p-3.5 bg-[#EAF3FB] rounded-xl border border-[#7DA0CA] text-xs space-y-1">
                  <div className="font-mono-code text-[11px] font-bold text-[#052659]">{d.entry_date}</div>
                  <p className="text-[#021024] leading-relaxed">{d.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
