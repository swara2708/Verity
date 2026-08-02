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

      try {
        await apiFetch('/organizations/setup', {
          method: 'POST',
          body: JSON.stringify({
            industry,
            company_size: companySize,
            departments: departments.split(',').map((d) => d.trim()).filter(Boolean),
            review_cycle_frequency: cycleFrequency,
            max_recency_pct: parseInt(maxRecencyPct, 10) || 70,
            min_feedback_sources: parseInt(minSources, 10) || 2,
          }),
        });
      } catch (setupErr) {
        console.warn('Organization setup endpoint fallback executed');
      }

      loginHR(data.token, { id: data.user_id, email, name: hrName, role: 'hr_admin' });
      navigate('/hr/dashboard');
    } catch (err: any) {
      setError(err.message || 'Onboarding failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C1E8FF] text-[#021024] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-3" />
          <h1 className="text-3xl font-sora font-extrabold text-[#021024]">Setup Your Organization</h1>
          <p className="text-[#5483B3] text-xs font-mono-code mt-1">Configure multi-tenant isolation, department rosters, and automated bias auditing thresholds.</p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {steps.map((st) => (
            <div
              key={st.id}
              onClick={() => setStep(st.id)}
              className={`p-2.5 rounded-xl border text-center font-mono-code text-[10px] font-bold cursor-pointer transition-all ${
                step === st.id
                  ? 'bg-[#052659] text-[#C1E8FF] border-[#052659] shadow-md'
                  : step > st.id
                  ? 'bg-[#EAF3FB] text-[#052659] border-[#7DA0CA]'
                  : 'bg-white text-[#5483B3] border-[#7DA0CA]/50'
              }`}
            >
              {st.label}
            </div>
          ))}
        </div>

        <Card className="p-8 shadow-2xl space-y-6 bg-white border-[#7DA0CA]">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#5483B3]/15 border border-[#5483B3]/30 text-[#021024] text-xs flex items-center gap-2 font-mono-code font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#052659]" />
              <span>{error} &bull; unverified</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-sora font-extrabold text-[#021024] mb-2">Step 1: Organization & Admin Details</h3>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">HR Lead / Admin Name</label>
                  <input
                    type="text"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">HR Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Admin Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-sora font-extrabold text-[#021024] mb-2">Step 2: Industry & Organization Scale</h3>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Industry Domain</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  >
                    <option value="Technology & Software">Technology & Software</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare & Bio">Healthcare & Biotech</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  >
                    <option value="1-50 employees">1 - 50 employees</option>
                    <option value="50-200 employees">50 - 200 employees</option>
                    <option value="200-1000 employees">200 - 1,000 employees</option>
                    <option value="1000+ employees">1,000+ employees (Enterprise)</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-sora font-extrabold text-[#021024] mb-2">Step 3: Department Roster Setup</h3>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Departments (Comma-separated)</label>
                  <textarea
                    value={departments}
                    onChange={(e) => setDepartments(e.target.value)}
                    className="w-full p-3.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659] h-28"
                    placeholder="Engineering, Product, Design, HR, Sales"
                  />
                  <p className="text-[11px] font-mono-code text-[#5483B3] mt-1">Used to categorize employee roster & department level review reports.</p>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-sora font-extrabold text-[#021024] mb-2">Step 4: Review Cycle Cadence</h3>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Cycle Frequency</label>
                  <select
                    value={cycleFrequency}
                    onChange={(e) => setCycleFrequency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
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
                <h3 className="text-xl font-sora font-extrabold text-[#021024] mb-2">Step 5: Bias Sensitivity Thresholds</h3>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Max Recency Threshold (%)</label>
                  <input
                    type="number"
                    value={maxRecencyPct}
                    onChange={(e) => setMaxRecencyPct(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  />
                  <p className="text-[11px] font-mono-code text-[#5483B3] mt-1">Flag reviews if more than this percentage of feedback occurs in the last 2 weeks.</p>
                </div>
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#021024] uppercase tracking-wider mb-1.5">Min Unique Feedback Sources</label>
                  <input
                    type="number"
                    value={minSources}
                    onChange={(e) => setMinSources(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EAF3FB] border border-[#7DA0CA] rounded-xl text-[#021024] text-xs focus:outline-none focus:border-[#052659]"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#7DA0CA]/50">
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
