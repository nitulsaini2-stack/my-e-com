import type { Category } from "../../types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mockData";

// Representative product image per category (inline SVG, never external)
function categoryImage(cat: string): string {
  const product = MOCK_PRODUCTS.find((p) => p.category === cat);
  return product?.image ?? "";
}

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert a category string to a URL-safe slug.
 * "electronics"       → "electronics"
 * "jewelery"          → "jewelery"
 * "men's clothing"    → "mens-clothing"
 * "women's clothing"  → "womens-clothing"
 */
export function categoryToSlug(cat: string): string {
  return cat
    .replace(/'/g, "") // remove apostrophes first
    .replace(/\s+/g, "-") // spaces → hyphens
    .toLowerCase();
}

/**
 * Convert a URL slug back to the canonical raw category string.
 * This is the inverse of categoryToSlug.
 */
export function slugToRawCategory(slug: string): string {
  if (!slug) return "";

  // Direct match first (handles "electronics", "jewelery")
  if (MOCK_CATEGORIES.includes(slug)) return slug;

  // Try all categories and find the one whose slug matches
  for (const cat of MOCK_CATEGORIES) {
    if (categoryToSlug(cat) === slug) return cat;
  }

  // Fallback: replace hyphens with spaces and try
  const withSpaces = slug.replace(/-/g, " ");
  const spaceMatch = MOCK_CATEGORIES.find(
    (c) => c.toLowerCase() === withSpaces.toLowerCase(),
  );
  if (spaceMatch) return spaceMatch;

  return slug;
}

export async function getCategoriesWithImages(): Promise<Category[]> {
  return MOCK_CATEGORIES.map((cat) => ({
    id: cat,
    name: capitalize(cat),
    slug: categoryToSlug(cat),
    image: categoryImage(cat),
    productCount: MOCK_PRODUCTS.filter((p) => p.category === cat).length,
  }));
}
