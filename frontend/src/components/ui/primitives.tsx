import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileEdit,
  Circle,
  X,
  ExternalLink,
  Hexagon
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* LOGO (QOUNT STYLE WITH GLOW PULSE)                                         */
/* -------------------------------------------------------------------------- */
export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#d0f347] text-[#141414] flex items-center justify-center font-black shadow-md shadow-[#d0f347]/20 glow-pulse-lime">
      <Hexagon className="w-5 h-5 fill-[#141414]" />
    </div>
    <span className="font-extrabold text-xl tracking-tight text-white uppercase">
      Verity
    </span>
  </div>
);

export const LogoDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#d0f347] text-[#141414] flex items-center justify-center font-black shadow-md shadow-[#d0f347]/20 glow-pulse-lime">
      <Hexagon className="w-5 h-5 fill-[#141414]" />
    </div>
    <span className="font-extrabold text-xl tracking-tight text-white uppercase">
      Verity
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/* BUTTON                                                                     */
/* -------------------------------------------------------------------------- */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-extrabold button-hover-lift focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all';

  const variants = {
    primary: 'bg-[#d0f347] hover:bg-[#beeb30] text-[#141414] shadow-md shadow-[#d0f347]/20',
    white: 'bg-white hover:bg-slate-100 text-[#141414] shadow-sm',
    dark: 'bg-[#222222] hover:bg-[#2e2e2e] text-white border border-[#2e2e2e]',
    outline: 'bg-transparent text-white border border-[#2e2e2e] hover:bg-[#222222]',
    danger: 'bg-transparent text-[#fb7185] border border-[#fb7185]/40 hover:bg-[#fb7185]/10',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* CARD                                                                       */
/* -------------------------------------------------------------------------- */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}> = ({ children, className = '', hoverLift = false }) => (
  <div
    className={`bg-[#222222] border border-[#2e2e2e] rounded-2xl p-6 ${
      hoverLift ? 'card-hover-lift' : ''
    } ${className}`}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* STATUS BADGE WITH 200MS CROSSFADE & GLOW PULSE                             */
/* -------------------------------------------------------------------------- */
export type StatusType =
  | 'not_started'
  | 'drafting'
  | 'draft'
  | 'flagged'
  | 'pending'
  | 'needs_input'
  | 'approved'
  | 'rejected';

export const StatusBadge: React.FC<{ status: StatusType | string; className?: string }> = ({
  status,
  className = '',
}) => {
  const norm = status.toLowerCase();
  const baseClass = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold status-badge-crossfade';

  if (norm === 'approved') {
    return (
      <span className={`${baseClass} bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30 ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
        Approved
      </span>
    );
  }

  if (norm === 'flagged') {
    return (
      <span className={`${baseClass} bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-[#fb7185] animate-pulse" />
        Flagged
      </span>
    );
  }

  if (norm === 'pending' || norm === 'needs_input') {
    return (
      <span className={`${baseClass} bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-[#fbbf24]" />
        {norm === 'needs_input' ? 'Needs Input' : 'Pending Approval'}
      </span>
    );
  }

  if (norm === 'rejected') {
    return (
      <span className={`${baseClass} bg-[#f43f5e]/15 text-[#fb7185] border border-[#f43f5e]/30 ${className}`}>
        <X className="w-3.5 h-3.5 text-[#fb7185]" />
        Rejected
      </span>
    );
  }

  if (norm === 'drafting' || norm === 'draft') {
    return (
      <span className={`${baseClass} bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 glow-pulse-lime ${className}`}>
        <FileEdit className="w-3.5 h-3.5 text-[#d0f347]" />
        Draft Ready
      </span>
    );
  }

  return (
    <span className={`${baseClass} bg-[#181818] text-slate-400 border border-[#2e2e2e] ${className}`}>
      <Circle className="w-3 h-3 text-slate-500" />
      {status.replace('_', ' ')}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* EVIDENCE PILL + CLAIM WITH ENTRANCE ANIMATION                              */
/* -------------------------------------------------------------------------- */
interface ClaimProps {
  text: string;
  supported: boolean;
  sourceId?: string | null;
  linkUrl?: string | null;
  description?: string | null;
  animateEntrance?: boolean;
}

export const Claim: React.FC<ClaimProps> = ({
  text,
  supported,
  sourceId,
  linkUrl,
  description,
  animateEntrance = true
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="inline relative">
      <span
        className={supported ? 'evidence-claim-verified font-medium text-white' : 'evidence-claim-flagged font-medium text-white'}
      >
        {text}
      </span>
      {' '}
      {supported ? (
        <button
          type="button"
          onClick={() => setShowPopover(!showPopover)}
          className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#d0f347]/15 text-[#d0f347] border border-[#d0f347]/30 font-bold hover:bg-[#d0f347]/25 transition-all align-middle cursor-pointer ${
            animateEntrance ? 'animate-pill-entrance' : ''
          }`}
        >
          {sourceId || 'ev_linked'}
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </button>
      ) : (
        <span
          className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#C98A2B]/15 text-[#fbbf24] border border-[#C98A2B]/30 font-bold align-middle ${
            animateEntrance ? 'animate-pill-entrance' : ''
          }`}
        >
          no source
        </span>
      )}

      {showPopover && supported && (
        <div className="absolute left-0 bottom-full mb-2 w-72 p-3.5 bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl shadow-2xl z-50 text-xs text-white animate-modal-card-enter">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2e2e2e]">
            <span className="font-mono font-bold text-[#d0f347] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Source Verification
            </span>
            <button onClick={() => setShowPopover(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300 mb-2">{description || 'Verified against accumulated daily draft logs & formal evidence submission.'}</p>
          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d0f347] hover:underline inline-flex items-center gap-1 font-mono text-[11px] break-all"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" /> {linkUrl}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SCORE GAUGE WITH MOUNT ANIMATION & PULSING THRESHOLD                       */
/* -------------------------------------------------------------------------- */
export const ScoreGauge: React.FC<{
  label: string;
  score: number;
  threshold: number;
  invertRisk?: boolean;
  subtext?: string;
}> = ({ label, score, threshold, invertRisk = false, subtext }) => {
  const [filledWidth, setFilledWidth] = useState(0);
  const percentage = Math.round(score * 100);
  const thresholdPct = Math.round(threshold * 100);
  const isFlagged = invertRisk ? score >= threshold : score < threshold;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilledWidth(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className={`font-mono font-extrabold ${isFlagged ? 'text-[#fb7185]' : 'text-[#d0f347]'}`}>
          {percentage}%
        </span>
      </div>

      <div className="relative w-full h-2.5 bg-[#181818] rounded-full overflow-hidden border border-[#2e2e2e]">
        <div
          className={`h-full transition-all duration-500 ease-verity ${isFlagged ? 'bg-[#fb7185]' : 'bg-[#d0f347]'}`}
          style={{ width: `${filledWidth}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 animate-pulse"
          style={{ left: `${thresholdPct}%` }}
          title={`Threshold: ${thresholdPct}%`}
        />
      </div>

      {subtext && <p className="text-[11px] font-mono text-slate-400">{subtext}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* AUDIT FLAG CARD                                                            */
/* -------------------------------------------------------------------------- */
export const AuditFlagCard: React.FC<{ flag: string }> = ({ flag }) => (
  <div className="p-3.5 bg-[#C98A2B]/10 border border-[#C98A2B]/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5 card-hover-lift">
    <AlertTriangle className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5 animate-pulse" />
    <span className="font-medium leading-relaxed">{flag}</span>
  </div>
);
