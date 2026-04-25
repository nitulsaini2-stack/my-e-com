import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(deadline: Date): TimeLeft {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimerBox({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-3 rounded-xl border-2 min-w-[64px]"
      style={{ borderColor: "var(--color-accent)" }}
    >
      <span
        className="text-3xl font-bold tabular-nums text-white leading-none"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-white/60 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}

export function OfferBanner() {
  const deadline = useMemo(
    () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    [],
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(deadline),
  );

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <section
      className="py-16"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
      }}
      data-ocid="offer.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full border"
              style={{
                color: "var(--color-accent)",
                borderColor: "var(--color-accent)",
              }}
            >
              Limited Time
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Flash Sale!{" "}
              <span style={{ color: "var(--color-accent)" }}>Limited Time</span>{" "}
              Offer
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Up to 70% off on selected items. Don't miss out on these
              incredible deals!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm min-h-[44px] transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "var(--color-accent)" }}
              data-ocid="offer.cta_button"
            >
              Shop the Sale 🔥
            </Link>
          </div>

          {/* Right: Countdown */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/60 text-sm uppercase tracking-widest font-medium">
              Offer ends in
            </p>
            <div className="flex items-center gap-3">
              <TimerBox value={timeLeft.days} label="Days" />
              <span className="text-white/40 text-2xl font-bold">:</span>
              <TimerBox value={timeLeft.hours} label="Hours" />
              <span className="text-white/40 text-2xl font-bold">:</span>
              <TimerBox value={timeLeft.minutes} label="Mins" />
              <span className="text-white/40 text-2xl font-bold">:</span>
              <TimerBox value={timeLeft.seconds} label="Secs" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
