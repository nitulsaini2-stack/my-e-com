import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ProductGalleryProps {
  images?: string[];
  image?: string;
  title: string;
}

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = PLACEHOLDER_SVG;
}

export function ProductGallery({ images, image, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build image list: prefer images array, fall back to single image, else placeholder
  const rawImages = images && images.length > 0 ? images : image ? [image] : [];
  const safeImages = rawImages.length > 0 ? rawImages : [PLACEHOLDER_SVG];
  const totalImages = safeImages.length;

  function goTo(index: number) {
    if (index === selectedIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setIsTransitioning(false);
    }, 150);
  }

  function goPrev() {
    goTo((selectedIndex - 1 + totalImages) % totalImages);
  }

  function goNext() {
    goTo((selectedIndex + 1) % totalImages);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setIsTransitioning(true);
        setTimeout(() => {
          setSelectedIndex((i) => (i - 1 + totalImages) % totalImages);
          setIsTransitioning(false);
        }, 150);
      }
      if (e.key === "ArrowRight") {
        setIsTransitioning(true);
        setTimeout(() => {
          setSelectedIndex((i) => (i + 1) % totalImages);
          setIsTransitioning(false);
        }, 150);
      }
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [totalImages]);

  return (
    <div ref={containerRef} className="w-full" data-ocid="product.gallery">
      {/* Mobile: main image + horizontal thumbnail strip */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="relative bg-muted rounded-xl overflow-hidden aspect-square">
          <img
            src={safeImages[selectedIndex]}
            alt={`${title} — view ${selectedIndex + 1}`}
            className={`w-full h-full object-contain p-6 cursor-zoom-in transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            onClick={() => setLightboxOpen(true)}
            onKeyDown={() => setLightboxOpen(true)}
            onError={handleImgError}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm"
            aria-label="Open fullscreen view"
          >
            <ZoomIn size={18} className="text-foreground" />
          </button>
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous image"
                data-ocid="product.gallery_prev"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next image"
                data-ocid="product.gallery_next"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
        {totalImages > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {safeImages.map((img, i) => (
              <button
                key={`thumb-m-${img}`}
                type="button"
                onClick={() => goTo(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === selectedIndex
                    ? "border-accent scale-105"
                    : "border-border hover:border-muted-foreground"
                }`}
                aria-label={`View image ${i + 1}`}
                data-ocid={`product.gallery_thumb.${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${title} thumbnail ${i + 1}`}
                  className="w-full h-full object-contain p-1 bg-muted"
                  onError={handleImgError}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: vertical thumbnail strip + main image */}
      <div className="hidden lg:flex gap-4">
        {totalImages > 1 && (
          <div className="flex flex-col gap-2 w-20 flex-shrink-0 max-h-[520px] overflow-y-auto">
            {safeImages.map((img, i) => (
              <button
                key={`desktop-thumb-${img}`}
                type="button"
                onClick={() => goTo(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  i === selectedIndex
                    ? "border-accent scale-105 shadow-md"
                    : "border-border hover:border-muted-foreground"
                }`}
                aria-label={`View image ${i + 1}`}
                data-ocid={`product.gallery_thumb.${i + 1}`}
              >
                <img
                  src={img}
                  alt={`${title} thumbnail ${i + 1}`}
                  className="w-full h-full object-contain p-1 bg-muted"
                  onError={handleImgError}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative flex-1 bg-muted rounded-xl overflow-hidden aspect-square min-h-0">
          <img
            src={safeImages[selectedIndex]}
            alt={`${title} — view ${selectedIndex + 1}`}
            className={`w-full h-full object-contain p-8 cursor-zoom-in transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            onClick={() => setLightboxOpen(true)}
            onKeyDown={() => setLightboxOpen(true)}
            onError={handleImgError}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 p-2.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            aria-label="Open fullscreen view"
          >
            <ZoomIn size={20} className="text-foreground" />
          </button>
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-card transition-colors"
                aria-label="Previous image"
                data-ocid="product.gallery_prev"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-card transition-colors"
                aria-label="Next image"
                data-ocid="product.gallery_next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          {/* Image counter */}
          {totalImages > 1 && (
            <span className="absolute bottom-4 left-4 text-xs bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-foreground font-medium">
              {selectedIndex + 1} / {totalImages}
            </span>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-4xl w-full bg-background p-0 border-border"
          data-ocid="product.gallery_lightbox.dialog"
        >
          <div className="relative flex items-center justify-center min-h-[60vh] bg-muted rounded-lg overflow-hidden">
            <img
              src={safeImages[selectedIndex]}
              alt={`${title} — fullscreen view ${selectedIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain p-6"
              onError={handleImgError}
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close lightbox"
              data-ocid="product.gallery_lightbox.close_button"
            >
              <X size={20} />
            </button>
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {totalImages > 1 && (
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm bg-card/80 px-3 py-1 rounded-full text-foreground font-medium">
                {selectedIndex + 1} / {totalImages}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
