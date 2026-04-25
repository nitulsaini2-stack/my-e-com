import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "../../lib/api/products";
import type { Product } from "../../types";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const BG_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-primary-hover)",
];

const SUBTITLES = [
  "Discover amazing products at unbeatable prices",
  "Top-rated gadgets and electronics at great prices",
  "Style meets comfort in our clothing collection",
];

interface SlideData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  bgColor: string;
  product: Product;
}

function buildSlides(products: Product[]): SlideData[] {
  return products.slice(0, 3).map((p, i) => ({
    title: p.title.length > 50 ? `${p.title.slice(0, 50)}…` : p.title,
    subtitle: SUBTITLES[i] ?? "Shop the best deals today",
    ctaText:
      i === 0 ? "Shop Now" : i === 1 ? "Explore More" : "View Collection",
    ctaLink: `/products/${p.id}`,
    imageUrl: p.image,
    bgColor: BG_COLORS[i] ?? "var(--color-primary)",
    product: p,
  }));
}

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
}

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["hero-products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });

  const slides = buildSlides(products);
  const slideCount = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 200);
    },
    [slideCount],
  );

  const next = useCallback(() => {
    if (slideCount === 0) return;
    goTo((current + 1) % slideCount);
  }, [current, goTo, slideCount]);

  const prev = useCallback(() => {
    if (slideCount === 0) return;
    goTo((current - 1 + slideCount) % slideCount);
  }, [current, goTo, slideCount]);

  useEffect(() => {
    if (!isHovered && slideCount > 1) {
      intervalRef.current = setInterval(next, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, next, slideCount]);

  // Loading state — show skeleton banner
  if (slides.length === 0) {
    return (
      <section
        className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center"
        style={{ backgroundColor: "var(--color-primary)" }}
        data-ocid="hero.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 py-12">
            <div className="flex-1 space-y-4">
              <div className="h-4 w-32 rounded-full bg-white/20 animate-pulse" />
              <div className="h-10 w-3/4 rounded-lg bg-white/20 animate-pulse" />
              <div className="h-6 w-1/2 rounded-lg bg-white/20 animate-pulse" />
              <div className="h-12 w-36 rounded-full bg-white/20 animate-pulse" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-ocid="hero.section"
    >
      <div
        className="min-h-[480px] md:min-h-[560px] flex items-center transition-colors duration-500"
        style={{ backgroundColor: slide.bgColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 py-12">
            {/* Text content */}
            <div
              className={`flex-1 text-white text-center md:text-left transition-all duration-300 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/60 mb-3 border border-white/20 rounded-full px-3 py-1">
                Special Offer
              </span>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-white/80 mb-8 max-w-md mx-auto md:mx-0">
                {slide.subtitle}
              </p>
              <Link
                to="/products/$productId"
                params={{ productId: String(slide.product.id) }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm min-h-[44px] transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "var(--color-accent)" }}
                data-ocid="hero.cta_button"
              >
                {slide.ctaText}
                <ChevronRight size={18} />
              </Link>
            </div>

            {/* Image */}
            <div className="flex-1 flex justify-center">
              <div
                className={`relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 transition-all duration-300 ${transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
              >
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                  onError={handleImgError}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors min-w-[44px] min-h-[44px]"
        aria-label="Previous slide"
        data-ocid="hero.prev_button"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors min-w-[44px] min-h-[44px]"
        aria-label="Next slide"
        data-ocid="hero.next_button"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.product.id}
              type="button"
              onClick={() => goTo(i)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label={`Go to slide ${i + 1}`}
              data-ocid={`hero.dot.${i + 1}`}
            >
              <span
                className={`rounded-full transition-all duration-300 block ${i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
