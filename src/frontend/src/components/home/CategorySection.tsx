import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getCategoriesWithImages } from "../../lib/api/categories";

// Category color themes for visual distinction — no external images needed
const CATEGORY_BG: Record<string, string> = {
  electronics: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
  jewelery: "linear-gradient(135deg, #5c3a00 0%, #b45309 100%)",
  "men's clothing": "linear-gradient(135deg, #1a3a2a 0%, #059669 100%)",
  "women's clothing": "linear-gradient(135deg, #4a1a4a 0%, #9333ea 100%)",
};

const CATEGORY_EMOJI: Record<string, string> = {
  electronics: "💻",
  jewelery: "💎",
  "men's clothing": "👔",
  "women's clothing": "👗",
};

export function CategorySection() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories-with-images"],
    queryFn: getCategoriesWithImages,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <section className="py-14 bg-background" data-ocid="categories.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Browse
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold min-h-[44px] px-3 rounded-lg transition-colors hover:bg-muted"
            style={{ color: "var(--color-accent)" }}
            data-ocid="categories.view_all_link"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 animate-pulse"
              >
                <div className="w-24 h-24 rounded-2xl bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p
            className="text-muted-foreground text-center py-8"
            data-ocid="categories.error_state"
          >
            Failed to load categories. Please try again.
          </p>
        )}

        {/* Categories grid — using inline gradients + emoji, zero external deps */}
        {categories && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => {
              const bg =
                CATEGORY_BG[category.id] ??
                "linear-gradient(135deg, #374151, #6b7280)";
              const emoji = CATEGORY_EMOJI[category.id] ?? "🛍️";
              return (
                <Link
                  key={category.id}
                  to="/category/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className="group flex flex-col items-center gap-3"
                  data-ocid={`categories.item.${category.id.replace(/\s+/g, "_")}`}
                >
                  <div
                    className="relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.03] flex flex-col items-center justify-center gap-2 px-3 py-4"
                    style={{ background: bg }}
                  >
                    <span className="text-4xl sm:text-5xl drop-shadow-md">
                      {emoji}
                    </span>
                    <span className="text-white font-bold text-sm sm:text-base text-center leading-tight drop-shadow">
                      {category.name}
                    </span>
                    {category.productCount !== undefined && (
                      <span className="text-white/75 text-xs font-medium">
                        {category.productCount} items
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View all on mobile */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold min-h-[44px] px-4 rounded-lg border border-border"
            style={{ color: "var(--color-accent)" }}
            data-ocid="categories.view_all_mobile_link"
          >
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
