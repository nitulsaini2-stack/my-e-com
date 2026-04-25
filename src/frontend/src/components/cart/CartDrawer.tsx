import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils/formatPrice";
import { useCartStore, useCartTotals } from "../../store/cartStore";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, removeItem, updateQuantity } =
    useCartStore();
  const items = useCartStore((s) => s.items);
  const { totalItems, subtotal } = useCartTotals();

  function handleCheckout() {
    toast.info("Checkout coming soon!");
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent
        side="right"
        className="w-80 sm:w-96 p-0 flex flex-col"
        data-ocid="cart.drawer"
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <SheetTitle
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shopping Cart
            </SheetTitle>
            {totalItems > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                }}
              >
                {totalItems}
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-1"
            onClick={closeDrawer}
            aria-label="Close cart"
            data-ocid="cart.close_button"
          >
            <X className="h-4 w-4" />
          </Button>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        {items.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 px-5"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-40" />
            <div className="text-center">
              <p className="font-medium text-foreground mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground">
                Add items to get started
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              asChild
              onClick={closeDrawer}
              data-ocid="cart.continue_shopping_link"
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-5">
            <div className="py-2">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span
                className="text-base font-bold tabular-nums"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                asChild
                onClick={closeDrawer}
                data-ocid="cart.view_cart_button"
              >
                <Link to="/cart">View Cart</Link>
              </Button>
              <Button
                type="button"
                className="flex-1 h-11 font-semibold"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                }}
                onClick={handleCheckout}
                data-ocid="cart.checkout_button"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
