import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EditProductView } from "@/components/products/edit-product-view";
import { FormSkeleton } from "@/components/products/skeletons";
import { loadProduct, loadProductTitle } from "../load-product";

export async function generateMetadata({ params }: PageProps<"/products/[id]/edit">): Promise<Metadata> {
  const { id } = await params;
  const title = await loadProductTitle(id);
  return { title: title ? `Edit ${title}` : "Edit product" };
}

export default function EditProductPage({ params }: PageProps<"/products/[id]/edit">) {
  return (
    <div className="mx-auto max-w-3xl">
      <Suspense fallback={<EditHeader href="/products" />}>
        {params.then(({ id }) => (
          <EditHeader href={`/products/${id}`} />
        ))}
      </Suspense>
      <Suspense fallback={<FormSkeleton />}>
        <EditContent params={params} />
      </Suspense>
    </div>
  );
}

function EditHeader({ href }: { href: string }) {
  return <PageHeader title="Edit product" description="Update the product's details." back={{ href, label: "Back to product" }} />;
}

async function EditContent({ params }: Pick<PageProps<"/products/[id]/edit">, "params">) {
  const { id, product } = await loadProduct((await params).id);
  return <EditProductView id={id} initialProduct={product} />;
}
