import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoriesWithImages } from "@/lib/api/categories";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Cart", to: "/cart" },
];

const customerServiceLinks = [
  { label: "FAQ", to: "/contact" },
  { label: "Returns Policy", to: "/contact" },
  { label: "Track Order", to: "/contact" },
  { label: "Customer Support", to: "/contact" },
  { label: "Privacy Policy", to: "/contact" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const paymentBadges = ["Visa", "Mastercard", "UPI", "PayPal"];

const footerLinkClass =
  "text-sm text-white/60 hover:text-white transition-colors duration-200 leading-relaxed";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-semibold uppercase tracking-wider mb-4"
      style={{ color: "rgba(255,255,255,0.4)" }}
    >
      {children}
    </h3>
  );
}

function CategoryLinks() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories-with-images"],
    queryFn: getCategoriesWithImages,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-24 bg-white/10" />
        ))}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            to="/category/$categorySlug"
            params={{ categorySlug: cat.slug }}
            className={footerLinkClass}
            data-ocid={`footer.category.${cat.slug}`}
          >
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "var(--color-primary)" }}
      data-ocid="footer"
    >
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Desktop grid */}
        <div
          className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-0.5 mb-3"
              data-ocid="footer.logo"
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
            <p className="text-sm text-white/60 mb-5 leading-relaxed">
              Your trusted online shopping destination for quality products at
              great prices.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                  data-ocid={`footer.social.${label.toLowerCase()}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <ColumnTitle>Quick Links</ColumnTitle>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={footerLinkClass}
                    data-ocid={`footer.quicklink.${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Categories */}
          <div>
            <ColumnTitle>Categories</ColumnTitle>
            <CategoryLinks />
          </div>

          {/* Column 4 — Customer Service */}
          <div>
            <ColumnTitle>Customer Service</ColumnTitle>
            <ul className="flex flex-col gap-2">
              {customerServiceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={footerLinkClass}
                    data-ocid={`footer.service.${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Contact + App */}
          <div>
            <ColumnTitle>Contact Us</ColumnTitle>
            <ul className="flex flex-col gap-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={15} className="shrink-0 text-white/40" />
                support@myecom.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone size={15} className="shrink-0 text-white/40" />
                +91 1800-000-0000
              </li>
              <li className="text-sm text-white/60 pl-5">Mon–Sat 9am–6pm</li>
            </ul>

            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Download App
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg px-3 py-2 transition-colors duration-200 text-center"
                data-ocid="footer.app_store_button"
              >
                🍎 App Store
              </button>
              <button
                type="button"
                className="text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg px-3 py-2 transition-colors duration-200 text-center"
                data-ocid="footer.google_play_button"
              >
                ▶ Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Mobile accordion */}
        <div
          className="md:hidden py-6 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {/* Brand always visible */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-0.5 mb-2">
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
            <p className="text-sm text-white/60 mb-4">
              Your trusted online shopping destination.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="quick-links" className="border-white/10">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-white hover:no-underline py-3">
                Quick Links
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 pb-2">
                  {quickLinks.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="categories" className="border-white/10">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-white hover:no-underline py-3">
                Categories
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  <CategoryLinks />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customer-service" className="border-white/10">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-white hover:no-underline py-3">
                Customer Service
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 pb-2">
                  {customerServiceLinks.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="contact"
              className="border-b-0 border-white/10"
            >
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-white/60 hover:text-white hover:no-underline py-3">
                Contact Us
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 pb-2">
                  <li className="flex items-center gap-2 text-sm text-white/60">
                    <Mail size={14} />
                    support@myecom.com
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/60">
                    <Phone size={14} />
                    +91 1800-000-0000
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-sm text-white/50 text-center sm:text-left">
            © {year} My E-Com. All rights reserved. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "myecom")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-2 shrink-0">
            {paymentBadges.map((badge) => (
              <span
                key={badge}
                className="text-xs font-semibold px-2 py-1 rounded border border-white/20 text-white/60"
                aria-label={badge}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
