import type { ProductInput } from "@/lib/types";
import { toCategorySlug } from "@/lib/format";

export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  rating: string;
  stock: string;
  brand: string;
  thumbnail: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export type ValidationResult = { ok: true; data: ProductInput } | { ok: false; errors: ProductFormErrors };

export const EMPTY_FORM: ProductFormValues = {
  title: "",
  description: "",
  category: "",
  price: "",
  rating: "",
  stock: "",
  brand: "",
  thumbnail: "",
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateProduct(values: ProductFormValues): ValidationResult {
  const errors: ProductFormErrors = {};
  const title = values.title.trim();
  const category = toCategorySlug(values.category);
  const price = Number(values.price);
  const rating = values.rating.trim() === "" ? 0 : Number(values.rating);
  const stock = values.stock.trim() === "" ? 0 : Number(values.stock);
  const thumbnail = values.thumbnail.trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length > 120) errors.title = "Title must be 120 characters or fewer.";

  if (!category) errors.category = "Category is required.";

  if (values.price.trim() === "") errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be a positive number.";

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) errors.rating = "Rating must be between 0 and 5.";

  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more.";

  if (values.description.length > 1000) errors.description = "Description must be 1000 characters or fewer.";

  if (thumbnail && !isHttpUrl(thumbnail)) errors.thumbnail = "Enter a valid http(s) image URL.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      title,
      description: values.description.trim(),
      category,
      price: Math.round(price * 100) / 100,
      rating,
      stock,
      brand: values.brand.trim(),
      thumbnail,
    },
  };
}

export function toFormValues(input: Partial<ProductInput>): ProductFormValues {
  return {
    title: input.title ?? "",
    description: input.description ?? "",
    category: input.category ?? "",
    price: input.price !== undefined ? String(input.price) : "",
    rating: input.rating !== undefined ? String(input.rating) : "",
    stock: input.stock !== undefined ? String(input.stock) : "",
    brand: input.brand ?? "",
    thumbnail: input.thumbnail ?? "",
  };
}
