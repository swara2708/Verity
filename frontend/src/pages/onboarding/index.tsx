import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Logo, Button, Card } from '../../components/ui/primitives';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { loginHR } = useAuth();

  const [step, setStep] = useState(1);

  // Form states
  const [orgName, setOrgName] = useState('Acme Corp');
  const [hrName, setHrName] = useState('Priya Shah');
  const [email, setEmail] = useState('priya@acme.com');
  const [password, setPassword] = useState('password123');

  const [industry, setIndustry] = useState('Technology & Software');
  const [companySize, setCompanySize] = useState('50-200 employees');
  const [departments, setDepartments] = useState('Engineering, Design, Product, HR, Sales');
  const [cycleFrequency, setCycleFrequency] = useState('Quarterly');
  const [maxRecencyPct, setMaxRecencyPct] = useState('70');
  const [minSources, setMinSources] = useState('2');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { id: 1, label: '01. ORGANIZATION' },
    { id: 2, label: '02. INDUSTRY & SCALE' },
    { id: 3, label: '03. DEPARTMENTS' },
    { id: 4, label: '04. REVIEW CYCLE' },
    { id: 5, label: '05. BIAS THRESHOLDS' }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch<{ user_id: string; org_id: string; role: string; token: string }>('/auth/signup-hr', {
        method: 'POST',
        body: JSON.stringify({
          org_name: orgName,
          hr_name: hrName,
          email,
          password,
        }),
      });

      loginHR(data.token, {
        id: data.user_id,
        org_id: data.org_id,
        role: 'hr_admin',
        name: hrName,
        status: 'active',
      });

      navigate('/hr/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-3" />
          <h1 className="text-3xl font-bold text-white">Organization Setup Wizard</h1>
          <p className="text-slate-400 text-xs font-mono mt-1">Configure multi-tenant boundary & review policies</p>
        </div>

        {/* Lime Progress Bar Per Step */}
        <div className="w-full bg-[#2e2e2e] h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#d0f347] h-full transition-all duration-300 ease-verity"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Label in Mono Font */}
        <div className="flex justify-between items-center font-mono text-xs text-slate-400 mb-6 px-1">
          <span className="font-bold text-[#d0f347] step-label-crossfade">{steps[step - 1].label}</span>
          <span className="step-label-crossfade">STEP {step} OF 5</span>
        </div>

        <Card className="p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#fb7185]/15 border border-[#fb7185]/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Step 1: Organization & Admin Account</h3>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Organization / Company Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="Acme Corp"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">HR Admin Name</label>
                  <input
                    type="text"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="Priya Shah"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="priya@acme.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Step 2: Industry Sector & Scale</h3>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Industry Sector</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  >
                    <option value="Technology & Software">Technology & Software</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                    <option value="Services & Consulting">Services & Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  >
                    <option value="1-50 employees">1-50 employees</option>
                    <option value="50-200 employees">50-200 employees</option>
                    <option value="200-500 employees">200-500 employees</option>
                    <option value="500+ employees">500+ employees</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Step 3: Organizational Departments</h3>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Departments (Comma-separated)</label>
                  <textarea
                    value={departments}
                    onChange={(e) => setDepartments(e.target.value)}
                    className="w-full p-3.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347] h-28"
                    placeholder="Engineering, Product, Design, HR, Sales"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-1">Used to categorize employee roster & department level review reports.</p>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Step 4: Review Cycle Cadence</h3>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Cycle Frequency</label>
                  <select
                    value={cycleFrequency}
                    onChange={(e) => setCycleFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  >
                    <option value="Quarterly">Quarterly (Recommended)</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Step 5: Bias Sensitivity Thresholds</h3>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Max Recency Threshold (%)</label>
                  <input
                    type="number"
                    value={maxRecencyPct}
                    onChange={(e) => setMaxRecencyPct(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  />
                  <p className="text-[11px] font-mono text-slate-500 mt-1">Flag reviews if more than this percentage of feedback occurs in the last 2 weeks.</p>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">Min Unique Feedback Sources</label>
                  <input
                    type="number"
                    value={minSources}
                    onChange={(e) => setMinSources(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2e2e2e] rounded-xl text-white text-xs focus:outline-none focus:border-[#d0f347]"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#2e2e2e]">
              {step > 1 ? (
                <Button
                  type="button"
                  onClick={handlePrev}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
              ) : <div />}

              {step < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="primary"
                  size="sm"
                  className="gap-1"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="md"
                  className="gap-1"
                >
                  {submitting ? 'Creating...' : 'Finish Setup'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
