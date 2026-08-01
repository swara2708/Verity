import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Send, CheckCircle2, Calendar } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function PanelDailyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<string | null>(null);

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
      setSubmittedDate(res.entry_date);
    } catch (err: any) {
      alert(err.message || 'Failed to submit daily check-in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-lg z-10">
        <div className="flex items-center justify-between mb-6">
          <Link to="/panel" className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Panel
          </Link>
          <span className="text-xs text-slate-500 font-mono">Verity Check-in Log</span>
        </div>

        {!submittedDate ? (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Daily Progress Check-in</h1>
                <p className="text-xs text-slate-400">Log short periodic updates to build your evidence timeline</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">What did you work on today?</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Shipped the invite-token backend endpoints, wrote 3 integration tests, unblocked frontend auth flow..."
                  className="w-full p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm h-36"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting Entry...' : 'Save Check-in Log'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 text-center shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Check-in Recorded!</h2>
            <p className="text-slate-300 text-sm mb-6">
              Log entry successfully saved for <span className="font-mono text-emerald-400 font-bold">{submittedDate}</span>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSubmittedDate(null);
                  setContent('');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                + Log Another Entry
              </button>
              <Link to="/panel" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl">
                Return to Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
