// Next's built-in image optimizer fetches images server-side (from our own
// VPS), instead of the visitor's browser fetching them directly the way
// `unoptimized` mode does. Some CDNs block requests from datacenter/VPS IP
// ranges regardless of headers — every ndtvimg.com subdomain does
// (confirmed: both c.ndtvimg.com and i.ndtvimg.com 403 a direct curl from
// this server) — so those hosts need to keep using the old unoptimized/
// browser-fetches-directly path while everyone else gets the responsive-
// image benefit.
const OPTIMIZER_BLOCKED_HOST_SUFFIXES = [".ndtvimg.com"];

export function shouldSkipOptimization(url: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return OPTIMIZER_BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
  } catch {
    return false;
  }
}
