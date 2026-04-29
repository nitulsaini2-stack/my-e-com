import { getCategoriesWithImages } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Category icon map — emoji fallback per slug
const CATEGORY_META: Record<
  string,
  { emoji: string; gradient: string; label: string }
> = {
  electronics: {
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f2547 100%)",
    label: "Gadgets & Tech",
  },
  jewelery: {
    emoji: "💎",
    gradient: "linear-gradient(135deg, #7c4a00 0%, #5c3300 100%)",
    label: "Rings & Chains",
  },
  "mens-clothing": {
    emoji: "👔",
    gradient: "linear-gradient(135deg, #1a3a2a 0%, #102414 100%)",
    label: "Style for Him",
  },
  "womens-clothing": {
    emoji: "✨",
    gradient: "linear-gradient(135deg, #5a1a5a 0%, #3d0f3d 100%)",
    label: "Style for Her",
  },
};

function getCatMeta(slug: string) {
  return (
    CATEGORY_META[slug] ?? {
      emoji: "🛍️",
      gradient: "linear-gradient(135deg, #333 0%, #111 100%)",
      label: "Shop Now",
    }
  );
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-with-images"],
    queryFn: getCategoriesWithImages,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-[100]",
          "w-[600px] max-w-[calc(100vw-32px)]",
          "bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_16px_48px_rgba(0,0,0,0.18)]",
          "transition-all duration-200 origin-top",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
        )}
        onMouseLeave={onClose}
        role="menu"
        aria-label="Category navigation"
      >
        {/* Arrow pointer */}
        <div
          className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-[var(--color-border)] rotate-45"
          aria-hidden="true"
        />

        {/* Header */}
        <div
          className="px-5 pt-4 pb-3 border-b border-[var(--color-border)]"
          style={{ borderBottomColor: "var(--color-border)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            Shop by Category
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          {categories.map((cat) => {
            const meta = getCatMeta(cat.slug);
            return (
              <Link
                key={cat.id}
                to="/category/$categorySlug"
                params={{ categorySlug: cat.slug }}
                onClick={onClose}
                className="group flex flex-col items-center gap-2.5 p-3 rounded-xl border border-transparent hover:border-[var(--color-border)] hover:shadow-[var(--shadow-card)] transition-all duration-200 cursor-pointer"
                style={
                  {
                    "--hover-bg": "var(--color-surface-alt)",
                  } as React.CSSProperties
                }
                data-ocid={`megamenu.category.${cat.slug}`}
                role="menuitem"
              >
                {/* Icon container */}
                <div
                  className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-[var(--shadow-sm)]"
                  style={{ background: meta.gradient }}
                >
                  {/* SVG product image — clipped inside box */}
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  ) : null}
                  {/* Emoji icon overlay — always visible */}
                  <span
                    className="relative z-10 text-3xl leading-none select-none"
                    role="img"
                    aria-label={cat.name}
                  >
                    {meta.emoji}
                  </span>
                </div>

                {/* Category name */}
                <div className="flex flex-col items-center gap-1 min-w-0 w-full">
                  <span
                    className="text-[13px] font-semibold text-center leading-tight truncate w-full group-hover:text-[var(--color-accent)] transition-colors duration-200"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Product count badge */}
                {cat.productCount !== undefined && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      backgroundColor: "var(--color-surface-alt)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {cat.productCount} items
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div
          className="px-5 py-3 border-t border-[var(--color-border)] flex items-center justify-between"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          <span
            className="text-[12px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Browse all{" "}
            {categories.reduce((s, c) => s + (c.productCount ?? 0), 0)} products
          </span>
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center gap-1 text-[12px] font-semibold transition-colors duration-200 group/link"
            style={{ color: "var(--color-accent)" }}
            data-ocid="megamenu.view_all_link"
          >
            View All
            <ChevronRight
              size={13}
              className="group-hover/link:translate-x-0.5 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </>
  );
}
