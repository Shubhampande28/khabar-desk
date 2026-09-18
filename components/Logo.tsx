// Speech-bubble mark: three "headline lines" inside a bubble, a small
// accent dot standing in for "breaking/new". Colors are fixed brand
// colors (orange bubble, navy accent ring) regardless of light/dark mode,
// same as any other logo mark.
export default function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M 30 20 H 170 A 20 20 0 0 1 190 40 V 130 A 20 20 0 0 1 170 150 H 78 L 46 182 A 4 4 0 0 1 40 179 L 42 150 H 30 A 20 20 0 0 1 10 130 V 40 A 20 20 0 0 1 30 20 Z"
        fill="#F2622A"
      />
      <rect x="38" y="58" width="124" height="14" rx="7" fill="#FFFFFF" />
      <rect x="38" y="86" width="90" height="14" rx="7" fill="#FFFFFF" opacity="0.9" />
      <rect x="38" y="114" width="64" height="14" rx="7" fill="#FFFFFF" opacity="0.7" />
      <circle cx="172" cy="28" r="13" fill="#0F172A" />
      <circle cx="172" cy="28" r="6" fill="#FFFFFF" />
    </svg>
  );
}
