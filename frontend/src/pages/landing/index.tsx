import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Briefcase,
  MessageSquare,
  Users,
  Clock,
  CreditCard,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
  TrendingUp,
  Hexagon,
  Sparkles,
  ExternalLink,
  Wrench,
  Layers,
  Database,
  Zap,
  GitBranch,
  Cpu,
  Globe,
  Cloud,
  Server
} from 'lucide-react';
import LogoLoop, { LogoItem } from '../../components/ui/LogoLoop';
import CardSwap, { Card } from '../../components/ui/CardSwap';
import BorderGlow from '../../components/ui/BorderGlow';
import SwapColumnFeatures from '../../components/ui/SwapColumnFeatures';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNode, setActiveNode] = useState<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate active node every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.scroll-popup');

    if (prefersReduced) {
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) scale(1)';
            observerRef.current?.unobserve(target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(24px) scale(0.97)';
      (el as HTMLElement).style.transition = 'opacity 500ms cubic-bezier(0.2, 0.7, 0.2, 1), transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1)';
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const partnerLogos: LogoItem[] = [
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <GitBranch className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">GitHub</span>
        </div>
      ),
      title: "GitHub Integrations",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Database className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">PostgreSQL</span>
        </div>
      ),
      title: "PostgreSQL Database Engine",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Cpu className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">Claude 3.5 Sonnet</span>
        </div>
      ),
      title: "Claude AI LLM Agent",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Cloud className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">Supabase Auth</span>
        </div>
      ),
      title: "Supabase Hosted Postgres",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Zap className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">FastAPI</span>
        </div>
      ),
      title: "FastAPI Backend",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Globe className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">React 18 + Vite</span>
        </div>
      ),
      title: "React Web Architecture",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Shield className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">Okta SSO</span>
        </div>
      ),
      title: "Okta Enterprise Auth",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#222222] border border-[#2e2e2e] rounded-xl text-white hover:border-[#d0f347] transition-all">
          <Server className="w-5 h-5 text-[#d0f347]" />
          <span className="font-extrabold text-xs font-mono">Row-Level Security</span>
        </div>
      ),
      title: "Row Level Security",
    },
  ];

  const leftNodes = [
    {
      id: 0,
      category: 'Integrations',
      title: 'Tools & HRIS',
      subtitle: 'GitHub · JIRA · Slack · Google Workspace · Okta',
      icon: Wrench,
    },
    {
      id: 1,
      category: 'Continuous Work',
      title: 'Evidence Timeline',
      subtitle: 'Daily Drafts · Project PRs · Metric Outcomes',
      icon: Layers,
    },
    {
      id: 2,
      category: 'Platform Security',
      title: 'PostgreSQL RLS',
      subtitle: 'org_id Scoped Policies · Row-Level Isolation',
      icon: Database,
    },
  ];

  const rightPreviews = [
    {
      title: 'Dev Patel - Lead Auth Architecture Review',
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
      title: 'Johanna Williams - Systems API Refactor',
      riskPill: '78% Recency Bias Alert',
      riskPillColor: 'bg-amber-100 text-amber-800 border-amber-300',
      status: 'Review Needs Input',
      statusColor: 'bg-amber-100 text-amber-800',
      detailText: '85% of feedback weight accumulated in the last 14 days of cycle.',
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
      title: 'Acme Corp - Multi-Tenant Security Audit',
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

  const currentPreview = rightPreviews[activeNode];

  return (
    <div className="min-h-screen bg-[#161616] text-white font-sans selection:bg-[#d0f347] selection:text-[#141414] overflow-x-hidden">
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#161616]/90 backdrop-blur-md border-b border-[#2a2a2a] py-3 shadow-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d0f347] text-[#141414] flex items-center justify-center font-black">
              <Hexagon className="w-5 h-5 fill-[#141414]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white uppercase">
              Verity
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#partners" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#integration-hub" className="hover:text-white transition-colors">Connected Hub</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#evidence-engine" className="hover:text-white transition-colors">Evidence Engine</a>
            <a href="#bias-audit" className="hover:text-white transition-colors">Bias Auditing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-white text-[#141414] hover:bg-slate-100 font-extrabold rounded-lg text-xs transition-all shadow-sm"
            >
              Get Demo
            </Link>
            <Link
              to="/login/hr"
              className="px-4 py-2 bg-[#d0f347] text-[#141414] hover:bg-[#beeb30] font-extrabold rounded-lg text-xs transition-all shadow-sm flex items-center gap-1"
            >
              Contact us
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section with React Bits <CardSwap /> 3D Animated Card Stack */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 scroll-popup">
            <div className="qount-eyebrow">
              Practice Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Bias-Aware Performance Intelligence Built for How Your Firm Actually Works
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Verity is a flexible, fully customizable all-in-one 360° review intelligence platform built for modern organizations that unifies daily evidence workflows, time-distributed progress check-ins, peer feedback, reporting, and deterministic bias auditing into one connected system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/onboarding"
                className="px-6 py-3 bg-[#d0f347] hover:bg-[#beeb30] text-[#141414] font-extrabold rounded-lg text-sm transition-all shadow-lg shadow-[#d0f347]/20 inline-flex items-center gap-2"
              >
                Get Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#integration-hub"
                className="px-6 py-3 bg-transparent text-white border border-[#2e2e2e] hover:bg-[#222222] font-extrabold rounded-lg text-sm transition-all"
              >
                Inspect Integration Flow
              </a>
            </div>
          </div>

          {/* Right Hero Stack: React Bits <CardSwap /> GSAP Animated Stack */}
          <div className="lg:col-span-6 h-[440px] relative scroll-popup flex items-center justify-center">
            <CardSwap
              width={540}
              height={360}
              cardDistance={35}
              verticalDistance={30}
              delay={2600}
              pauseOnHover={true}
              skewAmount={2}
              easing="snappy"
            >
              {/* Stack Card 1: Review Intelligence Hub List */}
              <Card className="bg-[#1c1c1c] border border-[#2e2e2e] p-4 shadow-2xl overflow-hidden grid grid-cols-12 gap-3">
                <div className="col-span-4 bg-[#181818] p-3 rounded-xl space-y-4 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#d0f347] flex items-center justify-center font-bold text-[#141414]">
                      <Hexagon className="w-4 h-4 fill-[#141414]" />
                    </div>
                    <span className="font-bold text-white text-xs uppercase tracking-wider">VERITY</span>
                  </div>

                  <div className="space-y-2 font-medium text-slate-300 text-[11px]">
                    <div className="flex items-center gap-2 text-[#d0f347] font-extrabold bg-[#242424] p-1.5 rounded-lg">
                      <Home className="w-3.5 h-3.5" /> Home
                    </div>
                    <div className="flex items-center gap-2 hover:text-white px-1.5 py-1">
                      <Briefcase className="w-3.5 h-3.5" /> Work
                    </div>
                    <div className="flex items-center gap-2 hover:text-white px-1.5 py-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Feedback
                    </div>
                    <div className="flex items-center gap-2 hover:text-white px-1.5 py-1">
                      <Clock className="w-3.5 h-3.5" /> Draft Logs
                    </div>
                  </div>
                </div>

                <div className="col-span-8 bg-white rounded-xl p-3 text-[#141414] shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-[#141414]">Review Intelligence Hub</span>
                    <span className="text-[10px] text-[#141414] font-bold border-b-2 border-[#141414] pb-0.5">List</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-12 items-center py-1 border-b border-slate-100">
                      <div className="col-span-4 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">✓</span>
                        <span className="font-bold text-slate-800">[PR #42]</span>
                      </div>
                      <div className="col-span-5 text-slate-600 font-medium truncate">Shipped auth backend</div>
                      <div className="col-span-3 text-right font-bold text-slate-800">Dev Patel</div>
                    </div>

                    <div className="grid grid-cols-12 items-center py-1 border-b border-slate-100">
                      <div className="col-span-4 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-[#d0f347]/30 text-[#141414] font-bold text-[10px] flex items-center justify-center">★</span>
                        <span className="font-bold text-slate-800">[Peer]</span>
                      </div>
                      <div className="col-span-5 text-slate-600 font-medium truncate">API migration ownership</div>
                      <div className="col-span-3 text-right font-bold text-slate-800">Johanna W.</div>
                    </div>

                    <div className="grid grid-cols-12 items-center py-1">
                      <div className="col-span-4 flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center">!</span>
                        <span className="font-bold text-slate-800">[Bias]</span>
                      </div>
                      <div className="col-span-5 text-slate-600 font-medium truncate">85% feedback in 2 wks</div>
                      <div className="col-span-3 text-right font-bold text-slate-800">Mia Chen</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stack Card 2: Semantic Claim Verification Audit */}
              <Card className="bg-[#1c1c1c] border border-[#2e2e2e] p-4 shadow-2xl overflow-hidden grid grid-cols-12 gap-3">
                <div className="col-span-4 bg-[#181818] p-3 rounded-xl space-y-4 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#d0f347] flex items-center justify-center font-bold text-[#141414]">
                      <Hexagon className="w-4 h-4 fill-[#141414]" />
                    </div>
                    <span className="font-bold text-white text-xs uppercase tracking-wider">VERITY</span>
                  </div>

                  <div className="space-y-2 font-medium text-slate-300 text-[11px]">
                    <div className="flex items-center gap-2 text-[#d0f347] font-extrabold bg-[#242424] p-1.5 rounded-lg">
                      <MessageSquare className="w-3.5 h-3.5" /> Feedback
                    </div>
                    <div className="flex items-center gap-2 hover:text-white px-1.5 py-1">
                      <BarChart3 className="w-3.5 h-3.5" /> Bias Audit
                    </div>
                  </div>
                </div>

                <div className="col-span-8 bg-white rounded-xl p-3 text-[#141414] shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-xs text-[#141414]">Claim Support Audit</span>
                    <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Live AI Agent</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="font-bold text-slate-900">Shipped invite token auth backend</div>
                      <span className="font-mono text-[10px] font-bold text-emerald-800 block mt-0.5">✓ Backed by PR #42 & JIRA-104</span>
                    </div>

                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="font-bold text-slate-900">Missed team architecture syncs</div>
                      <span className="font-mono text-[10px] font-bold text-amber-800 block mt-0.5">! Unsupported claim (no source)</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stack Card 3: Deterministic Bias Engine Metrics */}
              <Card className="bg-[#1c1c1c] border border-[#2e2e2e] p-4 shadow-2xl overflow-hidden grid grid-cols-12 gap-3">
                <div className="col-span-4 bg-[#181818] p-3 rounded-xl space-y-4 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#d0f347] flex items-center justify-center font-bold text-[#141414]">
                      <Hexagon className="w-4 h-4 fill-[#141414]" />
                    </div>
                    <span className="font-bold text-white text-xs uppercase tracking-wider">VERITY</span>
                  </div>

                  <div className="space-y-2 font-medium text-slate-300 text-[11px]">
                    <div className="flex items-center gap-2 text-[#d0f347] font-extrabold bg-[#242424] p-1.5 rounded-lg">
                      <BarChart3 className="w-3.5 h-3.5" /> Bias Audit
                    </div>
                  </div>
                </div>

                <div className="col-span-8 bg-white rounded-xl p-3 text-[#141414] shadow-md space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-xs text-[#141414]">Bias Metrics Engine</span>
                    <span className="font-mono text-[10px] bg-[#d0f347]/30 text-[#141414] font-bold px-2 py-0.5 rounded-full">Pure Math</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between font-bold text-[#141414] text-[10px] mb-0.5">
                        <span>Recency Index</span>
                        <span className="text-emerald-700 font-mono">0.25 (Pass)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[25%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-[#141414] text-[10px] mb-0.5">
                        <span>Source Diversity</span>
                        <span className="text-emerald-700 font-mono">85% (4 Sources)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]" />
                      </div>
                    </div>

                    <div className="p-1.5 bg-slate-100 rounded text-[10px] font-mono text-slate-700 font-bold flex items-center justify-between">
                      <span>Audit Warning Flags:</span>
                      <span className="text-emerald-700">0 Flags</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </section>

      {/* 2. REACT BITS LOGOLOOP MARQUEE BAND */}
      <section id="partners" className="py-10 bg-[#181818] border-y border-[#2e2e2e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            POWERED BY ENTERPRISE PLATFORM & ECOSYSTEM INTEGRATIONS
          </span>
        </div>

        <LogoLoop
          logos={partnerLogos}
          speed={90}
          direction="left"
          logoHeight={36}
          gap={36}
          pauseOnHover={true}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#181818"
          ariaLabel="Enterprise ecosystem integrations"
        />
      </section>

      {/* 3. ANIMATED NODE CONNECTOR INTEGRATION FLOW SECTION */}
      <section id="integration-hub" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-12 text-center max-w-2xl mx-auto scroll-popup">
          <span className="qount-eyebrow">Connected System Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Connected Intelligence Pipeline
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Select any source node to watch live evidence flow into the AI Analysis Hub.
          </p>
        </div>

        <div className="scroll-popup">
          <SwapColumnFeatures />
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-[#181818] border-t border-[#2e2e2e] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="qount-eyebrow">End-to-End Intelligence Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Verity Powers Bias-Aware Reviews
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              A 4-step continuous evidence flywheel that eliminates memory bias and recency traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BorderGlow
              glowColor="72 85 62"
              backgroundColor="#1c1c1c"
              borderRadius={20}
              glowRadius={30}
              glowIntensity={1.0}
              colors={['#d0f347', '#beeb30', '#10b981']}
              className="scroll-popup"
            >
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 flex items-center justify-center font-mono font-extrabold text-sm">
                  01
                </div>
                <h3 className="font-extrabold text-lg text-white">Daily Draft & Log Sync</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Employees log lightweight daily work notes and pull requests. Continuous evidence accumulates over 90 days.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow
              glowColor="72 85 62"
              backgroundColor="#1c1c1c"
              borderRadius={20}
              glowRadius={30}
              glowIntensity={1.0}
              colors={['#d0f347', '#beeb30', '#10b981']}
              className="scroll-popup"
            >
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 flex items-center justify-center font-mono font-extrabold text-sm">
                  02
                </div>
                <h3 className="font-extrabold text-lg text-white">Semantic Claim Extraction</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verity AI extracts individual performance claims and matches them against GitHub PRs, JIRA tickets, and Slack logs.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow
              glowColor="72 85 62"
              backgroundColor="#1c1c1c"
              borderRadius={20}
              glowRadius={30}
              glowIntensity={1.0}
              colors={['#d0f347', '#beeb30', '#10b981']}
              className="scroll-popup"
            >
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 flex items-center justify-center font-mono font-extrabold text-sm">
                  03
                </div>
                <h3 className="font-extrabold text-lg text-white">Balanced Peer Feedback</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-perspective feedback requests ensure self, peer, and manager inputs are balanced across time periods.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow
              glowColor="72 85 62"
              backgroundColor="#1c1c1c"
              borderRadius={20}
              glowRadius={30}
              glowIntensity={1.0}
              colors={['#d0f347', '#beeb30', '#10b981']}
              className="scroll-popup"
            >
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 flex items-center justify-center font-mono font-extrabold text-sm">
                  04
                </div>
                <h3 className="font-extrabold text-lg text-white">Deterministic Bias Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pure mathematical formulas compute Recency Index and Source Diversity scores before HR signs off on reviews.
                </p>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* 5. EVIDENCE ENGINE SECTION */}
      <section id="evidence-engine" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5 scroll-popup">
            <span className="qount-eyebrow">Signature Claim System</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Every Performance Claim Backed by Immutable Evidence
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Verity underlines verified performance claims with evidence badges. Any claim lacking an underlying GitHub PR, Slack log, or JIRA ticket gets flagged in amber for human review.
            </p>
            <div className="pt-2">
              <Link
                to="/hr/dashboard"
                className="px-5 py-2.5 bg-[#d0f347] hover:bg-[#beeb30] text-[#141414] font-extrabold rounded-lg text-xs transition-all inline-flex items-center gap-2"
              >
                Inspect Live Claims Queue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 scroll-popup">
            <div className="bg-[#222222] border border-[#2e2e2e] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#d0f347]" />
                  <span className="font-bold text-white text-sm">Draft Review Claim Inspection</span>
                </div>
                <span className="font-mono text-[11px] text-[#d0f347] bg-[#d0f347]/10 px-2.5 py-1 rounded-full font-bold">
                  2 Verified &bull; 1 Flagged
                </span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                <div className="p-4 bg-[#181818] border border-[#2e2e2e] rounded-xl space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase">Strength Claim</div>
                  <p>
                    Successfully <span className="evidence-claim-verified font-bold text-white">shipped multi-tenant authentication backend and PostgreSQL migration</span>{' '}
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 font-bold">
                      PR #42 &bull; JIRA-104
                    </span>{' '}
                    two weeks ahead of quarterly sprint schedule.
                  </p>
                </div>

                <div className="p-4 bg-[#181818] border border-[#2e2e2e] rounded-xl space-y-2">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">Flagged Growth Area</div>
                  <p>
                    Occasionally <span className="evidence-claim-flagged font-bold text-white">missed weekly architecture sync meetings</span>{' '}
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#C98A2B]/15 text-[#fbbf24] border border-[#C98A2B]/30 font-bold">
                      no source
                    </span>{' '}
                    without providing prior calendar updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BIAS AUDITING SECTION */}
      <section id="bias-audit" className="py-24 bg-[#181818] border-t border-[#2e2e2e] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="qount-eyebrow">Deterministic Bias Auditing Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Pure Mathematical Audit Rules
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Verity computes hard numerical metrics to catch recency bias and feedback concentration before reviews are finalized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-popup">
            <div className="bg-[#222222] border border-[#2e2e2e] p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase">Recency Index</span>
                <span className="font-mono text-xs font-bold text-[#d0f347]">0.25 (Pass)</span>
              </div>
              <div className="w-full bg-[#181818] h-3 rounded-full overflow-hidden border border-[#2e2e2e]">
                <div className="bg-[#d0f347] h-full w-[25%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates the weight of feedback accumulated in the final 14 days vs. the full 90-day cycle. Threshold: &lt; 0.60.
              </p>
            </div>

            <div className="bg-[#222222] border border-[#2e2e2e] p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase">Source Diversity</span>
                <span className="font-mono text-xs font-bold text-[#d0f347]">85% (4 Sources)</span>
              </div>
              <div className="w-full bg-[#181818] h-3 rounded-full overflow-hidden border border-[#2e2e2e]">
                <div className="bg-[#d0f347] h-full w-[85%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures feedback balance across Self, Peers, Direct Reports, and Manager to prevent single-source dependency.
              </p>
            </div>

            <div className="bg-[#222222] border border-[#2e2e2e] p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase">PostgreSQL RLS</span>
                <span className="font-mono text-xs font-bold text-[#d0f347]">100% Enforced</span>
              </div>
              <div className="w-full bg-[#181818] h-3 rounded-full overflow-hidden border border-[#2e2e2e]">
                <div className="bg-[#d0f347] h-full w-[100%]" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tenant isolation enforced at database level via row-level security (`org_id = auth.jwt() -&gt;&gt; 'org_id'`).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#181818] border-t border-[#2e2e2e] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 fill-[#d0f347] text-[#d0f347]" />
            <span className="font-bold text-white uppercase tracking-wider">Verity Intelligence System</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">verity_qount_edition_v2.0</span>
        </div>
      </footer>
    </div>
  );
}
