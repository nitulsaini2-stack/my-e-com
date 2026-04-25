import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "../../lib/utils/formatPrice";
import type { CartItem } from "../../types";

interface CouponDef {
  type: "percent" | "flat";
  value: number;
}

const VALID_COUPONS: Record<string, CouponDef> = {
  SAVE20: { type: "percent", value: 20 },
  SAVE10: { type: "percent", value: 10 },
  FLAT50: { type: "flat", value: 50 },
};

interface CartSummaryProps {
  items: CartItem[];
  coupon?: string;
  onCouponApply: (code: string) => void;
}

export function CartSummary({
  items,
  coupon,
  onCouponApply,
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState(coupon ?? "");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "valid" | "invalid"
  >(coupon && VALID_COUPONS[coupon] ? "valid" : "idle");

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Discount
  let discountAmount = 0;
  const activeCoupon =
    coupon && VALID_COUPONS[coupon] ? VALID_COUPONS[coupon] : null;
  if (activeCoupon) {
    discountAmount =
      activeCoupon.type === "percent"
        ? (subtotal * activeCoupon.value) / 100
        : Math.min(activeCoupon.value, subtotal);
  }

  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount > 999 ? 0 : 99;
  const taxRate = 0.18;
  const taxes = afterDiscount * taxRate;
  const total = afterDiscount + shipping + taxes;

  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCouponStatus("valid");
      onCouponApply(code);
    } else {
      setCouponStatus("invalid");
      onCouponApply("");
    }
  }

  function handleCouponKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleApplyCoupon();
  }

  return (
    <div
      className="bg-card rounded-xl border border-border p-5 sticky top-24"
      data-ocid="cart.summary_panel"
    >
      <h2
        className="text-lg font-semibold mb-4"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        Order Summary
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({totalItems} {totalItems === 1 ? "item" : "items"})
        </span>
      </h2>

      <Separator className="mb-4" />

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>

        {activeCoupon && discountAmount > 0 && (
          <div
            className="flex justify-between"
            style={{ color: "var(--color-success)" }}
          >
            <span>Discount ({coupon})</span>
            <span className="font-medium tabular-nums">
              −{formatPrice(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          {shipping === 0 ? (
            <span
              className="font-medium"
              style={{ color: "var(--color-success)" }}
            >
              FREE
            </span>
          ) : (
            <span className="font-medium tabular-nums">
              {formatPrice(shipping)}
            </span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes (18% GST)</span>
          <span className="font-medium tabular-nums">{formatPrice(taxes)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center mb-5">
        <span
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Total
        </span>
        <span
          className="text-xl font-bold tabular-nums"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-primary)",
          }}
        >
          {formatPrice(total)}
        </span>
      </div>

      <Separator className="mb-4" />

      {/* Coupon section */}
      <div className="mb-5">
        <p className="text-sm font-medium mb-2 text-foreground">Coupon Code</p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter code"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase());
              setCouponStatus("idle");
            }}
            onKeyDown={handleCouponKeyDown}
            className="uppercase text-sm"
            data-ocid="cart.coupon_input"
          />
          <Button
            type="button"
            variant="outline"
            className="shrink-0 text-sm"
            onClick={handleApplyCoupon}
            data-ocid="cart.coupon_apply_button"
          >
            Apply
          </Button>
        </div>

        {couponStatus === "valid" && activeCoupon && (
          <div
            className="flex items-center gap-1.5 mt-2 text-xs font-medium"
            style={{ color: "var(--color-success)" }}
            data-ocid="cart.coupon_success_state"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Coupon applied! You save {formatPrice(discountAmount)}
          </div>
        )}
        {couponStatus === "invalid" && (
          <div
            className="flex items-center gap-1.5 mt-2 text-xs font-medium"
            style={{ color: "var(--color-error)" }}
            data-ocid="cart.coupon_error_state"
          >
            <XCircle className="h-3.5 w-3.5" />
            Invalid coupon code
          </div>
        )}
      </div>

      {/* Checkout CTA */}
      <Button
        type="button"
        className="w-full h-12 text-base font-semibold"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#fff",
        }}
        data-ocid="cart.checkout_button"
      >
        Proceed to Checkout
      </Button>

      {!activeCoupon && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Use code <strong>SAVE20</strong>, <strong>SAVE10</strong>, or{" "}
          <strong>FLAT50</strong> for discounts
        </p>
      )}
    </div>
  );
}
