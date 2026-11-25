"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { updateProduct } from "@/lib/api/products";
import { deriveCategories } from "@/lib/catalog/query";
import { useProducts } from "@/lib/catalog/use-products";
import { toFormValues } from "@/lib/catalog/validation";
import { catalogActions, isLocalId, mergeInput, resolveProduct, useCatalogOverlay } from "@/lib/store/catalog-store";
import { showToast } from "@/lib/store/toast-store";
import type { Product, ProductInput } from "@/lib/types";
import { ProductForm } from "./product-form";
import { FormSkeleton } from "./skeletons";
import { ProductNotFound } from "./status-panels";

interface EditProductViewProps {
  id: number;
  initialProduct: Product | null;
}

export function EditProductView({ id, initialProduct }: EditProductViewProps) {
  const router = useRouter();
  const overlay = useCatalogOverlay();
  const state = useProducts();
  const categories = useMemo(() => (state.status === "success" ? deriveCategories(state.products) : []), [state]);

  if (!overlay.ready) return <FormSkeleton />;

  const product = resolveProduct(id, initialProduct, overlay);
  if (!product) return <ProductNotFound />;
  const current = product;
  const initialValues = toFormValues({ ...current, brand: current.brand ?? "" });

  async function handleSubmit(input: ProductInput) {
    if (!isLocalId(current.id)) await updateProduct(current.id, input);
    catalogActions.update(mergeInput(current, input));
    showToast(`"${input.title}" was updated.`);
    router.push(`/products/${current.id}`);
  }

  return (
    <ProductForm
      key={JSON.stringify(initialValues)}
      initialValues={initialValues}
      categories={categories}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      cancelHref={`/products/${current.id}`}
      onSubmit={handleSubmit}
    />
  );
}
