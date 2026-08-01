import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Layers,
  Database,
  ExternalLink,
  Sparkles,
  Hexagon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  GitBranch
} from 'lucide-react';
import BorderGlow from './BorderGlow';

export interface FeatureItem {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  riskPill: string;
  riskPillColor: string;
  status: string;
  statusColor: string;
  detailText: string;
  stats: { label: string; val: string; color: string }[];
  aiBullets: string[];
}

export const featuresData: FeatureItem[] = [
  {
    id: 0,
    category: 'Integrations',
    title: 'Tools & HRIS Pipeline',
    subtitle: 'GitHub · JIRA · Slack · Google Workspace · Okta',
    icon: Wrench,
    riskPill: '85% Source Diversity',
    riskPillColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    status: 'Verified Claims',
    statusColor: 'bg-emerald-100 text-emerald-800',
    detailText: 'Shipped invite token authentication backend and database migration ahead of sprint schedule.',
    stats: [
      { label: 'Recency Index', val: '0.25 (Pass)', color: 'text-[#d0f347]' },
      { label: 'Feedback Sources', val: '4 Unique', color: 'text-white' },
      { label: 'Audit Warnings', val: '0 Flags', color: 'text-emerald-400' },
    ],
    aiBullets: [
      '100% of strength claims backed by verified GitHub PR #42 & JIRA-104',
      'Balanced feedback distribution across Self, Peer, and Manager',
      'Zero recency bias detected over 90-day evaluation cycle',
    ],
  },
  {
    id: 1,
    category: 'Continuous Work',
    title: 'Evidence Timeline',
    subtitle: 'Daily Drafts · Project PRs · Metric Outcomes',
    icon: Layers,
    riskPill: '78% Recency Alert',
    riskPillColor: 'bg-amber-100 text-amber-800 border-amber-300',
    status: 'Review Needs Input',
    statusColor: 'bg-amber-100 text-amber-800',
    detailText: '85% of feedback weight accumulated in the last 14 days of evaluation cycle.',
    stats: [
      { label: 'Recency Index', val: '0.85 (High)', color: 'text-[#fbbf24]' },
      { label: 'Feedback Sources', val: '1 Source', color: 'text-[#fbbf24]' },
      { label: 'Audit Warnings', val: '1 Flag', color: 'text-[#fb7185]' },
    ],
    aiBullets: [
      'Single-source dependency detected: Manager feedback only',
      'Requires peer feedback input prior to HR final approval',
      '1 unsupported growth claim flagged by Evidence Retrieval Agent',
    ],
  },
  {
    id: 2,
    category: 'Platform Security',
    title: 'PostgreSQL RLS Audit',
    subtitle: 'org_id Scoped Policies · Row-Level Isolation',
    icon: Database,
    riskPill: '100% RLS Compliant',
    riskPillColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    status: 'PostgreSQL Active',
    statusColor: 'bg-emerald-100 text-emerald-800',
    detailText: 'Database policies enforce strict org_id isolation across all query execution paths.',
    stats: [
      { label: 'Tenant Isolation', val: 'Enforced', color: 'text-[#d0f347]' },
      { label: 'Token Expiry', val: '7 Days', color: 'text-white' },
      { label: 'API Key Exposure', val: 'Zero (Server)', color: 'text-emerald-400' },
    ],
    aiBullets: [
      'Row-Level Security prevents cross-tenant data leakage',
      'HR signed invite tokens land in pending state until admin verification',
      'All LLM synthesis calls execute strictly server-side',
    ],
  },
];

export const SwapColumnFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Auto-swap column every 4.5 seconds with live progress bar
  useEffect(() => {
    setProgress(0);
    const intervalTime = 45; // 45ms step
    const totalSteps = 4500 / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const p = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(p);

      if (currentStep >= totalSteps) {
        setActiveTab((prev) => (prev + 1) % featuresData.length);
        currentStep = 0;
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeTab]);

  const currentFeature = featuresData[activeTab];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        {/* Left Column: Feature Selection Tabs with Active Progress Bar */}
        <div className="lg:col-span-4 space-y-4 z-10">
          {featuresData.map((feature) => {
            const IconComp = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <div
                key={feature.id}
                onClick={() => {
                  setActiveTab(feature.id);
                  setProgress(0);
                }}
                className={`relative overflow-hidden p-5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#222222] border-[#d0f347] shadow-lg shadow-[#d0f347]/10 scale-[1.02]'
                    : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-slate-500 opacity-70'
                }`}
              >
                {/* Active Progress Bar Indicator */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#d0f347]/10 transition-all duration-75 pointer-events-none"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-[#d0f347] text-[#141414] glow-pulse-lime' : 'bg-[#282828] text-slate-300'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#d0f347] uppercase tracking-wider">{feature.category}</div>
                    <h4 className="font-extrabold text-base text-white">{feature.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono pl-11 relative z-10">{feature.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Middle Animated Node Connector SVG */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center relative h-96">
          <svg className="absolute inset-0 w-full h-full" overflow="visible">
            <path
              d="M 0 60 C 60 60, 60 190, 120 190"
              fill="none"
              stroke="#2e2e2e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 0 190 L 120 190"
              fill="none"
              stroke="#2e2e2e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 0 320 C 60 320, 60 190, 120 190"
              fill="none"
              stroke="#2e2e2e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            <path
              d={
                activeTab === 0
                  ? "M 0 60 C 60 60, 60 190, 120 190"
                  : activeTab === 1
                  ? "M 0 190 L 120 190"
                  : "M 0 320 C 60 320, 60 190, 120 190"
              }
              fill="none"
              stroke="#d0f347"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          <div className="z-20 w-10 h-10 rounded-xl bg-[#d0f347] text-[#141414] flex items-center justify-center font-black shadow-xl shadow-[#d0f347]/30 animate-bounce">
            <Hexagon className="w-6 h-6 fill-[#141414]" />
          </div>
        </div>

        {/* Right Column: Swapping Feature Preview Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div
            key={currentFeature.id}
            className="transition-all duration-300 ease-verity space-y-4 animate-modal-card-enter"
          >
            <div className="bg-white rounded-2xl p-5 text-[#141414] shadow-2xl space-y-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full border ${currentFeature.riskPillColor}`}>
                  {currentFeature.riskPill}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">Tue, Sep 30 &bull; Cycle v2</span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#141414]">{currentFeature.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{currentFeature.detailText}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg ${currentFeature.statusColor}`}>
                  {currentFeature.status}
                </span>
                <Link to="/hr/dashboard" className="text-xs font-extrabold text-[#141414] hover:underline flex items-center gap-1">
                  Inspect Report <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {currentFeature.stats.map((st, idx) => (
                <div key={idx} className="bg-[#222222] border border-[#2e2e2e] p-3.5 rounded-xl space-y-1 card-hover-lift">
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">{st.label}</div>
                  <div className={`text-sm font-extrabold ${st.color}`}>{st.val}</div>
                </div>
              ))}
            </div>

            <BorderGlow
              animated={true}
              glowColor="72 85 62"
              backgroundColor="#222222"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1.2}
              colors={['#d0f347', '#beeb30', '#10b981']}
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#d0f347] font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#d0f347]" /> VERITY AI ANALYSIS
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  {currentFeature.aiBullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#d0f347] font-bold">◇</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapColumnFeatures;
