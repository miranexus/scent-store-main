# US-01 — PHP API Serves Product Data

**As a frontend developer, I can fetch perfume data from a PHP API endpoint so that the Angular app renders real data rather than hardcoded values.**

| Field | Value |
|-------|-------|
| Complexity | M |
| Dependencies | None — foundational story |

## Acceptance Criteria

1. `GET /api/products.php` returns HTTP 200 with `Content-Type: application/json` and a valid JSON array.
2. Each product object includes: `id`, `name`, `price`, `imageUrl`, `description`, `category`, `featured`, `specialOffer`.
3. A `?category=` query parameter (e.g. `?category=Floral`) filters results server-side and returns only matching products.
4. CORS headers permit requests from `http://localhost:4200`.
5. An invalid or empty category returns an empty array `[]`, not an error.
