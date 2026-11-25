import type { Product, ProductInput } from "@/lib/types";
import { ApiError } from "./errors";
import { parseProduct, parseProductList } from "./parse";

const API_BASE = "https://dummyjson.com";
const LIST_FIELDS = ["title", "description", "category", "price", "rating", "stock", "brand", "thumbnail"];

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const message =
      response.status === 404 ? "Product not found." : `Request failed (${response.status} ${response.statusText}).`;
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<unknown>;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const params = new URLSearchParams({ limit: "0", select: LIST_FIELDS.join(",") });
  return parseProductList(await request(`/products?${params}`, { signal }));
}

export async function fetchProduct(id: number): Promise<Product | null> {
  try {
    return parseProduct(await request(`/products/${id}`));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return parseProduct(await request("/products/add", { method: "POST", body: JSON.stringify(input) }));
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product> {
  return parseProduct(await request(`/products/${id}`, { method: "PUT", body: JSON.stringify(input) }));
}

export async function deleteProduct(id: number): Promise<void> {
  await request(`/products/${id}`, { method: "DELETE" });
}
