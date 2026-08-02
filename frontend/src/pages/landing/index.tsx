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
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <GitBranch className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">GitHub</span>
        </div>
      ),
      title: "GitHub Integrations",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <Database className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">PostgreSQL</span>
        </div>
      ),
      title: "PostgreSQL Engine",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <Cpu className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">Claude Sonnet</span>
        </div>
      ),
      title: "Claude AI Agent",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <Cloud className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">Supabase Auth</span>
        </div>
      ),
      title: "Supabase Hosted Postgres",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <Zap className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">FastAPI</span>
        </div>
      ),
      title: "FastAPI Backend",
    },
    {
      node: (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-[#14152B] shadow-sm hover:border-[#5B4FE8] transition-all">
          <Globe className="w-4 h-4 text-[#5B4FE8]" />
          <span className="font-extrabold text-xs font-mono">React 18</span>
        </div>
      ),
      title: "React Architecture",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F5FC] via-[#ECEBF7] to-[#F1F0FA] text-[#14152B] font-sans selection:bg-[#5B4FE8] selection:text-white overflow-x-hidden">
      {/* 1. TOP NAVBAR (Transparent to Blurred Glass) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/70 py-3.5 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5B4FE8] text-white flex items-center justify-center font-black shadow-md shadow-[#5B4FE8]/25">
              <Hexagon className="w-5 h-5 fill-white" />
            </div>
            <span className="font-jakarta font-extrabold text-2xl tracking-tight text-[#14152B] uppercase">
              Verity
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-jakarta font-semibold text-slate-600">
            <a href="#partners" className="hover:text-[#5B4FE8] transition-colors">Ecosystem</a>
            <a href="#how-it-works" className="hover:text-[#5B4FE8] transition-colors">How It Works</a>
            <a href="#evidence-engine" className="hover:text-[#5B4FE8] transition-colors">Evidence Engine</a>
            <a href="#bias-audit" className="hover:text-[#5B4FE8] transition-colors">Bias Auditing</a>
            <a href="#evidence-matters" className="hover:text-[#5B4FE8] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-[#14162B] text-white hover:bg-[#1f2242] font-jakarta font-bold rounded-xl text-xs transition-all shadow-md"
            >
              Employee Sign In
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-[#5B4FE8] text-white hover:bg-[#4a3ecb] font-jakarta font-bold rounded-xl text-xs transition-all shadow-md shadow-[#5B4FE8]/30 flex items-center gap-1"
            >
              Employee Login
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH SOFT-3D GLASS COMPOSITION */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6 scroll-popup">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B4FE8]/10 border border-[#5B4FE8]/25 text-[#5B4FE8] font-mono font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Continuous Evidence & Bias Auditing Engine
            </div>

            <TextType
              text={["Bias-Aware Performance Intelligence Built for How Your Firm Actually Works"]}
              typingSpeed={45}
              pauseDuration={4000}
              deletingSpeed={20}
              loop={false}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-[#5B4FE8] font-light"
              as="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-jakarta font-extrabold tracking-tight text-[#14152B] leading-[1.12]"
            />

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Verity is an all-in-one 360° review intelligence platform that unifies daily evidence workflows, time-distributed progress check-ins, peer feedback, reporting, and deterministic bias auditing into one connected system.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="px-7 py-3.5 bg-[#5B4FE8] hover:bg-[#4a3ecb] text-white font-jakarta font-extrabold rounded-2xl text-sm transition-all shadow-xl shadow-[#5B4FE8]/30 inline-flex items-center gap-2 group"
              >
                Employee Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#contact-companies"
                className="px-7 py-3.5 bg-white/80 hover:bg-white text-[#14152B] border border-slate-300/80 font-jakarta font-bold rounded-2xl text-sm transition-all shadow-sm"
              >
                Register Company
              </a>
            </div>
          </div>

          {/* Right Hero: Floating Glass Tiles & Soft-3D Cylinder Composition */}
          <div className="lg:col-span-6 h-[460px] relative scroll-popup flex items-center justify-center">
            {/* Background Radial Glow */}
            <div className="absolute w-96 h-96 bg-[#5B4FE8]/15 rounded-full blur-3xl -z-10" />

            {/* Central Glass Platform & Capsule Cylinders */}
            <div className="relative w-full max-w-md h-80 bg-white/40 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Glass Dish Base Header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#5B4FE8]" />
                  <span className="font-jakarta font-bold text-xs text-[#14152B]">Evidence Pipeline Hub</span>
                </div>
                <span className="font-mono-code text-[11px] bg-[#2ED9A0]/20 text-[#0E9F6E] px-2.5 py-0.5 rounded-full font-bold">
                  100% RLS Verified
                </span>
              </div>

              {/* Central Abstract Glass Capsules */}
              <div className="flex items-center justify-around py-4">
                {/* Capsule 1: Input Claims */}
                <div className="w-20 h-36 rounded-full bg-gradient-to-b from-white/80 to-[#4FC3E8]/20 border border-white/90 p-2 shadow-lg flex flex-col items-center justify-between animate-float-slow">
                  <div className="w-8 h-8 rounded-full bg-[#4FC3E8]/30 flex items-center justify-center text-[#0284C7] font-bold text-xs">
                    01
                  </div>
                  <GitBranch className="w-5 h-5 text-[#0284C7]" />
                  <span className="font-mono-code text-[9px] font-bold text-[#0284C7]">Commits</span>
                </div>

                {/* Capsule 2: Synthesis Engine */}
                <div className="w-24 h-44 rounded-full bg-gradient-to-b from-[#5B4FE8]/30 via-white/80 to-[#5B4FE8]/20 border border-white p-3 shadow-xl flex flex-col items-center justify-between animate-float-reverse">
                  <div className="w-9 h-9 rounded-full bg-[#5B4FE8] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-jakarta font-extrabold text-[10px] text-[#14152B] text-center">AI Synthesis</span>
                  <div className="w-full bg-[#5B4FE8]/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#5B4FE8] h-full w-[85%]" />
                  </div>
                </div>

                {/* Capsule 3: Audit Result */}
                <div className="w-20 h-36 rounded-full bg-gradient-to-b from-white/80 to-[#2ED9A0]/20 border border-white/90 p-2 shadow-lg flex flex-col items-center justify-between animate-float-delayed">
                  <div className="w-8 h-8 rounded-full bg-[#2ED9A0]/30 flex items-center justify-center text-[#0E9F6E] font-bold text-xs">
                    03
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#0E9F6E]" />
                  <span className="font-mono-code text-[9px] font-bold text-[#0E9F6E]">Audit 0.25</span>
                </div>
              </div>

              {/* Bottom Glass Platform Footnote */}
              <div className="bg-white/60 p-2.5 rounded-2xl border border-white/80 text-[11px] font-mono-code text-[#14152B] flex items-center justify-between font-semibold">
                <span>Determinism Audit:</span>
                <span className="text-[#0E9F6E] font-bold">0 Unbacked Claims</span>
              </div>
            </div>

            {/* Scattered Floating Tinted Glass Tiles */}
            {/* Tile 1: Mint Tint (Top Left) */}
            <div className="absolute -top-4 -left-2 bg-white/70 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-lg shadow-[#2ED9A0]/15 flex items-center gap-3 animate-float-slow">
              <div className="w-9 h-9 rounded-xl bg-[#2ED9A0]/20 text-[#0E9F6E] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-code font-bold text-[#0E9F6E]">PR #42 Verified</div>
                <div className="text-[11px] font-jakarta font-extrabold text-[#14152B]">Auth Backend Shipped</div>
              </div>
            </div>

            {/* Tile 2: Sky Blue Tint (Bottom Left) */}
            <div className="absolute -bottom-4 -left-4 bg-white/70 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-lg shadow-[#4FC3E8]/15 flex items-center gap-3 animate-float-delayed">
              <div className="w-9 h-9 rounded-xl bg-[#4FC3E8]/20 text-[#0284C7] flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-code font-bold text-[#0284C7]">Source Diversity</div>
                <div className="text-[11px] font-jakarta font-extrabold text-[#14152B]">85% (4 Sources)</div>
              </div>
            </div>

            {/* Tile 3: Coral Pink Tint (Right Middle) */}
            <div className="absolute top-12 -right-6 bg-white/70 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-lg shadow-[#F27DA0]/15 flex items-center gap-3 animate-float-reverse">
              <div className="w-9 h-9 rounded-xl bg-[#F27DA0]/20 text-[#E11D48] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-code font-bold text-[#E11D48]">Evidence Log</div>
                <div className="text-[11px] font-jakarta font-extrabold text-[#14152B]">90-Day History</div>
              </div>
            </div>

            {/* Floating Decorative Plus Icon Circle (Top Right) */}
            <div className="absolute -top-6 right-8 w-10 h-10 rounded-full bg-[#5B4FE8] text-white flex items-center justify-center shadow-lg shadow-[#5B4FE8]/40 animate-pulse">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DARK STAT STRIP BENEATH HERO (High-Contrast Navy Cards) */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="bg-[#14162B] border border-[#282B4E] rounded-3xl p-8 shadow-2xl scroll-popup">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat Card 1 */}
            <div className="p-5 rounded-2xl bg-[#1c1f3b] border border-[#2e335b] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-slate-400 uppercase">Recency Index</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#2ED9A0]/20 text-[#2ED9A0]">
                  Pass &lt; 0.60
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-[#2ED9A0]">0.25</div>
              <p className="text-xs text-slate-400">Time-weighted feedback distribution over 90 days.</p>
            </div>

            {/* Stat Card 2 */}
            <div className="p-5 rounded-2xl bg-[#1c1f3b] border border-[#2e335b] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-slate-400 uppercase">Source Diversity</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#4FC3E8]/20 text-[#4FC3E8]">
                  4 Sources
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-white">85%</div>
              <p className="text-xs text-slate-400">Balanced input from Self, Peers, Directs & Manager.</p>
            </div>

            {/* Stat Card 3 */}
            <div className="p-5 rounded-2xl bg-[#1c1f3b] border border-[#2e335b] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-slate-400 uppercase">Audit Flags</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#2ED9A0]/20 text-[#2ED9A0]">
                  Clean Audit
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-[#2ED9A0]">0 Flags</div>
              <p className="text-xs text-slate-400">Zero unbacked claims allowed into final reviews.</p>
            </div>

            {/* Stat Card 4 */}
            <div className="p-5 rounded-2xl bg-[#1c1f3b] border border-[#2e335b] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-slate-400 uppercase">PostgreSQL RLS</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono-code text-[10px] font-bold bg-[#5B4FE8]/30 text-[#A59EFF]">
                  100% Enforced
                </span>
              </div>
              <div className="text-3xl font-mono-code font-bold text-[#A59EFF]">Isolated</div>
              <p className="text-xs text-slate-400">Tenant isolation enforced at database layer via org_id.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONNECTED INTELLIGENCE PIPELINE SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#5B4FE8] bg-[#5B4FE8]/10 px-3 py-1 rounded-full">
            Connected Intelligence Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-jakarta font-extrabold text-[#14152B] mt-3">
            Three agents. One deterministic check.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Select a data source pipeline to inspect live claim extraction, evidence linkage, and PostgreSQL tenant auditing.
          </p>
        </div>
        <div className="scroll-popup">
          <SwapColumnFeatures />
        </div>
      </section>

      {/* 5. ASYMMETRIC COLLAGE FEATURE / TESTIMONIAL ROW */}
      <section id="evidence-engine" className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-12 scroll-popup">
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#5B4FE8] bg-[#5B4FE8]/10 px-3 py-1 rounded-full">
            Signature Evidence Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-jakarta font-extrabold text-[#14152B] mt-3">
            Every Performance Claim Backed by Immutable Evidence
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card A: Dark Contrast Profile Card */}
          <div className="lg:col-span-5 bg-[#14162B] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 scroll-popup">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B4FE8] text-white flex items-center justify-center font-bold text-sm">
                    DP
                  </div>
                  <div>
                    <div className="font-jakarta font-extrabold text-base text-white">Dev Patel</div>
                    <div className="text-xs font-mono-code text-slate-400">Lead Auth Architect</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-code font-bold bg-[#2ED9A0]/20 text-[#2ED9A0]">
                  Verified Claims
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed pt-2">
                "Verity underlines verified performance claims with evidence badges. Any claim lacking an underlying GitHub PR, Slack log, or JIRA ticket gets flagged in amber for human review."
              </p>

              <div className="p-4 bg-[#1c1f3b] border border-[#2e335b] rounded-2xl space-y-2">
                <div className="text-xs font-mono-code font-bold text-[#2ED9A0] uppercase">Verified Strength Claim</div>
                <p className="text-xs text-slate-200">
                  Successfully shipped multi-tenant authentication backend & PostgreSQL RLS migration two weeks ahead of quarterly sprint schedule.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2e335b]">
              <Link
                to="/hr/dashboard"
                className="w-full py-3 bg-[#5B4FE8] hover:bg-[#4a3ecb] text-white font-jakarta font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                Inspect Live Claims Queue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B: Photo & Evidence Tile Overlay */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 scroll-popup">
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#5B4FE8]/10 text-[#5B4FE8] flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-extrabold text-xl text-[#14152B]">Draft Claim Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claims extracted from daily check-ins are matched against GitHub PRs and JIRA tickets in real-time. Unbacked assertions are flagged before manager sign-off.
              </p>
              <div className="p-3 bg-[#2ED9A0]/10 border border-[#2ED9A0]/30 rounded-xl text-[11px] font-mono-code text-[#0E9F6E] font-bold">
                ✓ 2 Verified &bull; 1 Flagged Area
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-lg flex flex-col justify-between space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#F2C14E]/20 text-[#D97706] flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-extrabold text-xl text-[#14152B]">Flagged Growth Area</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Occasionally missed weekly architecture sync meetings without providing prior calendar updates."
              </p>
              <div className="p-3 bg-[#F2C14E]/15 border border-[#F2C14E]/40 rounded-xl text-[11px] font-mono-code text-[#D97706] font-bold">
                ! Requires Peer Source Input
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BIAS AUDITING SECTION */}
      <section id="bias-audit" className="py-24 bg-white/60 backdrop-blur-md border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#5B4FE8] bg-[#5B4FE8]/10 px-3 py-1 rounded-full">
              Deterministic Bias Auditing Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-jakarta font-extrabold text-[#14152B] mt-3">
              What it catches
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Verity computes hard numerical metrics to catch recency bias and feedback concentration before reviews are finalized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-popup">
            <div className="bg-white border border-slate-200/80 p-7 rounded-3xl shadow-md space-y-4 hover:border-[#5B4FE8]/50 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-slate-500 uppercase">Recency Index</h3>
                <span className="font-mono-code text-xs font-bold text-[#0E9F6E] bg-[#2ED9A0]/20 px-2 py-0.5 rounded-full">0.25 (Pass)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#2ED9A0] h-full w-[25%]" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates the weight of feedback accumulated in the final 14 days vs. the full 90-day cycle. Threshold: &lt; 0.60.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-7 rounded-3xl shadow-md space-y-4 hover:border-[#5B4FE8]/50 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-slate-500 uppercase">Source Diversity</h3>
                <span className="font-mono-code text-xs font-bold text-[#0284C7] bg-[#4FC3E8]/20 px-2 py-0.5 rounded-full">85% (4 Sources)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#4FC3E8] h-full w-[85%]" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Measures feedback balance across Self, Peers, Direct Reports, and Manager to prevent single-source dependency.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-7 rounded-3xl shadow-md space-y-4 hover:border-[#5B4FE8]/50 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-code text-xs font-bold text-slate-500 uppercase">PostgreSQL RLS</h3>
                <span className="font-mono-code text-xs font-bold text-[#5B4FE8] bg-[#5B4FE8]/15 px-2 py-0.5 rounded-full">100% Enforced</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#5B4FE8] h-full w-[100%]" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tenant isolation enforced at database level via row-level security policy (`org_id = auth.jwt() -&gt;&gt; 'org_id'`).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REPURPOSED PRICING / TIER COMPARISON ROW */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative">
        <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#5B4FE8] bg-[#5B4FE8]/10 px-3 py-1 rounded-full">
            Organization Plans & Deployment Tiers
          </span>
          <h2 className="text-3xl sm:text-4xl font-jakarta font-extrabold text-[#14152B] mt-3">
            Tailored Deployment for Every Scale
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Select the organizational model that aligns with your engineering headcount and security compliance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch scroll-popup">
          {/* Tier 1: Standard Team */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-jakarta font-extrabold text-2xl text-[#14152B]">Standard Team</h3>
              <p className="text-xs text-slate-600">Ideal for growing teams starting continuous 90-day review cycles.</p>
              <div className="pt-2 text-3xl font-jakarta font-extrabold text-[#14152B]">1-50 <span className="text-xs font-normal text-slate-500">Users</span></div>

              <ul className="space-y-3 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Daily Check-in & Evidence Logging
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Recency Index & Diversity Auditing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Basic GitHub & Slack Integrations
                </li>
              </ul>
            </div>

            <Link
              to="/onboarding"
              className="w-full py-3 bg-[#14162B] text-white hover:bg-[#1f2242] font-jakarta font-bold rounded-xl text-xs transition-all text-center block"
            >
              Get Started
            </Link>
          </div>

          {/* Tier 2: Enterprise HR (Recommended Indigo Card) */}
          <div className="bg-[#5B4FE8] text-white p-8 rounded-3xl shadow-2xl shadow-[#5B4FE8]/30 flex flex-col justify-between space-y-6 transform lg:-translate-y-2 border-2 border-white/40">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-white/20 rounded-full font-mono-code text-[10px] font-bold uppercase tracking-wider">
                  ★ Recommended
                </span>
                <Sparkles className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="font-jakarta font-extrabold text-2xl text-white">Enterprise HR</h3>
              <p className="text-xs text-white/80">Full multi-tenant organization suite with PostgreSQL RLS & AI agents.</p>
              <div className="pt-2 text-3xl font-jakarta font-extrabold text-white">50-1000+ <span className="text-xs font-normal text-white/80">Users</span></div>

              <ul className="space-y-3 pt-4 border-t border-white/20 text-xs font-semibold text-white">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> PostgreSQL Row-Level Security (RLS)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> AI Evidence Retrieval Agent
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Signed 7-Day Employee Invite Tokens
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> HR Admin Approval Queue
                </li>
              </ul>
            </div>

            <Link
              to="/onboarding"
              className="w-full py-3.5 bg-white text-[#5B4FE8] hover:bg-slate-100 font-jakarta font-extrabold rounded-xl text-xs transition-all text-center block shadow-md"
            >
              Setup Company Details
            </Link>
          </div>

          {/* Tier 3: Custom Compliance */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-jakarta font-extrabold text-2xl text-[#14152B]">Custom Compliance</h3>
              <p className="text-xs text-slate-600">For regulated enterprises requiring custom RLS policies & dedicated LLMs.</p>
              <div className="pt-2 text-3xl font-jakarta font-extrabold text-[#14152B]">Custom <span className="text-xs font-normal text-slate-500">Deployment</span></div>

              <ul className="space-y-3 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Dedicated Supabase Postgres Instance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Custom Bias Metric Weightings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" /> Enterprise Okta & SAML SSO
                </li>
              </ul>
            </div>

            <a
              href="#contact-companies"
              className="w-full py-3 bg-[#14162B] text-white hover:bg-[#1f2242] font-jakarta font-bold rounded-xl text-xs transition-all text-center block"
            >
              Contact HR Sales
            </a>
          </div>
        </div>
      </section>

      {/* 8. ECOSYSTEM MARQUEE BAND */}
      <section id="partners" className="py-12 bg-white/50 border-t border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <span className="font-mono-code text-[11px] font-bold text-slate-500 uppercase tracking-widest">
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
          fadeOutColor="#F6F5FC"
          ariaLabel="Enterprise ecosystem integrations"
        />
      </section>

      {/* 9. WHY EVIDENCE-FIRST REVIEWS MATTER & FAQ SECTION */}
      <section id="evidence-matters" className="py-24 bg-white/80 backdrop-blur-md border-t border-slate-200/80 relative">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          {/* Main Title & Deep Content Paragraphs */}
          <div className="space-y-6 scroll-popup">
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#5B4FE8] bg-[#5B4FE8]/10 px-3 py-1 rounded-full">
              Core Philosophy & Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-jakarta font-extrabold text-[#14152B] tracking-tight">
              Why evidence-first reviews matter
            </h2>

            <div className="space-y-6 text-slate-700 text-base leading-relaxed pt-2">
              <p>
                In traditional performance management, reviews are written from memory at the end of an evaluation cycle, leading to vagueness, forgotten achievements, and unsubstantiated claims. Verity reverses this paradigm by anchoring every statement in verifiable, continuous evidence collected from GitHub commits, JIRA tickets, Slack updates, and time-distributed peer check-ins. Rather than allowing an AI to invent or extrapolate employee achievements, Verity’s Evidence Retrieval Agent strictly extracts semantic claims and matches them against tangible artifacts, providing a transparent audit trail for every strength and growth area.
              </p>
              <p>
                Large language models are inherently probabilistic and can unintentionally amplify systemic human biases if trusted to perform evaluations directly. To prevent this, Verity intentionally decouples performance summary synthesis from bias scoring. While LLMs organize evidence into clear review drafts, all bias auditing—including Recency Index calculation, Source Diversity scoring, and unverified claim detection—runs through an independent, pure mathematical rule engine. This separation guarantees that audit metrics remain 100% deterministic, reproducible, and immune to model drift.
              </p>
            </div>
          </div>

          {/* 4-Item FAQ Block */}
          <div className="space-y-8 pt-8 border-t border-slate-200 scroll-popup">
            <div className="space-y-1">
              <span className="font-mono-code text-xs font-bold text-[#5B4FE8] uppercase tracking-wider">Frequently Asked Questions</span>
              <h3 className="text-2xl font-jakarta font-extrabold text-[#14152B]">Understand How Verity Works</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-base font-jakarta font-extrabold text-[#14152B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" />
                  How is this different from an AI writing my reviews for me?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike generative tools that invent narrative text from high-level prompts, Verity requires every claim to be grounded in continuous evidence logs and verified artifacts. The system never generates arbitrary performance evaluations; it simply organizes verified work history while flagging any statement that lacks documented backing for manager review.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-base font-jakarta font-extrabold text-[#14152B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" />
                  What counts as 'evidence' in a review?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evidence includes verifiable workplace artifacts such as merged GitHub pull requests, closed JIRA issues, daily check-in logs, and structured peer feedback submitted throughout the review cycle. Each artifact is tied to a timestamp and user identity within PostgreSQL row-level security boundaries.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-base font-jakarta font-extrabold text-[#14152B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" />
                  Can employees see why something was flagged?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yes, transparency is built directly into the system interface. When a claim or review metric is flagged for recency bias or lack of backing evidence, both employees and managers can view the exact mathematical score and specific missing evidence source causing the alert.
                </p>
              </div>

              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-base font-jakarta font-extrabold text-[#14152B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5B4FE8] shrink-0" />
                  Does Verity work across multiple teams or business units?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verity supports multi-tenant enterprise architectures with strict row-level security policy isolation per department and organization. HR administrators can configure custom review cycles, department rosters, and bias auditing thresholds tailored to engineering, product, sales, or operations teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CLOSING DARK PANEL & COMPANY ONBOARDING CTA BAND */}
      <section id="contact-companies" className="py-24 bg-[#14162B] text-white border-t border-[#282B4E] relative overflow-hidden">
        {/* Decorative Floating Glass Cylinders Bleeding Off Edge */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#5B4FE8]/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-14 text-center max-w-2xl mx-auto scroll-popup">
            <span className="font-mono-code text-xs font-extrabold uppercase tracking-widest text-[#2ED9A0] bg-[#2ED9A0]/10 px-3.5 py-1 rounded-full">
              Company & HR Onboarding Portal
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-jakarta font-extrabold text-white mt-3">
              Register Your Company & Setup HR Details
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              Are you an HR Lead, Manager, or Executive looking to eliminate evaluation bias? Register your organization with Verity to configure custom 360° review rules and invite your team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-popup">
            {/* Left Card: HR & Manager Direct Registration */}
            <div className="lg:col-span-6 bg-[#1c1f3b] border border-[#2e335b] rounded-3xl p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5B4FE8]/20 border border-[#5B4FE8]/40 flex items-center justify-center text-[#A59EFF]">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-jakarta font-extrabold text-white">HR & Manager Onboarding</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Setup your organization's custom performance workflow in under 2 minutes. Configure tenant isolation, department rosters, and automated bias auditing thresholds.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs font-mono-code text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2ED9A0] shrink-0" />
                    <span>PostgreSQL Tenant Isolation (org_id RLS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2ED9A0] shrink-0" />
                    <span>Custom 360° Review Cycles & Recency Indexing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2ED9A0] shrink-0" />
                    <span>Issue 7-Day Signed Access Tokens to Employees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2ED9A0] shrink-0" />
                    <span>Server-Side Deterministic Bias Auditing</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#2e335b] flex flex-wrap items-center gap-4">
                <Link
                  to="/onboarding"
                  className="px-6 py-3.5 bg-[#5B4FE8] hover:bg-[#4a3ecb] text-white font-jakarta font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-[#5B4FE8]/30 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" /> Setup Company Details
                </Link>
                <Link
                  to="/login/hr"
                  className="px-6 py-3.5 bg-[#25284a] border border-[#3b4073] hover:bg-[#2f335c] text-white font-jakarta font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  HR Admin Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Card: Contact Us / Instant Registration Form */}
            <div className="lg:col-span-6 bg-[#1c1f3b] border border-[#2e335b] rounded-3xl p-8 space-y-6">
              <div>
                <span className="font-mono-code text-xs font-bold text-[#4FC3E8] uppercase tracking-wider">Contact & Registration</span>
                <h3 className="text-xl font-jakarta font-extrabold text-white mt-1">Get Started / Inquiry</h3>
                <p className="text-slate-400 text-xs mt-1">Enter your organization details below to initialize your company setup.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = '/onboarding';
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#14162B] border border-[#2e335b] rounded-xl text-white text-xs focus:outline-none focus:border-[#5B4FE8] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">
                    HR Admin / Manager Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="hr.admin@acme.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#14162B] border border-[#2e335b] rounded-xl text-white text-xs focus:outline-none focus:border-[#5B4FE8] transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code font-bold text-slate-300 uppercase mb-1.5">
                    Organization Size
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-[#14162B] border border-[#2e335b] rounded-xl text-white text-xs focus:outline-none focus:border-[#5B4FE8] transition-all"
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
                    className="w-full py-3.5 bg-[#5B4FE8] hover:bg-[#4a3ecb] text-white font-jakarta font-extrabold rounded-2xl text-xs uppercase tracking-wider font-mono-code transition-all shadow-lg shadow-[#5B4FE8]/30 flex items-center justify-center gap-2"
                  >
                    Register & Setup Company Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-8 bg-[#0e1021] border-t border-[#282B4E] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 fill-[#5B4FE8] text-[#5B4FE8]" />
            <span className="font-jakarta font-bold text-white uppercase tracking-wider">Verity Intelligence System</span>
          </div>
          <span className="font-mono-code text-[11px] text-slate-500">verity_glass_edition_v3.0</span>
        </div>
      </footer>
    </div>
  );
}
