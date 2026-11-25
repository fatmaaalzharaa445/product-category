import type { Product } from "@/lib/types";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(obj: JsonObject, key: string): string | undefined {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
}

function num(obj: JsonObject, key: string): number | undefined {
  const value = obj[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function strArray(obj: JsonObject, key: string): string[] | undefined {
  const value = obj[key];
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : undefined;
}

export function parseProduct(value: unknown): Product {
  if (!isObject(value)) throw new Error("Invalid product payload");
  const id = num(value, "id");
  const title = str(value, "title");
  if (id === undefined || title === undefined) throw new Error("Product payload is missing id or title");

  const thumbnail = str(value, "thumbnail") ?? "";
  return {
    id,
    title,
    description: str(value, "description") ?? "",
    category: str(value, "category") ?? "uncategorized",
    price: num(value, "price") ?? 0,
    rating: num(value, "rating") ?? 0,
    stock: num(value, "stock") ?? 0,
    brand: str(value, "brand"),
    thumbnail,
    images: strArray(value, "images") ?? (thumbnail ? [thumbnail] : []),
    discountPercentage: num(value, "discountPercentage"),
    tags: strArray(value, "tags"),
    sku: str(value, "sku"),
    warrantyInformation: str(value, "warrantyInformation"),
    shippingInformation: str(value, "shippingInformation"),
    availabilityStatus: str(value, "availabilityStatus"),
    returnPolicy: str(value, "returnPolicy"),
  };
}

export function parseProductList(value: unknown): Product[] {
  if (!isObject(value) || !Array.isArray(value.products)) {
    throw new Error("Invalid product list payload");
  }
  return value.products.map(parseProduct);
}
