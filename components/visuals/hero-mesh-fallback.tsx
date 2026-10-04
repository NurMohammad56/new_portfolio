import { flowFieldFallbackPaths } from "./flow-field-geometry";

export function HeroMeshFallback({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 780" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth=".65" opacity=".28">
        {flowFieldFallbackPaths.map((path, index) => <path key={index} d={path} />)}
      </g>
    </svg>
  );
}
