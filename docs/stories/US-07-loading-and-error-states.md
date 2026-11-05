# US-07 — Loading and Error States

**As a visitor, I receive clear feedback when product data is loading or unavailable so that I am never left with a blank or broken page.**

| Field | Value |
|-------|-------|
| Complexity | S |
| Dependencies | US-01 |

## Acceptance Criteria

1. A loading indicator (spinner or skeleton placeholder) is displayed while the API request is in flight.
2. If the API request fails, a user-friendly message is shown (e.g. "Unable to load products. Please try again later.").
3. The error state does not crash the app or render a blank screen.
4. Once data loads successfully, the loading indicator is removed and the content renders.
5. Error and loading states apply to both the carousel and the product grid.
