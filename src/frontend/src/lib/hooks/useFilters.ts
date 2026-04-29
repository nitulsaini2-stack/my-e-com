import { useRouter, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import type { FilterState } from "../../types";

const DEFAULT_FILTERS: FilterState = {
  category: [],
  priceMin: 0,
  priceMax: 1000,
  rating: null,
  sortBy: "popular",
  brands: [],
  inStock: false,
  discount: [],
};

function parseArrayParam(value: unknown): string[] {
  if (!value || typeof value !== "string") return [];
  return value.split(",").filter(Boolean);
}

function parseNumberArrayParam(value: unknown): number[] {
  if (!value || typeof value !== "string") return [];
  return value.split(",").filter(Boolean).map(Number);
}

/**
 * Update URL search params without TanStack Router's strict type system.
 * Uses the History API directly so no route-level validateSearch types are needed.
 */
function pushSearchParams(params: Record<string, string>): void {
  const url = new URL(window.location.href);
  // Clear all existing search params
  url.search = "";
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  window.history.replaceState(null, "", url.toString());
}

export function useFilters() {
  const router = useRouter();
  // strict: false lets this hook work on any route without requiring per-route search schema
  const raw = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;

  const filters: FilterState = {
    category: parseArrayParam(raw.category),
    priceMin: raw.priceMin ? Number(raw.priceMin) : DEFAULT_FILTERS.priceMin,
    priceMax: raw.priceMax ? Number(raw.priceMax) : DEFAULT_FILTERS.priceMax,
    rating: raw.rating ? Number(raw.rating) : null,
    sortBy: (raw.sortBy as FilterState["sortBy"]) ?? DEFAULT_FILTERS.sortBy,
    brands: parseArrayParam(raw.brands),
    inStock: raw.inStock === "true",
    discount: parseNumberArrayParam(raw.discount),
  };

  const setFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const next = { ...DEFAULT_FILTERS, ...updates };
      const params: Record<string, string> = {};
      if (next.category.length) params.category = next.category.join(",");
      if (next.priceMin !== DEFAULT_FILTERS.priceMin)
        params.priceMin = String(next.priceMin);
      if (next.priceMax !== DEFAULT_FILTERS.priceMax)
        params.priceMax = String(next.priceMax);
      if (next.rating !== null && next.rating !== undefined)
        params.rating = String(next.rating);
      if (next.sortBy !== DEFAULT_FILTERS.sortBy) params.sortBy = next.sortBy;
      if (next.brands.length) params.brands = next.brands.join(",");
      if (next.inStock) params.inStock = "true";
      if (next.discount.length) params.discount = next.discount.join(",");

      pushSearchParams(params);
      // Invalidate router so useSearch picks up the new URL
      void router.invalidate();
    },
    [router],
  );

  const clearFilters = useCallback(() => {
    pushSearchParams({});
    void router.invalidate();
  }, [router]);

  return { filters, setFilters, clearFilters };
}
