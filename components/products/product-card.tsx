import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCategory, formatPrice } from "@/lib/format";
import { StarRating } from "@/components/ui/star-rating";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-within:shadow-lg">
      <div className="relative aspect-square bg-surface-muted">
        <ProductImage
          src={product.thumbnail}
          alt=""
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{formatCategory(product.category)}</p>
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
          <Link href={`/products/${product.id}`} className="after:absolute after:inset-0 after:content-['']">
            {product.title}
          </Link>
        </h2>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-1">
          <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </article>
  );
}
