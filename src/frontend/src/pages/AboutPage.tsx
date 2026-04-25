import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/layout/Layout";
import { cn } from "../lib/utils";

// --- Data ---

const VALUES = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: "Our Mission",
    description:
      "To deliver quality products at fair prices, making premium shopping accessible to every household across India.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Customer First",
    description:
      "Every decision we make — from product curation to delivery — is driven by what's best for our customers.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Sustainability",
    description:
      "We're committed to responsible sourcing, eco-friendly packaging, and reducing our environmental footprint.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: "Excellence",
    description:
      "We never compromise on quality. Every product is vetted to meet our high standards before it reaches you.",
  },
];

const TEAM: { id: string; name: string; role: string; initials: string }[] = [
  { id: "t1", name: "Arjun Patel", role: "CEO & Founder", initials: "AP" },
  { id: "t2", name: "Priya Kumar", role: "Head of Operations", initials: "PK" },
  { id: "t3", name: "Vikram Shah", role: "Lead Developer", initials: "VS" },
  { id: "t4", name: "Neha Gupta", role: "Marketing Director", initials: "NG" },
];

const STATS: { value: string; label: string; target: number }[] = [
  { value: "10,000+", label: "Happy Customers", target: 10000 },
  { value: "500+", label: "Products", target: 500 },
  { value: "50+", label: "Brands", target: 50 },
  { value: "99%", label: "Satisfaction Rate", target: 99 },
];

const TIMELINE = [
  {
    year: "2020",
    event: "Founded with a vision to change online shopping in India",
  },
  {
    year: "2021",
    event:
      "Reached 1,000 happy customers milestone and expanded product catalog",
  },
  {
    year: "2022",
    event: "Expanded product range to 200+ curated products across categories",
  },
  {
    year: "2023",
    event:
      "Launched mobile-optimized platform and introduced same-day delivery",
  },
  {
    year: "2024",
    event: "Serving 10,000+ customers across India with pan-India shipping",
  },
];

// --- Animated Counter Hook ---

function useCounter(target: number, duration: number, isActive: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [isActive, target, duration]);

  return count;
}

// --- Stats Item ---

