import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "../../types";

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    rating: 5,
    quote:
      "Amazing products and super fast delivery! Will definitely shop again. The quality exceeded my expectations completely.",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    rating: 4,
    quote:
      "Great quality products at competitive prices. Very satisfied with my purchase. The customer support was helpful too.",
  },
  {
    id: "3",
    name: "Anita Singh",
    rating: 5,
    quote:
      "Excellent customer service and authentic products. My go-to shopping destination for all my needs.",
  },
  {
    id: "4",
    name: "Vikram Patel",
    rating: 5,
    quote:
      "Couldn't be happier! Smooth checkout, fast shipping, and the product looks exactly as described.",
  },
  {
    id: "5",
    name: "Deepa Nair",
    rating: 4,
    quote:
      "Great variety and competitive pricing. I've been shopping here for months and always satisfied.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card rounded-xl shadow-md p-6 flex flex-col gap-4 h-full border border-border">
      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            className={
              s <= testimonial.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground"
            }
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm text-muted-foreground italic leading-relaxed flex-1">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">Verified Buyer</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const visibleCount = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, TESTIMONIALS.length - visibleCount);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(next, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, next]);

  const visible = TESTIMONIALS.slice(current, current + 3);

  return (
    <section
      className="py-14 bg-muted/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-ocid="testimonials.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Reviews
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Customers Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Previous"
            data-ocid="testimonials.prev_button"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => i).map((i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${i === current ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-muted-foreground/30"}`}
                style={
                  i === current
                    ? { backgroundColor: "var(--color-accent)" }
                    : {}
                }
                aria-label={`Go to testimonial ${i + 1}`}
                data-ocid={`testimonials.dot.${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Next"
            data-ocid="testimonials.next_button"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
