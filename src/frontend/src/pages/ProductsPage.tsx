import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, LayoutGrid, List } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { ProductFilters } from "../components/product/ProductFilters";
import { ProductGrid } from "../components/product/ProductGrid";
import { getProductsSync } from "../lib/api/products";
import { useFilters } from "../lib/hooks/useFilters";
import type { FilterState, Product } from "../types";

const PAGE_SIZE = 12;

function applyFiltersAndSort(
  products: Product[],
  filters: FilterState,
): Product[] {
  let result = [...products];

  if (filters.category.length > 0) {
    result = result.filter((p) => filters.category.includes(p.category));
  }

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

export default function ProductsPage() {
  const { filters, setFilters } = useFilters();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Synchronous data — use queryFn that returns synchronously
  // staleTime: Infinity means data is never re-fetched (it's static mock data)
  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsSync,
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

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({
      ...filters,
      sortBy: e.target.value as FilterState["sortBy"],
    });
    setPage(1);
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background" data-ocid="products.page">
        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4"
            aria-label="Breadcrumb"
            data-ocid="products.breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-foreground transition-colors"
              data-ocid="breadcrumb.home_link"
            >
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Products</span>
          </nav>

          {/* Page title */}
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Products
          </h1>

          <div className="flex gap-6 items-start">
            {/* Desktop sidebar filters */}
            <ProductFilters />

            {/* Main content */}
            <main className="flex-1 min-w-0">
              {/* Sort bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border"
                data-ocid="products.sort_bar"
              >
                <div className="flex items-center gap-3">
                  {/* Mobile filter trigger */}
                  <ProductFilters mobileOnly={true} />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {isLoading ? "…" : filteredProducts.length}
                    </span>{" "}
                    products found
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="text-sm border border-input rounded-lg px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                    data-ocid="products.sort_select"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* View toggle */}
                  <div className="hidden sm:flex items-center border border-input rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="Grid view"
                      data-ocid="products.grid_view_toggle"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                      aria-label="List view"
                      data-ocid="products.list_view_toggle"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
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
                  data-ocid="products.pagination"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="min-h-[44px]"
                    data-ocid="products.pagination_prev"
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
                        data-ocid={`products.pagination.page.${pageNum}`}
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
                    data-ocid="products.pagination_next"
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
