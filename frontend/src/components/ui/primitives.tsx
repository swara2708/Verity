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
/* LOGO (MONOCHROME BLUE STYLE)                                               */
/* -------------------------------------------------------------------------- */
export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-black shadow-md">
      <Hexagon className="w-5 h-5 fill-[#C1E8FF]" />
    </div>
    <span className="font-sora font-extrabold text-xl tracking-tight text-[#021024] uppercase">
      Verity
    </span>
  </div>
);

export const LogoDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#052659] text-[#C1E8FF] flex items-center justify-center font-black shadow-md">
      <Hexagon className="w-5 h-5 fill-[#C1E8FF]" />
    </div>
    <span className="font-sora font-extrabold text-xl tracking-tight text-white uppercase">
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
    'inline-flex items-center justify-center font-sora font-extrabold button-hover-lift focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all';

  const variants = {
    primary: 'bg-[#052659] hover:bg-[#021024] text-[#C1E8FF] shadow-md',
    white: 'bg-white hover:bg-[#EAF3FB] text-[#021024] border border-[#7DA0CA] shadow-sm',
    dark: 'bg-[#021024] hover:bg-black text-[#C1E8FF] border border-[#052659]',
    outline: 'bg-transparent text-[#052659] border border-[#7DA0CA] hover:bg-[#EAF3FB]',
    danger: 'bg-transparent text-[#052659] border border-[#5483B3] hover:bg-[#5483B3]/10',
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
    className={`bg-white border border-[#7DA0CA] rounded-2xl p-6 text-[#021024] ${
      hoverLift ? 'card-hover-lift' : ''
    } ${className}`}
  >
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */
export type StatusType =
  | 'not_started'
  | 'drafting'
  | 'draft'
  | 'flagged'
  | 'pending'
  | 'needs_input'
  | 'approved'
  | 'rejected'
  | 'verified';

export const StatusBadge: React.FC<{ status: StatusType | string; className?: string }> = ({
  status,
  className = '',
}) => {
  const norm = status.toLowerCase();
  const baseClass = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code font-bold';

  if (norm === 'approved' || norm === 'verified') {
    return (
      <span className={`${baseClass} bg-[#052659]/10 text-[#052659] border border-[#052659]/30 ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-[#052659] fill-[#052659]" />
        {norm === 'verified' ? 'Verified' : 'Approved'}
      </span>
    );
  }

  if (norm === 'flagged') {
    return (
      <span className={`${baseClass} bg-[#5483B3]/15 text-[#052659] border border-[#5483B3]/30 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-[#052659]" />
        Flagged &bull; unverified
      </span>
    );
  }

  if (norm === 'pending' || norm === 'needs_input') {
    return (
      <span className={`${baseClass} bg-[#5483B3]/15 text-[#052659] border border-[#5483B3]/30 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-[#052659]" />
        {norm === 'needs_input' ? 'Needs Input · unverified' : 'Pending Approval'}
      </span>
    );
  }

  if (norm === 'rejected') {
    return (
      <span className={`${baseClass} bg-[#5483B3]/20 text-[#052659] border border-[#5483B3]/40 ${className}`}>
        <X className="w-3.5 h-3.5 text-[#052659]" />
        Rejected &bull; unverified
      </span>
    );
  }

  if (norm === 'drafting' || norm === 'draft') {
    return (
      <span className={`${baseClass} bg-[#052659]/10 text-[#052659] border border-[#052659]/30 ${className}`}>
        <FileEdit className="w-3.5 h-3.5 text-[#052659]" />
        Draft Ready
      </span>
    );
  }

  return (
    <span className={`${baseClass} bg-[#EAF3FB] text-[#5483B3] border border-[#7DA0CA] ${className}`}>
      <Circle className="w-3 h-3 text-[#5483B3]" />
      {status.replace('_', ' ')}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* EVIDENCE PILL + CLAIM WITH SOLID VS DASHED VERIFICATION                   */
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
        className={supported ? 'evidence-claim-verified' : 'evidence-claim-flagged'}
      >
        {text}
      </span>
      {' '}
      {supported ? (
        <button
          type="button"
          onClick={() => setShowPopover(!showPopover)}
          className="inline-flex items-center gap-1 font-mono-code text-[11px] px-2.5 py-0.5 rounded-full bg-[#052659]/10 text-[#052659] border border-[#052659]/30 font-bold hover:bg-[#052659]/20 transition-all align-middle cursor-pointer"
        >
          <CheckCircle2 className="w-3 h-3 fill-[#052659] text-white" />
          {sourceId || 'ev_linked'}
          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
        </button>
      ) : (
        <span
          className="inline-flex items-center gap-1 font-mono-code text-[11px] px-2.5 py-0.5 rounded-full bg-[#5483B3]/15 text-[#052659] border border-[#5483B3]/30 font-bold align-middle"
        >
          <AlertTriangle className="w-3 h-3 text-[#5483B3]" />
          no source &bull; unverified
        </span>
      )}

      {showPopover && supported && (
        <div className="absolute left-0 bottom-full mb-2 w-72 p-3.5 bg-white border border-[#7DA0CA] rounded-xl shadow-2xl z-50 text-xs text-[#021024]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#7DA0CA]/50">
            <span className="font-mono-code font-bold text-[#052659] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#052659]" /> Source Verification
            </span>
            <button onClick={() => setShowPopover(false)} className="text-[#5483B3] hover:text-[#021024]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[#5483B3] mb-2">{description || 'Verified against accumulated daily draft logs & formal evidence submission.'}</p>
          {linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#052659] font-bold hover:underline inline-flex items-center gap-1 font-mono-code text-[11px] break-all"
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
/* SCORE GAUGE WITH DIAGONAL STRIPE FILL PATTERN FOR RISK OVER THRESHOLD     */
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
        <span className="font-semibold text-[#021024]">{label}</span>
        <span className={`font-mono-code font-extrabold ${isFlagged ? 'text-[#052659]' : 'text-[#052659]'}`}>
          {percentage}% {isFlagged ? '(Flagged)' : ''}
        </span>
      </div>

      <div className="relative w-full h-3 bg-[#EAF3FB] rounded-full overflow-hidden border border-[#7DA0CA]">
        <div
          className={`h-full transition-all duration-500 ${isFlagged ? 'bias-gauge-striped bg-[#052659]' : 'bg-[#052659]'}`}
          style={{ width: `${filledWidth}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#021024] z-10"
          style={{ left: `${thresholdPct}%` }}
          title={`Threshold: ${thresholdPct}%`}
        />
      </div>

      {subtext && <p className="text-[11px] font-mono-code text-[#5483B3]">{subtext}</p>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* AUDIT FLAG CARD                                                            */
/* -------------------------------------------------------------------------- */
export const AuditFlagCard: React.FC<{ flag: string }> = ({ flag }) => (
  <div className="p-3.5 bg-[#5483B3]/15 border border-dashed border-[#5483B3] rounded-xl text-[#021024] text-xs flex items-start gap-2.5">
    <AlertTriangle className="w-4 h-4 text-[#052659] flex-shrink-0 mt-0.5" />
    <span className="font-medium leading-relaxed">{flag} &bull; unverified</span>
  </div>
);
