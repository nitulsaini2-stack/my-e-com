import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { ProductCard } from "../components/product/ProductCard";
import { ProductGallery } from "../components/product/ProductGallery";
import { ProductInfo } from "../components/product/ProductInfo";
import { getProductById, getProductsByCategory } from "../lib/api/products";

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Priya Sharma",
    rating: 5,
    date: "18 March 2025",
    comment:
      "Absolutely love this product! Quality is outstanding and it arrived well-packaged. Exactly as described. Would definitely buy again.",
    helpful: 24,
    unhelpful: 2,
  },
  {
    id: "r2",
    name: "Rohan Mehta",
    rating: 4,
    date: "5 February 2025",
    comment:
      "Very good product for the price. Build quality feels solid and works as expected. Minor complaint about the instructions but overall happy with the purchase.",
    helpful: 18,
    unhelpful: 1,
  },
  {
    id: "r3",
    name: "Anjali Patel",
    rating: 4,
    date: "14 January 2025",
    comment:
      "Delivered on time and packed well. The product looks premium and matches the pictures. Good value for money. Recommended for anyone looking for quality.",
    helpful: 11,
    unhelpful: 0,
  },
];

function GallerySkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="hidden lg:flex flex-col gap-2 w-20">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="flex-1 aspect-square rounded-xl" />
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

type MockReview = (typeof MOCK_REVIEWS)[0];

