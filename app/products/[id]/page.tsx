import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ProductDetails } from "@/components/products/product-details";
import { ProductDetailsSkeleton } from "@/components/products/skeletons";
import { loadProduct, loadProductTitle } from "./load-product";

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const title = await loadProductTitle(id);
  return { title: title ?? "Product details" };
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <>
      <PageHeader back={{ href: "/products", label: "Back to catalog" }} />
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[id]">, "params">) {
  const { id, product } = await loadProduct((await params).id);
  return <ProductDetails id={id} initialProduct={product} />;
}
