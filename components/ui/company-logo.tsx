import type { SVGProps } from "react";

export type CompanyLogoId = "backend" | "arabian" | "scaleup" | "coderstrust" | "fiverr" | "lskit";

interface CompanyLogoProps extends SVGProps<SVGSVGElement> {
  id: CompanyLogoId;
  size?: number;
  className?: string;
  variant?: "icon" | "full";
}

/**
 * Scaleup IT LTD Official Vector Brand Mark
 * Exact colors & geometry from official brand asset:
 * - Golden-yellow sun/head (#F9B217)
 * - Emerald-green rising swoosh (#00A859)
 * - SCALE (Dark Navy #0B132A / White #FFFFFF in dark mode), U (#F9B217), P (#0B132A / #FFFFFF) with green top accent (#00A859)
 */
export function ScaleupLogo({
  size = 24,
  className = "",
  variant = "icon",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; variant?: "icon" | "full" }) {
  if (variant === "full") {
    const height = size;
    const width = (size * 180) / 44;
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        {/* Scaleup Icon */}
        <circle cx="16" cy="11.5" r="7" fill="#F9B217" />
        <path
          d="M6 35C4.5 24 9 13.5 15.5 10C11.5 15.5 12 25 18 35C14 36 9 36 6 35Z"
          fill="#00A859"
        />
        {/* SCALE in White/Light Text */}
        <text
          x="38"
          y="29"
          fill="currentColor"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.01em"
        >
          SCALE
        </text>
        {/* U in Golden Yellow */}
        <text
          x="126"
          y="29"
          fill="#F9B217"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.01em"
        >
          U
        </text>
        {/* P in Current Color with Green Accent */}
        <text
          x="147"
          y="29"
          fill="currentColor"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.01em"
        >
          P
        </text>
        <path d="M161 10.5L168 10.5L161 17.5Z" fill="#00A859" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" rx="7" fill="#0B132A" stroke="rgba(var(--signal-rgb), 0.35)" strokeWidth="1.2" />
      {/* Official Golden Yellow Sun */}
      <circle cx="16.5" cy="10.5" r="5.2" fill="#F9B217" />
      {/* Official Green Rising Figure/Leaf */}
      <path
        d="M8.5 25.5C7.2 17 11 9.5 15.8 7C12.5 11 13 18.5 18 25.5C14.5 26.2 10.5 26.2 8.5 25.5Z"
        fill="#00A859"
      />
    </svg>
  );
}

/**
 * CodersTrust Official Brand Mark
 * Exact brand colors & typography from reference asset:
 * - Royal Blue background (#1A56DB)
 * - Bold white "CodersTrust" wordmark
 */
export function CodersTrustLogo({
  size = 24,
  className = "",
  variant = "icon",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; variant?: "icon" | "full" }) {
  if (variant === "full") {
    const height = size;
    const width = (size * 160) / 40;
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 160 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <rect width="160" height="40" rx="6" fill="#1A56DB" />
        <text
          x="80"
          y="26.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="var(--font-geist-sans), Arial, sans-serif"
          fontWeight="900"
          fontSize="18.5"
          letterSpacing="-0.02em"
        >
          CodersTrust
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" rx="7" fill="#1A56DB" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.2" />
      {/* CT Monogram with authentic bold slab typography */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontWeight="900"
        fontSize="12.5"
        letterSpacing="-0.04em"
      >
        CT
      </text>
    </svg>
  );
}

/**
 * Fiverr Official Brand Mark
 * Iconic green rounded badge with white "fi." wordmark
 */
export function FiverrLogo({
  size = 24,
  className = "",
  variant = "icon",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; variant?: "icon" | "full" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="32" height="32" rx="7" fill="#0A1D13" stroke="rgba(29, 191, 115, 0.45)" strokeWidth="1.2" />
      {/* Fiverr 'fi' glyph */}
      <path
        d="M13.5 10.5C12.4 10.5 11.5 11.4 11.5 12.5V14H9.5V16.5H11.5V23H14.5V16.5H17.5V14H14.5V12.8C14.5 12.4 14.8 12.2 15.2 12.2H17.5V9.8C16.8 9.6 15.2 9.5 13.5 10.5Z"
        fill="#FFFFFF"
      />
      {/* 'i' stem */}
      <rect x="18.5" y="14" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      {/* Signature Fiverr Green Dot */}
      <circle cx="20" cy="11" r="1.6" fill="#1DBF73" />
      {/* Period at end */}
      <circle cx="23.8" cy="22" r="1.3" fill="#1DBF73" />
    </svg>
  );
}

export function CompanyLogo({
  id,
  size = 24,
  className = "",
  variant = "icon",
  ...props
}: CompanyLogoProps) {
  switch (id) {
    case "lskit":
      return (
        <svg width={size * 2.08} height={size} viewBox="0 0 208 100" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true" {...props}>
          <image href="/companies/lskit.svg" width="208" height="100" preserveAspectRatio="xMidYMid meet" />
        </svg>
      );
    case "arabian":
      return (
        <svg width={size} height={size} viewBox="0 0 160 155" className={className} aria-hidden="true" {...props}>
          <image href="/companies/arabian-services.svg" width="160" height="155" />
        </svg>
      );
    case "backend":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" {...props}>
          <rect x="1" y="1" width="30" height="30" rx="7" fill="#111811" stroke="rgba(var(--signal-rgb), 0.45)" strokeWidth="1.2" />
          <path d="M9 10h14v5H9zM9 17h14v5H9z" fill="var(--signal)" />
          <path d="M12 12.5h2M18 12.5h2M12 19.5h2M18 19.5h2" stroke="#111811" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "scaleup":
      return <ScaleupLogo size={size} className={className} variant={variant} {...props} />;
    case "coderstrust":
      return <CodersTrustLogo size={size} className={className} variant={variant} {...props} />;
    case "fiverr":
      return <FiverrLogo size={size} className={className} variant={variant} {...props} />;
    default:
      return null;
  }
}
