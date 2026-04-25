export interface FakestoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  videoUrl?: string;
  rating: { rate: number; count: number };
  stock: number;
  brand?: string;
  tags?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface FilterState {
  category: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  sortBy: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  brands: string[];
  inStock: boolean;
  discount: number[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  bgColor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  quote: string;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
