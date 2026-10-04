type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect className="brand-logo-frame" x="1" y="1" width="46" height="46" />
      <path
        className="brand-logo-route"
        d="M10 12h18c6 0 10 3.2 10 8.3S34 29 28 29H19c-5.5 0-9 2.7-9 7"
      />
      <path className="brand-logo-terminal" d="M10 36h28" />
      <circle className="brand-logo-node brand-logo-node--start" cx="10" cy="12" r="2.4" />
      <circle className="brand-logo-node brand-logo-node--live" cx="38" cy="36" r="2.4" />
      <path className="brand-logo-corner" d="M6 16V6h10M32 42h10V32" />
    </svg>
  );
}
