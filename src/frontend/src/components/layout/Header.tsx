import { cn } from "@/lib/utils";
import { useCartStore, useCartTotals } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MegaMenu from "./MegaMenu";
import MobileDrawer from "./MobileDrawer";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function IconBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center text-white px-1"
      style={{ backgroundColor: "var(--color-accent)" }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { totalItems } = useCartTotals();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleMegaEnter() {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaOpen(true);
  }
  function handleMegaLeave() {
    megaTimeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  }

  return (
    <>
      {/* Announcement bar */}
      <div
        className="hidden sm:flex items-center justify-center text-center text-xs py-2 px-4 font-medium"
        style={{
          backgroundColor: "var(--color-secondary)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        🚚 Free shipping on orders over ₹999&nbsp;&nbsp;|&nbsp;&nbsp; 30-day
        returns&nbsp;&nbsp;|&nbsp;&nbsp;24/7 Support
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-[200] transition-all duration-200",
          scrolled ? "shadow-lg py-0" : "py-0",
        )}
        style={{ backgroundColor: "var(--color-primary)" }}
        data-ocid="header"
      >
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-4 h-[60px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-0.5 shrink-0 min-h-[44px] min-w-[44px]"
              data-ocid="header.logo"
            >
              <span className="text-xl font-bold text-white font-heading">
                My&nbsp;
              </span>
              <span
                className="text-xl font-bold font-heading"
                style={{ color: "var(--color-accent)" }}
              >
                E-Com
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors duration-200 min-h-[44px] flex items-center"
                  activeProps={{ className: "text-white bg-white/10" }}
                  data-ocid={`header.nav.${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories with mega menu */}
              <div
                ref={categoriesRef}
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                <button
                  type="button"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px] flex items-center gap-1",
                    megaOpen
                      ? "text-white bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  )}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  data-ocid="header.nav.categories"
                >
                  Categories
                  <svg
                    className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      megaOpen && "rotate-180",
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <MegaMenu
                  isOpen={megaOpen}
                  onClose={() => setMegaOpen(false)}
                />
              </div>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-ocid="header.search_button"
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              {/* Wishlist */}
              <Link
                to="/products"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-ocid="header.wishlist_button"
              >
                <Heart size={20} />
                <IconBadge count={wishlistCount} />
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Cart (${totalItems} items)`}
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-ocid="header.cart_button"
              >
                <ShoppingCart size={20} />
                <IconBadge count={totalItems} />
              </button>

              {/* Hamburger (mobile only) */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                data-ocid="header.menu_button"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div
            className="border-t px-4 py-3"
            style={{
              backgroundColor: "var(--color-primary-hover)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <div className="max-w-[1280px] mx-auto relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                placeholder="Search for products..."
                aria-label="Search products"
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-white/40"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                data-ocid="header.search_input"
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
