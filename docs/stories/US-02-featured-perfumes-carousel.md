# US-02 — Featured Perfumes Carousel

**As a visitor, I can view a rotating carousel of featured perfumes so that I can easily discover the products the store wants to highlight.**

| Field | Value |
|-------|-------|
| Complexity | M |
| Dependencies | US-01 |

## Acceptance Criteria

1. The carousel displays only products where `featured: true`.
2. Each card shows the product image, name, category tag, description, and price.
3. The carousel auto-rotates every 4 seconds and includes manual prev/next controls.
4. The carousel shows 3 items on desktop (≥1200px), 2 on tablet, 1 on mobile (≤767px).
5. If no featured products exist, the carousel section is not rendered.
