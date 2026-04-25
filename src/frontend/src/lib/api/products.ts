import type { FakestoreProduct, Product } from "../../types";
import { apiGet } from "./client";

const DISCOUNT_SEEDS = [
  0, 10, 15, 20, 25, 30, 0, 40, 0, 10, 20, 0, 35, 15, 0, 10, 30, 20, 0, 25,
];

function extractBrand(title: string): string {
  return title.split(" ")[0];
}

function mapProduct(p: FakestoreProduct, index = 0): Product {
  const discount = DISCOUNT_SEEDS[index % DISCOUNT_SEEDS.length];
  const originalPrice =
    discount > 0
      ? Number.parseFloat((p.price / (1 - discount / 100)).toFixed(2))
      : undefined;

  return {
    id: p.id,
    title: p.title,
    slug: String(p.id),
    price: p.price,
    originalPrice,
    description: p.description,
    category: p.category,
    image: p.image,
    images: [p.image],
    rating: p.rating,
    stock: 100,
    brand: extractBrand(p.title),
    tags: [p.category],
    isFeatured: index < 8,
    isNew: index % 5 === 0,
    discount: discount > 0 ? discount : undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const items = await apiGet<FakestoreProduct[]>("/products");
  return items.map((p, i) => mapProduct(p, i));
}

export async function getProductById(id: number | string): Promise<Product> {
  const item = await apiGet<FakestoreProduct>(`/products/${id}`);
  return mapProduct(item);
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const items = await apiGet<FakestoreProduct[]>(
    `/products/category/${encodeURIComponent(category)}`,
  );
  return items.map((p, i) => mapProduct(p, i));
}

export async function getCategories(): Promise<string[]> {
  return apiGet<string[]>("/products/categories");
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getProducts();
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}
