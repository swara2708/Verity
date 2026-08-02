import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Briefcase,
  MessageSquare,
  Users,
  Clock,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
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
  Server,
  Building2,
  Mail,
  UserCheck,
  Plus,
  ShieldCheck,
  PieChart,
  Award,
  Lock,
  ChevronRight
} from 'lucide-react';
import LogoLoop, { LogoItem } from '../../components/ui/LogoLoop';
import SwapColumnFeatures from '../../components/ui/SwapColumnFeatures';
import TextType from '../../components/ui/TextType';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <GitBranch className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">GitHub</span>
        </div>
      ),
      title: "GitHub Integrations",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <Database className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">PostgreSQL</span>
        </div>
      ),
      title: "PostgreSQL Engine",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <Cpu className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">Claude AI Agent</span>
        </div>
      ),
      title: "Claude AI Agent",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <Cloud className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">Supabase Auth</span>
        </div>
      ),
      title: "Supabase Hosted Postgres",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <Zap className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">FastAPI</span>
        </div>
      ),
      title: "FastAPI Backend",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7DA0CA] rounded-xl text-[#021024] shadow-sm hover:border-[#052659] transition-all">
          <Globe className="w-4 h-4 text-[#052659]" />
          <span className="font-extrabold text-xs font-mono-code">React 18</span>
        </div>
      ),
      title: "React Architecture",
    },
  ];

  return (
    <div className="min-h-screen bg-[#C1E8FF] text-[#021024] font-sans selection:bg-[#052659] selection:text-[#C1E8FF] overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-[#7DA0CA] py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-black shadow-md">
              <Hexagon className="w-5 h-5 fill-[#C1E8FF]" />
            </div>
            <span className="font-sora font-extrabold text-2xl tracking-tight text-[#021024] uppercase">
              Verity
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-sora font-semibold text-[#5483B3]">
            <a href="#partners" className="hover:text-[#052659] transition-colors">Ecosystem</a>
            <a href="#how-it-works" className="hover:text-[#052659] transition-colors">How It Works</a>
            <a href="#evidence-engine" className="hover:text-[#052659] transition-colors">Evidence Engine</a>
            <a href="#bias-audit" className="hover:text-[#052659] transition-colors">Bias Auditing</a>
            <a href="#evidence-matters" className="hover:text-[#052659] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-transparent border border-[#7DA0CA] text-[#052659] hover:bg-[#EAF3FB] font-sora font-bold rounded-xl text-xs transition-all"
            >
              Employee Sign In
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-[#052659] text-[#C1E8FF] hover:bg-[#021024] font-sora font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6 scroll-popup">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#7DA0CA] text-[#052659] font-mono-code font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#052659]" /> Continuous Evidence & Bias Auditing Engine
            </div>

            <TextType
              text={["Bias-Aware Performance Intelligence Built for How Your Firm Actually Works"]}
              typingSpeed={45}
              pauseDuration={4000}
              deletingSpeed={20}
              loop={false}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-[#052659] font-light"
              as="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-sora font-extrabold tracking-tight text-[#021024] leading-[1.12]"
            />

            <p className="text-[#5483B3] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Verity is an all-in-one 360° review intelligence platform that unifies daily evidence workflows, time-distributed progress check-ins, peer feedback, reporting, and deterministic bias auditing into one connected system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="px-7 py-3.5 bg-[#052659] hover:bg-[#021024] text-[#C1E8FF] font-sora font-extrabold rounded-2xl text-sm transition-all shadow-xl inline-flex items-center gap-2 group"
              >
                Employee Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#contact-companies"
                className="px-7 py-3.5 bg-white hover:bg-[#EAF3FB] text-[#052659] border border-[#7DA0CA] font-sora font-bold rounded-2xl text-sm transition-all shadow-sm"
              >
                Register Company
              </a>
            </div>
          </div>

          {/* Right Hero: Evidence Card Preview Stack */}
          <div className="lg:col-span-6 scroll-popup flex items-center justify-center">
            <div className="w-full max-w-lg bg-white border border-[#7DA0CA] rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#7DA0CA]/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-bold text-xs">
                    <Hexagon className="w-4 h-4 fill-[#C1E8FF]" />
                  </div>
                  <span className="font-sora font-extrabold text-sm text-[#021024]">Review Evidence Hub</span>
                </div>
                <span className="font-mono-code text-[11px] bg-[#052659]/10 text-[#052659] px-2.5 py-1 rounded-full font-bold border border-[#052659]/30">
                  PostgreSQL RLS Active
                </span>
              </div>

              {/* Verified Claim Card (SOLID Underline + Filled Checkmark) */}
              <div className="p-4 bg-[#EAF3FB] border border-[#7DA0CA] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-xs font-bold text-[#052659] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 fill-[#052659] text-white" /> Strength Claim Verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#052659]/10 text-[#052659] border border-[#052659]/30">
                    PR #42 &bull; JIRA-104
                  </span>
                </div>
                <p className="text-xs text-[#021024] leading-relaxed">
                  Shipped <span className="evidence-claim-verified">multi-tenant auth backend & PostgreSQL migration</span> 2 weeks ahead of sprint schedule.
                </p>
              </div>

              {/* Unsupported Claim Card (DASHED Underline + Alert Icon + '· unverified' text) */}
              <div className="p-4 bg-white border border-dashed border-[#5483B3] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-xs font-bold text-[#021024] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#5483B3]" /> Growth Area
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#5483B3]/15 text-[#052659] border border-[#5483B3]/30">
                    no source &bull; unverified
                  </span>
                </div>
                <p className="text-xs text-[#021024] leading-relaxed">
                  Occasionally <span className="evidence-claim-flagged">missed weekly architecture sync meetings</span> without calendar updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARK STAT STRIP (Deep Navy #021024) */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="bg-[#021024] text-[#C1E8FF] border border-[#052659] rounded-3xl p-8 shadow-2xl scroll-popup">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="p-5 rounded-2xl bg-[#052659]/40 border border-[#5483B3]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#7DA0CA] uppercase">Recency Index</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#052659] text-[#C1E8FF]">
                  Pass &lt; 0.60
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-[#C1E8FF]">0.25</div>
              <p className="text-xs text-[#7DA0CA]">Time-weighted feedback distribution over 90 days.</p>
            </div>

            {/* Stat Card 2 */}
            <div className="p-5 rounded-2xl bg-[#052659]/40 border border-[#5483B3]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#7DA0CA] uppercase">Source Diversity</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#052659] text-[#C1E8FF]">
                  4 Sources
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-white">85%</div>
              <p className="text-xs text-[#7DA0CA]">Balanced input from Self, Peers, Directs & Manager.</p>
            </div>

            {/* Stat Card 3 */}
            <div className="p-5 rounded-2xl bg-[#052659]/40 border border-[#5483B3]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#7DA0CA] uppercase">Audit Flags</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#052659] text-[#C1E8FF]">
                  Clean Audit
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-[#C1E8FF]">0 Flags</div>
              <p className="text-xs text-[#7DA0CA]">Zero unbacked claims allowed into final reviews.</p>
            </div>

            {/* Stat Card 4 */}
            <div className="p-5 rounded-2xl bg-[#052659]/40 border border-[#5483B3]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-[#7DA0CA] uppercase">PostgreSQL RLS</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#052659] text-[#C1E8FF]">
                  100% Enforced
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-white">Isolated</div>
              <p className="text-xs text-[#7DA0CA]">Tenant isolation enforced at database layer via org_id.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONNECTED INTELLIGENCE PIPELINE SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#052659] bg-white border border-[#7DA0CA] px-3.5 py-1 rounded-full">
            Connected Intelligence Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-[#021024] mt-3">
            Three agents. One deterministic check.
          </h2>
          <p className="text-[#5483B3] text-sm sm:text-base mt-2">
            Select a data source pipeline to inspect live claim extraction, evidence linkage, and PostgreSQL tenant auditing.
          </p>
        </div>
        <div className="scroll-popup">
          <SwapColumnFeatures />
        </div>
      </section>

      {/* 5. EVIDENCE ENGINE SECTION */}
      <section id="evidence-engine" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-12 scroll-popup">
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#052659] bg-white border border-[#7DA0CA] px-3.5 py-1 rounded-full">
            Signature Evidence Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-[#021024] mt-3">
            Every Performance Claim Backed by Immutable Evidence
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card A: Dark Contrast Profile Card */}
          <div className="lg:col-span-5 bg-[#021024] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 scroll-popup border border-[#052659]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-bold text-sm">
                    DP
                  </div>
                  <div>
                    <div className="font-sora font-extrabold text-base text-white">Dev Patel</div>
                    <div className="text-xs font-mono-code text-[#7DA0CA]">Lead Auth Architect</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-[#052659] text-[#C1E8FF]">
                  Verified Claims
                </span>
              </div>

              <p className="text-[#C1E8FF] text-sm leading-relaxed pt-2">
                "Verity underlines verified performance claims with evidence badges. Any claim lacking an underlying GitHub PR, Slack log, or JIRA ticket gets flagged in dashed slate for human review."
              </p>

              <div className="p-4 bg-[#052659]/50 border border-[#5483B3]/40 rounded-2xl space-y-2">
                <div className="text-xs font-mono-code font-bold text-[#C1E8FF] uppercase">Verified Strength Claim</div>
                <p className="text-xs text-white">
                  Successfully shipped multi-tenant authentication backend & PostgreSQL RLS migration two weeks ahead of quarterly sprint schedule.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#052659]">
              <Link
                to="/hr/dashboard"
                className="w-full py-3 bg-[#052659] hover:bg-black text-[#C1E8FF] font-sora font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                Inspect Live Claims Queue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B: Claim Verification Inspection */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 scroll-popup">
            <div className="bg-white border border-[#7DA0CA] p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#052659]/10 text-[#052659] flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sora font-extrabold text-xl text-[#021024]">Draft Claim Inspection</h3>
              <p className="text-xs text-[#5483B3] leading-relaxed">
                Claims extracted from daily check-ins are matched against GitHub PRs and JIRA tickets in real-time. Unbacked assertions are flagged before manager sign-off.
              </p>
              <div className="p-3 bg-[#052659]/10 border border-[#052659]/30 rounded-xl text-[11px] font-mono-code text-[#052659] font-bold">
                ✓ 2 Verified &bull; 1 Flagged Area
              </div>
            </div>

            <div className="bg-white border border-dashed border-[#5483B3] p-6 rounded-3xl shadow-md flex flex-col justify-between space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#5483B3]/20 text-[#052659] flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-sora font-extrabold text-xl text-[#021024]">Flagged Growth Area</h3>
              <p className="text-xs text-[#5483B3] leading-relaxed">
                "Occasionally missed weekly architecture sync meetings without providing prior calendar updates."
              </p>
              <div className="p-3 bg-[#5483B3]/15 border border-[#5483B3]/30 rounded-xl text-[11px] font-mono-code text-[#052659] font-bold">
                ! Requires Peer Source Input &bull; unverified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BIAS AUDITING SECTION */}
      <section id="bias-audit" className="py-24 bg-white border-t border-[#7DA0CA] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#052659] bg-[#EAF3FB] border border-[#7DA0CA] px-3.5 py-1 rounded-full">
              Deterministic Bias Auditing Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-sora font-extrabold text-[#021024] mt-3">
              What it catches
            </h2>
            <p className="text-[#5483B3] text-sm mt-2">
              Verity computes hard numerical metrics to catch recency bias and feedback concentration before reviews are finalized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-popup">
            <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-7 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-[#052659] uppercase">Recency Index</h3>
                <span className="font-mono-code text-xs font-bold text-[#052659] bg-white px-2 py-0.5 rounded-full border border-[#7DA0CA]">0.25 (Pass)</span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#7DA0CA]">
                <div className="bg-[#052659] h-full w-[25%]" />
              </div>
              <p className="text-xs text-[#5483B3] leading-relaxed">
                Calculates the weight of feedback accumulated in the final 14 days vs. the full 90-day cycle. Threshold: &lt; 0.60.
              </p>
            </div>

            <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-7 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-[#052659] uppercase">Source Diversity</h3>
                <span className="font-mono-code text-xs font-bold text-[#052659] bg-white px-2 py-0.5 rounded-full border border-[#7DA0CA]">85% (4 Sources)</span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#7DA0CA]">
                <div className="bg-[#052659] h-full w-[85%]" />
              </div>
              <p className="text-xs text-[#5483B3] leading-relaxed">
                Measures feedback balance across Self, Peers, Direct Reports, and Manager to prevent single-source dependency.
              </p>
            </div>

            <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-7 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-[#052659] uppercase">PostgreSQL RLS</h3>
                <span className="font-mono-code text-xs font-bold text-[#052659] bg-white px-2 py-0.5 rounded-full border border-[#7DA0CA]">100% Enforced</span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#7DA0CA]">
                <div className="bg-[#052659] h-full w-[100%]" />
              </div>
              <p className="text-xs text-[#5483B3] leading-relaxed">
                Tenant isolation enforced at database level via row-level security policy (`org_id = auth.jwt() -&gt;&gt; 'org_id'`).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ECOSYSTEM MARQUEE BAND */}
      <section id="partners" className="py-12 bg-[#EAF3FB] border-t border-[#7DA0CA] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <span className="font-mono-code text-[11px] font-bold text-[#052659] uppercase tracking-widest">
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
          fadeOutColor="#EAF3FB"
          ariaLabel="Enterprise ecosystem integrations"
        />
      </section>

      {/* 8. WHY EVIDENCE-FIRST REVIEWS MATTER & FAQ SECTION */}
      <section id="evidence-matters" className="py-24 bg-white border-t border-[#7DA0CA] relative">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          {/* Main Title & Deep Content Paragraphs */}
          <div className="space-y-6 scroll-popup">
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#052659] bg-[#EAF3FB] border border-[#7DA0CA] px-3.5 py-1 rounded-full">
              Core Philosophy & Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-extrabold text-[#021024] tracking-tight">
              Why evidence-first reviews matter
            </h2>

            <div className="space-y-6 text-[#021024] text-base leading-relaxed pt-2">
              <p>
                In traditional performance management, reviews are written from memory at the end of an evaluation cycle, leading to vagueness, forgotten achievements, and unsubstantiated claims. Verity reverses this paradigm by anchoring every statement in verifiable, continuous evidence collected from GitHub commits, JIRA tickets, Slack updates, and time-distributed peer check-ins. Rather than allowing an AI to invent or extrapolate employee achievements, Verity’s Evidence Retrieval Agent strictly extracts semantic claims and matches them against tangible artifacts, providing a transparent audit trail for every strength and growth area.
              </p>
              <p>
                Large language models are inherently probabilistic and can unintentionally amplify systemic human biases if trusted to perform evaluations directly. To prevent this, Verity intentionally decouples performance summary synthesis from bias scoring. While LLMs organize evidence into clear review drafts, all bias auditing—including Recency Index calculation, Source Diversity scoring, and unverified claim detection—runs through an independent, pure mathematical rule engine. This separation guarantees that audit metrics remain 100% deterministic, reproducible, and immune to model drift.
              </p>
            </div>
          </div>

          {/* 4-Item FAQ Block */}
          <div className="space-y-8 pt-8 border-t border-[#7DA0CA] scroll-popup">
            <div className="space-y-1">
              <span className="font-mono-code text-xs font-bold text-[#052659] uppercase tracking-wider">Frequently Asked Questions</span>
              <h3 className="text-2xl font-sora font-extrabold text-[#021024]">Understand How Verity Works</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-6 rounded-2xl space-y-3">
                <h3 className="text-base font-sora font-extrabold text-[#021024] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#052659] shrink-0" />
                  How is this different from an AI writing my reviews for me?
                </h3>
                <p className="text-xs text-[#5483B3] leading-relaxed">
                  Unlike generative tools that invent narrative text from high-level prompts, Verity requires every claim to be grounded in continuous evidence logs and verified artifacts. The system never generates arbitrary performance evaluations; it simply organizes verified work history while flagging any statement that lacks documented backing for manager review.
                </p>
              </div>

              <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-6 rounded-2xl space-y-3">
                <h3 className="text-base font-sora font-extrabold text-[#021024] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#052659] shrink-0" />
                  What counts as 'evidence' in a review?
                </h3>
                <p className="text-xs text-[#5483B3] leading-relaxed">
                  Evidence includes verifiable workplace artifacts such as merged GitHub pull requests, closed JIRA issues, daily check-in logs, and structured peer feedback submitted throughout the review cycle. Each artifact is tied to a timestamp and user identity within PostgreSQL row-level security boundaries.
                </p>
              </div>

              <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-6 rounded-2xl space-y-3">
                <h3 className="text-base font-sora font-extrabold text-[#021024] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#052659] shrink-0" />
                  Can employees see why something was flagged?
                </h3>
                <p className="text-xs text-[#5483B3] leading-relaxed">
                  Yes, transparency is built directly into the system interface. When a claim or review metric is flagged for recency bias or lack of backing evidence, both employees and managers can view the exact mathematical score and specific missing evidence source causing the alert.
                </p>
              </div>

              <div className="bg-[#EAF3FB] border border-[#7DA0CA] p-6 rounded-2xl space-y-3">
                <h3 className="text-base font-sora font-extrabold text-[#021024] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#052659] shrink-0" />
                  Does Verity work across multiple teams or business units?
                </h3>
                <p className="text-xs text-[#5483B3] leading-relaxed">
                  Verity supports multi-tenant enterprise architectures with strict row-level security policy isolation per department and organization. HR administrators can configure custom review cycles, department rosters, and bias auditing thresholds tailored to engineering, product, sales, or operations teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CLOSING DARK PANEL & COMPANY ONBOARDING CTA BAND (#021024) */}
      <section id="contact-companies" className="py-24 bg-[#021024] text-[#C1E8FF] border-t border-[#052659] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="font-mono-code text-xs font-extrabold uppercase tracking-widest text-[#C1E8FF] bg-[#052659] px-3.5 py-1 rounded-full">
              Company & HR Onboarding Portal
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-extrabold text-white mt-3">
              Register Your Company & Setup HR Details
            </h2>
            <p className="text-[#7DA0CA] text-xs sm:text-sm mt-3 leading-relaxed">
              Are you an HR Lead, Manager, or Executive looking to eliminate evaluation bias? Register your organization with Verity to configure custom 360° review rules and invite your team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-popup">
            {/* Left Card: HR & Manager Direct Registration */}
            <div className="lg:col-span-6 bg-[#052659]/50 border border-[#5483B3]/40 rounded-3xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-sora font-extrabold text-white">HR & Manager Onboarding</h3>
                <p className="text-[#C1E8FF] text-xs sm:text-sm leading-relaxed">
                  Setup your organization's custom performance workflow in under 2 minutes. Configure tenant isolation, department rosters, and automated bias auditing thresholds.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs font-mono-code text-[#C1E8FF]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C1E8FF] shrink-0" />
                    <span>PostgreSQL Tenant Isolation (org_id RLS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C1E8FF] shrink-0" />
                    <span>Custom 360° Review Cycles & Recency Indexing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C1E8FF] shrink-0" />
                    <span>Issue 7-Day Signed Access Tokens to Employees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C1E8FF] shrink-0" />
                    <span>Server-Side Deterministic Bias Auditing</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#052659] flex flex-wrap items-center gap-4">
                <Link
                  to="/onboarding"
                  className="px-6 py-3.5 bg-[#052659] hover:bg-black text-[#C1E8FF] font-sora font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" /> Setup Company Details
                </Link>
                <Link
                  to="/login/hr"
                  className="px-6 py-3.5 bg-transparent border border-[#7DA0CA] hover:bg-[#052659] text-white font-sora font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  HR Admin Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card: Contact Us / Instant Registration Form */}
            <div className="lg:col-span-6 bg-[#052659]/50 border border-[#5483B3]/40 rounded-3xl p-8 space-y-6">
              <div>
                <span className="font-mono-code text-xs font-bold text-[#C1E8FF] uppercase tracking-wider">Contact & Registration</span>
                <h3 className="text-xl font-sora font-extrabold text-white mt-1">Get Started / Inquiry</h3>
                <p className="text-[#7DA0CA] text-xs mt-1">Enter your organization details below to initialize your company setup.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = '/onboarding';
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#C1E8FF] uppercase mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#7DA0CA] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#021024] border border-[#5483B3]/40 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1E8FF] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#C1E8FF] uppercase mb-1.5">
                    HR Admin / Manager Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7DA0CA] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="hr.admin@acme.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#021024] border border-[#5483B3]/40 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1E8FF] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-[#C1E8FF] uppercase mb-1.5">
                    Organization Size
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-[#021024] border border-[#5483B3]/40 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1E8FF] transition-all"
                  >
                    <option value="1-50">1 - 50 Employees</option>
                    <option value="51-200">51 - 200 Employees</option>
                    <option value="201-1000">201 - 1,000 Employees</option>
                    <option value="1000+">1,000+ Enterprise</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#052659] hover:bg-black text-[#C1E8FF] font-sora font-extrabold rounded-2xl text-xs uppercase tracking-wider font-mono-code transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Register & Setup Company Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="py-8 bg-[#021024] border-t border-[#052659] text-[#7DA0CA] text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 fill-[#052659] text-[#C1E8FF]" />
            <span className="font-sora font-bold text-white uppercase tracking-wider">Verity Intelligence System</span>
          </div>
          <span className="font-mono-code text-[11px] text-[#5483B3]">verity_monochrome_blue_v3.0</span>
        </div>
      </footer>
    </div>
  );
}
