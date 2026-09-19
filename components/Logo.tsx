// Rounded-square icon (accent background) containing a white speech-bubble
// glyph with 3 dots — the dots get a continuous staggered bounce (see
// .logo-dot in globals.css), and the whole icon rotates/scales on hover via
// the parent's `group` class in Header.tsx. Colors are fixed brand colors
// regardless of light/dark mode, same as any other logo mark.
export default function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`logo-icon origin-center transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-[1.06] ${className}`}
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="22" fill="#ea580c" />
      <path
        d="M 26 24 H 74 A 10 10 0 0 1 84 34 V 58 A 10 10 0 0 1 74 68 H 42 L 30 82 A 2 2 0 0 1 27 80.5 L 28 68 H 26 A 10 10 0 0 1 16 58 V 34 A 10 10 0 0 1 26 24 Z"
        fill="#FFFFFF"
      />
      <circle className="logo-dot logo-dot-1" cx="35" cy="46" r="4.5" fill="#ea580c" />
      <circle className="logo-dot logo-dot-2" cx="50" cy="46" r="4.5" fill="#ea580c" />
      <circle className="logo-dot logo-dot-3" cx="65" cy="46" r="4.5" fill="#ea580c" />
    </svg>
  );
}
