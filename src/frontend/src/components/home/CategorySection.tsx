import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getCategoriesWithImages } from "../../lib/api/categories";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ECategory%3C/text%3E%3C/svg%3E";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
}

export function CategorySection() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesWithImages,
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

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
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

        {/* Categories grid */}
        {categories && (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/category/$categorySlug"
                params={{ categorySlug: category.slug }}
                className="group flex flex-col items-center gap-3 flex-shrink-0 snap-start sm:flex-shrink w-28 sm:w-auto"
                data-ocid={`categories.item.${category.id}`}
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-border bg-muted transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:border-accent">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🛍️
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground text-center leading-tight group-hover:text-accent transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
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
