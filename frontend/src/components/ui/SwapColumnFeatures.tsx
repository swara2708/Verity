import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Layers,
  Database,
  ExternalLink,
  Sparkles,
  Hexagon,
  ArrowRight
} from 'lucide-react';
import BorderGlow from './BorderGlow';

export interface SourceItem {
  id: number;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  statusPill: string;
  statusPillColor: string;
  timestamp: string;
  detailTitle: string;
  detailSentence: string;
  secondaryStatus: string;
  secondaryStatusColor: string;
  stats: { label: string; val: string; color: string }[];
  aiBullets: string[];
}

export const sourcesData: SourceItem[] = [
  {
    id: 0,
    category: 'INTEGRATIONS',
    title: 'Tools & HRIS Pipeline',
    description: 'GitHub · JIRA · Slack · Google Workspace · Okta',
    icon: Wrench,
    statusPill: '85% Source Diversity',
    statusPillColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    timestamp: 'Tue, Sep 30 • Cycle v2',
    detailTitle: 'Dev Patel - Lead Auth Architecture Review',
    detailSentence: 'Shipped invite token authentication backend and database migration ahead of quarterly sprint schedule.',
    secondaryStatus: 'Verified Claims',
    secondaryStatusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
    category: 'CONTINUOUS WORK',
    title: 'Evidence Timeline',
    description: 'Daily Drafts · Project PRs · Metric Outcomes',
    icon: Layers,
    statusPill: '78% Recency Alert',
    statusPillColor: 'bg-amber-100 text-amber-800 border-amber-300',
    timestamp: 'Mon, Oct 06 • Cycle v2',
    detailTitle: 'Johanna Williams - Systems API Refactor',
    detailSentence: '85% of feedback weight accumulated in the last 14 days of evaluation cycle.',
    secondaryStatus: 'Review Needs Input',
    secondaryStatusColor: 'bg-amber-100 text-amber-800 border-amber-300',
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
    category: 'PLATFORM SECURITY',
    title: 'PostgreSQL RLS Audit',
    description: 'org_id Scoped Policies · Row-Level Isolation',
    icon: Database,
    statusPill: '100% RLS Compliant',
    statusPillColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    timestamp: 'Wed, Oct 15 • Active Shield',
    detailTitle: 'Acme Corp - Multi-Tenant Isolation Audit',
    detailSentence: 'Database policies enforce strict org_id isolation across all query execution paths.',
    secondaryStatus: 'PostgreSQL Active',
    secondaryStatusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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

const CUBIC_EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

export const SwapColumnFeatures: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeSource = sourcesData[activeIndex];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        {/* LEFT COLUMN: 3 Stacked Source Cards */}
        <div className="lg:col-span-4 space-y-4 z-10">
          {sourcesData.map((source) => {
            const IconComp = source.icon;
            const isActive = activeIndex === source.id;
            return (
              <div
                key={source.id}
                onClick={() => setActiveIndex(source.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-250 ${
                  isActive
                    ? 'bg-[#222222] border-[#d0f347] shadow-lg shadow-[#d0f347]/15 translate-x-1'
                    : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-slate-500 opacity-75 hover:opacity-100'
                }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2.5 rounded-xl transition-all duration-250 ${
                      isActive ? 'bg-[#d0f347] text-[#141414] glow-pulse-lime' : 'bg-[#282828] text-slate-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#d0f347] uppercase tracking-wider">
                      {source.category}
                    </div>
                    <h4 className="font-extrabold text-base text-white">{source.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono pl-11 leading-relaxed">
                  {source.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CENTER: Dashed Connector Line with Animated Glowing Node */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center relative h-96">
          <svg className="absolute inset-0 w-full h-full" overflow="visible">
            {/* Static background dashed connector lines */}
            <path d="M 0 60 C 60 60, 60 190, 120 190" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 0 190 L 120 190" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 0 320 C 60 320, 60 190, 120 190" fill="none" stroke="#2e2e2e" strokeWidth="2" strokeDasharray="4 4" />

            {/* Active connecting path smoothly animating over ~250ms */}
            <motion.path
              fill="none"
              stroke="#d0f347"
              strokeWidth="3"
              strokeDasharray="6 6"
              initial={false}
              animate={{
                d:
                  activeIndex === 0
                    ? "M 0 60 C 60 60, 60 190, 120 190"
                    : activeIndex === 1
                    ? "M 0 190 L 120 190"
                    : "M 0 320 C 60 320, 60 190, 120 190"
              }}
              transition={{ duration: 0.25, ease: CUBIC_EASE }}
            />
          </svg>

          {/* Central Glowing Hub */}
          <motion.div
            className="z-20 w-10 h-10 rounded-xl bg-[#d0f347] text-[#141414] flex items-center justify-center font-black shadow-xl shadow-[#d0f347]/40 glow-pulse-lime"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hexagon className="w-6 h-6 fill-[#141414]" />
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Single Detail Panel with Staggered Framer Motion Swap Animation */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeSource.id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{
                duration: 0.25,
                delay: 0.08,
                ease: CUBIC_EASE,
              }}
              className="space-y-4"
            >
              {/* White Detail Card - BUG FIXED: Title sits directly on white canvas in solid dark text (NO dark overlay box!) */}
              <div className="bg-white rounded-2xl p-6 text-[#141414] shadow-2xl space-y-4 border border-slate-200">
                {/* Top Row: Status Pill + Timestamp */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full border ${activeSource.statusPillColor}`}>
                    {activeSource.statusPill}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">{activeSource.timestamp}</span>
                </div>

                {/* Main Title sitting CLEANLY on white background */}
                <div>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-[#141414] tracking-tight leading-snug">
                    {activeSource.detailTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
                    {activeSource.detailSentence}
                  </p>
                </div>

                {/* Secondary Status Row + Inspect Link */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg ${activeSource.secondaryStatusColor}`}>
                    {activeSource.secondaryStatus}
                  </span>
                  <Link
                    to="/hr/dashboard"
                    className="text-xs font-extrabold text-[#141414] hover:text-[#1F6D4C] transition-colors flex items-center gap-1.5 group"
                  >
                    Inspect Report{' '}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* 3 Small Stat Cards Below */}
              <div className="grid grid-cols-3 gap-3">
                {activeSource.stats.map((st, idx) => (
                  <div key={idx} className="bg-[#222222] border border-[#2e2e2e] p-3.5 rounded-xl space-y-1 card-hover-lift">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{st.label}</div>
                    <div className={`text-sm font-extrabold ${st.color}`}>{st.val}</div>
                  </div>
                ))}
              </div>

              {/* Highlighted AI Analysis Callout Box with Glowing Accent Border */}
              <BorderGlow
                animated={true}
                glowColor="72 85 62"
                backgroundColor="#222222"
                borderRadius={16}
                glowRadius={28}
                glowIntensity={1.2}
                colors={['#d0f347', '#beeb30', '#10b981']}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#d0f347] font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#d0f347]" /> VERITY AI ANALYSIS
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 font-medium">
                    {activeSource.aiBullets.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#d0f347] font-bold text-sm leading-none mt-0.5">◇</span>
                        <span className="leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SwapColumnFeatures;
