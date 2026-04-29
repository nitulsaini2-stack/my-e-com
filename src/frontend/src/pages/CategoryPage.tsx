import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { ProductFilters } from "../components/product/ProductFilters";
import { ProductGrid } from "../components/product/ProductGrid";
import { categoryToSlug, slugToRawCategory } from "../lib/api/categories";
import {
  getCategoriesSync,
  getProductsByCategorySync,
} from "../lib/api/products";
import { useFilters } from "../lib/hooks/useFilters";
import type { FilterState, Product } from "../types";

const PAGE_SIZE = 12;

function applyFiltersAndSort(
  products: Product[],
  filters: FilterState,
): Product[] {
  let result = [...products];

  if (filters.priceMax > 0) {
    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax,
    );
  }

  if (filters.rating !== null) {
    result = result.filter((p) => p.rating.rate >= (filters.rating as number));
  }

  if (filters.inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  switch (filters.sortBy) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case "newest":
      result.sort((a, b) => b.id - a.id);
      break;
    case "popular":
      result.sort((a, b) => b.rating.count - a.rating.count);
      break;
  }

  return result;
}

const SORT_OPTIONS: Array<{ value: FilterState["sortBy"]; label: string }> = [
  { value: "popular", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  electronics: "linear-gradient(135deg, #1e3a5f, #2563eb)",
  jewelery: "linear-gradient(135deg, #5c3a00, #b45309)",
  "men's clothing": "linear-gradient(135deg, #1a3a2a, #059669)",
  "women's clothing": "linear-gradient(135deg, #4a1a4a, #9333ea)",
};

export default function CategoryPage() {
  // categorySlug from URL is a slug like "electronics", "mens-clothing", etc.
  const { categorySlug } = useParams({ strict: false }) as {
    categorySlug: string;
  };

  const { filters, setFilters } = useFilters();
  const [page, setPage] = useState(1);

  // Convert URL slug → canonical raw category string (e.g. "mens-clothing" → "men's clothing")
  const rawCategory = slugToRawCategory(categorySlug ?? "");
  const categoryName = capitalize(rawCategory || categorySlug || "");

  // Synchronous data load — all local, no async needed
  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "category", rawCategory],
    queryFn: () => getProductsByCategorySync(rawCategory),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!categorySlug,
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories-list"],
    queryFn: getCategoriesSync,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const filteredProducts = useMemo(
    () => applyFiltersAndSort(allProducts, filters),
    [allProducts, filters],
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const heroGradient =
    CATEGORY_GRADIENTS[rawCategory] ??
    "linear-gradient(135deg, #1e3a5f, #2563eb)";

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({
      ...filters,
      sortBy: e.target.value as FilterState["sortBy"],
    });
    setPage(1);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background" data-ocid="category.page">
        {/* Category hero banner — no external images, pure gradient */}
        <div
          className="relative text-white"
          style={{ background: heroGradient }}
          data-ocid="category.hero"
        >
          <div className="relative max-w-[1280px] mx-auto px-4 py-12 md:py-16">
            <nav
              className="flex items-center gap-1.5 text-sm text-white/70 mb-4"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="hover:text-white transition-colors"
                data-ocid="breadcrumb.home_link"
              >
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{categoryName}</span>
            </nav>

            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {categoryName}
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-md">
              Explore our curated selection of {categoryName.toLowerCase()} —
              quality products at great prices.
            </p>

            {!isLoading && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
                {filteredProducts.length} products
              </div>
            )}
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Sub-category pills — use categoryToSlug for correct URL params */}
          {allCategories.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-6"
              data-ocid="category.sub_category_pills"
            >
              {allCategories.map((cat) => {
                const catSlug = categoryToSlug(cat);
                const isActive =
                  catSlug === categorySlug || cat === rawCategory;
                return (
                  <Link
                    key={cat}
                    to="/category/$categorySlug"
                    params={{ categorySlug: catSlug }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
                    }`}
                    data-ocid={`category.pill.${catSlug}`}
                  >
                    {capitalize(cat)}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex gap-6 items-start">
            {/* Desktop sidebar */}
            <ProductFilters />

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Sort bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border"
                data-ocid="category.sort_bar"
              >
                <div className="flex items-center gap-3">
                  <ProductFilters mobileOnly={true} />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {isLoading ? "…" : filteredProducts.length}
                    </span>{" "}
                    products in {categoryName}
                  </p>
                </div>

                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="text-sm border border-input rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                  data-ocid="category.sort_select"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product grid */}
              <ProductGrid
                products={paginatedProducts}
                isLoading={isLoading}
                error={error}
              />

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div
                  className="flex justify-center items-center gap-2 mt-8"
                  data-ocid="category.pagination"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="min-h-[44px]"
                    data-ocid="category.pagination_prev"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isVisible =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - page) <= 1;
                    const isEllipsis =
                      !isVisible &&
                      (pageNum === 2 || pageNum === totalPages - 1);

                    if (!isVisible && !isEllipsis) return null;
                    if (isEllipsis) {
                      return (
                        <span
                          key={`ellipsis-${pageNum}`}
                          className="text-muted-foreground px-2"
                        >
                          …
                        </span>
                      );
                    }

                    return (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "border border-input bg-card text-foreground hover:bg-muted"
                        }`}
                        data-ocid={`category.pagination.page.${pageNum}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="min-h-[44px]"
                    data-ocid="category.pagination_next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
