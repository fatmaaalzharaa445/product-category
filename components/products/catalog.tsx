"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogQuery } from "@/lib/types";
import { PAGE_SIZE, applyCatalogQuery, deriveCategories, parseCatalogQuery, toSearchString } from "@/lib/catalog/query";
import { useProducts } from "@/lib/catalog/use-products";
import { formatCategory } from "@/lib/format";
import { buttonStyles } from "@/components/ui/styles";
import { CatalogToolbar } from "./catalog-toolbar";
import { Pagination } from "./pagination";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./skeletons";
import { ErrorPanel, StatusPanel } from "./status-panels";

export function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams]);
  const state = useProducts();

  const products = state.status === "success" ? state.products : null;
  const categories = useMemo(() => (products ? deriveCategories(products) : []), [products]);
  const result = useMemo(() => (products ? applyCatalogQuery(products, query) : null), [products, query]);

  function navigate(patch: Partial<CatalogQuery>, options: { replace?: boolean } = {}) {
    const href = `${pathname}${toSearchString({ ...query, ...patch })}`;
    if (options.replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  }

  const hasFilters = Boolean(query.search || query.category);

  return (
    <div className="space-y-6">
      <CatalogToolbar query={query} categories={categories} onChange={navigate} />

      {state.status === "loading" && <ProductGridSkeleton />}

      {state.status === "error" && <ErrorPanel message={state.message} onRetry={state.retry} />}

      {result && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
            <p aria-live="polite">
              {result.total === 0
                ? "No products found"
                : `Showing ${(result.page - 1) * PAGE_SIZE + 1}–${Math.min(result.page * PAGE_SIZE, result.total)} of ${result.total} products`}
              {query.category && ` in ${formatCategory(query.category)}`}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => navigate({ search: "", category: "", page: 1 })}
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {result.total === 0 ? (
            <StatusPanel
              role="status"
              icon="📦"
              title={hasFilters ? "No products match your filters" : "The catalog is empty"}
              action={
                hasFilters && (
                  <button
                    type="button"
                    onClick={() => navigate({ search: "", category: "", page: 1 })}
                    className={buttonStyles.secondary}
                  >
                    Clear filters
                  </button>
                )
              }
            >
              {hasFilters ? "Try a different search term or category." : "Add a product to get started."}
            </StatusPanel>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {result.items.map((product, index) => (
                <li key={product.id} className="animate-fade-up">
                  <ProductCard product={product} priority={index < 4} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={(page) => `${pathname}${toSearchString({ ...query, page })}`}
          />
        </>
      )}
    </div>
  );
}
