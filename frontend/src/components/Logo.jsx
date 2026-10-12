export const LogoMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M24 14C44 14 50 24 50 32S44 50 24 50" fill="none" stroke="currentColor" strokeWidth="3.5" />
    <path d="M24 5L27.5 16L24 57L20.5 16Z" fill="currentColor" />
    <path d="M15 18H33" stroke="currentColor" strokeWidth="3" />
    <circle cx="24" cy="60" r="2.4" fill="#C1272D" />
  </svg>
);

export const Logo = () => (
  <span className="flex items-center gap-3 text-[var(--bone)]">
    <LogoMark className="w-8 h-8" />
    <span className="leading-none">
      <span className="font-cond font-extrabold tracking-[0.18em] text-lg block">DARKEN</span>
      <span className="font-mono text-[10px] tracking-[0.35em] text-[var(--ash)] block mt-1">TATTOO STUDIO</span>
    </span>
  </span>
);
