import { CategorySection } from "../components/home/CategorySection";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { HeroBanner } from "../components/home/HeroBanner";
import { NewsletterSection } from "../components/home/NewsletterSection";
import { OfferBanner } from "../components/home/OfferBanner";
import { Testimonials } from "../components/home/Testimonials";
import { USPStrip } from "../components/home/USPStrip";
import { Layout } from "../components/layout/Layout";

export default function HomePage() {
  return (
    <Layout>
      <HeroBanner />
      <USPStrip />
      <CategorySection />
      <FeaturedProducts title="Featured Products" maxItems={8} />
      <OfferBanner />
      <FeaturedProducts title="Trending Now" maxItems={8} />
      <Testimonials />
      <NewsletterSection />
    </Layout>
  );
}
