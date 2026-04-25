/**
 * Format a number as a price string with Indian Rupee symbol.
 * Example: 1299.99 → "₹1,299.99"
 */
export function formatPrice(price: number): string {
  const formatted = price.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
}
