import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingCart, Star, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils/formatPrice";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../types";
import { ProductBreadcrumb } from "./ProductBreadcrumb";

interface ProductInfoProps {
  product: Product;
}

function StarDisplay({ rate, count }: { rate: number; count: number }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= Math.round(rate)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground"
            }
          />
        ))}
      </div>
      <span className="font-semibold text-foreground">{rate.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({count} reviews)</span>
      <button
        type="button"
        className="text-sm text-accent hover:underline ml-1"
      >
        Write a Review
      </button>
    </div>
  );
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span
        className="text-sm font-semibold"
        style={{ color: "var(--color-error)" }}
      >
        Out of Stock
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span
        className="text-sm font-semibold"
        style={{ color: "var(--color-warning)" }}
      >
        Only {stock} left — order soon!
      </span>
    );
  }
  return (
    <span
      className="text-sm font-semibold"
      style={{ color: "var(--color-success)" }}
    >
      ✓ In Stock
    </span>
  );
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const navigate = useNavigate();

  const isOutOfStock = product.stock === 0;
  const maxQty = Math.max(product.stock, 1);

  function decreaseQty() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(product, quantity);
    openDrawer();
    toast.success(
      `Added ${quantity}× "${product.title.slice(0, 30)}…" to cart`,
    );
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    addItem(product, quantity);
    navigate({ to: "/cart" });
  }

  function handleWishlist() {
    toggleItem(product);
    toast(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ♡");
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="product.info">
      {/* Breadcrumb */}
      <ProductBreadcrumb
        category={product.category}
        productTitle={product.title}
      />

      {/* Title */}
      <h1
        className="text-2xl lg:text-3xl font-bold text-foreground leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {product.title}
      </h1>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
        {product.brand && (
          <span>
            Brand: <strong className="text-foreground">{product.brand}</strong>
          </span>
        )}
        <span className="text-border">|</span>
        <span>
          SKU: <strong className="text-foreground">#{product.id}</strong>
        </span>
      </div>

      {/* Rating */}
      <StarDisplay rate={product.rating.rate} count={product.rating.count} />

      {/* Price block */}
      <div className="rounded-xl bg-muted/40 p-4 border border-border flex flex-col gap-1">
        <div className="flex items-end gap-3 flex-wrap">
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <Badge
              className="text-sm px-2 py-0.5 font-semibold"
              style={{
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
              }}
            >
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
        {product.discount && product.originalPrice && (
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-success)" }}
          >
            You save {formatPrice(product.originalPrice - product.price)}
          </p>
        )}
      </div>

      {/* Stock status */}
      <StockStatus stock={product.stock} />

      {/* Quantity stepper */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Qty:
          </span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={decreaseQty}
              disabled={quantity <= 1}
              className="px-3 py-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
              data-ocid="product.qty_decrease"
            >
              <Minus size={16} />
            </button>
            <span
              className="px-4 py-2 min-w-[48px] text-center font-semibold text-foreground border-x border-border"
              data-ocid="product.qty_value"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increaseQty}
              disabled={quantity >= maxQty}
              className="px-3 py-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
              data-ocid="product.qty_increase"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2.5">
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full min-h-[48px] gap-2 text-base font-semibold"
          data-ocid="product.add_to_cart_button"
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        <div className="flex gap-2.5">
          <Button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            variant="outline"
            className="flex-1 min-h-[48px] gap-2 text-base font-semibold border-2"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
            data-ocid="product.buy_now_button"
          >
            <Zap size={18} />
            Buy Now
          </Button>

          <Button
            type="button"
            onClick={handleWishlist}
            variant="outline"
            className="min-h-[48px] min-w-[48px] px-3.5 border-2"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            data-ocid="product.wishlist_button"
          >
            <Heart
              size={20}
              className={
                isWishlisted
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              }
            />
          </Button>
        </div>
      </div>

      {/* USP features */}
      <div className="border border-border rounded-xl overflow-hidden">
        {[
          { icon: "🚚", text: "Free delivery on orders above ₹999" },
          { icon: "↩️", text: "Easy 30-day returns — no questions asked" },
          { icon: "🛡️", text: "1 Year Warranty included" },
        ].map((feat) => (
          <div
            key={feat.text}
            className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 text-sm text-foreground"
          >
            <span className="text-base">{feat.icon}</span>
            <span>{feat.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
