import type { Metadata } from "next";
import Link from "next/link";
import { StatusPanel } from "@/components/products/status-panels";
import { buttonStyles } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="py-6">
      <StatusPanel
        icon="🧭"
        title="Page not found"
        action={
          <Link href="/products" className={buttonStyles.primary}>
            Go to catalog
          </Link>
        }
      >
        We couldn&apos;t find the page you were looking for.
      </StatusPanel>
    </div>
  );
}
