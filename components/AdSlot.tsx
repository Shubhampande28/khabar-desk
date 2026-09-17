// Placeholder ad slot. Renders nothing until NEXT_PUBLIC_ADS_ENABLED=true is
// set, so the site doesn't show empty "Advertisement space" boxes before
// AdSense is actually approved and wired up. Once approved:
//   1. Add your publisher ID to app/layout.tsx (see the TODO there).
//   2. Replace the contents of this div with an <ins class="adsbygoogle">
//      tag using the ad unit's slot ID from your AdSense dashboard.
//   3. Set NEXT_PUBLIC_ADS_ENABLED=true in your environment.

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export default function AdSlot({ label = "Advertisement" }: { label?: string }) {
  if (!ADS_ENABLED) return null;

  return (
    <div className="my-8 flex h-24 w-full items-center justify-center border border-dashed border-ink/25 text-xs uppercase tracking-wide text-ink/40 sm:h-28">
      {label} space
    </div>
  );
}
