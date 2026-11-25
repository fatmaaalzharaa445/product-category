import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/products.server";
import { isLocalId, parseProductId } from "@/lib/catalog/ids";

export async function loadProduct(rawId: string) {
  const id = parseProductId(rawId);
  if (id === null) notFound();
  if (isLocalId(id)) return { id, product: null };

  const product = await getProduct(id);
  if (!product) notFound();
  return { id, product };
}

export async function loadProductTitle(rawId: string): Promise<string | null> {
  const id = parseProductId(rawId);
  if (id === null || isLocalId(id)) return null;
  try {
    return (await getProduct(id))?.title ?? null;
  } catch {
    return null;
  }
}
