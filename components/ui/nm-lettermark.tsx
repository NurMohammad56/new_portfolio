// Custom-drawn letterforms: a cut diagonal N and a matching angular M.
export function NmLettermark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 44" fill="currentColor" aria-hidden="true">
      <path d="M4 36V8H10L25 27V8H31V36H25L10 17V36Z" />
      <path d="M35 36V8H41L50 22L59 8H65V36H59V19L50 32L41 19V36Z" fillOpacity=".72" />
    </svg>
  );
}
