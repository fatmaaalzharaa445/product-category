"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  exclude?: string[];
}

export function NavLink({ href, children, exact = false, exclude = [] }: NavLinkProps) {
  const pathname = usePathname();
  const matches = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const active = matches && !exclude.some((path) => pathname.startsWith(path));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-muted hover:text-text"
      }`}
    >
      {children}
    </Link>
  );
}
