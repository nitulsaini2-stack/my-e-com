import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX } from "lucide-react";
import { useFilters } from "../../lib/hooks/useFilters";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error?: Error | null;
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-square w-full animate-pulse" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-3 w-1/3 animate-pulse" />
        <Skeleton className="h-4 w-full animate-pulse" />
        <Skeleton className="h-4 w-4/5 animate-pulse" />
        <Skeleton className="h-3 w-1/2 animate-pulse" />
        <Skeleton className="h-9 w-full mt-1 animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  const { clearFilters } = useFilters();

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center gap-4"
        data-ocid="products.error_state"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <SearchX size={32} className="text-destructive" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            Failed to load products
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check your connection and try again.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          data-ocid="products.retry_button"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        data-ocid="products.loading_state"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton keys
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center gap-4"
        data-ocid="products.empty_state"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <SearchX size={40} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-xl font-semibold text-foreground">
            No products found
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Try adjusting your filters or search terms to find what you're
            looking for.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          data-ocid="products.clear_filters_button"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      data-ocid="products.grid"
    >
      {products.map((product, index) => (
        <div key={product.id} data-ocid={`products.item.${index + 1}`}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
