import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../lib/utils/formatPrice";
import type { CartItem as CartItemType } from "../../types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity, selectedVariant } = item;
  const subtotal = product.price * quantity;

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border last:border-0"
      data-ocid="cart.item"
    >
      {/* Image + Info row */}
      <div className="flex gap-3 flex-1 min-w-0">
        {/* Product image */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-[60px] h-[60px] object-cover rounded-md border border-border bg-muted"
          />
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p
            className="font-medium text-sm leading-snug line-clamp-2 text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.title}
          </p>
          {selectedVariant && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedVariant}
            </p>
          )}
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: "var(--color-accent)" }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      {/* Stepper + subtotal + remove */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        {/* Quantity stepper */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-[unset] sm:min-w-[unset]"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            data-ocid="cart.quantity_decrease"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span
            className="w-8 text-center text-sm font-medium tabular-nums select-none"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-[unset] sm:min-w-[unset]"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            aria-label="Increase quantity"
            data-ocid="cart.quantity_increase"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Subtotal */}
        <span className="text-sm font-semibold tabular-nums min-w-[60px] text-right text-foreground">
          {formatPrice(subtotal)}
        </span>

        {/* Remove */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-[unset] sm:min-w-[unset] text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.title} from cart`}
          data-ocid="cart.delete_button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
