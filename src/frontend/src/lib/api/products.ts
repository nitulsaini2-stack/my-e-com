import type { Product } from "../../types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mockData";

const DISCOUNT_SEEDS = [
  0, 10, 15, 20, 25, 30, 0, 40, 0, 10, 20, 0, 35, 15, 0, 10, 30, 20, 0, 25,
];

function extractBrand(title: string): string {
  return title.split(" ")[0];
}

function mapProduct(
  p: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number };
  },
  index = 0,
): Product {
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
    stock: 10 + ((p.id * 17) % 90), // deterministic 10-100
    brand: extractBrand(p.title),
    tags: [p.category],
    isFeatured: index < 8,
    isNew: index % 5 === 0,
    discount: discount > 0 ? discount : undefined,
  };
}

/**
 * Normalise a URL slug (or raw category string) to the canonical category.
 * Handles:
 *   "electronics"       → "electronics"
 *   "jewelery"          → "jewelery"
 *   "mens-clothing"     → "men's clothing"
 *   "men's-clothing"    → "men's clothing"
 *   "mens clothing"     → "men's clothing"
 *   "womens-clothing"   → "women's clothing"
 *   "women's-clothing"  → "women's clothing"
 *   "women's clothing"  → "women's clothing"
 */
export function slugToCategory(slug: string): string {
  if (!slug) return "";

  // Direct match (handles "electronics", "jewelery", "men's clothing", "women's clothing")
  if (MOCK_CATEGORIES.includes(slug)) return slug;

  const lower = slug.toLowerCase();

  // Direct lowercase match
  const direct = MOCK_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (direct) return direct;

  // Replace hyphens with spaces then check
  const spaced = lower.replace(/-/g, " ");
  const spacedMatch = MOCK_CATEGORIES.find((c) => c.toLowerCase() === spaced);
  if (spacedMatch) return spacedMatch;

  // Handle "mens clothing" → "men's clothing" and "womens clothing" → "women's clothing"
  // by inserting apostrophe before trailing "s" of words before a space
  const withApostrophe = spaced.replace(/\b(\w+)s\b(?=\s)/g, (match, stem) => {
    const candidate = `${stem}'s`;
    const full = spaced.replace(match, candidate);
    return MOCK_CATEGORIES.some((c) => c.toLowerCase() === full)
      ? candidate
      : match;
  });

  const apostropheMatch = MOCK_CATEGORIES.find(
    (c) => c.toLowerCase() === withApostrophe,
  );
  if (apostropheMatch) return apostropheMatch;

  // Exhaustive explicit map as final fallback
  const SLUG_MAP: Record<string, string> = {
    electronics: "electronics",
    jewelery: "jewelery",
    jewellery: "jewelery",
    jewelry: "jewelery",
    "mens clothing": "men's clothing",
    "mens-clothing": "men's clothing",
    "men-s-clothing": "men's clothing",
    "men's-clothing": "men's clothing",
    "men's clothing": "men's clothing",
    "womens clothing": "women's clothing",
    "womens-clothing": "women's clothing",
    "women-s-clothing": "women's clothing",
    "women's-clothing": "women's clothing",
    "women's clothing": "women's clothing",
  };
  return SLUG_MAP[lower] ?? SLUG_MAP[spaced] ?? slug;
}

export function getProductsSync(): Product[] {
  return MOCK_PRODUCTS.map((p, i) => mapProduct(p, i));
}

export function getProductByIdSync(id: number | string): Product | null {
  const numId = typeof id === "string" ? Number.parseInt(id, 10) : id;
  const found = MOCK_PRODUCTS.find((p) => p.id === numId);
  if (!found) return null;
  return mapProduct(found, found.id - 1);
}

export function getProductsByCategorySync(categoryOrSlug: string): Product[] {
  const canon = slugToCategory(categoryOrSlug);
  return MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === canon.toLowerCase(),
  ).map((p, i) => mapProduct(p, i));
}

export function getCategoriesSync(): string[] {
  return [...MOCK_CATEGORIES];
}

// Async wrappers so React Query's queryFn type is satisfied
export async function getProducts(): Promise<Product[]> {
  return getProductsSync();
}

export async function getProductById(id: number | string): Promise<Product> {
  const product = getProductByIdSync(id);
  // Return first product as fallback so the page never hard-404s
  return product ?? mapProduct(MOCK_PRODUCTS[0], 0);
}

export async function getProductsByCategory(
  categoryOrSlug: string,
): Promise<Product[]> {
  return getProductsByCategorySync(categoryOrSlug);
}

export async function getCategories(): Promise<string[]> {
  return getCategoriesSync();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = getProductsSync();
  const q = query.toLowerCase();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}
