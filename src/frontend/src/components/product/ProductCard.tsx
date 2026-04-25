import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils/formatPrice";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../types";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
}

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  variant?: "default" | "compact";
}

function StarRating({ rate, count }: { rate: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= Math.round(rate)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground"
            }
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rate.toFixed(1)} ({count})
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  showCategory = true,
  variant = "default",
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const isCompact = variant === "compact";

  const badge = product.isNew
    ? { label: "New", color: "bg-green-500" }
    : product.discount && product.discount >= 20
      ? { label: `${product.discount}% Off`, color: "bg-accent" }
      : product.isFeatured
        ? { label: "Hot", color: "bg-orange-500" }
        : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.title.slice(0, 30)}... added to cart`);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <div
      className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      data-ocid={`product.card.${product.id}`}
    >
      <Link
        to="/products/$productId"
        params={{ productId: String(product.id) }}
        className="block"
      >
        {/* Image wrapper */}
        <div className="relative overflow-hidden bg-muted aspect-square">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={handleImgError}
          />
          {badge && (
            <span
              className={`absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${badge.color}`}
              data-ocid={`product.badge.${product.id}`}
            >
              {badge.label}
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-card min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            data-ocid={`product.wishlist_button.${product.id}`}
          >
            <Heart
              size={18}
              className={
                isWishlisted
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              }
            />
          </button>
        </div>

        {/* Info */}
        <div className={`p-3 ${isCompact ? "p-2" : "p-4"}`}>
          {showCategory && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 truncate">
              {product.category}
            </p>
          )}
          <h3
            className={`font-semibold text-foreground mb-1 line-clamp-2 leading-snug ${isCompact ? "text-sm" : "text-sm"}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.title}
          </h3>
          <StarRating rate={product.rating.rate} count={product.rating.count} />

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="font-bold text-foreground text-base">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                {product.discount}% off
              </Badge>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart button */}
      <div className="px-4 pb-4">
        <Button
          type="button"
          onClick={handleAddToCart}
          className="w-full min-h-[44px] gap-2"
          size="sm"
          data-ocid={`product.add_to_cart_button.${product.id}`}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