function StatItem({
  stat,
  isActive,
}: { stat: (typeof STATS)[0]; isActive: boolean }) {
  const count = useCounter(stat.target, 2000, isActive);
  const isPercent = stat.value.includes("%");
  const isPlus = stat.value.includes("+");
  const display = isPercent
    ? `${count}%`
    : isPlus && count >= stat.target
      ? `${count.toLocaleString()}+`
      : count.toLocaleString();

  return (
    <div className="text-center px-4 py-6">
      <div
        className="text-4xl font-bold mb-1 font-heading"
        style={{
          color: "var(--color-accent)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {isActive ? display : "0"}
      </div>
      <div
        className="text-base font-medium"
        style={{ color: "var(--color-text-muted)" }}
      >
        {stat.label}
      </div>
    </div>
  );
}

// --- About Page ---

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <section
        data-ocid="about.hero.section"
        className="relative overflow-hidden py-24 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(233,69,96,0.18)",
              color: "var(--color-accent)",
            }}
          >
            Who We Are
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ color: "#fff", fontFamily: "var(--font-heading)" }}
          >
            About My E-Com
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Your trusted destination for quality products — curated with care,
            delivered with love.
          </p>
        </div>
        {/* decorative blobs */}
        <div
          className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "var(--color-accent)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
          style={{ background: "var(--color-accent)" }}
          aria-hidden="true"
        />
      </section>

      {/* Our Story */}
      <section
        data-ocid="about.story.section"
        className="py-20 px-4"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                background: "rgba(233,69,96,0.1)",
                color: "var(--color-accent)",
              }}
            >
              Our Story
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              From a Small Dream to a Nationwide Platform
            </h2>
            <div
              className="space-y-4 text-base leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <p>
                Founded in 2020, My E-Com started as a small online shop with a
                simple mission: to make quality products accessible to everyone.
                What began as a curated selection of 20 products in a single
                category has grown into a platform offering 500+ products across
                electronics, clothing, jewellery, and more.
              </p>
              <p>
                In our first year, we focused relentlessly on building trust —
                offering genuine products, transparent pricing, and hassle-free
                returns. Word spread quickly, and by the end of 2021 we had
                crossed 1,000 happy customers. We reinvested every rupee back
                into improving our catalog, our delivery network, and our
                customer support.
              </p>
              <p>
                By 2023, we launched a fully mobile-optimized platform,
                recognising that most of our customers shop on the go. Today, in
                2024, My E-Com serves over 10,000 customers across India with
                pan-India shipping, same-day delivery in select cities, and a
                growing family of trusted brand partners.
              </p>
            </div>
          </div>
          <div className="order-first lg:order-last">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=500&fit=crop"
                alt="Our team at work"
                className="w-full h-72 lg:h-96 object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,26,46,0.4) 0%, transparent 60%)",
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section
        data-ocid="about.values.section"
        className="py-20 px-4"
        style={{ background: "var(--color-surface-alt)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                background: "rgba(233,69,96,0.1)",
                color: "var(--color-accent)",
              }}
            >
              What Drives Us
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Our Mission &amp; Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-xl p-6 flex flex-col items-start gap-4 transition-smooth hover:-translate-y-1"
                style={{
                  background: "var(--color-surface)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: "rgba(233,69,96,0.1)",
                    color: "var(--color-accent)",
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        data-ocid="about.team.section"
        className="py-20 px-4"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                background: "rgba(233,69,96,0.1)",
                color: "var(--color-accent)",
              }}
            >
              The People Behind It
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Meet Our Team
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.id}
                data-ocid={`about.team.${member.id}`}
                className="rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-smooth hover:-translate-y-1"
                style={{
                  background: "var(--color-surface)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
                  style={{
                    background: "var(--color-secondary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {member.initials}
                </div>
                <div>
                  <h3
                    className="font-semibold text-base"
                    style={{
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section
        ref={statsRef}
        data-ocid="about.stats.section"
        className="py-16 px-4"
        style={{ background: "var(--color-secondary)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} isActive={statsVisible} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section
        data-ocid="about.timeline.section"
        className="py-20 px-4"
        style={{ background: "var(--color-surface-alt)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{
                background: "rgba(233,69,96,0.1)",
                color: "var(--color-accent)",
              }}
            >
              Our History
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Our Journey
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
              style={{ background: "var(--color-border)" }}
              aria-hidden="true"
            />
            {/* Mobile line */}
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5 md:hidden"
              style={{ background: "var(--color-border)" }}
              aria-hidden="true"
            />

            <div className="space-y-10">
              {TIMELINE.map((item, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className={cn(
                      "relative flex items-center gap-4 md:gap-0",
                      "md:grid md:grid-cols-2",
                    )}
                    data-ocid={`about.timeline.item.${idx + 1}`}
                  >
                    {/* Desktop left side */}
                    <div
                      className={cn(
                        "hidden md:flex",
                        isLeft
                          ? "justify-end pr-10"
                          : "justify-start pl-10 order-last",
                      )}
                    >
                      <div
                        className="rounded-xl px-5 py-4 max-w-xs text-right transition-smooth hover:shadow-md"
                        style={{
                          background: "var(--color-surface)",
                          boxShadow: "var(--shadow-card)",
                          textAlign: isLeft ? "right" : "left",
                        }}
                      >
                        <span
                          className="inline-block text-xs font-bold uppercase tracking-wider mb-2 px-3 py-1 rounded-full"
                          style={{
                            background: "var(--color-accent)",
                            color: "#fff",
                          }}
                        >
                          {item.year}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {item.event}
                        </p>
                      </div>
                    </div>

                    {/* Center dot (desktop) */}
                    <div
                      className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white z-10"
                      style={{ background: "var(--color-accent)" }}
                      aria-hidden="true"
                    />

                    {/* Empty spacer for alternating desktop */}
                    {!isLeft && <div className="hidden md:block" />}

                    {/* Mobile layout */}
                    <div className="flex items-start gap-4 md:hidden pl-14">
                      <div
                        className="absolute left-4 w-5 h-5 rounded-full border-4 border-white z-10 top-2"
                        style={{ background: "var(--color-accent)" }}
                        aria-hidden="true"
                      />
                      <div
                        className="rounded-xl px-4 py-3 flex-1"
                        style={{
                          background: "var(--color-surface)",
                          boxShadow: "var(--shadow-card)",
                        }}
                      >
                        <span
                          className="inline-block text-xs font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--color-accent)",
                            color: "#fff",
                          }}
                        >
                          {item.year}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {item.event}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
