import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Catalog } from "@/components/products/catalog";
import { CatalogSkeleton } from "@/components/products/skeletons";
import { buttonStyles } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Search, filter and sort the product catalog.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Catalog"
        description="Search, filter and sort products."
        actions={
          <Link href="/products/new" className={buttonStyles.primary}>
            <span aria-hidden="true">+</span> Add product
          </Link>
        }
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog />
      </Suspense>
    </>
  );
}
