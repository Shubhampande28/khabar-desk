"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/sources";

function NavLink({
  href,
  label,
  active
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative whitespace-nowrap pb-1 transition-colors ${
        active ? "font-semibold text-ink" : "text-inkSoft hover:text-ink"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent transition-opacity ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto border-t border-line px-4 py-2.5 text-sm sm:px-6">
      <NavLink href="/" label="Home" active={pathname === "/"} />
      {categories.map((c) => (
        <NavLink
          key={c.slug}
          href={`/category/${c.slug}`}
          label={c.label}
          active={pathname.startsWith(`/category/${c.slug}`)}
        />
      ))}
    </nav>
  );
}
