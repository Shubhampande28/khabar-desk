"use client";

import { trackOutboundClick } from "@/lib/analytics";

export default function OutboundLink({
  href,
  sourceName,
  category,
  articleSlug,
  className,
  children
}: {
  href: string;
  sourceName: string;
  category: string;
  articleSlug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackOutboundClick({ sourceName, category, articleSlug })}
    >
      {children}
    </a>
  );
}
