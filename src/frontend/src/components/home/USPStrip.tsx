import { Headphones, RefreshCcw, Shield, Truck } from "lucide-react";

const USP_ITEMS = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance",
  },
];

export function USPStrip() {
  return (
    <section
      className="py-8 border-y"
      style={{ backgroundColor: "var(--color-surface)" }}
      data-ocid="usp.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {USP_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start sm:items-center gap-3 group"
                data-ocid={`usp.item.${item.title.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: "rgba(233, 69, 96, 0.1)" }}
                >
                  <Icon size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold text-foreground leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
