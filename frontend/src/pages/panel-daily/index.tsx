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
    <div className="min-h-screen bg-[#161616] text-white p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/panel">
            <Button variant="outline" size="sm" className="gap-1.5 font-montserrat">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Panel
            </Button>
          </Link>
          <Logo />
        </div>

        {!submittedDate ? (
          <Card className="p-8 shadow-2xl mb-8 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Daily Progress Check-in</h1>
              <p className="text-xs font-medium text-slate-400 mt-1">Log short periodic updates to build your continuous evidence timeline</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-montserrat">
                  What did you work on today?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Shipped the invite token authentication flow, paired with frontend team on JWT claims, and wrote unit tests..."
                  className="w-full p-3.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347] h-32 leading-relaxed"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2 font-montserrat"
              >
                {submitting ? 'Saving Entry...' : 'Save Daily Check-in Log'}
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="p-8 shadow-2xl text-center mb-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#d0f347] mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Check-in Recorded</h2>
            <p className="text-slate-400 text-xs">
              Log entry saved for <span className="text-[#d0f347] font-bold">{submittedDate}</span>.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={() => {
                  setSubmittedDate(null);
                  setContent('');
                }}
                variant="outline"
                size="sm"
                className="font-montserrat"
              >
                + Log Another Entry
              </Button>
              <Link to="/panel">
                <Button variant="primary" size="sm" className="font-montserrat">Return to Panel</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Running List of Past Entries */}
        <Card className="p-6 shadow-2xl space-y-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#2e2e2e] pb-3 flex items-center gap-2 font-montserrat">
            <Clock className="w-4 h-4 text-[#d0f347]" />
            RUNNING HISTORY OF PAST CHECK-INS ({pastDrafts.length})
          </div>

          {pastDrafts.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No past check-in logs recorded yet.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {pastDrafts.map((d) => (
                <div key={d.id} className="p-3.5 bg-[#181818] rounded-xl border border-[#2e2e2e] text-xs space-y-1">
                  <div className="text-xs font-bold text-[#d0f347]">{d.entry_date}</div>
                  <p className="text-slate-200 leading-relaxed">{d.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
