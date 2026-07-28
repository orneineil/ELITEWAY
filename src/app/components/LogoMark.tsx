interface LogoMarkProps {
  size?: number;
  className?: string;
}

// EliteWay mark — a crown above a diamond lozenge, drawn in warm gold
export function LogoMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer diamond */}
      <path
        d="M40 6 L74 40 L40 74 L6 40 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.35"
      />
      {/* Inner diamond */}
      <path
        d="M40 18 L62 40 L40 62 L18 40 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Crown — 5 points */}
      <path
        d="M26 46 L26 36 L32 42 L40 30 L48 42 L54 36 L54 46 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* Crown base line */}
      <line x1="26" y1="48.5" x2="54" y2="48.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Three crown jewel dots */}
      <circle cx="32" cy="43.5" r="1.2" fill="currentColor" />
      <circle cx="40" cy="43.5" r="1.2" fill="currentColor" />
      <circle cx="48" cy="43.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Full lockup: mark + wordmark stacked
interface LogoFullProps {
  markSize?: number;
  className?: string;
}

export function LogoFull({ markSize = 44, className = "" }: LogoFullProps) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <LogoMark size={markSize} className="text-primary" />
      <span
        style={{
          fontFamily: "var(--font-heading)",
          letterSpacing: "0.32em",
          fontWeight: 400,
          fontSize: "0.75rem",
          lineHeight: 1,
        }}
        className="text-foreground uppercase tracking-[0.32em]"
      >
        EliteWay
      </span>
    </div>
  );
}

// Horizontal lockup: mark left + wordmark right
export function LogoHorizontal({ markSize = 28, className = "" }: LogoFullProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={markSize} className="text-primary" />
      <span
        style={{
          fontFamily: "var(--font-heading)",
          letterSpacing: "0.22em",
          fontWeight: 400,
          fontSize: "1.1rem",
          lineHeight: 1,
        }}
        className="text-foreground"
      >
        ELITEWAY
      </span>
    </div>
  );
}
