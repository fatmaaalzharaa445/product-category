export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  discountPercentage?: number;
  tags?: string[];
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
}

export interface ProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "title-asc";

export interface CatalogQuery {
  search: string;
  category: string;
  sort: SortOption;
  page: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}
