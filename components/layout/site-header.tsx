import Link from "next/link";
import { Suspense } from "react";
import { NavLink } from "./nav-link";

const links = [
  { href: "/products", label: "Catalog", exclude: ["/products/new"] },
  { href: "/products/new", label: "Add product", exclude: [] },
];

function StaticNav() {
  return (
    <>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-muted hover:text-text"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/products" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-on-accent"
          >
            P
          </span>
          <span className="sr-only whitespace-nowrap min-[420px]:not-sr-only">Product Catalog</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            <Suspense fallback={<StaticNav />}>
              {links.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} exclude={link.exclude}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </Suspense>
          </ul>
        </nav>
      </div>
    </header>
  );
}
