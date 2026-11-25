import Link from "next/link";

interface PaginationProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}

function visiblePages(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

const itemBase = "grid h-10 min-w-10 place-items-center rounded-lg px-3 text-sm font-medium transition-colors";

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount <= 1) return null;

  const edge = (target: number, label: string, text: string, disabled: boolean) =>
    disabled ? (
      <span className={`${itemBase} cursor-not-allowed text-muted opacity-50`} aria-disabled="true">
        {text}
      </span>
    ) : (
      <Link href={hrefFor(target)} aria-label={label} className={`${itemBase} text-text hover:bg-surface-muted`}>
        {text}
      </Link>
    );

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex flex-wrap items-center gap-1">
        <li>{edge(page - 1, "Previous page", "‹ Prev", page === 1)}</li>
        {visiblePages(page, pageCount).map((item, i) =>
          item === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item} className="hidden sm:block">
              <Link
                href={hrefFor(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${itemBase} ${
                  item === page ? "bg-accent text-on-accent" : "text-text hover:bg-surface-muted"
                }`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
        <li className="px-2 text-sm text-muted sm:hidden">
          Page {page} of {pageCount}
        </li>
        <li>{edge(page + 1, "Next page", "Next ›", page === pageCount)}</li>
      </ul>
    </nav>
  );
}
