import type { CatalogQuery, Paginated, Product, SortOption } from "@/lib/types";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "title-asc", label: "Name: A–Z" },
];

function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

interface SearchParamsLike {
  get(name: string): string | null;
}

export function parseCatalogQuery(params: SearchParamsLike): CatalogQuery {
  const sort = params.get("sort");
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    search: params.get("q")?.trim() ?? "",
    category: params.get("category") ?? "",
    sort: isSortOption(sort) ? sort : "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function toSearchString(query: CatalogQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("q", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort !== "featured") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  const value = params.toString();
  return value ? `?${value}` : "";
}

export function deriveCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b));
}

const comparators: Record<Exclude<SortOption, "featured">, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "rating-asc": (a, b) => a.rating - b.rating,
  "title-asc": (a, b) => a.title.localeCompare(b.title),
};

export function applyCatalogQuery(products: Product[], query: CatalogQuery): Paginated<Product> {
  const needle = query.search.toLowerCase();
  let result = products.filter(
    (p) => (!needle || p.title.toLowerCase().includes(needle)) && (!query.category || p.category === query.category),
  );
  if (query.sort !== "featured") result = [...result].sort(comparators[query.sort]);

  const pageCount = Math.max(1, Math.ceil(result.length / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  return { items: result.slice(start, start + PAGE_SIZE), page, pageCount, total: result.length };
}
