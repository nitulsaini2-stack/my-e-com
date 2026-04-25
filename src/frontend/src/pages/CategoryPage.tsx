import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { ProductFilters } from "../components/product/ProductFilters";
import { ProductGrid } from "../components/product/ProductGrid";
import { getCategories, getProductsByCategory } from "../lib/api/products";
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
    result = result.filter((p) => p.rating.rate >= filters.rating!);
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

function formatCategoryName(slug: string): string {
  return slug
    .split(/[-_\s]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  electronics:
    "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  jewelery:
    "linear-gradient(135deg, var(--color-secondary), var(--color-primary-hover))",
  "men's clothing":
    "linear-gradient(135deg, var(--color-primary-hover), var(--color-primary))",
  "women's clothing":
    "linear-gradient(135deg, var(--color-accent-hover), var(--color-secondary))",
};

export default function CategoryPage() {
  const { categorySlug } = useParams({ strict: false }) as {
    categorySlug: string;
  };
  const { filters, setFilters } = useFilters();
  const [page, setPage] = useState(1);

  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", "category", categorySlug],
    queryFn: () => getProductsByCategory(categorySlug),
    staleTime: 5 * 60 * 1000,
    enabled: !!categorySlug,
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
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

  const categoryName = formatCategoryName(categorySlug ?? "");
  const heroGradient =
    CATEGORY_GRADIENTS[(categorySlug ?? "").toLowerCase()] ??
    "linear-gradient(135deg, var(--color-primary), var(--color-secondary))";

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
        {/* Category hero banner */}
        <div
          className="relative text-white"
          style={{ background: heroGradient }}
          data-ocid="category.hero"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80')",
            }}
          />
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
          {/* Sub-category pills */}
          {allCategories.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-6"
              data-ocid="category.sub_category_pills"
            >
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  to="/category/$categorySlug"
                  params={{ categorySlug: cat }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] flex items-center ${
                    cat === categorySlug
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                  data-ocid={`category.pill.${cat.replace(/\s+/g, "_")}`}
                >
                  {formatCategoryName(cat)}
                </Link>
              ))}
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
