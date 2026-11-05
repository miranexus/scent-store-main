# US-03 — Special Offers Carousel

**As a visitor, I can view a dedicated carousel of discounted perfumes so that I can quickly spot current promotions.**

| Field | Value |
|-------|-------|
| Complexity | S |
| Dependencies | US-01, US-02 |

## Acceptance Criteria

1. The carousel only displays products where `specialOffer: true`.
2. The discount percentage is shown prominently (e.g. "20% OFF") on each card.
3. The original price is displayed with a strikethrough style.
4. The carousel section is hidden entirely when no special-offer products exist.
5. Responsive breakpoints and card layout are visually consistent with the Featured carousel (US-02).
