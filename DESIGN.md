# Design Brief: My E-Com

## Purpose & Context
Modern, responsive e-commerce storefront. Primary audience: shoppers seeking trusted, professional purchasing experience. Emotional state: confident, focused on discovery and ease-of-checkout.

## Tone & Differentiation
Clean, professional, trustworthy. Refined modernism — eschews playful trends in favor of timeless commerce convention. Sharp navy + red contrast creates visual confidence without aggression.

## Color Palette

| Token                | Light OKLCH          | Dark OKLCH           | Purpose                              |
|:-------------------|:-------------------:|:-------------------:|:-------------------------------------|
| primary            | 0.15 0.02 258       | 0.54 0.2 10         | Navy header/footer, dark surfaces   |
| accent             | 0.54 0.2 10         | 0.65 0.22 10        | Red CTA buttons, highlights         |
| background         | 0.98 0.01 280       | 0.12 0.02 258       | Page bg, light section containers   |
| card               | 1.0 0 0             | 0.16 0.02 258       | White product cards, modals         |
| border             | 0.92 0.01 280       | 0.25 0.02 258       | Subtle dividers, outlines           |
| muted              | 0.93 0.01 280       | 0.22 0.02 258       | Secondary surfaces, disabled states |
| destructive        | 0.54 0.2 10         | 0.65 0.22 10        | Error states, warnings              |
| success            | 0.72 0.14 125       | 0.72 0.14 125       | Confirmations, badges               |

## Typography

| Role        | Font             | Scale                                    | Weight |
|:-----------|:---------------:|:----------------------------------------:|:------:|
| Display    | Space Grotesk   | H1: 2.5rem, H2: 1.875rem, H3: 1.5rem   | 700    |
| Body       | Inter           | Base: 1rem, Small: 0.875rem, Tiny: 0.75rem | 400/500 |
| Mono       | GeistMono       | 0.875rem (form inputs, code)            | 400    |

## Structural Zones

| Zone       | Background                        | Border                | Shadow        | Density |
|:-----------|:--------------------------------:|:-------------------:|:-------------:|:--------:|
| Header     | primary (navy), sticky           | none                 | md below fold | compact  |
| Hero       | background + accent accent       | none                 | none          | loose    |
| Content    | background (light grey)          | none                 | none          | normal   |
| Cards      | card (white)                     | border subtle        | card          | normal   |
| Footer     | primary (navy)                   | border-t subtle      | none          | compact  |
| Forms      | card (white)                     | input border         | xs on focus   | normal   |

## Spacing & Rhythm
- Base unit: 0.5rem (8px) for most layouts
- Padding scales: 0.5rem (tight), 1rem (normal), 1.5rem (loose), 2rem (generous)
- Grid: 4-column desktop, 2-column tablet, 1-column mobile
- Product cards: 1:1 aspect ratio images, consistent spacing

## Component Patterns
- Buttons: accent red (#E94560) for primary CTAs, secondary navy for tertiary actions
- Cards: white bg, subtle shadow, rounded 8px, 1px border
- Forms: light grey background, white inputs with border on focus
- Product cards: image + overlay badge (New/Sale), title, rating, price, Add to Cart button
- Badges: color-coded (success: green, warning: orange, error: red, info: blue)

## Motion
- Hover states: subtle lift (shadow-md) on cards, underline on links
- Transitions: 0.3s smooth cubic-bezier(0.4, 0, 0.2, 1) for all interactive elements
- Loading: skeleton cards with shimmer animation
- Modal/drawer: fade in + slide from edge, 0.2s

## Signature Detail
Navy header with white text and red accent CTA buttons create instant visual hierarchy. Product cards contrast sharply against light background, drawing focus. Typography hierarchy uses geometric Space Grotesk for headlines, refined Inter for reading.

## Constraints
- Minimum touch target: 44×44px for all interactive elements
- Contrast ratio AA+ on all text (L difference ≥ 0.7)
- Max content width: 1280px
- Mobile-first Tailwind utilities (sm:, md:, lg: prefixes)
- Images use Next.js `<Image>` with lazy loading except above-fold

## Responsive Breakpoints
- Mobile: base styles (< 640px)
- Tablet: md: (≥ 768px) — sidebar visible, 3-col grid
- Desktop: lg: (≥ 1024px) — full layout, 4-col grid
