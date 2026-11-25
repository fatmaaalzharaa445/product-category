import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CreateProductView } from "@/components/products/create-product-view";

export const metadata: Metadata = {
  title: "Add product",
};

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Add product"
        description="Create a new product in the catalog."
        back={{ href: "/products", label: "Back to catalog" }}
      />
      <CreateProductView />
    </div>
  );
}
