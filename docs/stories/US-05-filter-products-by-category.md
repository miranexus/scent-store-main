# US-05 — Filter Products by Category

**As a visitor, I can filter the product grid by fragrance category so that I can quickly find the type of scent I am looking for.**

| Field | Value |
|-------|-------|
| Complexity | S |
| Dependencies | US-04 |

## Acceptance Criteria

1. A dropdown lists: All Categories, Floral, Woody, Citrus, Oriental.
2. Selecting a category immediately updates the grid to show only matching products.
3. Selecting "All Categories" (or clearing the selection) restores the full product list.
4. If no products match the selected category, a "No perfumes found in this category" message is displayed.
5. Filtering is client-side and requires no additional API call.
