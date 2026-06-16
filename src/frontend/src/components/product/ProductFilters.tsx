import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCategories } from "../../lib/api/products";
import { useFilters } from "../../lib/hooks/useFilters";
import type { FilterState } from "../../types";

interface ActiveChip {
  label: string;
  onRemove: () => void;
}

function buildActiveChips(
  filters: FilterState,
  setFilters: (updates: Partial<FilterState>) => void,
): ActiveChip[] {
  const chips: ActiveChip[] = [];

  for (const cat of filters.category) {
    chips.push({
      label: cat,
      onRemove: () =>
        setFilters({
          ...filters,
          category: filters.category.filter((c) => c !== cat),
        }),
    });
  }

  if (filters.priceMin > 0 || filters.priceMax < 1000) {
    chips.push({
      label: `₹${filters.priceMin}–₹${filters.priceMax}`,
      onRemove: () => setFilters({ ...filters, priceMin: 0, priceMax: 1000 }),
    });
  }

  if (filters.rating !== null) {
    chips.push({
      label: `${filters.rating}★ & above`,
      onRemove: () => setFilters({ ...filters, rating: null }),
    });
  }

  if (filters.inStock) {
    chips.push({
      label: "In Stock",
      onRemove: () => setFilters({ ...filters, inStock: false }),
    });
  }
cloths
  return chips;
}

interface FilterPanelProps {
  onClose?: () => void;
}

function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, setFilters, clearFilters } = useFilters();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const [localPrice, setLocalPrice] = useState<[number, number]>([
    filters.priceMin,
    filters.priceMax,
  ]);

  // Sync local price when URL params change externally
  useEffect(() => {
    setLocalPrice([filters.priceMin, filters.priceMax]);
  }, [filters.priceMin, filters.priceMax]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePriceChange = useCallback(
    (values: number[]) => {
      const [min, max] = values as [number, number];
      setLocalPrice([min, max]);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilters({ ...filters, priceMin: min, priceMax: max });
      }, 500);
    },
    [filters, setFilters],
  );

  function toggleCategory(cat: string) {
    const next = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat];
    setFilters({ ...filters, category: next });
  }

  function setRating(val: number | null) {
    setFilters({ ...filters, rating: val });
  }

  function toggleInStock() {
    setFilters({ ...filters, inStock: !filters.inStock });
  }

  const activeChips = buildActiveChips(filters, setFilters);
  const hasActiveFilters = activeChips.length > 0;

  const RATING_OPTIONS: Array<{ label: string; value: number | null }> = [
    { label: "Any rating", value: null },
    { label: "2★ & above", value: 2 },
    { label: "3★ & above", value: 3 },
    { label: "4★ & above", value: 4 },
  ];

  return (
    <div className="flex flex-col gap-5 text-sm">
      {/* Active chips + clear all */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          {activeChips.map((chip) => (
            <Badge
              key={chip.label}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer pr-1"
              data-ocid="filters.active_chip"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label} filter`}
                className="ml-0.5 rounded-full hover:bg-muted p-0.5"
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
            data-ocid="filters.clear_all_button"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 uppercase text-xs tracking-wider">
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 min-h-[44px] lg:min-h-0"
            >
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.category.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                data-ocid={`filters.category.${cat.replace(/\s+/g, "_")}`}
              />
              <Label
                htmlFor={`cat-${cat}`}
                className="capitalize cursor-pointer text-foreground/80 hover:text-foreground transition-colors leading-tight"
              >
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 uppercase text-xs tracking-wider">
          Price Range
        </h3>
        <div className="px-1">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={localPrice}
            onValueChange={handlePriceChange}
            className="mb-3"
            data-ocid="filters.price_slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{localPrice[0]}</span>
            <span>₹{localPrice[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 uppercase text-xs tracking-wider">
          Rating
        </h3>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((opt) => (
            <button
              type="button"
              key={String(opt.value)}
              onClick={() => setRating(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all min-h-[44px] lg:min-h-0 lg:py-1.5 ${
                filters.rating === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground/80"
              }`}
              data-ocid={`filters.rating.${opt.value ?? "any"}`}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock toggle */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 uppercase text-xs tracking-wider">
          Availability
        </h3>
        <div className="flex items-center gap-3 min-h-[44px] lg:min-h-0">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={toggleInStock}
            data-ocid="filters.in_stock_toggle"
          />
          <Label
            htmlFor="in-stock"
            className="cursor-pointer text-foreground/80"
          >
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Mobile close / apply */}
      {onClose && (
        <Button
          type="button"
          onClick={onClose}
          className="mt-2 w-full min-h-[48px]"
          data-ocid="filters.apply_button"
        >
          Apply Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeChips.length}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}

interface ProductFiltersProps {
  /** When true, only renders the mobile trigger button (not the desktop sidebar) */
  mobileOnly?: boolean;
}

export function ProductFilters({ mobileOnly = false }: ProductFiltersProps) {
  const { filters, setFilters } = useFilters();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeChips = buildActiveChips(filters, setFilters);
  const activeCount = activeChips.length;

  const mobileTrigger = (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 min-h-[44px]"
        data-ocid="filters.open_modal_button"
      >
        <Filter size={16} />
        Filters
        {activeCount > 0 && (
          <Badge className="ml-1 text-xs min-w-[20px] text-center">
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* Mobile bottom sheet overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          data-ocid="filters.dialog"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close filters"
          />
          <div className="relative bg-card rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close filters"
                data-ocid="filters.close_button"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );

  if (mobileOnly) {
    return mobileTrigger;
  }

  return (
    <>
      {mobileTrigger}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-[280px] flex-shrink-0 sticky top-24 self-start"
        data-ocid="filters.panel"
      >
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h2
            className="text-base font-semibold mb-5 text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Filters
          </h2>
          <FilterPanel />
        </div>
      </aside>
    </>
  );
}
