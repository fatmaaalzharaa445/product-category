const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatCategory(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function toCategorySlug(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
