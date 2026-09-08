// Placeholder ad slot. Once your site is approved for Google AdSense:
//   1. Add your publisher ID to app/layout.tsx (see the TODO there).
//   2. Replace the contents of this div with an <ins class="adsbygoogle">
//      tag using the ad unit's slot ID from your AdSense dashboard.
// Until then this just reserves the space so your layout doesn't jump
// around later, and makes it obvious where ads will sit.

export default function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="my-8 flex h-24 w-full items-center justify-center border border-dashed border-ink/25 text-xs uppercase tracking-wide text-ink/40 sm:h-28">
      {label} space
    </div>
  );
}
