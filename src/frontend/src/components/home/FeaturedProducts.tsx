import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { getProducts } from "../../lib/api/products";
import type { Product } from "../../types";
import { ProductCard } from "../product/ProductCard";

type Tab = "all" | "new" | "bestsellers" | "sale";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New Arrivals" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "sale", label: "On Sale" },
];

function filterProducts(
  products: Product[],
  tab: Tab,
  maxItems: number,
): Product[] {
  let filtered: Product[];
  switch (tab) {
    case "new":
      filtered = products.filter((p) => p.isNew);
      if (filtered.length === 0) filtered = products.filter((p) => p.id <= 5);
      break;
    case "bestsellers":
      filtered = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case "sale":
      filtered = products.filter((p) => p.discount !== undefined);
      if (filtered.length === 0)
        filtered = products.filter((p) => p.price < 50);
      break;
    default:
      filtered = products;
  }
  return filtered.slice(0, maxItems);
}

interface FeaturedProductsProps {
  title?: string;
  maxItems?: number;
}

export function FeaturedProducts({
  title = "Featured Products",
  maxItems = 8,
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const displayed = products
    ? filterProducts(products, activeTab, maxItems)
    : [];

  return (
    <section className="py-14 bg-muted/30" data-ocid="featured.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Curated For You
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-xl overflow-x-auto flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[36px] ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`featured.tab.${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-border bg-card"
              >
                <Skeleton className="h-64 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="flex justify-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-semibold text-sm min-h-[44px] transition-all duration-200 hover:text-white hover:border-transparent"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "var(--color-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "transparent";
            }}
            data-ocid="featured.view_all_link"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
