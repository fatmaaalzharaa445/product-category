"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDocumentTitle } from "@/lib/use-document-title";
import type { Product } from "@/lib/types";
import { catalogActions, resolveProduct, useCatalogOverlay } from "@/lib/store/catalog-store";
import { showToast } from "@/lib/store/toast-store";
import { formatCategory, formatPrice } from "@/lib/format";
import { StarRating } from "@/components/ui/star-rating";
import { buttonStyles } from "@/components/ui/styles";
import { DeleteProductButton } from "./delete-product-button";
import { ImageGallery } from "./image-gallery";
import { ProductDetailsSkeleton } from "./skeletons";
import { ProductNotFound } from "./status-panels";

interface ProductDetailsProps {
  id: number;
  initialProduct: Product | null;
}

export function ProductDetails({ id, initialProduct }: ProductDetailsProps) {
  const router = useRouter();
  const overlay = useCatalogOverlay();
  const [removed, setRemoved] = useState<Product | null>(null);

  const product = removed ?? resolveProduct(id, initialProduct, overlay);
  useDocumentTitle(product ? `${product.title} · Product Catalog` : null);

  if (!product) {
    return overlay.ready ? <ProductNotFound /> : <ProductDetailsSkeleton />;
  }

  function handleDeleted() {
    if (!product) return;
    setRemoved(product);
    catalogActions.remove(product.id);
    showToast(`"${product.title}" was deleted.`);
    router.push("/products");
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const originalPrice =
    product.discountPercentage && product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;
  const facts = [
    ["Brand", product.brand],
    ["SKU", product.sku],
    ["Warranty", product.warrantyInformation],
    ["Shipping", product.shippingInformation],
    ["Returns", product.returnPolicy],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <article className="animate-fade-up grid gap-8 md:grid-cols-2 md:gap-12">
      <ImageGallery images={images} title={product.title} />

      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent hover:underline"
          >
            {formatCategory(product.category)}
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.title}</h1>
          <StarRating rating={product.rating} />
        </div>

        <div className="flex flex-wrap items-baseline gap-3">
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          {originalPrice && (
            <>
              <p className="text-muted line-through">
                <span className="sr-only">Original price: </span>
                {formatPrice(originalPrice)}
              </p>
              <p className="rounded-md bg-success-soft px-2 py-0.5 text-sm font-medium text-success">
                {Math.round(product.discountPercentage ?? 0)}% off
              </p>
            </>
          )}
        </div>

        <p className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
          {product.availabilityStatus ?? (product.stock > 0 ? "In stock" : "Out of stock")}
          {product.stock > 0 && <span className="text-muted"> · {product.stock} available</span>}
        </p>

        {product.description && <p className="leading-relaxed text-muted">{product.description}</p>}

        {facts.length > 0 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-border bg-surface p-5 text-sm">
            {facts.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-muted">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {product.tags && product.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {product.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 flex flex-wrap gap-3 border-t border-border pt-5">
          <Link href={`/products/${product.id}/edit`} className={buttonStyles.primary}>
            <span aria-hidden="true">✎</span> Edit product
          </Link>
          <DeleteProductButton product={product} onDeleted={handleDeleted} />
        </div>
      </div>
    </article>
  );
}
