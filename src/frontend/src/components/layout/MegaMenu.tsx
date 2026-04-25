import { getCategoriesWithImages } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-with-images"],
    queryFn: getCategoriesWithImages,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full z-[100] bg-white shadow-lg border-t border-[var(--color-border)]",
        "transition-all duration-200 origin-top",
        isOpen
          ? "opacity-100 scale-y-100 pointer-events-auto"
          : "opacity-0 scale-y-95 pointer-events-none",
      )}
      onMouseLeave={onClose}
    >
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          Shop by Category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/category/$categorySlug"
              params={{ categorySlug: cat.slug }}
              onClick={onClose}
              className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors duration-200"
              data-ocid={`megamenu.category.${cat.slug}`}
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-surface-alt)] flex items-center justify-center shrink-0">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface-alt)]" />
                )}
              </div>
              <span
                className="text-sm font-medium text-center leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-200"
                style={{ color: "var(--color-text-primary)" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
