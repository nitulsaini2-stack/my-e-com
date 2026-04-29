import type { FakestoreProduct } from "../../types";

// All images are inline SVG data URIs — no external dependencies
// Each category has a distinct color theme

function makeSvgImage(
  bgColor: string,
  icon: string,
  label: string,
  accentColor = "#ffffff",
): string {
  const encoded = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)" rx="16"/>
  <text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" font-size="96" font-family="system-ui">${icon}</text>
  <text x="50%" y="72%" dominant-baseline="middle" text-anchor="middle" fill="${accentColor}" font-size="22" font-family="system-ui,sans-serif" font-weight="600">${label}</text>
</svg>`,
  );
  return `data:image/svg+xml,${encoded}`;
}

// Electronics: blue theme
const elec = (icon: string, label: string) =>
  makeSvgImage("#1e3a5f", icon, label, "#93c5fd");

// Jewelry: gold theme
const jwl = (icon: string, label: string) =>
  makeSvgImage("#5c3a00", icon, label, "#fcd34d");

// Men's clothing: forest green
const mens = (icon: string, label: string) =>
  makeSvgImage("#1a3a2a", icon, label, "#6ee7b7");

// Women's clothing: mauve/purple
const womens = (icon: string, label: string) =>
  makeSvgImage("#4a1a4a", icon, label, "#f0abfc");

export const MOCK_PRODUCTS: FakestoreProduct[] = [
  // ── Electronics ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    price: 1199.99,
    description:
      "The ultimate iPhone with a titanium design, A17 Pro chip, and pro camera system. Capture stunning photos with 48MP main camera, enjoy ProMotion display at 120Hz, and experience USB 3 speeds.",
    category: "electronics",
    image: elec("📱", "iPhone 15 Pro"),
    rating: { rate: 4.8, count: 2341 },
  },
  {
    id: 2,
    title: "Samsung 65-inch 4K QLED Smart TV Q80C",
    price: 1097.99,
    description:
      "Experience breathtaking picture quality with Quantum HDR 12x, Neo Quantum Processor 4K, and Object Tracking Sound. Smart TV powered by Tizen OS with built-in Alexa and Google Assistant.",
    category: "electronics",
    image: elec("📺", "4K Smart TV"),
    rating: { rate: 4.5, count: 892 },
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 349.99,
    description:
      "Industry-leading noise cancellation with Auto NC Optimizer. Up to 30 hours battery life, speak-to-chat technology, and multipoint connection. Exceptional sound quality with LDAC support.",
    category: "electronics",
    image: elec("🎧", "Sony WH-1000XM5"),
    rating: { rate: 4.7, count: 3105 },
  },
  {
    id: 4,
    title: "Apple MacBook Pro 14-inch M3 Pro 512GB",
    price: 1999.0,
    description:
      "Supercharged by M3 Pro chip with up to 18-core GPU. Stunning Liquid Retina XDR display, up to 18 hours battery, and a suite of pro ports. The world's best consumer laptop.",
    category: "electronics",
    image: elec("💻", "MacBook Pro M3"),
    rating: { rate: 4.9, count: 1567 },
  },
  {
    id: 5,
    title: "Canon EOS R50 Mirrorless Camera with 18-45mm Lens",
    price: 879.99,
    description:
      "24.2MP APS-C sensor, Dual Pixel CMOS AF II for fast, accurate autofocus. Perfect for content creators with vertical video support, 4K movie recording, and built-in Wi-Fi.",
    category: "electronics",
    image: elec("📷", "Canon EOS R50"),
    rating: { rate: 4.6, count: 743 },
  },
  {
    id: 6,
    title: "iPad Air 11-inch M2 Wi-Fi 256GB Blue",
    price: 749.0,
    description:
      "Supercharged by the M2 chip, the new iPad Air is more capable than ever. Stunning 11-inch Liquid Retina display, Ultra Wide front camera, and support for Apple Pencil Pro.",
    category: "electronics",
    image: elec("📲", "iPad Air M2"),
    rating: { rate: 4.7, count: 1289 },
  },
  {
    id: 7,
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    price: 99.99,
    description:
      "8K DPI sensor, ultra-fast MagSpeed electromagnetic scrolling, and quieter clicks. Works on any surface including glass. Connect up to 3 devices seamlessly with Easy-Switch.",
    category: "electronics",
    image: elec("🖱️", "MX Master 3S"),
    rating: { rate: 4.6, count: 4782 },
  },
  {
    id: 8,
    title: 'LG 27" UltraGear QHD 165Hz Gaming Monitor',
    price: 349.99,
    description:
      "27-inch QHD (2560x1440) IPS display with 165Hz refresh rate and 1ms GTG response time. HDR 400, AMD FreeSync Premium, and NVIDIA G-Sync compatible. Perfect for competitive gaming.",
    category: "electronics",
    image: elec("🖥️", "LG UltraGear"),
    rating: { rate: 4.5, count: 2156 },
  },

  // ── Jewelery ─────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Tiffany & Co. Classic Diamond Solitaire Ring 0.5ct",
    price: 2499.0,
    description:
      "The iconic Tiffany Setting solitaire ring crafted in platinum with a brilliant round diamond. A timeless symbol of love and commitment, set with precision to maximize diamond brilliance.",
    category: "jewelery",
    image: jwl("💎", "Solitaire Ring"),
    rating: { rate: 4.9, count: 312 },
  },
  {
    id: 10,
    title: "Pandora Signature 14K Gold Charm Bracelet",
    price: 299.99,
    description:
      "Authentic Pandora bracelet in 14K gold with signature barrel clasp. Compatible with all Pandora charms. Crafted with exceptional care, perfect for gifting and self-expression.",
    category: "jewelery",
    image: jwl("✨", "Gold Bracelet"),
    rating: { rate: 4.6, count: 987 },
  },
  {
    id: 11,
    title: "Sterling Silver Turquoise Drop Earrings",
    price: 49.99,
    description:
      "Handcrafted 925 sterling silver earrings with genuine turquoise gemstones. Boho-chic design with secure leverback closure. Hypoallergenic and nickel-free, perfect for sensitive ears.",
    category: "jewelery",
    image: jwl("💙", "Drop Earrings"),
    rating: { rate: 4.4, count: 653 },
  },
  {
    id: 12,
    title: "14K White Gold Diamond Tennis Bracelet 2ct",
    price: 1899.0,
    description:
      "Elegant tennis bracelet featuring 28 round brilliant diamonds totaling 2 carats set in 14K white gold. Box clasp with safety closure. A classic piece that works for every occasion.",
    category: "jewelery",
    image: jwl("💍", "Tennis Bracelet"),
    rating: { rate: 4.8, count: 234 },
  },
  {
    id: 13,
    title: "Rose Gold Personalized Name Necklace 18K",
    price: 89.99,
    description:
      "Custom name necklace in 18K rose gold plated sterling silver. Choose your name or special word in elegant script font. 18-inch chain with 2-inch extender, perfect fit for any neckline.",
    category: "jewelery",
    image: jwl("📿", "Name Necklace"),
    rating: { rate: 4.5, count: 1432 },
  },

  // ── Men's Clothing ────────────────────────────────────────────────────────────
  {
    id: 14,
    title: "Levi's 501 Original Straight Fit Jeans Dark Blue",
    price: 69.99,
    description:
      "The original blue jean since 1873. Straight fit with button fly. Made from heavyweight denim with the iconic Levi's leather patch. Available in 28-42 waist and 28-36 inseam.",
    category: "men's clothing",
    image: mens("👖", "Levi's 501 Jeans"),
    rating: { rate: 4.5, count: 5621 },
  },
  {
    id: 15,
    title: "Ralph Lauren Classic Fit Oxford Polo Shirt White",
    price: 98.5,
    description:
      "Crafted from soft cotton mesh, this iconic polo features the signature embroidered Polo pony. Classic fit with rib-knit collar and cuffs, two-button placket. Machine washable.",
    category: "men's clothing",
    image: mens("👕", "Polo Shirt"),
    rating: { rate: 4.6, count: 3201 },
  },
  {
    id: 16,
    title: "Nike Therma-FIT ADV Insulated Jacket",
    price: 149.99,
    description:
      "Stay warm without the bulk. Nike Therma-FIT technology pulls sweat away from skin and helps keep you warm and dry. Lightweight insulation, packable design, water-resistant finish.",
    category: "men's clothing",
    image: mens("🧥", "Nike Jacket"),
    rating: { rate: 4.7, count: 1876 },
  },
  {
    id: 17,
    title: "Patagonia Better Sweater Quarter-Zip Fleece Navy",
    price: 139.0,
    description:
      "Classic fleece style made from 100% recycled polyester fleece. Flattering athletic fit, stand-up collar, and front zip pocket. Bluesign approved fabric, fair trade certified.",
    category: "men's clothing",
    image: mens("🧶", "Patagonia Fleece"),
    rating: { rate: 4.8, count: 2456 },
  },
  {
    id: 18,
    title: "Hugo Boss Regular Fit White Dress Shirt",
    price: 129.99,
    description:
      "Classic dress shirt in premium poplin cotton. Regular fit with spread collar, French placket, and single button cuffs. Easy-iron finish keeps you looking sharp all day.",
    category: "men's clothing",
    image: mens("👔", "Dress Shirt"),
    rating: { rate: 4.4, count: 789 },
  },
  {
    id: 19,
    title: "Adidas Running Shorts 3-Stripes Tech Mesh Black",
    price: 34.99,
    description:
      "Lightweight running shorts with built-in briefs for support and comfort. Quick-dry fabric, 3-stripe detailing, side pockets. Perfect for training, running, or gym sessions.",
    category: "men's clothing",
    image: mens("🩳", "Running Shorts"),
    rating: { rate: 4.3, count: 2134 },
  },
  {
    id: 20,
    title: "Dockers Men's Classic Slim Fit Chino Pants Khaki",
    price: 59.99,
    description:
      "Smart 360 Flex stretch fabric moves with you throughout the day. Slim fit, flat front, tapered leg. Wrinkle-resistant and easy care. Dress up or down for any occasion.",
    category: "men's clothing",
    image: mens("👖", "Chino Pants"),
    rating: { rate: 4.4, count: 1654 },
  },

  // ── Women's Clothing ──────────────────────────────────────────────────────────
  {
    id: 21,
    title: "Zara Floral Wrap Midi Dress Summer Boho",
    price: 79.9,
    description:
      "Flowing midi dress in a beautiful floral print. Wrap-around front with adjustable tie, V-neck, and flutter sleeves. Lightweight woven fabric, perfect for warm weather and holidays.",
    category: "women's clothing",
    image: womens("👗", "Floral Midi Dress"),
    rating: { rate: 4.5, count: 2876 },
  },
  {
    id: 22,
    title: "Free People We The Free High-Rise Skinny Jeans",
    price: 98.0,
    description:
      "High-waisted skinny jeans with a flattering cut and stretch fabric for all-day comfort. Five-pocket styling, ankle length, raw hem. Available in multiple washes.",
    category: "women's clothing",
    image: womens("👖", "Skinny Jeans"),
    rating: { rate: 4.6, count: 1932 },
  },
  {
    id: 23,
    title: "Anthropologie Woven Linen Blazer Cream",
    price: 148.0,
    description:
      "Relaxed-fit linen blazer with a slightly oversized silhouette. Notched lapels, two button front closure, and flap pockets. Perfect for office to weekend transitions.",
    category: "women's clothing",
    image: womens("🧣", "Linen Blazer"),
    rating: { rate: 4.7, count: 876 },
  },
  {
    id: 24,
    title: "Lululemon Align High-Rise Yoga Pants 25-inch Black",
    price: 128.0,
    description:
      "Made with buttery-soft Nulu fabric that feels like a second skin. 4-way stretch, sweat-wicking, and barely-there feel. Ideal for yoga, pilates, or everyday wear.",
    category: "women's clothing",
    image: womens("🩱", "Yoga Pants"),
    rating: { rate: 4.8, count: 6754 },
  },
  {
    id: 25,
    title: "H&M Oversized Cotton Crewneck Sweatshirt Beige",
    price: 39.99,
    description:
      "Super cozy oversized sweatshirt in soft cotton-blend fabric. Dropped shoulders, ribbed cuffs and hem, front kangaroo pocket. The perfect layering essential for every wardrobe.",
    category: "women's clothing",
    image: womens("👚", "Crewneck Sweatshirt"),
    rating: { rate: 4.3, count: 3421 },
  },
  {
    id: 26,
    title: "ASOS Satin Cami Top with Lace Trim Blush Pink",
    price: 29.99,
    description:
      "Feminine cami top in luxurious satin fabric with delicate lace trim at neckline and hem. Adjustable spaghetti straps, v-neck, relaxed fit. Wear alone or layered.",
    category: "women's clothing",
    image: womens("👙", "Satin Cami Top"),
    rating: { rate: 4.2, count: 1876 },
  },
  {
    id: 27,
    title: "Mango Knitted Cardigan with Pockets Camel",
    price: 69.99,
    description:
      "Long knitted cardigan in a cozy oversized fit. Open front, side pockets, and ribbed cuffs. Versatile layering piece that pairs beautifully with both casual and dressy outfits.",
    category: "women's clothing",
    image: womens("🧤", "Knitted Cardigan"),
    rating: { rate: 4.5, count: 2134 },
  },
  {
    id: 28,
    title: "Urban Outfitters BDG A-Line Mini Skirt Denim Blue",
    price: 54.0,
    description:
      "Classic denim mini skirt with an A-line silhouette. Button front, five-pocket styling, raw hem. Medium-weight denim with just a touch of stretch for comfort.",
    category: "women's clothing",
    image: womens("👗", "Denim Mini Skirt"),
    rating: { rate: 4.4, count: 987 },
  },
];

export const MOCK_CATEGORIES: string[] = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];