function ReviewCard({ review }: { review: MockReview }) {
  return (
    <div
      className="border border-border rounded-xl p-5 bg-card"
      data-ocid={`product.review.${review.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "var(--color-primary)" }}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {review.name}
            </p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={
                s <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              }
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-foreground leading-relaxed">
        {review.comment}
      </p>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">Helpful?</span>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted min-h-[44px]"
          data-ocid={`product.review_helpful.${review.id}`}
        >
          <ThumbsUp size={13} /> Yes ({review.helpful})
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted min-h-[44px]"
          data-ocid={`product.review_unhelpful.${review.id}`}
        >
          <ThumbsDown size={13} /> No ({review.unhelpful})
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false });

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId ?? ""),
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["products-category", product?.category],
    queryFn: () => getProductsByCategory(product?.category ?? ""),
    enabled: !!product?.category,
  });

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 6);

  if (isError || (!isLoading && !product)) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center"
          data-ocid="product.error_state"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "var(--color-surface-alt)" }}
          >
            🔍
          </div>
          <div>
            <h2
              className="text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Product Not Found
            </h2>
            <p className="text-muted-foreground max-w-sm">
              This product doesn't exist or may have been removed.
            </p>
          </div>
          <Link to="/products">
            <Button
              type="button"
              className="gap-2 min-h-[44px]"
              data-ocid="product.back_to_products.button"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-ocid="product.page"
      >
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 min-h-[44px]"
          data-ocid="product.back_link"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Main product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3">
              <GallerySkeleton />
            </div>
            <div className="lg:col-span-2">
              <InfoSkeleton />
            </div>
          </div>
        ) : (
          product && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
              <div
                className="lg:col-span-3"
                data-ocid="product.gallery_section"
              >
                <ProductGallery
                  images={product.images}
                  image={product.image}
                  title={product.title}
                />
              </div>
              <div className="lg:col-span-2" data-ocid="product.info_section">
                <ProductInfo product={product} />
              </div>
            </div>
          )
        )}

        {/* Description tabs */}
        {product && (
          <section className="mb-12" data-ocid="product.tabs_section">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start mb-6 h-auto p-1 bg-muted flex-wrap gap-1">
                <TabsTrigger
                  value="description"
                  className="min-h-[40px] data-[state=active]:bg-card"
                  data-ocid="product.tab.description"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="min-h-[40px] data-[state=active]:bg-card"
                  data-ocid="product.tab.specifications"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="min-h-[40px] data-[state=active]:bg-card"
                  data-ocid="product.tab.reviews"
                >
                  Reviews ({product.rating.count})
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="min-h-[40px] data-[state=active]:bg-card"
                  data-ocid="product.tab.shipping"
                >
                  Shipping &amp; Returns
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="description"
                className="mt-0"
                data-ocid="product.description_tab"
              >
                <div className="bg-card rounded-xl p-6 border border-border">
                  <p className="text-foreground leading-relaxed text-base mb-6">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        icon: "✨",
                        title: "Premium Quality",
                        desc: "Crafted with high-grade materials for lasting durability.",
                      },
                      {
                        icon: "📦",
                        title: "Secure Packaging",
                        desc: "Every item is carefully packed to reach you in perfect condition.",
                      },
                      {
                        icon: "💯",
                        title: "Authentic Product",
                        desc: "100% genuine product sourced directly from the brand.",
                      },
                    ].map((feat) => (
                      <div
                        key={feat.title}
                        className="flex gap-3 p-4 bg-muted/40 rounded-lg"
                      >
                        <span className="text-xl">{feat.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {feat.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="specifications"
                className="mt-0"
                data-ocid="product.specifications_tab"
              >
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Category", product.category],
                        ["Brand", product.brand ?? "—"],
                        ["SKU", `#${product.id}`],
                        ["Stock Available", `${product.stock} units`],
                        [
                          "Rating",
                          `${product.rating.rate} / 5 (${product.rating.count} reviews)`,
                        ],
                        [
                          "Discount",
                          product.discount ? `${product.discount}%` : "None",
                        ],
                        ["Tags", product.tags?.join(", ") ?? "—"],
                      ].map(([label, value], i) => (
                        <tr
                          key={label}
                          className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-muted/30" : "bg-card"}`}
                        >
                          <td className="py-3 px-5 font-medium text-muted-foreground w-40 capitalize">
                            {label}
                          </td>
                          <td className="py-3 px-5 text-foreground capitalize">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent
                value="reviews"
                className="mt-0"
                data-ocid="product.reviews_tab"
              >
                <div className="space-y-4">
                  <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-8 flex-wrap">
                    <div className="text-center">
                      <p
                        className="text-5xl font-bold"
                        style={{
                          color: "var(--color-accent)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {product.rating.rate.toFixed(1)}
                      </p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={
                              s <= Math.round(product.rating.rate)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.rating.count} reviews
                      </p>
                    </div>
                    <div className="flex-1 min-w-[160px] space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct =
                          star === 5
                            ? 60
                            : star === 4
                              ? 25
                              : star === 3
                                ? 10
                                : star === 2
                                  ? 3
                                  : 2;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-muted-foreground w-3 text-right">
                              {star}
                            </span>
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400 flex-shrink-0"
                            />
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: "var(--color-accent)",
                                }}
                              />
                            </div>
                            <span className="text-muted-foreground w-8 text-right">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {MOCK_REVIEWS.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="shipping"
                className="mt-0"
                data-ocid="product.shipping_tab"
              >
                <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                  {[
                    {
                      icon: "🚚",
                      title: "Free Delivery",
                      desc: "Enjoy free shipping on all orders above ₹999. Delivery typically takes 3–5 business days. Express delivery (1–2 days) is available at checkout for a small fee.",
                    },
                    {
                      icon: "↩️",
                      title: "Easy 30-Day Returns",
                      desc: "Changed your mind? Return any item within 30 days of delivery for a full refund. Items must be unused and in original packaging. Refunds processed within 5–7 business days.",
                    },
                    {
                      icon: "🛡️",
                      title: "1 Year Warranty",
                      desc: "This product includes a 1-year manufacturer's warranty covering defects in material and workmanship. Contact our support team to initiate a warranty claim.",
                    },
                    {
                      icon: "📦",
                      title: "Order Tracking",
                      desc: "Once your order ships, you'll receive a tracking link via email. Track your order anytime from your account dashboard.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="text-2xl flex-shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <h4
                          className="font-semibold text-foreground mb-1"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        )}

        {/* Related products */}
        {filteredRelated.length > 0 && (
          <section data-ocid="product.related_section" className="mb-8">
            <h2
              className="text-2xl font-bold text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              You Might Also Like
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
              {filteredRelated.map((p) => (
                <div
                  key={p.id}
                  className="snap-start flex-shrink-0 w-56 sm:w-64"
                  data-ocid={`product.related_item.${p.id}`}
                >
                  <ProductCard
                    product={p}
                    showCategory={false}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
