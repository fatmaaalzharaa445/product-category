"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogQuery, SortOption } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/catalog/query";
import { formatCategory } from "@/lib/format";
import { fieldStyles } from "@/components/ui/styles";

interface CatalogToolbarProps {
  query: CatalogQuery;
  categories: string[];
  onChange: (patch: Partial<CatalogQuery>, options?: { replace?: boolean }) => void;
}

const SEARCH_DEBOUNCE_MS = 300;

export function CatalogToolbar({ query, categories, onChange }: CatalogToolbarProps) {
  const [searchText, setSearchText] = useState(query.search);
  const [syncedSearch, setSyncedSearch] = useState(query.search);
  const timer = useRef<number | undefined>(undefined);

  if (query.search !== syncedSearch) {
    setSyncedSearch(query.search);
    if (searchText.trim() !== query.search) setSearchText(query.search);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleSearch(value: string) {
    setSearchText(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      onChange({ search: value.trim(), page: 1 }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        window.clearTimeout(timer.current);
        onChange({ search: searchText.trim(), page: 1 });
      }}
      className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
    >
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">
          Search products by title
        </label>
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          id="catalog-search"
          type="search"
          value={searchText}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search by title…"
          autoComplete="off"
          className={`${fieldStyles} pl-9`}
        />
      </div>

      <div>
        <label htmlFor="catalog-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="catalog-category"
          value={query.category}
          onChange={(event) => onChange({ category: event.target.value, page: 1 })}
          className={`${fieldStyles} sm:w-48`}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {formatCategory(category)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="catalog-sort"
          value={query.sort}
          onChange={(event) => onChange({ sort: event.target.value as SortOption, page: 1 })}
          className={`${fieldStyles} sm:w-52`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
