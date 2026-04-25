import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Layout } from "../components/layout/Layout";
import { useCartStore, useCartTotals } from "../store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { totalItems } = useCartTotals();
  const [coupon, setCoupon] = useState<string>("");

  const isEmpty = items.length === 0;

  return (
    <Layout>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-ocid="cart.page"
      >
        {/* Page heading */}
        <div className="mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)",
            }}
          >
            Shopping Cart
          </h1>
          {!isEmpty && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          /* ── Empty state ── */
          <div
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
            data-ocid="cart.empty_state"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(233, 69, 96, 0.1)" }}
            >
              <ShoppingBag
                className="h-12 w-12"
                style={{ color: "var(--color-accent)" }}
              />
            </div>
            <div>
              <h2
                className="text-xl font-semibold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-primary)",
                }}
              >
                Your cart is empty
              </h2>
              <p className="text-muted-foreground max-w-sm">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
            <Button
              type="button"
              asChild
              className="h-12 px-8 font-semibold"
              style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
              data-ocid="cart.start_shopping_button"
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          /* ── Cart layout ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: cart items */}
            <div className="lg:col-span-2" data-ocid="cart.items_list">
              {/* Items */}
              <div className="bg-card rounded-xl border border-border px-4 sm:px-6 py-2">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  asChild
                  className="text-sm gap-2 text-muted-foreground hover:text-foreground"
                  data-ocid="cart.continue_shopping_link"
                >
                  <Link to="/products">
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="text-sm gap-2"
                  style={{
                    color: "var(--color-error)",
                    borderColor: "var(--color-error)",
                  }}
                  onClick={clearCart}
                  data-ocid="cart.clear_cart_button"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-1">
              <CartSummary
                items={items}
                coupon={coupon || undefined}
                onCouponApply={setCoupon}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
