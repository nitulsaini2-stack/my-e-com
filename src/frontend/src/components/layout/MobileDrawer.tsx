import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { getCategoriesWithImages } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { useCartTotals } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingCart, X } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { totalItems } = useCartTotals();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-with-images"],
    queryFn: getCategoriesWithImages,
    staleTime: 5 * 60 * 1000,
  });

  const navLinkClass =
    "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] hover:bg-white/10";

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[399] bg-black/50 transition-opacity duration-300 lg:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-[400] w-[280px] flex flex-col overflow-hidden lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ backgroundColor: "var(--color-primary)" }}
        aria-label="Mobile navigation"
        data-ocid="mobile_drawer"
      >
        {/* Header row */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-1"
            data-ocid="mobile_drawer.logo"
          >
            <span className="text-lg font-bold text-white font-heading">
              My&nbsp;
            </span>
            <span
              className="text-lg font-bold font-heading"
              style={{ color: "var(--color-accent)" }}
            >
              E-Com
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-200"
            data-ocid="mobile_drawer.close_button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div
          className="px-4 py-3 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 h-10"
              data-ocid="mobile_drawer.search_input"
            />
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <Link
            to="/"
            onClick={onClose}
            className={cn(navLinkClass, "text-white/90 hover:text-white mx-2")}
            data-ocid="mobile_drawer.home_link"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className={cn(navLinkClass, "text-white/90 hover:text-white mx-2")}
            data-ocid="mobile_drawer.products_link"
          >
            Products
          </Link>

          {/* Categories accordion */}
          <Accordion type="single" collapsible className="mx-2">
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger
                className="px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:no-underline min-h-[44px] rounded-lg hover:bg-white/10"
                data-ocid="mobile_drawer.categories_toggle"
              >
                Categories
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <div className="pl-4 flex flex-col gap-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/category/$categorySlug"
                      params={{ categorySlug: cat.slug }}
                      onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/10 min-h-[40px] transition-colors duration-200"
                      data-ocid={`mobile_drawer.category.${cat.slug}`}
                    >
                      {cat.image && (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-7 h-7 rounded object-contain bg-white/10 shrink-0"
                        />
                      )}
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            to="/about"
            onClick={onClose}
            className={cn(navLinkClass, "text-white/90 hover:text-white mx-2")}
            data-ocid="mobile_drawer.about_link"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className={cn(navLinkClass, "text-white/90 hover:text-white mx-2")}
            data-ocid="mobile_drawer.contact_link"
          >
            Contact
          </Link>
        </div>

        {/* Bottom: cart + wishlist */}
        <div
          className="border-t px-4 py-3 flex flex-col gap-1 shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 min-h-[44px] transition-colors duration-200"
            data-ocid="mobile_drawer.cart_link"
          >
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span
                className="ml-auto text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 min-h-[44px] transition-colors duration-200"
            data-ocid="mobile_drawer.wishlist_link"
          >
            <Heart size={18} />
            Wishlist
            {wishlistCount > 0 && (
              <span
                className="ml-auto text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center text-white"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
