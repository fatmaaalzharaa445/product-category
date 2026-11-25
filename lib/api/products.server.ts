import { cacheLife, cacheTag } from "next/cache";
import { fetchProduct } from "./products";

export async function getProduct(id: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(`product-${id}`);
  return fetchProduct(id);
}
