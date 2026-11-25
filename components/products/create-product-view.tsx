"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { createProduct } from "@/lib/api/products";
import { deriveCategories } from "@/lib/catalog/query";
import { useProducts } from "@/lib/catalog/use-products";
import { EMPTY_FORM } from "@/lib/catalog/validation";
import { catalogActions, nextLocalId } from "@/lib/store/catalog-store";
import { showToast } from "@/lib/store/toast-store";
import type { ProductInput } from "@/lib/types";
import { ProductForm } from "./product-form";

export function CreateProductView() {
  const router = useRouter();
  const state = useProducts();
  const categories = useMemo(() => (state.status === "success" ? deriveCategories(state.products) : []), [state]);

  async function handleSubmit(input: ProductInput) {
    const created = await createProduct(input);
    const product = {
      ...created,
      ...input,
      id: nextLocalId(),
      brand: input.brand || undefined,
      images: input.thumbnail ? [input.thumbnail] : [],
    };
    catalogActions.add(product);
    showToast(`"${product.title}" was created.`);
    router.push(`/products/${product.id}`);
  }

  return (
    <ProductForm
      initialValues={EMPTY_FORM}
      categories={categories}
      submitLabel="Create product"
      pendingLabel="Creating…"
      cancelHref="/products"
      onSubmit={handleSubmit}
    />
  );
}
