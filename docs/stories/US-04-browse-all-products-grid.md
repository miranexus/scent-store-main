# US-04 — Browse All Products in a Grid

**As a visitor, I can browse all available perfumes in a product grid so that I have a clear overview of the full catalogue.**

| Field | Value |
|-------|-------|
| Complexity | M |
| Dependencies | US-01 |

## Acceptance Criteria

1. All products returned by the API are displayed in a CSS grid — no products are omitted.
2. Each card shows: image, name, category, description, and price.
3. Products with `specialOffer: true` display a visible "Special Offer" badge.
4. The grid is responsive: 1 column on mobile, 2 on tablet, 3–4 on desktop.
5. The grid is populated from the API; no product data is hardcoded in the component.
